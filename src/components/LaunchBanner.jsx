import banana from '../assets/banana.png'

// Announcement bar for the banana pudding launch. Sits directly under the
// sticky header and scrolls away with the page. The banana photo reuses the
// same polaroid treatment as the hero collage (.hp).
//
// NOTE: the CTA is disabled and reads "Coming soon" until the dedicated
// pre-order page is built.
function LaunchBanner() {
  return (
    <div
      className="launch-banner"
      role="region"
      aria-label="Banana pudding launch announcement"
    >
      <div className="launch-banner-inner">
        <p className="launch-banner-title">New! Banana Pudding</p>
        <button className="launch-banner-cta" type="button" disabled>
          Coming soon
        </button>
      </div>
      <span className="launch-banner-photo" aria-hidden="true">
        <img src={banana} alt="" />
      </span>
    </div>
  )
}

export default LaunchBanner
