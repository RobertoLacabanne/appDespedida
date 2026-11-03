import { memo } from 'react'

/** Rama de olivo — la paz y el agradecimiento. `open` hace aparecer las aceitunas. */
interface Props {
  open?: number
  className?: string
}

const LEAF = 'M0 0C5-3.6 17-4.2 28 0C17 4.2 5 3.6 0 0Z'
// [posición a lo largo de la rama (0-1), lado, escala]
const LEAVES: Array<[number, 1 | -1, number]> = [
  [0.12, -1, 0.9],
  [0.2, 1, 1],
  [0.3, -1, 1.05],
  [0.4, 1, 1],
  [0.5, -1, 1.05],
  [0.6, 1, 0.95],
  [0.7, -1, 0.95],
  [0.79, 1, 0.85],
  [0.88, -1, 0.8],
  [0.97, 1, 0.7],
]
const OLIVES: Array<[number, 1 | -1]> = [
  [0.35, 1],
  [0.55, -1],
  [0.74, 1],
]

// Rama: curva cúbica de (20,148) a (62,6)
const P0 = [20, 148]
const P1 = [44, 110]
const P2 = [36, 50]
const P3 = [62, 6]
const at = (t: number) => {
  const u = 1 - t
  const x = u ** 3 * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t ** 3 * P3[0]
  const y = u ** 3 * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t ** 3 * P3[1]
  const dx = 3 * u * u * (P1[0] - P0[0]) + 6 * u * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0])
  const dy = 3 * u * u * (P1[1] - P0[1]) + 6 * u * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1])
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI }
}

export const OliveBranch = memo(function OliveBranch({ open = 1, className }: Props) {
  return (
    <svg viewBox="0 0 90 160" className={className} aria-hidden="true" focusable="false" overflow="visible">
      <path
        d={`M${P0}C${P1} ${P2} ${P3}`}
        fill="none"
        className="stroke-umber-soft"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <path d={`M${P0}C${P1} ${P2} ${P3}`} fill="none" className="stroke-ink" strokeWidth={0.7} opacity={0.6} transform="translate(1.2 0)" />
      {LEAVES.map(([t, side, k], i) => {
        const p = at(t)
        const rot = p.a + side * 42
        return (
          <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${k})`}>
            <path d={LEAF} className={i % 3 === 0 ? 'fill-sage' : 'fill-sage-deep'} opacity={0.92} transform="translate(1 1)" />
            <path d={LEAF} fill="none" className="stroke-ink" strokeWidth={0.75} />
            <path d="M1.5 0H25" className="stroke-sage-mist" strokeWidth={0.5} opacity={0.8} />
          </g>
        )
      })}
      {OLIVES.map(([t, side], i) => {
        const p = at(t)
        const ox = p.x + side * 8
        const oy = p.y + 6
        return (
          <g
            key={`o${i}`}
            style={{
              transformOrigin: `${ox}px ${oy - 6}px`,
              transform: `scale(${0.35 + 0.65 * open})`,
              opacity: 0.35 + 0.65 * open,
              transition: `transform 900ms var(--ease-soft) ${i * 120}ms, opacity 600ms ease ${i * 120}ms`,
            }}
          >
            <path d={`M${p.x} ${p.y}Q${(p.x + ox) / 2} ${p.y + 1} ${ox} ${oy - 5}`} fill="none" className="stroke-umber-soft" strokeWidth={0.9} />
            <ellipse cx={ox + 0.9} cy={oy + 0.9} rx={4.2} ry={5.6} className="fill-olive" />
            <ellipse cx={ox} cy={oy} rx={4.2} ry={5.6} fill="none" className="stroke-ink" strokeWidth={0.8} />
            <ellipse cx={ox - 1.3} cy={oy - 2} rx={1} ry={1.6} className="fill-sage-mist" opacity={0.7} />
          </g>
        )
      })}
    </svg>
  )
})
