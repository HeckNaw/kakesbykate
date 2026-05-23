import { useEffect, useState } from 'react'
import logo from '../assets/kake.webp'

const SECTIONS = [
  { id: 'home',    label: 'Home',    num: '01' },
  { id: 'menu',    label: 'Menu',    num: '02' },
  { id: 'order',   label: 'Order',   num: '03' },
  { id: 'contact', label: 'Contact', num: '04' },
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
      const el = document.getElementById(id)
      if (!el) return
      if (window.__lenis) {
        window.__lenis.scrollTo(el)
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <header className="site-header">
      <a href="#home" onClick={scrollTo('home')} className="brand">
        <img src={logo} alt="Kakes by Kate" className="brand-logo" />
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
