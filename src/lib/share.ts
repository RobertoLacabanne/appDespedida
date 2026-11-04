import { experience } from '../config/experience'

export type ShareOutcome = 'shared' | 'cancelled' | 'fallback'

/** URL canónica sin el hash del capítulo, para que quien la abra empiece desde el principio. */
export function shareUrl(): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}`
}

export function whatsappHref(): string {
  const text = `${experience.share.text}\n${shareUrl()}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export async function nativeShare(): Promise<ShareOutcome> {
  const data: ShareData = {
    title: experience.meta.title,
    text: experience.share.text,
    url: shareUrl(),
  }
  if (typeof navigator.share === 'function' && (!navigator.canShare || navigator.canShare(data))) {
    try {
      await navigator.share(data)
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      return 'fallback'
    }
  }
  return 'fallback'
}

export async function copyLink(): Promise<boolean> {
  const url = shareUrl()
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    // Respaldo para navegadores sin API de portapapeles
    const ta = document.createElement('textarea')
    ta.value = url
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
    return ok
  }
}
