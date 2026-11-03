import { AnimatePresence, m } from 'motion/react'
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { experience } from '../config/experience'
import { ChapterHeader, ChapterNav } from '../components/ChapterChrome'
import { OutlineButton } from '../components/Buttons'
import { MemorySheet } from '../components/MemorySheet'
import { Sky } from '../components/Sky'
import { getTreeModel, Tree } from '../components/illustrations/Tree'
import { SLOTS, TREE_H, TREE_W } from '../lib/tree'

interface Props {
  revealed: boolean[]
  setRevealed: Dispatch<SetStateAction<boolean[]>>
  onBack: () => void
  onNext: () => void
}

/*
 * Qué palabra va en cada brote (índices de `words` en la configuración).
 * Las cortas van arriba al centro; las largas, abajo a los costados, donde
 * hay lugar para leerlas en un celular.
 * Rótulos: 0-3 arriba de la copa (izq. → der.) · 4-5 abajo a la izquierda ·
 *          6-7 abajo a la derecha
 */
const LAYOUT = [0, 2, 6, 7, 1, 4, 3, 5]

const ease = [0.22, 0.8, 0.26, 1] as const

export function ChapterRoots({ revealed, setRevealed, onBack, onNext }: Props) {
  const { title, quote, words, hint, completed, memoriesTitle } = experience.chapters.roots
  const model = useMemo(getTreeModel, [])
  const [last, setLast] = useState<number | null>(null)
  const [sheet, setSheet] = useState(false)

  const spots = useMemo(() => {
    const useLayout = words.length === 8
    return model.hotspots
      .map((h, i) => ({ ...h, i, word: useLayout ? words[LAYOUT[i]] : words[i] }))
      .filter((s) => s.word !== undefined)
  }, [model, words])

  const count = spots.filter((s) => revealed[s.i]).length
  const complete = count === spots.length
  const hasMemories = experience.memories.length > 0

  const reveal = (i: number) => {
    setLast(i)
    if (!revealed[i]) setRevealed((r) => r.map((v, k) => (k === i ? true : v)))
  }

  return (
    <section className="relative flex h-screen-safe flex-col overflow-hidden">
      <Sky variant="paper" />
      <ChapterHeader index={1} title={title} />

      <m.blockquote
        className="font-display relative z-20 mx-auto mt-4 max-w-[27rem] px-7 text-center text-[clamp(1.08rem,0.9rem+0.9vw,1.32rem)] italic leading-[1.42] text-balance text-ink"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease }}
      >
        {quote}
      </m.blockquote>

      {/* Árbol: se ajusta al espacio disponible sin deformarse */}
      <div className="relative z-10 mt-1 flex min-h-0 flex-1 items-center justify-center [container-type:size]">
        <div
          className="relative shrink-0"
          style={{ width: `min(100cqw, calc(100cqh * ${TREE_W} / ${TREE_H}), 600px)`, aspectRatio: `${TREE_W} / ${TREE_H}` }}
        >
          <Tree revealed={revealed} complete={complete} className="absolute inset-0 h-full w-full" />

          {/* Líneas de rótulo, como en una lámina botánica */}
          <svg viewBox={`0 0 ${TREE_W} ${TREE_H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            {spots.map((s) => {
              const slot = SLOTS[s.i]
              const [lx, ly] = slot.label
              const ex = lx + (slot.align === 'start' ? 6 : slot.align === 'end' ? -6 : 0)
              const ey = ly + (slot.side === 'above' ? 1 : -1)
              const mx = (s.x + ex) / 2 + (ex > s.x ? -6 : 6)
              const my = (s.y + ey) / 2
              return (
                <path
                  key={s.i}
                  d={`M${s.x.toFixed(1)} ${s.y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex} ${ey}`}
                  fill="none"
                  className="stroke-ink"
                  strokeWidth={0.6}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  style={{
                    strokeDashoffset: revealed[s.i] ? 0 : 1,
                    opacity: revealed[s.i] ? 0.55 : 0,
                    transition: 'stroke-dashoffset 900ms var(--ease-soft), opacity 300ms ease',
                  }}
                />
              )
            })}
          </svg>

          {spots.map((s, n) => {
            const on = revealed[s.i]
            const fx = s.x / TREE_W
            return (
              <div
                key={s.i}
                className="absolute"
                style={{ left: `${fx * 100}%`, top: `${(s.y / TREE_H) * 100}%` }}
              >
                <button
                  type="button"
                  onClick={() => reveal(s.i)}
                  aria-label={on ? s.word : `Descubrir una palabra (${n + 1} de ${spots.length})`}
                  aria-pressed={on}
                  className="absolute left-0 top-0 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                >
                  <span className="relative grid size-4 place-items-center">
                    {!on && (
                      <span
                        className="motion-loop absolute inset-0 animate-bud rounded-full bg-gold"
                        style={{ animationDelay: `${(n % 4) * 0.4}s` }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={`relative rounded-full border transition-all duration-500 ${
                        on ? 'size-2.5 border-gold-deep bg-gold-soft' : 'size-3 border-ink/70 bg-gold-light'
                      }`}
                    />
                    {on && last === s.i && (
                      <span
                        aria-hidden="true"
                        className="absolute -inset-4 animate-[halo_1.2s_var(--ease-soft)_both] rounded-full border border-gold"
                      />
                    )}
                  </span>
                </button>

              </div>
            )
          })}

          {spots.map((s) => {
            const slot = SLOTS[s.i]
            const [lx, ly] = slot.label
            const tx = slot.align === 'start' ? '0%' : slot.align === 'end' ? '-100%' : '-50%'
            const ty = slot.side === 'above' ? '-100%' : '0%'
            return (
              <AnimatePresence key={s.i}>
                {revealed[s.i] && (
                  <m.span
                    aria-hidden="true"
                    className="font-display pointer-events-none absolute whitespace-nowrap px-1 text-[clamp(0.95rem,0.82rem+0.6vw,1.15rem)] italic leading-tight text-ink"
                    style={{ left: `${(lx / TREE_W) * 100}%`, top: `${(ly / TREE_H) * 100}%`, translate: `${tx} ${ty}` }}
                    initial={{ opacity: 0, y: slot.side === 'above' ? 6 : -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35, ease }}
                  >
                    {s.word}
                  </m.span>
                )}
              </AnimatePresence>
            )
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {last !== null ? spots.find((s) => s.i === last)?.word : ''}
      </p>

      <div className="relative z-20 flex min-h-12 flex-col items-center justify-center gap-2 px-safe pt-1 text-center">
        <AnimatePresence mode="wait">
          {complete ? (
            <m.p
              key="done"
              className="font-display text-lead italic text-ink"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease }}
            >
              {completed}
            </m.p>
          ) : (
            <m.p key="hint" className="label-caps text-ink-soft" exit={{ opacity: 0 }}>
              {hint}
            </m.p>
          )}
        </AnimatePresence>
        {hasMemories && (complete || count >= 3) && (
          <OutlineButton onClick={() => setSheet(true)}>{memoriesTitle}</OutlineButton>
        )}
      </div>

      <ChapterNav onBack={onBack} onNext={onNext} ready={complete}>
        <span className="font-sans text-ui tabular-nums text-ink-soft" aria-label={`${count} de ${spots.length} palabras descubiertas`}>
          {count}
          <span className="mx-1 text-ink-faint">/</span>
          {spots.length}
        </span>
      </ChapterNav>

      {hasMemories && (
        <MemorySheet open={sheet} title={memoriesTitle} memories={experience.memories} onClose={() => setSheet(false)} />
      )}
    </section>
  )
}
