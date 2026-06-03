import { useState, useMemo, useEffect, useRef } from 'react'

// ───────── Config ─────────
// Google Apps Script Web App URL. The script appends each order to a Google
// Sheet, saves inspo photos to Drive, and emails the customer a copy + notifies
// Kate. See docs/order-form-google-sheet.md for the script + setup steps.
// VITE_ORDER_ENDPOINT (Vercel env / .env.local) overrides the baked-in default
// below — handy if the Apps Script is ever re-deployed to a new URL.
const ENDPOINT =
  import.meta.env.VITE_ORDER_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbx4xQSDooNGTlLZWolr-wlSc6VIyM4V4dps7b0Erd1CctI92kdxzplasCBCo6_tsEAh/exec'

// Pickup time slots: every 15 minutes from 9:00 AM to 7:00 PM (inclusive).
const TIME_SLOTS = (() => {
  const slots = []
  for (let mins = 9 * 60; mins <= 19 * 60; mins += 15) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = ((h + 11) % 12) + 1
    slots.push(`${h12}:${String(m).padStart(2, '0')} ${ampm}`)
  }
  return slots
})()

const PRODUCTS = [
  { id: 'cake', label: 'Cake', emoji: '🎂' },
  { id: 'cupcake', label: 'Cupcakes', emoji: '🧁' },
  { id: 'macarons', label: 'Macarons', emoji: '🍬' },
  { id: 'other', label: 'Other', emoji: '✨' },
]

// Serving estimates are approximate — adjust to match Kate's actual sizing.
const CAKE_SIZES = [
  '6-inch · 2-layer — serves ~8–10',
  '6-inch · 4-layer — serves ~12–16',
  '8-inch · 2-layer — serves ~16–20',
  '8-inch · 3-layer — serves ~24–28',
  '8-inch · 4-layer — serves ~30–35',
]

const DOZENS = [
  '1 dozen (12)',
  '2 dozen (24)',
  '3 dozen (36)',
  '4 dozen (48)',
  '5 dozen (60)',
]

const PHOTO_NOTE =
  'I can’t guarantee exact replication, but I’ll do my best to recreate the design!'

const QUOTE_NOTE =
  'You’ll receive an order quote within 48 hours via Instagram or email. After that, you’ll get the pickup address and payment options. Thank you! 💕'

const initialForm = {
  // Your details
  name: '',
  instagram: '',
  phone: '',
  email: '',
  pickupDate: '',
  pickupTime: '',
  // Product
  productType: '',
  // Cake
  cakeSize: '',
  cakeDescription: '',
  cakeFlavour: '',
  cakeFilling: '',
  cakeMessage: '',
  // Cupcakes
  cupcakeQuantity: '',
  cupcakeDescription: '',
  cupcakeFlavour: '',
  // Macarons
  macaronQuantity: '',
  macaronFlavours: '',
  macaronExtras: '',
  // Other
  otherDescription: '',
}

function PaperclipIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

// Downscale + re-encode a photo to keep the upload small (camera-roll images
// are often several MB; base64 inflates them ~33%, which can break the POST).
// Falls back to the original file if the image can't be decoded (e.g. odd HEIC).
function compressImage(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve({
        name: file.name.replace(/\.(png|webp|heic|heif|gif)$/i, '.jpg'),
        type: 'image/jpeg',
        dataUrl: canvas.toDataURL('image/jpeg', quality),
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      const reader = new FileReader()
      reader.onload = () =>
        resolve({ name: file.name, type: file.type, dataUrl: reader.result })
      reader.readAsDataURL(file)
    }
    img.src = url
  })
}

