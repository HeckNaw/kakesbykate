import marketPhoto from '../assets/holiday-market.webp'

// Announcement bar for the UofT Holiday Market pop-up. Sits directly under
// the sticky header and scrolls away with the page.
//
// The photo is newbanana.png cropped to its visible content (the source has
// a lot of transparent padding) and saved as holiday-market.webp.
function LaunchBanner() {
  return (
    <div
      className="launch-banner"
      role="region"
      aria-label="UofT Holiday Market announcement"
    >
      <div className="launch-banner-inner">
        <p className="launch-banner-title">
          <span className="launch-banner-eyebrow">December 2nd, 10AM-6PM @ UofT Bookstore</span>
          UofT Holiday Market
        </p>
        <p className="launch-banner-when">
          <time dateTime="2026-12-02T10:00">TRY OUR NEW</time>
          <span className="launch-banner-dot" aria-hidden="true">ITEMS!!!</span>
        </p>
      </div>
      <span className="launch-banner-photo" aria-hidden="true">
        <img src={marketPhoto} alt="" />
      </span>
    </div>
  )
}

export default LaunchBanner
