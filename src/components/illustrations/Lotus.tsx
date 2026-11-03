import { memo } from 'react'

/** Flor de loto — el crecimiento personal. `open` abre los pétalos. */
interface Props {
  open?: number
  water?: boolean
  className?: string
}

const PETAL = 'M0 0C-9-12-9-34 0-50C9-34 9-12 0 0Z'
// [ángulo abierto, escala, capa]
const BACK: Array<[number, number]> = [
  [-62, 0.78],
  [-34, 0.92],
  [34, 0.92],
  [62, 0.78],
]
const FRONT: Array<[number, number]> = [
  [-48, 0.86],
  [-18, 0.98],
  [0, 1.02],
  [18, 0.98],
  [48, 0.86],
]

const Petal = ({ angle, scale, open, back, delay }: { angle: number; scale: number; open: number; back?: boolean; delay: number }) => (
  <g
    style={{
      transformOrigin: '60px 72px',
      transform: `rotate(${angle * (0.18 + 0.82 * open)}deg) scale(${scale})`,
      transition: `transform 1.6s var(--ease-soft) ${delay}ms`,
    }}
  >
    <g transform="translate(60 72)">
      <path d={PETAL} className={back ? 'fill-rose-soft' : 'fill-rose-mist'} transform="translate(1.4 1.4)" />
      <path d={PETAL} fill="none" className="stroke-ink" strokeWidth={0.85} />
      <path d="M0-4C-2-16-2-30 0-44" fill="none" className={back ? 'stroke-rose' : 'stroke-rose-deep'} strokeWidth={0.6} opacity={0.6} />
      {!back && <path d="M0 0C-5-8-6-18-4-26" fill="none" className="stroke-rose" strokeWidth={4} opacity={0.35} strokeLinecap="round" />}
    </g>
  </g>
)

export const Lotus = memo(function Lotus({ open = 1, water = true, className }: Props) {
  return (
    <svg viewBox="0 0 120 92" className={className} aria-hidden="true" focusable="false" overflow="visible">
      {water && (
        <g>
          <ellipse cx={60} cy={78} rx={52} ry={7} className="fill-sage-mist" opacity={0.9} />
          <path d="M14 80C30 77 44 82 60 79S92 76 106 80" fill="none" className="stroke-ink" strokeWidth={0.7} opacity={0.45} />
          <path d="M26 86C40 84 52 88 66 85S88 84 98 86" fill="none" className="stroke-ink" strokeWidth={0.5} opacity={0.3} />
          {/* Hoja flotante */}
          <path d="M84 76C90 70 106 70 110 76C106 81 92 82 84 79L95 76Z" className="fill-sage" transform="translate(1 1)" />
          <path d="M84 76C90 70 106 70 110 76C106 81 92 82 84 79L95 76Z" fill="none" className="stroke-ink" strokeWidth={0.7} />
        </g>
      )}
      {BACK.map(([a, s], i) => (
        <Petal key={`b${i}`} angle={a} scale={s} open={open} back delay={i * 90} />
      ))}
      {FRONT.map(([a, s], i) => (
        <Petal key={`f${i}`} angle={a} scale={s} open={open} delay={200 + i * 90} />
      ))}
      <ellipse cx={60} cy={73} rx={9} ry={3.2} className="fill-gold-soft stroke-ink" strokeWidth={0.6} />
    </svg>
  )
})
