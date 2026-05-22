import { NavLink, Outlet, Link } from 'react-router-dom'

function Layout() {
  return (
    <div className="site">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-mark">K</span>
          <span className="brand-name">Kakes by Kate</span>
        </Link>
        <nav className="site-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/order">Order</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <h4>Kakes by Kate</h4>
            <p>Custom celebration cakes, baked to order.</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p><a href="mailto:hello@kakesbykate.com">hello@kakesbykate.com</a></p>
          </div>
          <div>
            <h4>Follow</h4>
            <p><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></p>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} Kakes by Kate</div>
      </footer>
    </div>
  )
}

export default Layout
