import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { experience } from '../config/experience'
import { OutlineButton } from '../components/Buttons'
import { ChapterHeader, ChapterNav } from '../components/ChapterChrome'
import { DandelionField } from '../components/DandelionField'
import { Wind } from '../components/Icons'
import { Sky } from '../components/Sky'
import { Butterfly } from '../components/illustrations/Butterfly'
import { Feather } from '../components/illustrations/Feather'
import { Lotus } from '../components/illustrations/Lotus'
import { readingTime } from '../lib/text'

interface Props {
  released: boolean
  setReleased: Dispatch<SetStateAction<boolean>>
  onBack: () => void
  onNext: () => void
}

const ease = [0.22, 0.8, 0.26, 1] as const
const ANCHOR = { x: 0.5, y: 0.7 }

export function ChapterLettingGo({ released, setReleased, onBack, onNext }: Props) {
  const { title, prompt, hint, blowButton, texts } = experience.chapters.lettingGo
  const reduced = useReducedMotion() ?? false
  const [blow, setBlow] = useState(0)
  // Si se vuelve a este capítulo, los textos ya están: no hay que esperar
  const [instant] = useState(released)
  const [lotusOpen, setLotusOpen] = useState(released)

  const onRelease = useCallback(() => setReleased(true), [setReleased])

  useEffect(() => {
    if (!released || lotusOpen) return
    const t = window.setTimeout(() => setLotusOpen(true), reduced ? 0 : 2200)
    return () => window.clearTimeout(t)
  }, [released, lotusOpen, reduced])

  // Cada texto entra cuando el anterior ya se pudo leer
  const delays = texts.reduce<number[]>((acc, _, i) => {
    if (i === 0) return [instant ? 0 : 0.9]
    const prev = acc[i - 1] + (instant ? 0.15 : (readingTime(texts[i - 1]) * 0.75) / 1000)
    return [...acc, prev]
  }, [])

  return (
    <section className="relative flex h-screen-safe flex-col overflow-hidden">
      <Sky variant="dawn" />

      <DandelionField
        blow={blow}
        onRelease={onRelease}
        reduced={reduced}
        anchor={ANCHOR}
        ground={92}
        className="absolute inset-0 z-10 h-full w-full"
      />

      {/* Loto: el crecimiento personal */}
      <div className="pointer-events-none absolute bottom-[100px] right-[3%] z-0 w-[min(32vw,180px)] sm:right-[14%]" aria-hidden="true">
        <Lotus open={lotusOpen ? 1 : 0} className="w-full" />
      </div>

      {/* Pluma: cruza la pantalla despacio */}
      {released && !reduced && (
        <div className="pointer-events-none absolute left-0 top-[54%] z-20" aria-hidden="true">
          <div className="motion-loop animate-[feather-x_17s_linear_0.6s_both]">
            <div className="motion-loop animate-[feather-y_5.5s_var(--ease-breath)_infinite_alternate]">
              <Feather className="w-[clamp(34px,9vw,52px)] rotate-[64deg] drop-shadow-[0_6px_12px_rgb(92_64_30/0.18)]" />
            </div>
          </div>
        </div>
      )}
      {released && reduced && (
        <div className="pointer-events-none absolute bottom-[6svh] left-[8%] z-0" aria-hidden="true">
          <Feather className="w-9 rotate-[72deg]" />
        </div>
      )}

      {/* Mariposa: la transformación */}
      <AnimatePresence>
        {released && (
          <m.div
            className="pointer-events-none absolute right-[8%] top-[45%] z-20 w-[clamp(58px,16vw,92px)] sm:right-[20%]"
            aria-hidden="true"
            initial={reduced || instant ? { opacity: 0 } : { opacity: 0, x: 120, y: 220, rotate: 20 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -8 }}
            transition={{ duration: reduced || instant ? 0.8 : 6, delay: instant ? 0 : 3.2, ease: [0.3, 0.1, 0.3, 1] }}
          >
            <div className="motion-loop animate-[bob_3.4s_var(--ease-breath)_infinite]">
              <Butterfly flapping={!reduced} className="w-full" />
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <ChapterHeader index={3} title={title} />

      <div className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[34rem] flex-1 flex-col px-7 pt-[3svh] text-center">
        <AnimatePresence mode="wait">
          {!released ? (
            <m.div
              key="prompt"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.6 } }}
              transition={{ duration: 1.2, delay: 0.4, ease }}
            >
              <p className="font-display text-[clamp(1.45rem,1.05rem+2.2vw,2.2rem)] leading-[1.25] text-balance text-ink">{prompt}</p>
              <div className="pointer-events-auto mt-6 flex flex-col items-center gap-3">
                <p className="label-caps text-ink-soft">{hint}</p>
                <OutlineButton onClick={() => setBlow((b) => b + 1)} iconLeft={<Wind size={17} />}>
                  {blowButton}
                </OutlineButton>
              </div>
            </m.div>
          ) : (
            <m.div key="texts" className="space-y-[clamp(0.6rem,2svh,1.2rem)]" aria-live="polite">
              {texts.map((t, i) => (
                <m.p
                  key={i}
                  className={`font-display text-balance text-ink ${
                    i === 0
                      ? 'text-[clamp(1.35rem,min(1rem+2vw,3.4svh),2.1rem)] italic leading-[1.22]'
                      : 'text-[clamp(1.02rem,min(0.9rem+0.8vw,2.45svh),1.3rem)] leading-[1.45] text-ink-soft'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.3, delay: delays[i], ease }}
                >
                  {t}
                </m.p>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <ChapterNav onBack={onBack} onNext={onNext} ready={released} />
    </section>
  )
}
