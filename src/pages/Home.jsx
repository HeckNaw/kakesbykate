import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Custom celebration cakes</p>
          <h1>Sweet moments,<br />made to order.</h1>
          <p className="lede">
            Handmade cakes for birthdays, weddings, and every reason
            in between — designed and baked just for you.
          </p>
          <div className="hero-cta">
            <Link to="/order" className="btn btn-primary">Place an order</Link>
            <Link to="/gallery" className="btn btn-ghost">See the gallery</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Made from scratch</h3>
          <p>Real butter, real vanilla, no shortcuts. Every cake is baked the day it's picked up.</p>
        </div>
        <div className="feature">
          <h3>Designed with you</h3>
          <p>Share your idea, colors, and theme — we'll sketch something one of a kind.</p>
        </div>
        <div className="feature">
          <h3>Local pickup</h3>
          <p>Order at least 7 days ahead. Pickup and limited local delivery available.</p>
        </div>
      </section>

      <section className="cta-strip">
        <h2>Have a date in mind?</h2>
        <p>Tell us about your event and we'll send a custom quote within 24 hours.</p>
        <Link to="/order" className="btn btn-primary">Start an order</Link>
      </section>
    </>
  )
}

export default Home
