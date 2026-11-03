import { memo } from 'react'

export type SkyVariant = 'dusk' | 'paper' | 'garden' | 'dawn' | 'golden'

interface SkyProps {
  variant: SkyVariant
  /** Muestra el sol sobre el horizonte */
  sun?: boolean
  /** Muestra las colinas */
  hills?: boolean
  /** Altura del horizonte, en % desde arriba */
  horizon?: number
  className?: string
}

/**
 * Cielos de atardecer, siempre luminosos: el cierre de un ciclo
 * como la belleza de lo vivido, nunca como oscuridad.
 */
const GRADIENTS: Record<SkyVariant, string> = {
  dusk: 'linear-gradient(180deg, var(--color-paper-light) 0%, var(--color-paper) 26%, #f6dcbd 52%, var(--color-peach) 70%, var(--color-apricot) 86%)',
  paper: 'linear-gradient(180deg, var(--color-paper-light) 0%, var(--color-paper) 55%, var(--color-paper-deep) 100%)',
  garden: 'linear-gradient(180deg, var(--color-paper-light) 0%, #faebd9 40%, #f7dcc3 70%, var(--color-peach) 100%)',
  dawn: 'linear-gradient(180deg, var(--color-rose-mist) 0%, var(--color-paper-light) 38%, var(--color-paper) 62%, var(--color-gold-light) 100%)',
  golden: 'linear-gradient(180deg, var(--color-paper-light) 0%, #f9e6c8 24%, #f5cf9f 50%, var(--color-apricot) 72%, var(--color-coral) 90%)',
}

export const Sky = memo(function Sky({ variant, sun = false, hills = false, horizon = 72, className = '' }: SkyProps) {
  const golden = variant === 'golden'
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0" style={{ background: GRADIENTS[variant] }} />

      {/* Velos de nubes, muy lentos */}
      {(variant === 'dusk' || golden || variant === 'dawn') && (
        <>
          <div
            className="motion-loop absolute left-[-20%] h-[9%] w-[90%] animate-drift rounded-[50%] opacity-60"
            style={{
              top: `${horizon - 34}%`,
              background: 'radial-gradient(closest-side, var(--color-rose-soft), transparent)',
            }}
          />
          <div
            className="motion-loop absolute right-[-25%] h-[6%] w-[80%] animate-drift rounded-[50%] opacity-50"
            style={{
              top: `${horizon - 22}%`,
              animationDirection: 'reverse',
              animationDuration: '80s',
              background: 'radial-gradient(closest-side, var(--color-paper-light), transparent)',
            }}
          />
        </>
      )}

      {sun && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `${horizon}%` }}>
          <div className="motion-loop animate-[sun-sink_40s_var(--ease-breath)_forwards]">
            {/* Resplandor */}
            <div
              className="motion-loop absolute left-1/2 top-0 aspect-square -translate-x-1/2 -translate-y-1/2 animate-breathe rounded-full"
              style={{
                width: golden ? 'min(150vw, 1100px)' : 'min(120vw, 900px)',
                background: `radial-gradient(closest-side, ${golden ? 'rgb(255 236 190 / 0.95)' : 'rgb(255 238 205 / 0.85)'}, rgb(248 205 150 / 0.35) 45%, transparent 72%)`,
              }}
            />
            {/* Disco */}
            <div
              className="absolute left-1/2 top-0 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: golden ? 'min(46vw, 300px)' : 'min(38vw, 250px)',
                background: 'radial-gradient(circle at 50% 42%, #fffaf0 0%, var(--color-gold-light) 46%, var(--color-amber) 100%)',
                boxShadow: '0 0 60px 10px rgb(255 226 170 / 0.55)',
              }}
            />
          </div>
        </div>
      )}

      {hills && (
        <svg
          className="absolute inset-x-0 bottom-0 w-full"
          style={{ height: `${100 - horizon + 6}%` }}
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
        >
          <path d="M0 20C60 6 120 10 190 18S330 8 400 14V100H0Z" className="fill-sage-soft" opacity={0.75} />
          <path d="M0 34C80 22 150 30 230 26S350 20 400 30V100H0Z" className="fill-sage" opacity={0.55} />
          <path
            d="M0 34C80 22 150 30 230 26S350 20 400 30"
            fill="none"
            className="stroke-ink"
            strokeWidth={0.5}
            opacity={0.35}
            vectorEffect="non-scaling-stroke"
          />
          <path d="M0 52C90 42 170 50 260 46S370 44 400 50V100H0Z" className="fill-sage-deep" opacity={0.42} />
          <path
            d="M0 52C90 42 170 50 260 46S370 44 400 50"
            fill="none"
            className="stroke-ink"
            strokeWidth={0.6}
            opacity={0.4}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </div>
  )
})
