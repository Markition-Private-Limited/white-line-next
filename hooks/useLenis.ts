import Lenis from 'lenis'
import { useEffect } from 'react'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    // Recalculate scroll height after all content/images have loaded
    const onLoad = () => lenis.resize()
    window.addEventListener('load', onLoad)

    // Also recalculate on resize (handles iOS address bar show/hide)
    const onResize = () => lenis.resize()
    window.addEventListener('resize', onResize)

    const stop = () => lenis.stop()
    const start = () => lenis.start()
    window.addEventListener('lenis:stop', stop)
    window.addEventListener('lenis:start', start)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('lenis:stop', stop)
      window.removeEventListener('lenis:start', start)
      lenis.destroy()
    }
  }, [])
}
