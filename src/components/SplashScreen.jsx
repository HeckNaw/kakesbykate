import { useEffect, useState } from 'react'
import logo from '../assets/kake.webp'

const FILL_MS = 1800
const POP_MS = 900
const FADE_MS = 700

function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('fill')

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const t1 = setTimeout(() => setPhase('pop'), FILL_MS)
    const t2 = setTimeout(() => setPhase('fade'), FILL_MS + POP_MS)
    const t3 = setTimeout(() => {
      document.body.style.overflow = previousOverflow
      onDone()
    }, FILL_MS + POP_MS + FADE_MS)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      document.body.style.overflow = previousOverflow
    }
  }, [onDone])

  return (
    <div className={`splash splash--${phase}`} role="presentation" aria-hidden="true">
      <div className="splash-logo">
        <img src={logo} alt="" className="splash-logo-base" />
        <div className="splash-logo-mask" style={{ '--logo-img': `url(${logo})` }}>
          <div className="splash-liquid">
            <span className="splash-wave" aria-hidden="true" />
          </div>
        </div>
        <span className="splash-burst" aria-hidden="true" />
        <span className="splash-sparkle splash-sparkle--1" aria-hidden="true" />
        <span className="splash-sparkle splash-sparkle--2" aria-hidden="true" />
        <span className="splash-sparkle splash-sparkle--3" aria-hidden="true" />
        <span className="splash-sparkle splash-sparkle--4" aria-hidden="true" />
        <span className="splash-sparkle splash-sparkle--5" aria-hidden="true" />
        <span className="splash-sparkle splash-sparkle--6" aria-hidden="true" />
      </div>
    </div>
  )
}

export default SplashScreen
