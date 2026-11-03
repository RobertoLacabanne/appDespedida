import { memo } from 'react'

/** Rosa rosada — el cariño sincero. */
interface Props {
  open?: number
  stem?: number
  className?: string
}

// Capas de atrás hacia adelante: pétalo trasero, capullo central, pétalos que lo envuelven y pétalo frontal con el borde enrollado
const BACK = 'M27 44C24 30 34 17 50 17C66 17 76 30 73 44C66 37 58 35 50 35C42 35 34 37 27 44Z'
const BUD = 'M38 44C36 32 44 25 51 25C59 25 65 32 62 44C57 48 43 48 38 44Z'
const BUD_SPIRAL = 'M44 39C43 33 50 29 55 32C59 35 57 40 52 40C49 40 48 37 51 35.5'
const WRAP_L = 'M50 66C37 67 25 58 23 45C22 39 25 34 30 33C31 44 37 53 49 56Z'
const WRAP_R = 'M50 66C63 67 75 58 77 45C78 39 75 34 70 33C69 44 63 53 51 56Z'
const CURL_L = 'M30 33C26 31 21 34 22 40C23 37 26 35 30 36Z'
const CURL_R = 'M70 33C74 31 79 34 78 40C77 37 74 35 70 36Z'
const FRONT = 'M28 51C29 66 38 77 50 77C62 77 71 66 72 51C66 57 58 60 50 60C42 60 34 57 28 51Z'
const LIP = 'M28 51C34 57 42 60 50 60C58 60 66 57 72 51C66 55 58 57 50 57C42 57 34 55 28 51Z'
const SEPALS = 'M36 72C31 80 25 83 19 83C27 79 33 75 38 70ZM64 72C69 80 75 83 81 83C73 79 67 75 62 70ZM50 76C49 81 50 86 51 89C52 85 53 81 52 76Z'

export const Rose = memo(function Rose({ open = 1, stem = 0, className }: Props) {
  const h = 100 + stem
  const spread = 0.9 + 0.1 * open
  return (
    <svg viewBox={`0 0 100 ${h}`} className={className} aria-hidden="true" focusable="false" overflow="visible">
      {stem > 0 && (
        <g>
          <path d={`M50 80C53 ${80 + stem * 0.35} 47 ${80 + stem * 0.7} 50 ${h}`} fill="none" className="stroke-sage-deep" strokeWidth={2.6} strokeLinecap="round" />
          <path d={`M50 80C53 ${80 + stem * 0.35} 47 ${80 + stem * 0.7} 50 ${h}`} fill="none" className="stroke-ink" strokeWidth={0.7} opacity={0.55} transform="translate(1.4 0)" />
          {/* Espinas */}
          <path d={`M51 ${88 + stem * 0.2}l4-3M49 ${88 + stem * 0.5}l-4-2.5`} className="stroke-ink" strokeWidth={0.8} strokeLinecap="round" opacity={0.7} />
          <g transform={`translate(50 ${82 + stem * 0.42}) rotate(-34)`}>
            <path d="M0 0C6-8 20-9 26-2C18 4 8 5 0 0Z" className="fill-sage" transform="translate(1 1)" />
            <path d="M0 0C6-8 20-9 26-2C18 4 8 5 0 0Z" fill="none" className="stroke-ink" strokeWidth={0.8} />
            <path d="M2 0C10-2.5 18-3 25-2" fill="none" className="stroke-ink" strokeWidth={0.45} opacity={0.6} />
          </g>
          {stem > 40 && (
            <g transform={`translate(50 ${82 + stem * 0.72}) rotate(200)`}>
              <path d="M0 0C6-7 18-8 23-2C16 4 7 5 0 0Z" className="fill-sage-soft" transform="translate(1 1)" />
              <path d="M0 0C6-7 18-8 23-2C16 4 7 5 0 0Z" fill="none" className="stroke-ink" strokeWidth={0.8} />
            </g>
          )}
        </g>
      )}
      <path d={SEPALS} className="fill-sage-deep" />
      <path d={SEPALS} fill="none" className="stroke-ink" strokeWidth={0.6} opacity={0.6} />
      <g style={{ transformOrigin: '50px 60px', transform: `scale(${spread})`, transition: 'transform 900ms var(--ease-soft)' }}>
        <path d={BACK} className="fill-rose-soft" transform="translate(1.5 1.5)" />
        <path d={BACK} fill="none" className="stroke-ink" strokeWidth={0.9} />
        <path d={BUD} className="fill-rose" transform="translate(1.3 1.3)" />
        <path d={BUD} fill="none" className="stroke-ink" strokeWidth={0.85} />
        <path d={BUD_SPIRAL} fill="none" className="stroke-rose-deep" strokeWidth={1} strokeLinecap="round" />
        <path d={WRAP_L} className="fill-rose" transform="translate(1.4 1.4)" />
        <path d={WRAP_L} fill="none" className="stroke-ink" strokeWidth={0.9} />
        <path d={WRAP_R} className="fill-rose" transform="translate(1.4 1.4)" />
        <path d={WRAP_R} fill="none" className="stroke-ink" strokeWidth={0.9} />
        <path d={CURL_L} className="fill-rose-mist stroke-ink" strokeWidth={0.7} />
        <path d={CURL_R} className="fill-rose-mist stroke-ink" strokeWidth={0.7} />
        <path d={FRONT} className="fill-rose-soft" transform="translate(1.5 1.5)" />
        <path d={FRONT} fill="none" className="stroke-ink" strokeWidth={1} />
        <path d={LIP} className="fill-rose-mist" />
        <path d="M38 66C43 70 57 70 62 66" fill="none" className="stroke-rose" strokeWidth={0.9} opacity={0.8} />
        <path d="M33 55C35 64 41 71 47 73" fill="none" className="stroke-rose" strokeWidth={2.4} opacity={0.35} strokeLinecap="round" />
      </g>
    </svg>
  )
})
