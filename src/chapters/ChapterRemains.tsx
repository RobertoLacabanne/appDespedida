import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { experience } from '../config/experience'
import { QuietButton } from '../components/Buttons'
import { ChapterHeader } from '../components/ChapterChrome'
import { ArrowLeft, Restart } from '../components/Icons'
import { ShareBlock } from '../components/ShareBlock'
import { SparkCanvas, type SparkApi } from '../components/SparkCanvas'
import { Butterfly } from '../components/illustrations/Butterfly'
import { Feather } from '../components/illustrations/Feather'
import { Lotus } from '../components/illustrations/Lotus'
import { OliveBranch } from '../components/illustrations/OliveBranch'
import { OpenCircle } from '../components/illustrations/OpenCircle'
import { Rose } from '../components/illustrations/Rose'
import { Sunflower } from '../components/illustrations/Sunflower'
import { Tree } from '../components/illustrations/Tree'
import { listJoin } from '../lib/text'

interface Props {
  onBack: () => void
  onRestart: () => void
}

const ease = [0.22, 0.8, 0.26, 1] as const
const ALL = Array(8).fill(true)

// Abertura del círculo: arriba a la derecha
const GAP_AT = 40
const GAP = 38
const DRAW_MS = 4600

/** Momento en que el trazo del círculo pasa por un ángulo (horario, 0 = arriba) */
const when = (deg: number) => {
  const start = GAP_AT + GAP / 2
  const frac = (((deg - start) % 360) + 360) % 360 / (360 - GAP)
  return 0.5 + Math.min(1, frac) * (DRAW_MS / 1000)
}

function Piece({ deg, style, children, reduced }: { deg: number; style: CSSProperties; children: ReactNode; reduced: boolean }) {
  return (
    <m.div
      className="pointer-events-none absolute"
      style={style}
      initial={{ opacity: 0, scale: reduced ? 1 : 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: when(deg), ease }}
    >
      {children}
    </m.div>
  )
}

function Seedling({ x, y, r, delay }: { x: string; y: string; r: number; delay: number }) {
  return (
    <m.svg
      viewBox="0 0 20 24"
      className="motion-loop pointer-events-none absolute w-[3.4%] animate-[bob_4s_var(--ease-breath)_infinite]"
      style={{ left: x, top: y, rotate: `${r}deg`, animationDelay: `${delay}s` }}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.85 }}
      transition={{ delay: when(30) + delay, duration: 1.5 }}
    >
      <g className="stroke-ink" strokeWidth={0.6} fill="none" strokeLinecap="round">
        {[-5, -3, -1, 1, 3, 5].map((i) => (
          <path key={i} d={`M10 8L${10 + Math.cos(-Math.PI / 2 + i * 0.25) * 8} ${8 + Math.sin(-Math.PI / 2 + i * 0.25) * 8}`} />
        ))}
        <path d="M10 8V19" />
      </g>
      <path d="M10 19V23" className="stroke-umber-soft" strokeWidth={1.6} strokeLinecap="round" />
    </m.svg>
  )
}

