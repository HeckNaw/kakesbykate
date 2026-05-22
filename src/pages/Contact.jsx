function Contact() {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Contact</p>
        <h1>Say hello</h1>
        <p className="lede">
          The fastest way to reach Kate is by email. We aim to reply within one business day.
        </p>
      </header>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>Email</h3>
          <p><a href="mailto:hello@kakesbykate.com">hello@kakesbykate.com</a></p>
        </div>
        <div className="contact-card">
          <h3>Instagram</h3>
          <p><a href="https://instagram.com" target="_blank" rel="noreferrer">@kakesbykate</a></p>
        </div>
        <div className="contact-card">
          <h3>Hours</h3>
          <p>Tuesday – Saturday<br />9am – 5pm</p>
        </div>
      </div>
    </section>
  )
}

export default Contact
