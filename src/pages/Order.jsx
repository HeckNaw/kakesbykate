import { useState } from 'react'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  servings: '',
  flavor: '',
  details: '',
}

function Order() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: wire to a real endpoint (Formspree, Vercel function, or Firebase).
    // For now we just acknowledge the submission so the UI is testable.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="page">
        <header className="page-header">
          <h1>Thanks — we got it!</h1>
          <p className="lede">
            Kate will review your request and reply within 24 hours with a custom quote.
          </p>
        </header>
      </section>
    )
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Order</p>
        <h1>Request a custom cake</h1>
        <p className="lede">Tell us about your event and we'll send a quote within 24 hours.</p>
      </header>

      <form className="order-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            <span>Your name</span>
            <input required value={form.name} onChange={update('name')} />
          </label>
          <label>
            <span>Email</span>
            <input required type="email" value={form.email} onChange={update('email')} />
          </label>
        </div>

        <div className="form-row">
          <label>
            <span>Phone (optional)</span>
            <input type="tel" value={form.phone} onChange={update('phone')} />
          </label>
          <label>
            <span>Event date</span>
            <input required type="date" value={form.eventDate} onChange={update('eventDate')} />
          </label>
        </div>

        <div className="form-row">
          <label>
            <span>Servings</span>
            <input required type="number" min="4" value={form.servings} onChange={update('servings')} />
          </label>
          <label>
            <span>Flavor preference</span>
            <input value={form.flavor} onChange={update('flavor')} placeholder="e.g. vanilla with raspberry" />
          </label>
        </div>

        <label className="form-block">
          <span>Tell us about your cake</span>
          <textarea
            rows="6"
            value={form.details}
            onChange={update('details')}
            placeholder="Colors, theme, dietary notes, inspiration photos…"
          />
        </label>

        <button type="submit" className="btn btn-primary">Send request</button>
      </form>
    </section>
  )
}

export default Order
