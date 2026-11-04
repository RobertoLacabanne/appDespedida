import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef } from 'react'
import type { Memory } from '../config/experience'

interface Props {
  open: boolean
  title: string
  memories: Memory[]
  onClose: () => void
}

/** Hoja con recuerdos reales y fotos. Solo existe si hay contenido en la configuración. */
export function MemorySheet({ open, title, memories, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Cerrar" className="absolute inset-0 bg-paper/75" onClick={onClose} tabIndex={-1} />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative z-10 max-h-[82svh] w-full max-w-lg overflow-y-auto rounded-t-[1.25rem] bg-paper-light px-6 pb-safe pt-5 shadow-lift sm:rounded-card"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 40 }}
            transition={{ duration: 0.45, ease: [0.22, 0.8, 0.26, 1] }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-sand sm:hidden" aria-hidden="true" />
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-[1.6rem] italic text-ink">{title}</h3>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="label-caps min-h-11 rounded-full px-3 text-ink-soft hover:text-ink"
              >
                Cerrar
              </button>
            </div>
            <ul className="mt-4 space-y-8 pb-6">
              {memories.map((mem, i) => (
                <li key={i}>
                  {mem.photo && (
                    <figure className="rotate-[-0.6deg] rounded-[0.4rem] bg-white p-2 pb-3 shadow-paper">
                      <img
                        src={mem.photo.replace(/^\//, './')}
                        alt={mem.photoAlt ?? ''}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full rounded-[0.2rem] object-cover"
                      />
                    </figure>
                  )}
                  <div className={mem.photo ? 'mt-4' : ''}>
                    {mem.when && <p className="label-caps text-ink-soft">{mem.when}</p>}
                    {mem.title && <h4 className="font-display mt-1 text-[1.25rem] text-ink">{mem.title}</h4>}
                    <p className="font-letter mt-2 text-body text-pretty text-ink">{mem.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
