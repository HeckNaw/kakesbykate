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

  function scrollTo(id) {
    return (e) => {
      e.preventDefault()
      const section = document.getElementById(id)
      if (!section) return
      // Scroll past the section's top padding to the actual content (.section-head).
      // Home doesn't have one (.hero instead) — falls back to the section itself.
      const target = section.querySelector('.section-head') || section
      if (window.__lenis) {
        window.__lenis.scrollTo(target)
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
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
  )
}

export default Header
