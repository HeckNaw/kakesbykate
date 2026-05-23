import { useEffect } from 'react'
import Lenis from 'lenis'
import Header from './components/Header'
import Home from './sections/Home'
import InstaFeature from './sections/InstaFeature'
import Menu from './sections/Menu'
import Order from './sections/Order'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import './styles.css'

function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal:not(.is-visible)')
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// Custom smooth scroll with slightly stiffer-than-native momentum.
// Higher `lerp` = stiffer = scroll catches up to your wheel faster = stops more abruptly.
// Default Lenis lerp is 0.1 (very smooth/floaty). We use 0.14 for "a little more friction".
function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.14,
      duration: 1.0,
      wheelMultiplier: 1,
      smoothWheel: true,
      anchors: true,
    })
    window.__lenis = lenis

    let frame
    function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
}

function App() {
  useLenis()
  useScrollReveal()
  return (
    <div className="site">
      <Header />
      <main>
        <Home />
        <InstaFeature />
        <Menu />
        <Order />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