export function ChapterRemains({ onBack, onRestart }: Props) {
  const { title, letterHeading, letter, closingPhrase, circleHint, circleMessage } = experience.chapters.remains
  const reduced = useReducedMotion() ?? false
  const [drawn, setDrawn] = useState(false)
  const [tapped, setTapped] = useState(false)
  const sparks = useRef<SparkApi>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const ringRef = useRef<HTMLButtonElement>(null)
  const sealRef = useRef<HTMLDivElement>(null)
  const sealInView = useInView(sealRef, { once: true, amount: 0.6 })

  useEffect(() => {
    const t = window.setTimeout(() => setDrawn(true), 450)
    return () => window.clearTimeout(t)
  }, [])

  const touchRing = () => {
    setTapped(true)
    if (reduced) return
    const ring = ringRef.current?.getBoundingClientRect()
    const host = sectionRef.current?.getBoundingClientRect()
    if (!ring || !host) return
    sparks.current?.burst(
      ring.left - host.left + ring.width / 2,
      ring.top - host.top + ring.height / 2,
      ring.width * 0.46,
      GAP_AT,
      GAP,
    )
  }

  const phraseLines = closingPhrase.split(/(?<=\.)\s+/)

  return (
    <section ref={sectionRef} className="relative h-screen-safe">
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain">
        {/* ───────── Escena: el atardecer vuelve, más cálido ───────── */}
        <div className="relative flex min-h-screen-safe flex-col">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, var(--color-paper-light) 0%, #faebd3 30%, #f6d8b0 62%, #f3caa0 82%, var(--color-paper) 100%)',
            }}
          />
          <ChapterHeader index={4} title={title} />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-safe pb-[4svh]">
            {/* Medallón */}
            <div className="relative aspect-square w-[min(90vw,58svh,540px)]">
              {/* Paisaje dentro del círculo */}
              <m.div
                className="absolute inset-[9%] overflow-hidden rounded-full"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, delay: 0.2, ease }}
                aria-hidden="true"
                style={{
                  background:
                    'linear-gradient(180deg, #fbf1df 0%, #f8dcb2 42%, var(--color-peach) 66%, var(--color-apricot) 84%)',
                }}
              >
                <div
                  className="motion-loop absolute left-1/2 top-[64%] aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 animate-breathe rounded-full"
                  style={{ background: 'radial-gradient(closest-side, rgb(255 240 205 / 0.95), rgb(250 210 150 / 0.4) 50%, transparent 72%)' }}
                />
                <div
                  className="absolute left-1/2 top-[64%] aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 50% 42%, #fffaf0 0%, var(--color-gold-light) 50%, var(--color-amber) 100%)',
                    boxShadow: '0 0 40px 8px rgb(255 226 170 / 0.6)',
                  }}
                />
                <svg className="absolute inset-x-0 bottom-0 h-[34%] w-full" viewBox="0 0 100 34" preserveAspectRatio="none">
                  <path d="M0 10C20 4 40 6 56 9S84 6 100 8V34H0Z" className="fill-sage-soft" />
                  <path d="M0 18C24 12 44 16 64 15S88 12 100 16V34H0Z" className="fill-sage" opacity={0.75} />
                  <path d="M0 18C24 12 44 16 64 15S88 12 100 16" fill="none" className="stroke-ink" strokeWidth={0.3} opacity={0.45} />
                </svg>
                <m.div
                  className="absolute bottom-[14%] left-1/2 w-[58%] -translate-x-1/2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 1, ease }}
                >
                  <Tree revealed={ALL} complete variant="mini" className="w-full" />
                </m.div>
              </m.div>

              {/* El círculo de luz, que queda abierto */}
              <OpenCircle drawn={drawn} gap={GAP} gapAt={GAP_AT} duration={reduced ? 1 : DRAW_MS} strokeWidth={1.5} className="absolute inset-0 h-full w-full" />

              {/* Los símbolos del recorrido, alrededor */}
              <Piece deg={250} reduced={reduced} style={{ left: '-3%', top: '30%', width: '17%', rotate: '-14deg' }}>
                <OliveBranch className="w-full" />
              </Piece>
              <Piece deg={222} reduced={reduced} style={{ left: '2%', top: '64%', width: '22%' }}>
                <Sunflower className="w-full" />
              </Piece>
              <Piece deg={200} reduced={reduced} style={{ left: '21%', top: '80%', width: '15%', rotate: '-8deg' }}>
                <Rose className="w-full" />
              </Piece>
              <Piece deg={160} reduced={reduced} style={{ left: '58%', top: '84%', width: '22%' }}>
                <Lotus className="w-full" />
              </Piece>
              <Piece deg={118} reduced={reduced} style={{ left: '88%', top: '46%', width: '7.5%', rotate: '24deg' }}>
                <Feather className="w-full" />
              </Piece>
              <Piece deg={20} reduced={reduced} style={{ left: '74%', top: '-3%', width: '15%', rotate: '18deg' }}>
                <div className="motion-loop animate-[bob_3.6s_var(--ease-breath)_infinite]">
                  <Butterfly flapping={!reduced} className="w-full" />
                </div>
              </Piece>
              <Seedling x="66%" y="1%" r={-12} delay={0.3} />
              <Seedling x="92%" y="14%" r={14} delay={0.9} />
              <Seedling x="84%" y="-6%" r={4} delay={1.5} />
            </div>

            <m.h3
              className="font-display mt-[3.5svh] text-center text-[clamp(2.2rem,1.4rem+4vw,3.6rem)] leading-none text-ink"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 1.6, ease }}
            >
              {title}
            </m.h3>
            {experience.yearsShared !== null && (
              <m.p
                className="label-caps mt-3 text-ink-soft"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 2.4 }}
              >
                {experience.yearsShared} años compartidos
              </m.p>
            )}
            <m.a
              href="#carta"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('carta')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
              }}
              className="mt-[3.5svh] flex min-h-11 flex-col items-center gap-1 rounded-full px-4 text-ink-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 3.4 }}
            >
              <span className="label-caps">{letterHeading}</span>
              <svg width="16" height="22" viewBox="0 0 16 22" className="motion-loop animate-[bob_2.4s_var(--ease-breath)_infinite]" aria-hidden="true">
                <path d="M8 2V19M2.5 13.5 8 19l5.5-5.5" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </m.a>
          </div>
        </div>

        {/* ───────── La carta ───────── */}
        <div className="relative bg-paper px-safe pb-[10svh] pt-[2svh]">
          <article
            id="carta"
            className="relative mx-auto w-full max-w-[36rem] scroll-mt-6 rounded-card bg-paper-light px-[clamp(1.5rem,7vw,3.75rem)] py-[clamp(2.2rem,8vw,3.75rem)] shadow-paper"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-[6px] rounded-[0.55rem] border border-rule" />
            <p className="label-caps relative text-ink-soft">{letterHeading}</p>
            <p className="font-display relative mt-2 text-[clamp(1.2rem,1.05rem+0.8vw,1.45rem)] italic leading-snug text-balance text-ink">
              Para {listJoin(experience.recipients)}
            </p>
            <svg viewBox="0 0 120 12" className="relative mt-4 w-24" aria-hidden="true">
              <path d="M4 7C24 2 40 10 60 6S98 3 116 7" fill="none" className="stroke-gold" strokeWidth={1.3} strokeLinecap="round" />
            </svg>
            <div className="font-letter relative mt-6 space-y-[1.05em] text-[clamp(1.06rem,1rem+0.3vw,1.16rem)] leading-[1.72] text-pretty text-ink">
              {letter.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-[3.6em] first-letter:leading-[0.8] first-letter:text-gold-deep'
                      : undefined
                  }
                >
                  {p}
                </p>
              ))}
            </div>
            <p className="font-letter relative mt-9 text-[1.08rem] italic text-ink-soft">{experience.sender.closing}</p>
            <p className="font-display relative mt-1 text-[clamp(2rem,1.6rem+2vw,2.6rem)] italic leading-none text-ink">
              {experience.sender.name}.
            </p>
          </article>

          {/* Frase final */}
          <div className="mx-auto mt-[12svh] max-w-[30rem] text-center">
            <svg viewBox="0 0 60 20" className="mx-auto w-14" aria-hidden="true">
              <path d="M6 14C18 4 42 4 54 14" fill="none" className="stroke-gold" strokeWidth={1.2} strokeLinecap="round" />
              <circle cx={30} cy={7.2} r={1.6} className="fill-gold" />
            </svg>
            <p className="font-display mt-5 text-[clamp(1.75rem,1.2rem+2.8vw,2.7rem)] leading-[1.18] text-balance text-ink">
              {phraseLines.map((l, i) => (
                <span key={i} className={`block ${i > 0 ? 'mt-1 italic text-ink-soft' : ''}`}>
                  {l}
                </span>
              ))}
            </p>
          </div>

          {/* El círculo abierto: se toca */}
          <div ref={sealRef} className="relative mx-auto mt-[9svh] grid place-items-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute aspect-square w-[min(120vw,560px)] rounded-full"
              style={{ background: 'radial-gradient(closest-side, rgb(250 225 175 / 0.7), rgb(250 225 175 / 0) 70%)' }}
            />
            <button
              ref={ringRef}
              type="button"
              onClick={touchRing}
              aria-label={tapped ? circleMessage : circleHint}
              className="group relative grid aspect-square w-[min(64vw,250px)] place-items-center rounded-full"
            >
              <OpenCircle
                drawn={sealInView || tapped}
                gap={GAP}
                gapAt={GAP_AT}
                duration={reduced ? 1 : 2600}
                strokeWidth={2}
                className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.02] group-active:scale-[0.98]"
              />
              <AnimatePresence mode="wait">
                {tapped ? (
                  <m.span
                    key="msg"
                    className="font-display relative px-6 text-center text-[clamp(1.5rem,1.2rem+1.6vw,2rem)] italic leading-tight text-ink"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: reduced ? 0 : 0.35, ease }}
                    aria-live="polite"
                  >
                    {circleMessage}
                  </m.span>
                ) : (
                  <m.span
                    key="hint"
                    className="label-caps relative text-ink-soft"
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  >
                    {circleHint}
                  </m.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Compartir */}
          <div className="relative mx-auto mt-[9svh] max-w-md">
            <ShareBlock />
          </div>

          <footer className="mx-auto mt-[6svh] flex max-w-md items-center justify-between gap-3 border-t border-rule pt-4 pb-safe">
            <QuietButton onClick={onBack} iconLeft={<ArrowLeft size={16} />}>
              {experience.ui.back}
            </QuietButton>
            <QuietButton onClick={onRestart} iconLeft={<Restart size={16} />}>
              {experience.ui.restart}
            </QuietButton>
          </footer>
        </div>
      </div>

      <SparkCanvas ref={sparks} className="absolute inset-0 z-40 h-full w-full" />
    </section>
  )
}
