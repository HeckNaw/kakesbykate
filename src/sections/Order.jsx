import { useState } from 'react'

const initialForm = {
  name: '',
  email: '',
  instagram: '',
  eventDate: '',
  servings: '',
  flavour: '',
  details: '',
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

function Order() {
  const [form, setForm] = useState(initialForm)
  const [files, setFiles] = useState([])
  const [submitted, setSubmitted] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleFiles(e) {
    setFiles((existing) => [...existing, ...Array.from(e.target.files || [])])
    e.target.value = ''
  }

  function removeFile(idx) {
    setFiles((fs) => fs.filter((_, i) => i !== idx))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: wire to a real endpoint (Formspree, Vercel function, or Firebase).
    // When wired up, send `files` as multipart/form-data alongside `form`.
    setSubmitted(true)
  }

  return (
    <section id="order" className="section section-order">
      <div className="section-head reveal">
        <span className="section-num" data-num="03">— place an order</span>
        <h2>Tell us about<br /><em>your order.</em></h2>
        <p className="lede">
          Share the details below and we'll respond within a few days with a custom quote and to confirm your order.
        </p>
      </div>

      {submitted ? (
        <div className="thanks reveal">
          <h3>Sweet — we got it.</h3>
          <p>Kate will review your request and reply within 24 hours.</p>
        </div>
      ) : (
        <form className="order-form reveal reveal--d1" onSubmit={handleSubmit}>
          <label>
            <span>Your name</span>
            <input required value={form.name} onChange={update('name')} />
          </label>
          <label>
            <span>Email</span>
            <input required type="email" value={form.email} onChange={update('email')} />
          </label>
          <label>
            <span>Instagram (optional)</span>
            <input type="text" value={form.instagram} onChange={update('instagram')} placeholder="@handle" />
          </label>
          <label>
            <span>Event date</span>
            <input required type="date" value={form.eventDate} onChange={update('eventDate')} />
          </label>
          <label>
            <span>Servings</span>
            <input required type="number" min="4" value={form.servings} onChange={update('servings')} />
          </label>
          <label>
            <span>Flavour preference</span>
            <input value={form.flavour} onChange={update('flavour')} placeholder="vanilla with raspberry…" />
          </label>
          <label className="form-block">
            <span>Your order</span>
            <textarea
              rows="6"
              value={form.details}
              onChange={update('details')}
              placeholder="Colours, theme, dietary notes, anything else we should know…"
            />
          </label>

          <div className="form-block file-block">
            <span className="file-block-label">Inspiration photos (optional)</span>
            <input
              id="inspo-files"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="file-input-native"
              aria-label="Inspiration photos (optional)"
            />
            <label htmlFor="inspo-files" className="file-input-button">
              <PaperclipIcon />
              <span>{files.length === 0 ? 'Choose photos' : 'Add more photos'}</span>
            </label>
            {files.length > 0 && (
              <ul className="file-list">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`}>
                    <span className="file-name">{f.name}</span>
                    <button
                      type="button"
                      className="file-remove"
                      aria-label={`Remove ${f.name}`}
                      onClick={() => removeFile(i)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="submit-row">
            <button type="submit" className="btn btn-primary">Send request →</button>
          </div>
        </form>
      )}
    </section>
  )
}

export default Order
