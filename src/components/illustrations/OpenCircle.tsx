import { memo, useId } from 'react'

/**
 * Círculo abierto — los vínculos continúan. Se dibuja despacio y nunca se
 * cierra: siempre queda una abertura.
 */
interface Props {
  drawn: boolean
  /** Abertura en grados */
  gap?: number
  /** Dónde está la abertura (grados, 0 = arriba, horario) */
  gapAt?: number
  duration?: number
  glow?: boolean
  strokeWidth?: number
  className?: string
}

export const OpenCircle = memo(function OpenCircle({
  drawn,
  gap = 34,
  gapAt = 38,
  duration = 4200,
  glow = true,
  strokeWidth = 1.6,
  className,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const r = 46
  const start = ((gapAt + gap / 2) * Math.PI) / 180
  const end = ((gapAt - gap / 2 + 360) * Math.PI) / 180
  const pt = (a: number) => [50 + Math.sin(a) * r, 50 - Math.cos(a) * r].map((v) => v.toFixed(2)).join(' ')
  const d = `M${pt(start)}A${r} ${r} 0 1 1 ${pt(end)}`
  const dash = {
    strokeDasharray: '1 1',
    strokeDashoffset: drawn ? 0 : 1,
    transition: `stroke-dashoffset ${duration}ms cubic-bezier(0.45, 0.05, 0.35, 1)`,
  }
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false" overflow="visible">
      <defs>
        <linearGradient id={`ring-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-soft)" />
          <stop offset="55%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-apricot)" />
        </linearGradient>
      </defs>
      {glow && (
        <>
          <path d={d} fill="none" stroke="var(--color-gold-light)" strokeWidth={strokeWidth * 7} strokeLinecap="round" opacity={0.55} pathLength={1} style={dash} />
          <path d={d} fill="none" stroke="var(--color-gold-soft)" strokeWidth={strokeWidth * 3} strokeLinecap="round" opacity={0.5} pathLength={1} style={dash} />
        </>
      )}
      <path d={d} fill="none" stroke={`url(#ring-${uid})`} strokeWidth={strokeWidth} strokeLinecap="round" pathLength={1} style={dash} />
      {/* Los extremos brillan un poco: ahí es donde el círculo sigue abierto */}
      <g style={{ opacity: drawn ? 1 : 0, transition: `opacity 800ms ease ${duration * 0.9}ms` }}>
        <circle cx={pt(start).split(' ')[0]} cy={pt(start).split(' ')[1]} r={strokeWidth * 1.2} fill="var(--color-gold-light)" />
        <circle cx={pt(end).split(' ')[0]} cy={pt(end).split(' ')[1]} r={strokeWidth * 1.2} fill="var(--color-gold-light)" />
      </g>
    </svg>
  )
})
