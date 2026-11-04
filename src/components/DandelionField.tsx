import { useEffect, useRef } from 'react'
import { seeded } from '../lib/random'

/**
 * Diente de león — aprender a soltar.
 * Canvas 2D: las semillas se sueltan con el dedo (o con "Soplar") y vuelan
 * con un viento suave. Con movimiento reducido no hay vuelo: las semillas
 * aparecen ya dispersas en el cielo.
 */
interface Props {
  /** Incrementar para soplar desde un botón */
  blow: number
  /** Se llama una vez cuando ya se soltó una buena parte */
  onRelease: () => void
  onInteract?: () => void
  reduced: boolean
  /** Posición de la cabeza, en fracciones del lienzo */
  anchor: { x: number; y: number }
  /** Espacio libre abajo (px) para que el tallo no quede debajo de la navegación */
  ground?: number
  className?: string
}

interface Seed {
  // Posición sobre la esfera (unitaria)
  sx: number
  sy: number
  sz: number
  attached: boolean
  releaseAt: number
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  phase: number
  size: number
}

const N = 120
const RELEASE_RATIO = 0.3

const css = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export function DandelionField({ blow, onRelease, onInteract, reduced, anchor, ground = 0, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const api = useRef<{ blow: () => void } | null>(null)
  const cb = useRef({ onRelease, onInteract })
  cb.current = { onRelease, onInteract }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const INK = css('--color-ink', '#1d2a44')
    const SAGE = css('--color-sage', '#8da287')
    const SAGE_DEEP = css('--color-sage-deep', '#5b7558')
    const UMBER = css('--color-umber-soft', '#9a7448')

    const rand = seeded(7)
    const seeds: Seed[] = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = i * 2.399963
      return {
        sx: Math.cos(t) * r,
        sy: y,
        sz: Math.sin(t) * r,
        attached: true,
        releaseAt: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rot: 0,
        phase: rand() * Math.PI * 2,
        size: 0.85 + rand() * 0.35,
      }
    })

    let w = 0
    let h = 0
    let R = 60
    let hx = 0
    let hy = 0
    let sway = 0
    let released = 0
    let notified = false
    let lastInteraction = performance.now()
    let lastHint = performance.now()
    let raf = 0
    let groundPx = ground
    let running = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      R = Math.max(46, Math.min(92, Math.min(w, h) * 0.17))
      const badge = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--badge-space')) || 0
      groundPx = ground + Math.max(0, badge - 16)
      hx = w * anchor.x
      hy = Math.min(h * anchor.y, h - groundPx - R * 2.2)
      if (reduced) draw(performance.now())
    }

    const headX = () => hx + sway
    const proj = (s: Seed) => ({
      x: headX() + s.sx * R * 0.86,
      y: hy + s.sy * R * 0.86,
    })

    const detach = (s: Seed, vx: number, vy: number, delay = 0) => {
      if (!s.attached) return
      const p = proj(s)
      s.attached = false
      s.releaseAt = performance.now() + delay
      s.x = p.x
      s.y = p.y
      s.vx = vx
      s.vy = vy
      s.rot = Math.atan2(s.sy, s.sx) + Math.PI / 2
      released++
      if (!notified && released >= N * RELEASE_RATIO) {
        notified = true
        cb.current.onRelease()
      }
    }

    const scatterStatic = () => {
      // Movimiento reducido: algunas semillas quedan quietas en la franja libre
      // entre el texto y la flor (nunca encima del texto); el resto ya se fue.
      const r = seeded(11)
      const top = h * 0.5
      const bottom = Math.max(top + 30, hy - R * 1.15)
      let shown = 0
      for (const s of seeds) {
        if (s.attached) continue
        if (shown >= 18) {
          s.x = -9999
          s.y = -9999
          continue
        }
        shown++
        s.x = w * (0.06 + r() * 0.88)
        s.y = top + r() * (bottom - top)
        s.rot = 0.3 + (r() - 0.5) * 0.6
        s.releaseAt = 0
      }
    }

    const doBlow = () => {
      lastInteraction = performance.now()
      cb.current.onInteract?.()
      const order = seeds.filter((s) => s.attached).sort((a, b) => b.sx - a.sx)
      const take = Math.ceil(order.length * 0.78)
      order.slice(0, take).forEach((s, i) => {
        const out = 1 + Math.random()
        detach(s, 1.2 + Math.random() * 1.8 + s.sx * out, -0.8 + s.sy * out - Math.random() * 0.9, i * 9 + Math.random() * 160)
      })
      if (reduced) {
        scatterStatic()
        draw(performance.now())
      }
    }
    api.current = { blow: doBlow }

    // --- Gestos -------------------------------------------------------
    let last: { x: number; y: number; t: number } | null = null
    let downAt: { x: number; y: number } | null = null

    const local = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onDown = (e: PointerEvent) => {
      const p = local(e)
      last = { ...p, t: performance.now() }
      downAt = p
      canvas.setPointerCapture?.(e.pointerId)
    }

    const onMove = (e: PointerEvent) => {
      if (!last) return
      const p = local(e)
      const now = performance.now()
      const dt = Math.max(8, now - last.t)
      const vx = ((p.x - last.x) / dt) * 16
      const vy = ((p.y - last.y) / dt) * 16
      const speed = Math.hypot(vx, vy)
      lastInteraction = now
      if (speed > 0.6) cb.current.onInteract?.()

      // Semillas pegadas que toca el trazo
      const reach = R * 0.55
      for (const s of seeds) {
        if (!s.attached) continue
        const q = proj(s)
        // Distancia del punto al segmento recorrido por el dedo
        const ax = last.x
        const ay = last.y
        const bx = p.x - ax
        const by = p.y - ay
        const len2 = bx * bx + by * by || 1
        const k = Math.max(0, Math.min(1, ((q.x - ax) * bx + (q.y - ay) * by) / len2))
        const d = Math.hypot(q.x - (ax + bx * k), q.y - (ay + by * k))
        if (d < reach && speed > 1.2) {
          detach(s, vx * 0.22 + s.sx * 1.1 + (Math.random() - 0.5), vy * 0.22 + s.sy * 1.1 - 0.5, Math.random() * 60)
        }
      }
      // Semillas que ya vuelan reciben la estela del gesto
      if (!reduced) {
        for (const s of seeds) {
          if (s.attached) continue
          const d = Math.hypot(s.x - p.x, s.y - p.y)
          if (d < 110) {
            const f = (1 - d / 110) * 0.12
            s.vx += vx * f
            s.vy += vy * f
          }
        }
      }
      last = { ...p, t: now }
      if (reduced && released) {
        scatterStatic()
        draw(now)
      }
    }

    const onUp = (e: PointerEvent) => {
      const p = local(e)
      // Un toque sobre la cabeza suelta un puñado de semillas
      if (downAt && Math.hypot(p.x - downAt.x, p.y - downAt.y) < 10 && Math.hypot(p.x - headX(), p.y - hy) < R * 1.3) {
        lastInteraction = performance.now()
        cb.current.onInteract?.()
        const near = seeds
          .filter((s) => s.attached)
          .map((s) => ({ s, d: Math.hypot(proj(s).x - p.x, proj(s).y - p.y) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 14)
        near.forEach(({ s }, i) => detach(s, s.sx * 2.4 + 0.8, s.sy * 2.4 - 1, i * 30))
        if (reduced) {
          scatterStatic()
          draw(performance.now())
        }
      }
      last = null
      downAt = null
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    // --- Dibujo -------------------------------------------------------
    const drawLeaf = (bx: number, by: number, dir: number, len: number) => {
      ctx.save()
      ctx.translate(bx, by)
      ctx.rotate(dir)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      // Hoja dentada de diente de león
      const teeth = 6
      for (let i = 1; i <= teeth; i++) {
        const t = i / teeth
        const wdt = Math.sin(Math.PI * t) * len * 0.16 + 2
        ctx.lineTo(len * (t - 0.06), -wdt * 0.55)
        ctx.lineTo(len * t, -wdt)
      }
      for (let i = teeth; i >= 1; i--) {
        const t = i / teeth
        const wdt = Math.sin(Math.PI * t) * len * 0.14 + 2
        ctx.lineTo(len * t, wdt)
        ctx.lineTo(len * (t - 0.06), wdt * 0.5)
      }
      ctx.closePath()
      ctx.fillStyle = SAGE
      ctx.globalAlpha = 0.85
      ctx.fill()
      ctx.globalAlpha = 0.7
      ctx.strokeStyle = INK
      ctx.lineWidth = 0.8
      ctx.stroke()
      ctx.restore()
    }

    const drawFlying = (s: Seed, alpha: number) => {
      const k = (R / 70) * s.size * 1.3
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      const dpr = canvas.width / (w || 1)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.translate(s.x, s.y)
      ctx.rotate(s.rot)
      ctx.scale(k, k)
      ctx.globalAlpha = alpha
      ctx.strokeStyle = INK
      ctx.lineWidth = 0.5
      ctx.beginPath()
      // Penacho
      for (let i = -5; i <= 5; i++) {
        const a = -Math.PI / 2 + i * 0.24
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(a) * 10, Math.sin(a) * 10 + 1.5)
      }
      // Pico
      ctx.moveTo(0, 0)
      ctx.lineTo(0, 13)
      ctx.stroke()
      // Semilla
      ctx.lineWidth = 1.6
      ctx.strokeStyle = UMBER
      ctx.beginPath()
      ctx.moveTo(0, 13)
      ctx.lineTo(0, 17.5)
      ctx.stroke()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(now: number) {
      const dpr = canvas!.width / (w || 1)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, w, h)
      ctx!.globalAlpha = 1

      sway = reduced ? 0 : Math.sin(now * 0.0007) * 3 + Math.sin(now * 0.0017) * 1.2
      const X = headX()

      // Tallo
      ctx!.lineCap = 'round'
      ctx!.strokeStyle = SAGE_DEEP
      ctx!.lineWidth = 3
      ctx!.beginPath()
      const base = h - groundPx
      ctx!.moveTo(hx - 4, base)
      ctx!.quadraticCurveTo(hx + 10, hy + (base - hy) * 0.5, X, hy + R * 0.1)
      ctx!.stroke()
      ctx!.strokeStyle = INK
      ctx!.globalAlpha = 0.55
      ctx!.lineWidth = 0.8
      ctx!.beginPath()
      ctx!.moveTo(hx - 2.5, base)
      ctx!.quadraticCurveTo(hx + 11.5, hy + (base - hy) * 0.5, X + 1.5, hy + R * 0.1)
      ctx!.stroke()
      ctx!.globalAlpha = 1

      drawLeaf(hx - 4, base, -Math.PI * 0.88, Math.min(110, R * 1.45))
      drawLeaf(hx - 2, base, -Math.PI * 0.16, Math.min(96, R * 1.25))
      // Línea de tierra
      ctx!.strokeStyle = INK
      ctx!.globalAlpha = 0.35
      ctx!.lineWidth = 0.8
      ctx!.beginPath()
      ctx!.moveTo(hx - R * 2.4, base + 1)
      ctx!.quadraticCurveTo(hx, base - 3, hx + R * 2.4, base + 2)
      ctx!.stroke()
      ctx!.globalAlpha = 1

      // Semillas pegadas: primero las de atrás
      const att = seeds.filter((s) => s.attached).sort((a, b) => a.sz - b.sz)
      for (const s of att) {
        const depth = (s.sz + 1) / 2
        const alpha = 0.2 + depth * 0.62
        const cx = X + s.sx * R * 0.14
        const cy = hy + s.sy * R * 0.14
        const px = X + s.sx * R * 0.82
        const py = hy + s.sy * R * 0.82
        const dir = Math.atan2(s.sy, s.sx)
        const pl = R * (0.17 + depth * 0.06)
        ctx!.globalAlpha = alpha
        ctx!.strokeStyle = INK
        ctx!.lineWidth = 0.5
        ctx!.beginPath()
        ctx!.moveTo(cx, cy)
        ctx!.lineTo(px, py)
        for (let i = -3; i <= 3; i++) {
          const a = dir + i * 0.32
          ctx!.moveTo(px, py)
          ctx!.lineTo(px + Math.cos(a) * pl, py + Math.sin(a) * pl)
        }
        ctx!.stroke()
      }
      ctx!.globalAlpha = 1

      // Receptáculo
      ctx!.fillStyle = SAGE_DEEP
      ctx!.beginPath()
      ctx!.ellipse(X, hy, R * 0.13, R * 0.11, 0, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.strokeStyle = INK
      ctx!.lineWidth = 0.8
      ctx!.stroke()
      // Brácteas colgantes
      ctx!.beginPath()
      for (let i = -2; i <= 2; i++) {
        ctx!.moveTo(X + i * R * 0.04, hy + R * 0.09)
        ctx!.quadraticCurveTo(X + i * R * 0.12, hy + R * 0.2, X + i * R * 0.16, hy + R * 0.3)
      }
      ctx!.stroke()

      // Semillas en vuelo
      for (const s of seeds) {
        if (s.attached || now < s.releaseAt) continue
        const fade = Math.min(1, (h - s.y) / 60, (s.x + 40) / 60, (w + 40 - s.x) / 60)
        if (fade <= 0) continue
        drawFlying(s, Math.max(0, Math.min(0.85, fade)))
      }
      ctx!.globalAlpha = 1
    }

    const step = (now: number) => {
      if (!running) return
      const t = now
      for (const s of seeds) {
        if (s.attached || now < s.releaseAt) continue
        // Viento: brisa hacia la derecha y hacia arriba, con remolinos suaves
        const tx = 0.3 + Math.sin(t * 0.0006 + s.y * 0.012 + s.phase) * 0.38
        const ty = -0.3 + Math.sin(t * 0.0011 + s.x * 0.014 + s.phase) * 0.3
        s.vx += (tx - s.vx) * 0.014
        s.vy += (ty - s.vy) * 0.014
        s.x += s.vx
        s.y += s.vy
        const target = Math.max(-0.7, Math.min(0.7, s.vx * 0.22)) + Math.sin(t * 0.002 + s.phase) * 0.12
        s.rot += (target - s.rot) * 0.04
      }
      // Pista: si nadie toca nada, cada tanto se va una semilla sola
      if (now - lastInteraction > 6000 && now - lastHint > 4200) {
        lastHint = now
        const candidates = seeds.filter((s) => s.attached && s.sx > 0.2)
        const s = candidates[Math.floor(Math.random() * candidates.length)]
        if (s) {
          s.attached = false
          const p = proj(s)
          s.x = p.x
          s.y = p.y
          s.vx = 0.8 + s.sx
          s.vy = -0.6 + s.sy * 0.5
          s.rot = Math.atan2(s.sy, s.sx) + Math.PI / 2
          s.releaseAt = now
        }
      }
      draw(now)
      raf = requestAnimationFrame(step)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener('badgespace', resize)
    resize()
    if (reduced) draw(performance.now())
    else raf = requestAnimationFrame(step)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('badgespace', resize)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      api.current = null
    }
  }, [reduced, anchor.x, anchor.y, ground])

  useEffect(() => {
    if (blow > 0) api.current?.blow()
  }, [blow])

  return <canvas ref={canvasRef} className={`touch-none ${className}`} aria-hidden="true" />
}
