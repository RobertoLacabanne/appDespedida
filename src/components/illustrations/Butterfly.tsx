import { memo } from 'react'

/** Mariposa — la transformación. Vista desde arriba; las alas aletean con CSS. */
interface Props {
  flapping?: boolean
  className?: string
}

const FORE = 'M50 37C44 22 30 8 16 9C6 10 4 22 12 31C20 40 36 43 49 42Z'
const HIND = 'M49 45C36 44 22 50 22 61C22 72 34 72 41 63C45 58 48 52 50 47Z'
const VEINS = 'M48 39C38 30 26 20 15 14M48 40C36 36 22 32 11 27M48 41C38 40 28 39 18 37M49 46C40 50 32 56 27 64M49 47C44 54 40 60 36 66'

const Wing = ({ mirror }: { mirror?: boolean }) => (
  <g transform={mirror ? 'translate(100 0) scale(-1 1)' : undefined}>
    <path d={FORE} className="fill-rose" transform="translate(1.4 1.4)" />
    <path d="M22 14C30 14 40 24 46 36C36 36 24 32 17 26C12 21 15 14 22 14Z" className="fill-rose-soft" opacity={0.9} />
    <path d={HIND} className="fill-gold-soft" transform="translate(1.4 1.4)" />
    <path d={FORE} fill="none" className="stroke-ink" strokeWidth={0.9} />
    <path d={HIND} fill="none" className="stroke-ink" strokeWidth={0.9} />
    <path d={VEINS} fill="none" className="stroke-ink" strokeWidth={0.45} opacity={0.55} />
    <circle cx={16} cy={18} r={2.2} className="fill-paper-light stroke-ink" strokeWidth={0.5} />
    <circle cx={29} cy={62} r={1.8} className="fill-rose-deep" opacity={0.8} />
  </g>
)

export const Butterfly = memo(function Butterfly({ flapping = true, className }: Props) {
  const flap = flapping ? 'motion-loop animate-[flap_0.42s_ease-in-out_infinite]' : ''
  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden="true" focusable="false" overflow="visible">
      <g className={flap} style={{ transformOrigin: '50px 40px', transformBox: 'view-box' }}>
        <Wing />
      </g>
      <g className={flap} style={{ transformOrigin: '50px 40px', transformBox: 'view-box', animationDelay: '0.02s' }}>
        <Wing mirror />
      </g>
      <ellipse cx={50} cy={44} rx={2.4} ry={12} className="fill-ink" />
      <circle cx={50} cy={31} r={2.6} className="fill-ink" />
      <path d="M49 29C47 22 44 17 40 14M51 29C53 22 56 17 60 14" fill="none" className="stroke-ink" strokeWidth={0.8} strokeLinecap="round" />
      <circle cx={40} cy={14} r={1.1} className="fill-ink" />
      <circle cx={60} cy={14} r={1.1} className="fill-ink" />
    </svg>
  )
})
