import { CHAPTER_COUNT } from '../lib/useChapter'

/**
 * Indicador de progreso: el mismo círculo abierto del final, en cinco tramos.
 * Aunque se recorran todos, el círculo nunca se cierra.
 */
export function ProgressRing({ current, label }: { current: number; label: string }) {
  const r = 10
  const gap = 46 // abertura arriba, en grados
  const sep = 9 // separación entre tramos
  const span = (360 - gap - sep * (CHAPTER_COUNT - 1)) / CHAPTER_COUNT
  const pt = (deg: number) => {
    const a = (deg * Math.PI) / 180
    return `${(14 + Math.sin(a) * r).toFixed(2)} ${(14 - Math.cos(a) * r).toFixed(2)}`
  }
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`${label} ${current + 1} de ${CHAPTER_COUNT}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        {Array.from({ length: CHAPTER_COUNT }, (_, i) => {
          const a0 = gap / 2 + i * (span + sep)
          const a1 = a0 + span
          const done = i < current
          const now = i === current
          return (
            <path
              key={i}
              d={`M${pt(a0)}A${r} ${r} 0 0 1 ${pt(a1)}`}
              fill="none"
              strokeLinecap="round"
              strokeWidth={now ? 2.4 : 1.6}
              className={now ? 'stroke-gold-deep' : done ? 'stroke-ink-soft' : 'stroke-sand'}
              style={{ transition: 'stroke 600ms ease, stroke-width 600ms ease' }}
            />
          )
        })}
      </svg>
    </div>
  )
}
