import { useEffect, useRef, type ReactNode } from 'react'
import { experience } from '../config/experience'
import { ArrowLeft, ArrowRight } from './Icons'
import { PrimaryButton, QuietButton } from './Buttons'
import { ProgressRing } from './ProgressRing'
import { SoundToggle } from './SoundToggle'

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

interface HeaderProps {
  index: number
  title: string
  /** Mover el foco al título al entrar (lectores de pantalla) */
  focusOnMount?: boolean
  className?: string
}

export function ChapterHeader({ index, title, focusOnMount = true, className = '' }: HeaderProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (focusOnMount) ref.current?.focus({ preventScroll: true })
  }, [focusOnMount])
  return (
    <header className={`relative z-30 flex items-start justify-between gap-4 px-safe pt-safe ${className}`}>
      <div className="pt-1.5 pl-1">
        <p className="label-caps text-ink-soft" aria-hidden="true">
          Capítulo {ROMAN[index]}
        </p>
        <h2 ref={ref} tabIndex={-1} className="font-display mt-1 text-[1.15rem] italic leading-tight text-ink outline-none">
          <span className="sr-only">Capítulo {index + 1}: </span>
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-0.5">
        <ProgressRing current={index} label={experience.ui.progressLabel} />
        <SoundToggle />
      </div>
    </header>
  )
}

interface NavProps {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  /** Resalta "Seguir" cuando el capítulo ya se recorrió */
  ready?: boolean
  children?: ReactNode
  className?: string
}

export function ChapterNav({ onBack, onNext, nextLabel = experience.ui.next, ready, children, className = '' }: NavProps) {
  return (
    <nav
      aria-label="Navegación entre capítulos"
      className={`relative z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-safe pb-safe pt-2 ${className}`}
    >
      <div className="justify-self-start">
        {onBack && (
          <QuietButton onClick={onBack} iconLeft={<ArrowLeft size={16} />}>
            {experience.ui.back}
          </QuietButton>
        )}
      </div>
      <div className="min-w-0 justify-self-center text-center">{children}</div>
      <div className="justify-self-end">
        {onNext && (
          <PrimaryButton onClick={onNext} icon={<ArrowRight size={17} />} glow={ready}>
            {nextLabel}
          </PrimaryButton>
        )}
      </div>
    </nav>
  )
}
