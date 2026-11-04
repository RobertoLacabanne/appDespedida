import { useEffect } from 'react'

/**
 * En el plan gratuito, Netlify agrega abajo a la derecha un distintivo fijo
 * que no se puede ocultar. Medimos cuánto ocupa y lo publicamos en la
 * variable CSS --badge-space para que la navegación quede siempre por encima
 * y se pueda tocar. Si no hay distintivo, la variable vale 0.
 */
export function useHostBadge() {
  useEffect(() => {
    const root = document.documentElement
    let current = -1
    let ro: ResizeObserver | null = null
    let observed: Element | null = null

    const update = () => {
      const frame = document.getElementById('nl-badge-frame')
      const space = frame ? Math.max(0, Math.round(window.innerHeight - frame.getBoundingClientRect().top)) : 0
      if (frame && frame !== observed) {
        ro?.disconnect()
        ro = new ResizeObserver(update)
        ro.observe(frame)
        observed = frame
      }
      if (space !== current) {
        current = space
        root.style.setProperty('--badge-space', `${space}px`)
        window.dispatchEvent(new Event('badgespace'))
      }
    }

    const mo = new MutationObserver(update)
    mo.observe(document.body, { childList: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      mo.disconnect()
      ro?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])
}
