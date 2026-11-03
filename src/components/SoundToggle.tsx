import { useEffect, useRef, useState } from 'react'
import { experience } from '../config/experience'
import { createFileAmbient, createGenerativeAmbient, type Ambient } from '../lib/ambient'
import { SoundOff, SoundOn } from './Icons'

let shared: Ambient | null = null
let sharedOn = false
const getAmbient = (): Ambient | null => {
  const { mode, src } = experience.sound
  if (mode === 'off') return null
  if (!shared) shared = mode === 'file' && src ? createFileAmbient(src) : createGenerativeAmbient()
  return shared
}

/** Sonido voluntario: nunca arranca solo y se pausa al salir de la pestaña. */
export function SoundToggle() {
  const [on, setOn] = useState(sharedOn)
  const wasOn = useRef(false)

  useEffect(() => {
    const onVisibility = () => {
      const a = getAmbient()
      if (!a) return
      if (document.hidden && sharedOn) {
        wasOn.current = true
        a.stop()
      } else if (!document.hidden && wasOn.current) {
        wasOn.current = false
        void a.start().catch(() => undefined)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (experience.sound.mode === 'off') return null

  const toggle = async () => {
    const a = getAmbient()
    if (!a) return
    if (sharedOn) {
      a.stop()
      sharedOn = false
      setOn(false)
    } else {
      sharedOn = true
      setOn(true)
      try {
        await a.start()
      } catch {
        sharedOn = false
        setOn(false)
      }
    }
  }

  const label = on ? experience.ui.soundOff : experience.ui.soundOn
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className="relative grid size-11 place-items-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-paper-light/70 hover:text-ink"
    >
      {on ? <SoundOn /> : <SoundOff />}
      {on && (
        <span
          aria-hidden="true"
          className="motion-loop absolute inset-1.5 rounded-full border border-gold/60 animate-[glow-pulse_3s_ease-in-out_infinite]"
        />
      )}
    </button>
  )
}
