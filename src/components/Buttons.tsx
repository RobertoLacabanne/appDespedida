import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode; iconLeft?: ReactNode; glow?: boolean }

/** Acción principal: píldora de tinta, la única superficie oscura de la obra. */
export function PrimaryButton({ children, icon, iconLeft, glow, className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      className={`group relative inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-ink px-6 text-[0.95rem] font-semibold tracking-[0.01em] text-paper-light shadow-button transition-[transform,background-color,box-shadow] duration-200 ease-out hover:-translate-y-px hover:bg-dusk active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${className}`}
      {...rest}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="motion-loop pointer-events-none absolute -inset-1.5 rounded-full border border-gold/70 animate-[glow-pulse_2.8s_ease-in-out_infinite]"
        />
      )}
      {iconLeft}
      <span>{children}</span>
      {icon && <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">{icon}</span>}
    </button>
  )
}

/** Acción secundaria: texto con subrayado fino. */
export function QuietButton({ children, icon, iconLeft, className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-ui font-medium text-ink-soft transition-colors duration-200 hover:text-ink disabled:pointer-events-none disabled:opacity-40 ${className}`}
      {...rest}
    >
      {iconLeft}
      <span className="underline decoration-sand decoration-1 underline-offset-4 transition-[text-decoration-color] duration-200 group-hover:decoration-ink-soft">
        {children}
      </span>
      {icon}
    </button>
  )
}

/** Botón secundario con borde, para acciones como "Soplar" o "Copiar enlace". */
export function OutlineButton({ children, icon, iconLeft, className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ink/25 bg-paper-light/70 px-4.5 text-ui font-semibold text-ink transition-[background-color,border-color,transform] duration-200 ease-out hover:border-ink/50 hover:bg-paper-light active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${className}`}
      {...rest}
    >
      {iconLeft}
      <span>{children}</span>
      {icon}
    </button>
  )
}
