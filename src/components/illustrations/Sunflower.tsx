import { memo } from 'react'

/** Girasol — la gratitud. `open` va de 0 (cerrado) a 1 (en plena flor). */
interface Props {
  open?: number
  stem?: number
  className?: string
}

const PETAL = 'M0 0C-5.4-6-6-16.5 0-25C6-16.5 5.4-6 0 0Z'
const SEEDS = Array.from({ length: 70 }, (_, i) => {
  const a = i * 2.39996
  const r = Math.sqrt(i / 70) * 13
  return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r] as const
})

export const Sunflower = memo(function Sunflower({ open = 1, stem = 0, className }: Props) {
  const h = 100 + stem
  const s = 0.55 + 0.45 * open
  return (
    <svg viewBox={`0 0 100 ${h}`} className={className} aria-hidden="true" focusable="false" overflow="visible">
      {stem > 0 && (
        <g>
          <path d={`M50 64C47 ${64 + stem * 0.4} 53 ${64 + stem * 0.7} 50 ${h}`} fill="none" className="stroke-sage-deep" strokeWidth={3.2} strokeLinecap="round" />
          <path d={`M50 64C47 ${64 + stem * 0.4} 53 ${64 + stem * 0.7} 50 ${h}`} fill="none" className="stroke-ink" strokeWidth={0.8} strokeLinecap="round" opacity={0.6} transform="translate(1.6 0)" />
          <g transform={`translate(50 ${64 + stem * 0.5}) rotate(-28)`}>
            <path d="M0 0C10-12 30-12 38-2C28 6 12 8 0 0Z" className="fill-sage" transform="translate(1.2 1.2)" />
            <path d="M0 0C10-12 30-12 38-2C28 6 12 8 0 0Z" fill="none" className="stroke-ink" strokeWidth={0.9} />
            <path d="M2 0C14-3 26-3 36-2" fill="none" className="stroke-ink" strokeWidth={0.5} opacity={0.6} />
          </g>
          {stem > 50 && (
            <g transform={`translate(50 ${64 + stem * 0.78}) rotate(208)`}>
              <path d="M0 0C10-10 26-10 32-2C24 5 10 7 0 0Z" className="fill-sage-soft" transform="translate(1.2 1.2)" />
              <path d="M0 0C10-10 26-10 32-2C24 5 10 7 0 0Z" fill="none" className="stroke-ink" strokeWidth={0.9} />
            </g>
          )}
        </g>
      )}
      <g
        style={{
          transformOrigin: '50px 50px',
          transform: `scale(${s})`,
          transition: 'transform 900ms var(--ease-soft)',
        }}
      >
        {/* Pétalos de atrás */}
        {Array.from({ length: 18 }, (_, i) => (
          <g key={`b${i}`} transform={`translate(50 50) rotate(${i * 20 + 10}) translate(0 -13)`}>
            <path d={PETAL} className="fill-gold" opacity={0.85} transform="translate(1 1)" />
            <path d={PETAL} fill="none" className="stroke-ink" strokeWidth={0.7} opacity={0.7} />
          </g>
        ))}
        {/* Pétalos de adelante */}
        {Array.from({ length: 18 }, (_, i) => (
          <g key={`f${i}`} transform={`translate(50 50) rotate(${i * 20}) translate(0 -14) scale(0.94)`}>
            <path d={PETAL} className="fill-gold-soft" transform="translate(1.2 1.2)" />
            <path d={PETAL} fill="none" className="stroke-ink" strokeWidth={0.8} />
            <path d="M0-3L0-20" className="stroke-gold-deep" strokeWidth={0.5} opacity={0.6} />
          </g>
        ))}
      </g>
      {/* Centro */}
      <circle cx={51.2} cy={51.2} r={16} className="fill-umber" />
      <circle cx={50} cy={50} r={16} fill="none" className="stroke-ink" strokeWidth={1} />
      <g className="fill-gold-soft" opacity={0.75}>
        {SEEDS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.85} />
        ))}
      </g>
    </svg>
  )
})
