import { useEffect, useState } from 'react'
import logo from '../assets/kake.webp'

const SECTIONS = [
  { id: 'home',    label: 'Home',    num: '01' },
  { id: 'menu',    label: 'Menu',    num: '02' },
  { id: 'order',   label: 'Order',   num: '03' },
  { id: 'reviews', label: 'Reviews', num: '04' },
  { id: 'contact', label: 'Contact', num: '05' },
]

function Header() {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Lock page scroll (and pause Lenis) while the mobile menu is open.
  useEffect(() => {
    if (open) {
      window.__lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      window.__lenis?.start()
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close the menu on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function scrollTo(id) {
    return (e) => {
      e.preventDefault()
      setOpen(false)
      const section = document.getElementById(id)
      if (!section) return
      // Scroll past the section's top padding to the actual content (.section-head).
      // Home doesn't have one (.hero instead) — falls back to the section itself.
      const target = section.querySelector('.section-head') || section
      if (window.__lenis) {
        window.__lenis.start() // resume now; the close effect runs after this handler
        window.__lenis.scrollTo(target)
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <>
      <header className="site-header">
        <a href="#home" onClick={scrollTo('home')} className="brand">
          <img src={logo} alt="Kakes by Kate" className="brand-logo" width="46" height="46" />
          <span className="brand-name">kakes by kate</span>
        </a>
        <nav className="site-nav">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={scrollTo(s.id)}
              data-num={s.num}
              className={active === s.id ? 'active' : ''}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Floating hamburger — mobile only (hidden ≥601px via CSS) */}
      <button
        type="button"
        className={`nav-toggle${open ? ' is-open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle-box" aria-hidden="true">
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </span>
      </button>

      <div
        id="mobile-menu"
        className={`nav-overlay${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false)
        }}
      >
        <div className="nav-overlay-inner">
          <img src={logo} alt="" className="nav-overlay-logo" width="56" height="56" />
          <ul className="nav-overlay-list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={scrollTo(s.id)}
                  className={active === s.id ? 'active' : ''}
                >
                  <span className="nav-overlay-num">{s.num}</span>
                  <span className="nav-overlay-word">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            className="nav-overlay-handle"
            href="https://instagram.com/_kakesbykate/"
            target="_blank"
            rel="noreferrer"
          >
            @_kakesbykate
          </a>
        </div>
      </div>
    </>
  )
}

export default Header
