import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import { experience } from '../config/experience'
import { copyLink, nativeShare, whatsappHref } from '../lib/share'
import { OutlineButton, PrimaryButton } from './Buttons'
import { ChatIcon, LinkIcon, ShareIcon } from './Icons'

/** Compartir: nativo si el teléfono lo ofrece; WhatsApp y copiar enlace siempre a mano. */
export function ShareBlock() {
  const { button, whatsappFallback, copyLink: copyLabel, copied } = experience.share
  const [canNative, setCanNative] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    setCanNative(typeof navigator.share === 'function')
  }, [])

  useEffect(() => {
    if (!status) return
    const t = window.setTimeout(() => setStatus(null), 2600)
    return () => window.clearTimeout(t)
  }, [status])

  const share = async () => {
    const result = await nativeShare()
    if (result === 'fallback') window.open(whatsappHref(), '_blank', 'noopener')
  }

  const copy = async () => {
    const ok = await copyLink()
    setStatus(ok ? copied : 'No se pudo copiar. Copialo desde la barra de direcciones.')
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <PrimaryButton onClick={share} iconLeft={<ShareIcon size={18} />} className="px-7">
        {button}
      </PrimaryButton>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {canNative && (
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ink/25 bg-paper-light/70 px-4.5 text-ui font-semibold text-ink transition-[background-color,border-color] duration-200 hover:border-ink/50 hover:bg-paper-light"
          >
            <ChatIcon size={17} />
            {whatsappFallback}
          </a>
        )}
        <OutlineButton onClick={copy} iconLeft={<LinkIcon size={17} />}>
          {copyLabel}
        </OutlineButton>
      </div>
      <div className="h-6" aria-live="polite">
        <AnimatePresence>
          {status && (
            <m.p
              className="label-caps rounded-full bg-sage-mist px-3 py-1.5 text-ink"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {status}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
