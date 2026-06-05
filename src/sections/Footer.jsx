import logo from '../assets/newlogo.webp'

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-2.9v11.5a2.45 2.45 0 1 1-2.45-2.45c.2 0 .4.03.6.08V9.18a5.36 5.36 0 0 0-.6-.04 5.34 5.34 0 1 0 5.34 5.34V8.99a7.06 7.06 0 0 0 4.07 1.3V7.38a4.28 4.28 0 0 1-2.99-1.56z" />
    </svg>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="" className="footer-logo" />
          <p className="footer-tag"></p>
        </div>
        <div>
          <h4>Contact</h4>
          <p><a href="mailto:orders@kakesbykate.com">orders@kakesbykate.com</a></p>
        </div>
        <div>
          <h4>Follow</h4>
          <p><a className="footer-social" href="https://instagram.com/_kakesbykate/" target="_blank" rel="noreferrer"><InstagramIcon /> @_kakesbykate</a></p>
          <p><a className="footer-social" href="https://www.tiktok.com/@_kakesbykate" target="_blank" rel="noreferrer"><TikTokIcon /> @_kakesbykate</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} KakesbyKate</span>
        <span></span>
      </div>
    </footer>
  )
}

export default Footer
