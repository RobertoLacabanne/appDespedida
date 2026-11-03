import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'

export interface SparkApi {
  /** Lanza chispas desde un anillo (coordenadas relativas al lienzo) */
  burst(cx: number, cy: number, r: number, gapAtDeg: number, gapDeg: number): void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  color: string
  star: boolean
  phase: number
}

const css = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

/**
 * Chispas cálidas y livianas: celebración, no homenaje. Salen hacia afuera,
 * suben un poco, titilan y se apagan. Las que nacen en la abertura salen por ella.
 */
export function SparkCanvas({ ref, className = '' }: { ref?: Ref<SparkApi>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useRef<{ particles: Particle[]; raf: number; w: number; h: number; dpr: number }>({
    particles: [],
    raf: 0,
    w: 0,
    h: 0,
    dpr: 1,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      state.current.w = rect.width
      state.current.h = rect.height
      state.current.dpr = dpr
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    const s = state.current
    return () => {
      ro.disconnect()
      cancelAnimationFrame(s.raf)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    burst(cx, cy, r, gapAtDeg, gapDeg) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      const palette = [
        css('--color-gold-soft', '#e9cb85'),
        css('--color-gold', '#c69a3e'),
        css('--color-gold', '#c69a3e'),
        css('--color-apricot', '#eda77f'),
        css('--color-rose', '#d9a0a6'),
        css('--color-amber', '#f2c66e'),
      ]
      const s = state.current
      const count = 120
      for (let i = 0; i < count && s.particles.length < 420; i++) {
        const throughGap = i < 26
        const deg = throughGap
          ? gapAtDeg + (Math.random() - 0.5) * gapDeg * 0.9
          : gapAtDeg + gapDeg / 2 + Math.random() * (360 - gapDeg)
        const a = (deg * Math.PI) / 180
        const ox = Math.sin(a)
        const oy = -Math.cos(a)
        const speed = throughGap ? 1.6 + Math.random() * 2.2 : 0.5 + Math.random() * 1.7
        const max = 150 + Math.random() * 130
        s.particles.push({
          x: cx + ox * r * (throughGap ? 0.75 : 1),
          y: cy + oy * r * (throughGap ? 0.75 : 1),
          vx: ox * speed + (Math.random() - 0.5) * 0.4,
          vy: oy * speed - 0.5 - Math.random() * 0.9,
          life: 0,
          max,
          size: 1.4 + Math.random() * 2.4,
          color: palette[Math.floor(Math.random() * palette.length)],
          star: Math.random() < 0.3,
          phase: Math.random() * Math.PI * 2,
        })
      }

      if (s.raf) return
      const tick = () => {
        const { w, h, dpr } = s
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)
        s.particles = s.particles.filter((p) => p.life < p.max)
        for (const p of s.particles) {
          p.life++
          p.vx *= 0.985
          p.vy = p.vy * 0.985 - 0.012
          p.x += p.vx + Math.sin(p.life * 0.05 + p.phase) * 0.18
          p.y += p.vy
          const t = p.life / p.max
          const fade = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9
          const twinkle = 0.7 + 0.3 * Math.sin(p.life * 0.25 + p.phase)
          const alpha = Math.max(0, fade * twinkle)
          ctx.fillStyle = p.color
          ctx.strokeStyle = p.color
          if (p.star) {
            const k = p.size * 2.4
            ctx.globalAlpha = alpha
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x - k, p.y)
            ctx.lineTo(p.x + k, p.y)
            ctx.moveTo(p.x, p.y - k)
            ctx.lineTo(p.x, p.y + k)
            ctx.stroke()
          }
          ctx.globalAlpha = alpha * 0.22
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        if (s.particles.length) s.raf = requestAnimationFrame(tick)
        else {
          s.raf = 0
          ctx.clearRect(0, 0, w, h)
        }
      }
      s.raf = requestAnimationFrame(tick)
    },
  }))

  return <canvas ref={canvasRef} className={`pointer-events-none ${className}`} aria-hidden="true" />
}
