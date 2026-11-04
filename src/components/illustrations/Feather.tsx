import { memo } from 'react'

/** Pluma blanca — una despedida serena. */
const LEFT_VANE = 'M30 150C19 128 10 92 15 58C18 36 25 18 32 6'
const RIGHT_VANE = 'M32 6C41 22 49 52 47 88C45.5 112 39 134 31.5 150'

const barbs = (side: -1 | 1) =>
  Array.from({ length: 22 }, (_, i) => {
    const t = (i + 1) / 24
    const y = 150 - t * 140
    const x = 31 + (side > 0 ? 0.6 : -0.6) + t * 1
    const reach = Math.sin(Math.PI * Math.min(1, t * 1.15)) * (side > 0 ? 15 : 14) + 2
    return `M${x.toFixed(1)} ${y.toFixed(1)}q${(side * reach * 0.6).toFixed(1)} -4 ${(side * reach).toFixed(1)} -12`
  }).join('')

export const Feather = memo(function Feather({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 170" className={className} aria-hidden="true" focusable="false" overflow="visible">
      {/* Aguada blanca con un borde tibio para que se lea sobre el papel */}
      <path d={`${LEFT_VANE}${RIGHT_VANE.replace('M', 'L')}Z`} className="fill-paper-light" transform="translate(1.5 1.5)" />
      <path d={`${LEFT_VANE}${RIGHT_VANE.replace('M', 'L')}Z`} className="fill-white" opacity={0.85} />
      <path d={barbs(-1)} fill="none" className="stroke-ink-faint" strokeWidth={0.45} opacity={0.75} />
      <path d={barbs(1)} fill="none" className="stroke-ink-faint" strokeWidth={0.45} opacity={0.75} />
      {/* Muesca en el borde, como en las plumas reales */}
      <path d="M46.5 76l-7 2.5" className="stroke-paper-deep" strokeWidth={2.2} />
      <path d={LEFT_VANE} fill="none" className="stroke-ink" strokeWidth={0.8} opacity={0.75} />
      <path d={RIGHT_VANE} fill="none" className="stroke-ink" strokeWidth={0.8} opacity={0.75} />
      {/* Plumón de la base */}
      <path d="M30 150c-5 2-9 0-11-3M31 151c-3 4-7 5-10 4M32 151c3 3 7 4 10 2M32 150c4 0 7-2 8-5" fill="none" className="stroke-ink-faint" strokeWidth={0.5} />
      {/* Raquis */}
      <path d="M31 166C31 140 30.6 70 32 6" fill="none" className="stroke-ink" strokeWidth={1.1} strokeLinecap="round" />
    </svg>
  )
})

