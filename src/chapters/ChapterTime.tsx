import { AnimatePresence, m } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { experience } from '../config/experience'
import { PrimaryButton } from '../components/Buttons'
import { ArrowRight } from '../components/Icons'
import { Sky } from '../components/Sky'
import { SoundToggle } from '../components/SoundToggle'
import { listJoin, readingTime } from '../lib/text'

interface Props {
  /** Ya se vio la intro: se muestra directamente la portada */
  introSeen: boolean
  onIntroDone: () => void
  onNext: () => void
}

const ease = [0.22, 0.8, 0.26, 1] as const

function Words({ text, delay = 0, stagger = 0.07 }: { text: string; delay?: number; stagger?: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <m.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: delay + i * stagger, ease }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </m.span>
      ))}
    </>
  )
}

export function ChapterTime({ introSeen, onIntroDone, onNext }: Props) {
  const { phrases, cta } = experience.chapters.time
  const [step, setStep] = useState(introSeen ? phrases.length : -1)
  const [hint, setHint] = useState(false)
  const timer = useRef<number | null>(null)
  const done = step >= phrases.length

  const advance = useCallback(() => {
    setStep((s) => Math.min(phrases.length, s + 1))
  }, [phrases.length])

  // Arranca cuando las tipografías están listas (máximo 1,2 s de espera)
  useEffect(() => {
    if (introSeen) return
    let cancelled = false
    const start = () => !cancelled && setStep(0)
    const fallback = window.setTimeout(start, 1200)
    document.fonts?.ready.then(() => window.setTimeout(start, 500))
    return () => {
      cancelled = true
      window.clearTimeout(fallback)
    }
  }, [introSeen])

  // Avance automático según el largo de cada frase
  useEffect(() => {
    if (step < 0 || done) return
    timer.current = window.setTimeout(advance, readingTime(phrases[step]) + 900)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [step, done, advance, phrases])

  useEffect(() => {
    if (done) onIntroDone()
  }, [done, onIntroDone])

  useEffect(() => {
    if (done) return
    const t = window.setTimeout(() => setHint(true), 3200)
    return () => window.clearTimeout(t)
  }, [done])

  return (
    <section className="relative flex h-screen-safe flex-col overflow-hidden" aria-labelledby="titulo-obra">
      <Sky variant="dusk" sun hills horizon={done ? 74 : 70} />

      <div className="absolute right-0 top-0 z-30 px-safe pt-safe">
        <SoundToggle />
      </div>

      {/* Toda la pantalla avanza la intro */}
      {!done && step >= 0 && (
        <button
          type="button"
          onClick={advance}
          className="absolute inset-0 z-10 cursor-default"
          aria-label={experience.ui.skipIntro}
        />
      )}

      <p className="sr-only" aria-live="polite">
        {!done && step >= 0 ? phrases[step] : ''}
      </p>

      <div className="pointer-events-none relative z-20 flex flex-1 flex-col items-center px-safe">
        <AnimatePresence mode="wait">
          {!done && step >= 0 && (
            <m.p
              key={step}
              className="font-display mx-auto mt-[24svh] max-w-[17em] text-center text-phrase text-balance text-ink"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.7, ease } }}
              aria-hidden="true"
            >
              <Words text={phrases[step]} />
            </m.p>
          )}

          {done && (
            <m.div
              key="title"
              className="flex w-full max-w-xl flex-1 flex-col items-center pt-[12svh] text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.2 }}
              >
                <p className="label-caps text-ink-soft">Para</p>
                <p className="font-display mx-auto mt-1.5 max-w-[20em] text-[clamp(1.02rem,0.92rem+0.5vw,1.2rem)] italic leading-snug text-balance text-ink-soft">
                  {listJoin(experience.recipients)}
                </p>
              </m.div>
              <h1 id="titulo-obra" className="font-display mt-5 text-display font-[380] text-ink">
                <Words text={experience.meta.title} delay={0.5} stagger={0.14} />
              </h1>
              <m.svg
                viewBox="0 0 120 12"
                className="mt-4 w-28"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <m.path
                  d="M4 7C24 2 40 10 60 6S98 3 116 7"
                  fill="none"
                  className="stroke-gold-deep"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.1, duration: 1.6, ease }}
                />
              </m.svg>
              <m.p
                className="font-display mt-5 max-w-[24em] text-lead italic text-balance text-ink-soft"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.5, ease }}
              >
                {experience.meta.subtitle}
              </m.p>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-20 flex min-h-28 flex-col items-center justify-end px-safe pb-safe">
        <AnimatePresence>
          {done ? (
            <m.div
              key="cta"
              className="mb-[6svh]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: introSeen ? 0.4 : 2.3, ease }}
            >
              <PrimaryButton onClick={onNext} icon={<ArrowRight size={17} />}>
                {cta}
              </PrimaryButton>
            </m.div>
          ) : (
            hint && (
              <m.p
                key="hint"
                className="label-caps mb-[5svh] text-ink/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                aria-hidden="true"
              >
                {experience.ui.skipIntro}
              </m.p>
            )
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
