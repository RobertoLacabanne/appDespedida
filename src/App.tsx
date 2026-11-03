import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChapterTime } from './chapters/ChapterTime'
import { ChapterRoots } from './chapters/ChapterRoots'
import { ChapterGratitude } from './chapters/ChapterGratitude'
import { ChapterLettingGo } from './chapters/ChapterLettingGo'
import { ChapterRemains } from './chapters/ChapterRemains'
import { CHAPTER_COUNT, useChapter } from './lib/useChapter'

const ease = [0.22, 0.8, 0.26, 1] as const

export default function App() {
  const { chapter, goTo } = useChapter()
  const navigated = useRef(false)

  // Estado que sobrevive al ir y volver entre capítulos
  const [introSeen, setIntroSeen] = useState(chapter > 0)
  const [roots, setRoots] = useState<boolean[]>(() => Array(8).fill(false))
  const [flowers, setFlowers] = useState<number[]>([])
  const [released, setReleased] = useState(false)

  const go = useCallback(
    (n: number) => {
      navigated.current = true
      goTo(n)
    },
    [goTo],
  )
  const next = useCallback(() => go(chapter + 1), [go, chapter])
  const back = useCallback(() => go(chapter - 1), [go, chapter])
  const markIntro = useCallback(() => setIntroSeen(true), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.metaKey || e.ctrlKey) return
      if (e.key === 'ArrowRight' && chapter < CHAPTER_COUNT - 1 && (chapter > 0 || introSeen)) next()
      if (e.key === 'ArrowLeft' && chapter > 0) back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chapter, introSeen, next, back])

  const scenes = [
    <ChapterTime key="1" introSeen={introSeen} onIntroDone={markIntro} onNext={next} />,
    <ChapterRoots key="2" revealed={roots} setRevealed={setRoots} onBack={back} onNext={next} />,
    <ChapterGratitude key="3" order={flowers} setOrder={setFlowers} onBack={back} onNext={next} />,
    <ChapterLettingGo key="4" released={released} setReleased={setReleased} onBack={back} onNext={next} />,
    <ChapterRemains key="5" onBack={back} onRestart={() => go(0)} />,
  ]

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <main className="relative h-screen-safe overflow-hidden bg-paper">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={chapter}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 1.1, ease } }}
              exit={{ opacity: 0, scale: 1.012, transition: { duration: 0.65, ease: 'easeIn' } }}
            >
              {scenes[chapter]}
            </m.div>
          </AnimatePresence>

          {/* Fundido a luz entre capítulos */}
          {navigated.current && (
            <m.div
              key={`veil-${chapter}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-40"
              style={{
                background:
                  'radial-gradient(120% 80% at 50% 60%, rgb(255 244 222 / 0.95), rgb(245 230 191 / 0.6) 55%, rgb(247 239 226 / 0) 100%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.7, times: [0, 0.38, 1], ease: 'easeInOut' }}
            />
          )}

          <div className="paper-grain" aria-hidden="true" />
        </main>
      </LazyMotion>
    </MotionConfig>
  )
}
