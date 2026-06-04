import { useState, useMemo, useEffect, useRef } from 'react'
import review1 from '../assets/review1.jpg'
import review2 from '../assets/review2.jpg'
import review3 from '../assets/review3.jpg'
import logo from '../assets/kake.webp'

// Same Google Apps Script endpoint as the order form; reviews are tagged with
// type:'review' so the script writes them to the "Reviews" sheet tab instead.
const ENDPOINT =
  import.meta.env.VITE_ORDER_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbwT2toz9znkPadREwXybiEn1sjNrPDaFDU-2EW7EZVgW6TB3nWtxzXAOR8tM9lOmjGX/exec'

const REVIEWS = [
  {
    img: review1,
    name: 'Shriana',
    tilt: 'tilt-a',
    quote:
      'Best cake ever — it fed a family of 14 and was demolished! The filling was so freaking good. I’m not a cake person but I’ll always buy one… we loved that it actually had crushed Oreos!',
  },
  {
    img: review2,
    name: 'Rameeka',
    tilt: 'tilt-b',
    quote:
      'Thank you sooo much! All my friends loved it — they said it’s so yummy. We loved the cake, it was gorgeous… you make my birthday every year! 🥹',
  },
  {
    img: review3,
    name: 'Tracy',
    tilt: 'tilt-c',
    quote:
      'My son brought home some macarons on Mother’s Day — I must say they are the best I have ever had, hands down!',
  },
]

const RATING_LABELS = {
  1: 'Needs more sugar',
  2: 'A little plain',
  3: 'Pretty tasty',
  4: 'Really delicious',
  5: 'Soooo yummy!',
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

// Downscale + re-encode a photo before upload (same as the order form).
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
      reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result })
      reader.readAsDataURL(file)
    }
    img.src = url
  })
}

function Cupcake() {
  return (
    <svg viewBox="0 0 24 24" className="cupcake" aria-hidden="true">
      <circle className="cc-cherry" cx="12" cy="3.7" r="1.4" />
      <path
        className="cc-frost"
        d="M6.5 11.2c-1 0-1.8-.8-1.8-1.8 0-.85.6-1.56 1.4-1.74C6.2 6.4 7.2 5.6 8.4 5.6c.36 0 .7.07 1.02.2C9.96 4.7 10.9 4 12 4s2.04.7 2.58 1.8c.32-.13.66-.2 1.02-.2 1.2 0 2.2.8 2.4 2.06.8.18 1.4.9 1.4 1.74 0 1-.8 1.8-1.8 1.8H6.5z"
      />
      <path
        className="cc-cup"
        d="M7 12h10l-1.05 7.8a1.2 1.2 0 0 1-1.19 1.04H9.24A1.2 1.2 0 0 1 8.05 19.8L7 12z"
      />
    </svg>
  )
}

function Reviews() {
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  const shown = hover || rating
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews])

  function handleFiles(e) {
    const picked = Array.from(e.target.files || [])
    setFiles((existing) => [...existing, ...picked])
    e.target.value = ''
  }
  function removeFile(idx) {
    setFiles((fs) => fs.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!rating) {
      setError('Please pick a cupcake rating first!')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const photos = await Promise.all(files.map((f) => compressImage(f)))
      const payload = {
        type: 'review',
        name,
        rating,
        feedback,
        photos,
        submittedAt: new Date().toISOString(),
      }
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
      } else {
        console.warn('VITE_ORDER_ENDPOINT not set; review not sent:', payload)
      }
      setDone(true)
    } catch (err) {
      setError('Something went wrong sending your review. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  function closeReview() {
    setDone(false)
    setName('')
    setFeedback('')
    setRating(0)
    setHover(0)
    setFiles([])
  }

  return (
    <section id="reviews" className="section section-reviews">
      <div className="section-head reveal">
        <span className="section-num" data-num="04">— kind words</span>
        <h2>Liked it?<br /><em>Leave a review!</em></h2>
        <p className="lede">
          Let us know what you thought of your order, and share any
          feedback you have about your experience.
        </p>
      </div>

      <div className="reviews-showcase">
        {REVIEWS.map((r, i) => (
          <figure key={r.name} className={`review-card ${r.tilt} reveal reveal--d${i + 1}`}>
            <div className="review-photo">
              <img src={r.img} alt={`A treat made for ${r.name}`} loading="lazy" />
            </div>
            <blockquote className="review-quote">“{r.quote}”</blockquote>
            <figcaption className="review-name">{r.name}</figcaption>
          </figure>
        ))}
      </div>

      <div className="review-form-wrap reveal">
        <form className="review-form" onSubmit={handleSubmit}>
            <h3>Leave a review</h3>
            <p className="review-form-sub">Tasted something delightful? Tell us about it.</p>

            <label>
              <span>Your name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <div className="rating-field">
              <span>How was it?</span>
              <div
                className="rating"
                role="radiogroup"
                aria-label="Rate your experience from 1 to 5 cupcakes"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} out of 5 cupcakes`}
                    className={`cupcake-btn${n <= shown ? ' is-on' : ''}`}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onFocus={() => setHover(n)}
                    onBlur={() => setHover(0)}
                    onClick={() => setRating(n)}
                  >
                    <Cupcake />
                  </button>
                ))}
              </div>
              <p className="rating-label">
                {shown ? `${shown} — ${RATING_LABELS[shown]}` : 'Tap a cupcake'}
              </p>
            </div>

            <label>
              <span>Your feedback</span>
              <textarea
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you order, and what did you think about it?"
              />
            </label>

            <div className="form-block file-block">
              <span className="file-block-label">Photos (optional)</span>
              <input
                ref={fileInputRef}
                id="review-files"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="file-input-native"
                aria-label="Photos (optional)"
              />
              <div className="file-controls">
                <button
                  type="button"
                  className="file-input-button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <PaperclipIcon />
                  <span>{files.length === 0 ? 'Add photos' : 'Add more photos'}</span>
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
            </div>

            {error && <p className="review-error">{error}</p>}

            <div className="review-submit-row">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Sending…' : 'Share review →'}
              </button>
            </div>
        </form>
      </div>

      {done && (
        <div className="order-modal" role="dialog" aria-modal="true"
          aria-labelledby="review-thanks-title" onClick={closeReview}>
          <div className="order-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="order-modal-close" aria-label="Close" onClick={closeReview}>×</button>
            <img className="order-modal-logo" src={logo} alt="" aria-hidden="true" />
            <h3 id="review-thanks-title">Thank you for the feedback!</h3>
            <p>Your review means the world to us!</p>
            <button type="button" className="btn btn-primary" onClick={closeReview}>Done</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Reviews