function Order() {
  const [form, setForm] = useState(initialForm)
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const sectionRef = useRef(null)
  const fileInputRef = useRef(null)

  // Object URLs for thumbnail previews. useMemo creates them as `files` changes;
  // the effect's cleanup revokes the *previous* set (already replaced on screen),
  // so a URL is never revoked while it's still being displayed.
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews])

  function closeThanks() {
    setSubmitted(false)
    setForm(initialForm)
    setFiles([])
  }

  // Close the thank-you popup on Escape.
  useEffect(() => {
    if (!submitted) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSubmitted(false)
        setForm(initialForm)
        setFiles([])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [submitted])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function selectProduct(id) {
    setForm((f) => ({ ...f, productType: id }))
  }

  function handleFiles(e) {
    // Capture the picked files NOW — clearing the input below empties
    // e.target.files before React runs the state updater.
    const picked = Array.from(e.target.files || [])
    setFiles((existing) => [...existing, ...picked])
    e.target.value = ''
  }

  function removeFile(idx) {
    setFiles((fs) => fs.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const photos = await Promise.all(files.map((f) => compressImage(f)))
      const payload = { ...form, photos, submittedAt: new Date().toISOString() }

      if (ENDPOINT) {
        // text/plain keeps this a "simple" request so the browser skips the
        // CORS preflight that Apps Script web apps don't answer.
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
      } else {
        // No endpoint configured yet — log so it's testable during dev.
        console.warn('VITE_ORDER_ENDPOINT not set; order not sent:', payload)
      }

      setSubmitted(true)
      // Bring the popup into view (it's anchored within the order section).
      const section = sectionRef.current
      if (section) {
        if (window.__lenis) window.__lenis.scrollTo(section, { offset: -10 })
        else section.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (err) {
      setError(
        'Something went wrong sending your order. Please try again, or reach out on Instagram.'
      )
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const showPhotos = ['cake', 'cupcake', 'other'].includes(form.productType)

  return (
    <section id="order" ref={sectionRef} className="section section-order">
      <div className="section-head reveal">
        <span className="section-num" data-num="03">— place an order</span>
        <h2>Tell us about<br /><em>your order.</em></h2>
        <p className="lede">
          Share the details below and we’ll respond within a few days with a custom quote and to confirm your order.
        </p>
      </div>

        <form className="order-form reveal reveal--d1" onSubmit={handleSubmit}>
          {/* ───────── Step 1: Your details ───────── */}
          <fieldset className="order-group">
            <legend className="order-group-head">
              <span className="order-step">01</span>
              <span className="order-group-title">Your details</span>
            </legend>
            <div className="order-grid">
              <label>
                <span>Your name</span>
                <input required value={form.name} onChange={update('name')} />
              </label>
              <label>
                <span>Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="so we can send your order copy"
                />
              </label>
              <label>
                <span>Instagram / Facebook</span>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={update('instagram')}
                  placeholder="@handle or FB username"
                />
              </label>
              <label>
                <span>Phone number</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="(optional)"
                />
              </label>
              <label>
                <span>Pickup date</span>
                <input
                  required
                  type="date"
                  value={form.pickupDate}
                  onChange={update('pickupDate')}
                />
              </label>
              <label>
                <span>Preferred pickup time</span>
                <select
                  required
                  className="order-select"
                  value={form.pickupTime}
                  onChange={update('pickupTime')}
                >
                  <option value="" disabled>
                    Choose a time…
                  </option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          {/* ───────── Step 2: Pick a product ───────── */}
          <fieldset className="order-group">
            <legend className="order-group-head">
              <span className="order-step">02</span>
              <span className="order-group-title">What are we making?</span>
            </legend>
            <div className="product-picker" role="group" aria-label="Choose a product">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`product-option${form.productType === p.id ? ' is-selected' : ''}`}
                  aria-pressed={form.productType === p.id}
                  onClick={() => selectProduct(p.id)}
                >
                  <span className="product-emoji" aria-hidden="true">{p.emoji}</span>
                  <span className="product-label">{p.label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* ───────── Step 3: Product-specific fields ───────── */}
          {form.productType && (
            <fieldset className="order-group">
              <legend className="order-group-head">
                <span className="order-step">03</span>
                <span className="order-group-title">
                  {form.productType === 'cake' && 'Cake details'}
                  {form.productType === 'cupcake' && 'Cupcake details'}
                  {form.productType === 'macarons' && 'Macaron details'}
                  {form.productType === 'other' && 'Tell us more'}
                </span>
              </legend>

              {form.productType === 'cake' && (
                <div className="order-grid">
                  <label>
                    <span>Size</span>
                    <select
                      required
                      className="order-select"
                      value={form.cakeSize}
                      onChange={update('cakeSize')}
                    >
                      <option value="" disabled>Choose a size…</option>
                      {CAKE_SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Cake flavour</span>
                    <input
                      value={form.cakeFlavour}
                      onChange={update('cakeFlavour')}
                      placeholder="vanilla, chocolate, custom…"
                    />
                  </label>
                  <label>
                    <span>Cake filling</span>
                    <input
                      value={form.cakeFilling}
                      onChange={update('cakeFilling')}
                      placeholder="raspberry, salted caramel, custom…"
                    />
                  </label>
                  <label>
                    <span>Cake message</span>
                    <input
                      value={form.cakeMessage}
                      onChange={update('cakeMessage')}
                      placeholder="“Happy Birthday Kate!”"
                    />
                  </label>
                  <label className="form-block">
                    <span>Description of your request</span>
                    <textarea
                      rows="5"
                      value={form.cakeDescription}
                      onChange={update('cakeDescription')}
                      placeholder="Colour, shape, added details…"
                    />
                  </label>
                </div>
              )}

              {form.productType === 'cupcake' && (
                <div className="order-grid">
                  <label>
                    <span>Quantity</span>
                    <select
                      required
                      className="order-select"
                      value={form.cupcakeQuantity}
                      onChange={update('cupcakeQuantity')}
                    >
                      <option value="" disabled>Choose a quantity…</option>
                      {DOZENS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Cupcake flavour</span>
                    <input
                      value={form.cupcakeFlavour}
                      onChange={update('cupcakeFlavour')}
                      placeholder="vanilla, red velvet, custom…"
                    />
                  </label>
                  <label className="form-block">
                    <span>Description of your request</span>
                    <textarea
                      rows="5"
                      value={form.cupcakeDescription}
                      onChange={update('cupcakeDescription')}
                      placeholder="Specific colour themes, pearls, toppers…"
                    />
                  </label>
                </div>
              )}

              {form.productType === 'macarons' && (
                <div className="order-grid">
                  <label>
                    <span>Quantity</span>
                    <select
                      required
                      className="order-select"
                      value={form.macaronQuantity}
                      onChange={update('macaronQuantity')}
                    >
                      <option value="" disabled>Choose a quantity…</option>
                      {DOZENS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Macaron flavours</span>
                    <input
                      value={form.macaronFlavours}
                      onChange={update('macaronFlavours')}
                      placeholder="3 flavours per dozen"
                    />
                  </label>
                  <label className="form-block">
                    <span>Extra requests</span>
                    <textarea
                      rows="4"
                      value={form.macaronExtras}
                      onChange={update('macaronExtras')}
                      placeholder="Any custom requests…"
                    />
                  </label>
                </div>
              )}

              {form.productType === 'other' && (
                <div className="order-grid">
                  <label className="form-block">
                    <span>What can we make for you?</span>
                    <textarea
                      rows="6"
                      value={form.otherDescription}
                      onChange={update('otherDescription')}
                      placeholder="Tell us what you have in mind — flavours, quantity, theme, anything else…"
                    />
                  </label>
                </div>
              )}

              {/* Inspo photos — for cake, cupcake & other */}
              {showPhotos && (
                <div className="form-block file-block">
                  <span className="file-block-label">Inspiration photos (optional)</span>
                  <input
                    ref={fileInputRef}
                    id="inspo-files"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    className="file-input-native"
                    aria-label="Inspiration photos (optional)"
                  />
                  <div className="file-controls">
                    <button
                      type="button"
                      className="file-input-button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <PaperclipIcon />
                      <span>{files.length === 0 ? 'Choose photos' : 'Add more photos'}</span>
                    </button>
                    {files.length > 0 && (
                      <span className="file-count" role="status">
                        {files.length} photo{files.length === 1 ? '' : 's'} attached
                      </span>
                    )}
                  </div>
                  {files.length > 0 && (
                    <ul className="file-previews">
                      {files.map((f, i) => (
                        <li key={`${f.name}-${i}`} className="file-preview">
                          <img src={previews[i]} alt={f.name} />
                          <button
                            type="button"
                            className="file-remove-thumb"
                            aria-label={`Remove ${f.name}`}
                            onClick={() => removeFile(i)}
                          >
                            ×
                          </button>
                          <span className="file-preview-name">{f.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="file-note">{PHOTO_NOTE}</p>
                </div>
              )}

              {/* Closing note */}
              <p className="order-note">
                {form.productType === 'macarons'
                  ? `You’ll receive confirmation and your pickup address + payment options within 48 hours via Instagram or email. Thank you! 💕`
                  : QUOTE_NOTE}
              </p>
            </fieldset>
          )}

          {error && <p className="form-error">{error}</p>}

          <div className="submit-row">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !form.productType}
            >
              {submitting ? 'Sending…' : 'Send request →'}
            </button>
          </div>
        </form>

      {submitted && (
        <div
          className="order-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-thanks-title"
          onClick={closeThanks}
        >
          <div className="order-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="order-modal-close"
              aria-label="Close"
              onClick={closeThanks}
            >
              ×
            </button>
            <div className="order-modal-emoji" aria-hidden="true">🎂</div>
            <h3 id="order-thanks-title">Thank you for your order!</h3>
            <p>
              You will get a reply within 48 hours via Instagram or email.
              {form.email ? ' A copy of your order has been sent to your inbox.' : ''}
            </p>
            <button type="button" className="btn btn-primary" onClick={closeThanks}>
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Order
