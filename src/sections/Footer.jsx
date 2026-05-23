import logo from '../assets/kake.webp'

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
          <p><a href="https://instagram.com/_kakesbykate/" target="_blank" rel="noreferrer">@_kakesbykate</a></p>
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
