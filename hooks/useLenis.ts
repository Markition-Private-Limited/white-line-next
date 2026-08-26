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

    const stop = () => lenis.stop()
    const start = () => lenis.start()
    window.addEventListener('lenis:stop', stop)
    window.addEventListener('lenis:start', start)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('lenis:stop', stop)
      window.removeEventListener('lenis:start', start)
      lenis.destroy()
    }
  }, [])
}
