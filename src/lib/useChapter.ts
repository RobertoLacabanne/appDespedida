import { useCallback, useEffect, useRef, useState } from 'react'

export const CHAPTER_COUNT = 5

const fromHash = (): number => {
  const m = window.location.hash.match(/^#(\d)$/)
  if (!m) return 0
  const n = Number(m[1]) - 1
  return n >= 0 && n < CHAPTER_COUNT ? n : 0
}

/**
 * Capítulo actual sincronizado con el historial: el botón "atrás" del
 * celular vuelve al capítulo anterior en lugar de cerrar la experiencia.
 */
export function useChapter() {
  const [chapter, setChapter] = useState<number>(fromHash)
  const current = useRef(chapter)

  useEffect(() => {
    const onPop = () => {
      current.current = fromHash()
      setChapter(current.current)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const goTo = useCallback((n: number) => {
    const next = Math.max(0, Math.min(CHAPTER_COUNT - 1, n))
    if (next === current.current) return
    const url = next === 0 ? window.location.pathname + window.location.search : `#${next + 1}`
    window.history.pushState(null, '', url)
    current.current = next
    setChapter(next)
  }, [])

  return { chapter, goTo }
}
