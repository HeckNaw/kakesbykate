import { useState } from 'react'
import review1 from '../assets/review1.jpg'
import review2 from '../assets/review2.jpg'
import review3 from '../assets/review3.jpg'

// Same Google Apps Script endpoint as the order form; reviews are tagged with
// type:'review' so the script writes them to the "Reviews" sheet tab instead.
const ENDPOINT =
  import.meta.env.VITE_ORDER_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbx4xQSDooNGTlLZWolr-wlSc6VIyM4V4dps7b0Erd1CctI92kdxzplasCBCo6_tsEAh/exec'

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
  5: 'Absolutely scrumptious!',
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

  const shown = hover || rating

  async function handleSubmit(e) {
    e.preventDefault()
    if (!rating) {
      setError('Please pick a cupcake rating first!')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        type: 'review',
        name,
        rating,
        feedback,
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

  return (
    <section id="reviews" className="section section-reviews">
      <div className="section-head reveal">
        <span className="section-num" data-num="04">— kind words</span>
        <h2>Sweet things<br /><em>people say.</em></h2>
        <p className="lede">
          A few of the lovely notes our customers have sent after their first bite.
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
        {done ? (
          <div className="review-done">
            <h3>Thank you — you’re the sweetest! 🧁</h3>
            <p>Your review means the world to Kate.</p>
          </div>
        ) : (
          <form className="review-form" onSubmit={handleSubmit}>
            <h3>Leave a review</h3>
            <p className="review-form-sub">Tasted something delightful? Tell us about it.</p>

            <label>
              <span>Your name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name is perfect"
              />
            </label>

            <div className="rating-field">
              <span>How sweet was it?</span>
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
                {shown ? `${shown} — ${RATING_LABELS[shown]}` : 'Tap a cupcake to rate'}
              </p>
            </div>

            <label>
              <span>Your feedback</span>
              <textarea
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you order, and what did you love about it?"
              />
            </label>

            {error && <p className="review-error">{error}</p>}

            <div className="review-submit-row">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Sending…' : 'Share review →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default Reviews
