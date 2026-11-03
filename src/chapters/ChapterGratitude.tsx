import { AnimatePresence, m } from 'motion/react'
import { useMemo, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react'
import { experience, type FlowerKind } from '../config/experience'
import { ChapterHeader, ChapterNav } from '../components/ChapterChrome'
import { Sky } from '../components/Sky'
import { OliveBranch } from '../components/illustrations/OliveBranch'
import { Rose } from '../components/illustrations/Rose'
import { Sunflower } from '../components/illustrations/Sunflower'

interface Props {
  order: number[]
  setOrder: Dispatch<SetStateAction<number[]>>
  onBack: () => void
  onNext: () => void
}

interface FlowerSpec {
  kind: FlowerKind
  /** Centro horizontal, % del jardín */
  x: number
  /** Base, % desde abajo */
  bottom: number
  /** Ancho, % del jardín */
  w: number
  stem: number
  front: boolean
}

const FLOWERS: FlowerSpec[] = [
  { kind: 'girasol', x: 19, bottom: 15, w: 31, stem: 105, front: false },
  { kind: 'girasol', x: 52, bottom: 18, w: 33, stem: 140, front: false },
  { kind: 'girasol', x: 84, bottom: 14, w: 30, stem: 88, front: false },
  { kind: 'olivo', x: 7, bottom: 1, w: 20, stem: 0, front: true },
  { kind: 'rosa', x: 34, bottom: 3, w: 25, stem: 55, front: true },
  { kind: 'rosa', x: 69, bottom: 2, w: 25, stem: 70, front: true },
  { kind: 'olivo', x: 94, bottom: 1, w: 19, stem: 0, front: true },
]

const ratio = (f: FlowerSpec) => (f.kind === 'olivo' ? 160 / 90 : (100 + f.stem) / 100)
const ease = [0.22, 0.8, 0.26, 1] as const

const POLLEN = Array.from({ length: 9 }, (_, i) => {
  const a = -Math.PI / 2 + (i - 4) * 0.32
  return { dx: Math.cos(a) * (34 + (i % 3) * 14), dy: Math.sin(a) * (46 + (i % 2) * 22), delay: (i % 4) * 60 }
})

function FlowerArt({ f, open }: { f: FlowerSpec; open: number }) {
  if (f.kind === 'girasol') return <Sunflower open={open} stem={f.stem} className="block w-full" />
  if (f.kind === 'rosa') return <Rose open={open} stem={f.stem} className="block w-full" />
  return <OliveBranch open={open} className="block w-full" />
}

export function ChapterGratitude({ order, setOrder, onBack, onNext }: Props) {
  const { title, intro, hint, messages, finalMessage, finalLabel, flowerNames } = experience.chapters.gratitude
  const all = useMemo(() => [...messages, finalMessage], [messages, finalMessage])
  const flowers = FLOWERS.slice(0, Math.min(FLOWERS.length, all.length))
  const [active, setActive] = useState<number | null>(order.length ? order[order.length - 1] : null)
  const [burst, setBurst] = useState(0)

  const complete = order.length >= flowers.length

  const touch = (i: number) => {
    setActive(i)
    setBurst((b) => b + 1)
    if (!order.includes(i)) setOrder((o) => [...o, i])
  }

  // El mensaje sale del orden de descubrimiento: la última flor siempre guarda el mensaje final
  const indexOf = (i: number) => {
    const k = order.indexOf(i)
    return k === -1 ? order.length : k
  }
  const activeIndex = active === null ? -1 : indexOf(active)
  const isFinal = activeIndex === flowers.length - 1
  const activeMessage = activeIndex >= 0 ? (isFinal ? finalMessage : all[activeIndex]) : null

  return (
    <section className="relative flex h-screen-safe flex-col overflow-hidden">
      <Sky variant="garden" />
      <ChapterHeader index={2} title={title} />

      {/* Mensajes */}
      <div className="relative z-30 flex min-h-[clamp(13rem,30svh,17rem)] items-center justify-center px-safe pt-2" aria-live="polite">
        <AnimatePresence mode="wait">
          {activeMessage === null || active === null ? (
            <m.div
              key="intro"
              className="text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.35 } }}
              transition={{ duration: 1.1, delay: 0.4, ease }}
            >
              <p className="font-display text-[clamp(3rem,2rem+6vw,4.6rem)] italic leading-none text-ink" aria-hidden="true">
                {title}
              </p>
              <p className="font-display mx-auto mt-4 max-w-[19em] text-lead text-balance text-ink-soft">{intro}</p>
              <p className="label-caps mt-5 text-ink-soft">{hint}</p>
            </m.div>
          ) : (
            <m.article
              key={`card-${active}`}
              className={`relative w-full max-w-[25rem] rounded-card bg-paper-light px-6 pb-5 pt-4 ${
                isFinal ? 'shadow-lift' : 'shadow-paper'
              }`}
              initial={{ opacity: 0, y: 12, rotate: -1.2 }}
              animate={{ opacity: 1, y: 0, rotate: -0.4 }}
              exit={{ opacity: 0, y: -8, rotate: 0.4, transition: { duration: 0.3 } }}
              transition={{ duration: 0.75, ease }}
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-[5px] rounded-[0.55rem] border ${isFinal ? 'border-gold' : 'border-rule'}`}
              />
              {isFinal && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-[9px] rounded-[0.4rem] border border-gold-soft" />
              )}
              <header className="relative flex items-center justify-between gap-3">
                <p className="label-caps text-ink-soft">
                  N.º {String(activeIndex + 1).padStart(2, '0')}
                  <span className="mx-1.5 text-sand">·</span>
                  {isFinal ? finalLabel : flowerNames[flowers[active].kind].name}
                </p>
                <ol className="flex gap-1" aria-label={`${order.length} de ${flowers.length} mensajes descubiertos`}>
                  {flowers.map((_, k) => (
                    <li
                      key={k}
                      className={`size-1.5 rounded-full ${k < order.length ? (k === flowers.length - 1 ? 'bg-gold' : 'bg-ink-soft') : 'bg-sand'}`}
                    />
                  ))}
                </ol>
              </header>
              <p
                className={`font-display relative mt-3 leading-[1.3] text-balance text-ink ${
                  isFinal ? 'text-[clamp(1.3rem,1.05rem+1.2vw,1.65rem)] italic' : 'text-[clamp(1.2rem,1rem+1vw,1.5rem)]'
                }`}
              >
                {activeMessage}
              </p>
              <svg viewBox="0 0 200 10" className="relative mt-3 h-2.5 w-36" aria-hidden="true">
                <m.path
                  d="M2 6C30 2 60 9 100 5S170 2 198 6"
                  fill="none"
                  className={isFinal ? 'stroke-gold' : 'stroke-rose'}
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.35, ease }}
                />
              </svg>
              {!isFinal && (
                <p className="font-display relative mt-1.5 text-ui italic text-ink-soft">
                  {flowerNames[flowers[active].kind].name}: {flowerNames[flowers[active].kind].meaning}
                </p>
              )}
            </m.article>
          )}
        </AnimatePresence>
      </div>

      {/* Jardín */}
      <div className="relative z-10 mx-auto w-full max-w-[680px] min-h-0 flex-1 [container-type:size]">
        {complete && (
          <div
            aria-hidden="true"
            className="motion-loop pointer-events-none absolute inset-x-[-10%] bottom-0 top-[-10%] animate-[glow-pulse_6s_ease-in-out_infinite]"
            style={{ background: 'radial-gradient(60% 55% at 50% 60%, rgb(255 236 190 / 0.75), transparent 70%)' }}
          />
        )}

        {/* Loma de atrás */}
        <svg className="absolute bottom-0 left-1/2 h-[24%] w-[max(100vw,100%)] -translate-x-1/2" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30C70 12 140 20 210 24S340 14 400 22V100H0Z" className="fill-sage-mist" />
          <path d="M0 30C70 12 140 20 210 24S340 14 400 22" fill="none" className="stroke-ink" strokeWidth={0.6} opacity={0.4} vectorEffect="non-scaling-stroke" />
        </svg>

        {flowers.map((f, i) => {
          const discovered = order.includes(i)
          const isActive = active === i
          const r = ratio(f)
          const style: CSSProperties = {
            left: `${f.x}%`,
            bottom: `${f.bottom}%`,
            width: `min(${f.w}cqw, ${((90 - f.bottom) / r).toFixed(2)}cqh)`,
            zIndex: f.front ? 30 : 10,
          }
          const kindName = flowerNames[f.kind].name
          return (
            <m.div
              key={i}
              className="absolute -translate-x-1/2"
              style={style}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.25 + i * 0.12, ease }}
            >
              <div
                className="motion-loop origin-bottom animate-sway"
                style={{ animationDuration: `${5.2 + (i % 3) * 1.1}s`, animationDelay: `${-i * 0.9}s` }}
              >
                <FlowerArt f={f} open={discovered ? 1 : 0.5} />
                <button
                  type="button"
                  onClick={() => touch(i)}
                  aria-label={discovered ? `${kindName}: volver a leer` : `${kindName}: descubrir un mensaje`}
                  aria-pressed={isActive}
                  className={`absolute left-1/2 top-0 w-[120%] -translate-x-1/2 rounded-full ${f.kind === 'olivo' ? 'h-full' : 'aspect-square'}`}
                >
                  {isActive && (
                    <span key={burst} aria-hidden="true" className="pointer-events-none absolute inset-0">
                      <span className="absolute inset-[12%] animate-[halo_1.3s_var(--ease-soft)_both] rounded-full border-2 border-gold-soft" />
                      {POLLEN.map((p, k) => (
                        <span
                          key={k}
                          className="absolute left-1/2 top-[45%] size-1.5 rounded-full bg-gold animate-[rise_1.6s_var(--ease-soft)_both]"
                          style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animationDelay: `${p.delay}ms` } as CSSProperties}
                        />
                      ))}
                    </span>
                  )}
                </button>
                {discovered && !isActive && (
                  <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-6px] size-1.5 -translate-x-1/2 rounded-full bg-gold" />
                )}
              </div>
            </m.div>
          )
        })}

        {/* Loma de adelante */}
        <svg className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[11%] w-[max(100vw,100%)] -translate-x-1/2" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40C90 20 180 34 260 28S360 26 400 34V100H0Z" className="fill-sage-soft" />
          <path d="M0 40C90 20 180 34 260 28S360 26 400 34" fill="none" className="stroke-ink" strokeWidth={0.7} opacity={0.45} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <ChapterNav onBack={onBack} onNext={onNext} ready={complete} className="bg-sage-soft">
        <span className="font-sans text-ui tabular-nums text-ink-soft" aria-hidden="true">
          {order.length}
          <span className="mx-1 text-ink-faint">/</span>
          {flowers.length}
        </span>
      </ChapterNav>
    </section>
  )
}
