function Contact() {
  return (
    <section id="contact" className="section section-contact">
      <div className="section-head reveal">
        <span className="section-num" data-num="05">— say hello</span>
        <h2>Send us<br/><em>a message!</em></h2>
        <p className="lede">
          We cater birthday parties, weddings, corporate events, and more. Contact us for quotes on custom orders.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-card feature reveal reveal--d1">
          <h4>Email</h4>
          <p className="big">
            <a href="mailto:kakesbykate24@gmail.com">kakesbykate24@gmail.com</a>
          </p>
        </div>
        <div className="contact-card reveal reveal--d2">
          <h4>Instagram</h4>
          <p className="big">
            <a href="https://instagram.com/_kakesbykate/" target="_blank" rel="noreferrer">@_kakesbykate</a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Contact
