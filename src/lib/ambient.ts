/**
 * Ambiente sonoro opcional.
 *
 * Modo 'generative': un colchón armónico muy suave y algunas notas de caja de
 * música, generados en el momento con Web Audio. No usa archivos ni obras de
 * terceros, así que no hay derechos que gestionar.
 * Modo 'file': reproduce en bucle un archivo propio con fundido de entrada.
 *
 * Nunca arranca solo: se crea recién cuando la persona toca el botón.
 */

export interface Ambient {
  start(): Promise<void>
  stop(): void
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12)

// Re mayor: D(add9) – Bm7 – Gmaj7 – A(sus)
const CHORDS: number[][] = [
  [50, 57, 64, 66],
  [47, 54, 57, 62],
  [43, 50, 54, 59],
  [45, 52, 59, 62],
]
// Pentatónica de Re en registro agudo: consonante con todos los acordes
const BELL_SCALE = [74, 76, 78, 81, 83, 86, 88]

const CHORD_SECONDS = 10
const MASTER_LEVEL = 0.2

function impulse(ctx: AudioContext, seconds: number, decay: number) {
  const rate = ctx.sampleRate
  const len = Math.floor(rate * seconds)
  const buf = ctx.createBuffer(2, len, rate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
  }
  return buf
}

export function createGenerativeAmbient(): Ambient {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let bus: GainNode | null = null
  let timer: number | null = null
  let stopTimer: number | null = null
  let nextChordAt = 0
  let chordIndex = 0
  let nextBellAt = 0
  let bellStep = 2

  const build = () => {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const c = new AC()
    const m = c.createGain()
    m.gain.value = 0
    const tone = c.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 4200
    const comp = c.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.ratio.value = 3
    m.connect(tone).connect(comp).connect(c.destination)

    const b = c.createGain()
    const dry = c.createGain()
    dry.gain.value = 0.55
    const verb = c.createConvolver()
    verb.buffer = impulse(c, 4.2, 2.6)
    const wet = c.createGain()
    wet.gain.value = 0.6
    b.connect(dry).connect(m)
    b.connect(verb).connect(wet).connect(m)

    ctx = c
    master = m
    bus = b
  }

  const padChord = (notes: number[], at: number) => {
    if (!ctx || !bus) return
    const end = at + CHORD_SECONDS + 3.5
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 820
    filter.Q.value = 0.4
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, at)
    env.gain.linearRampToValueAtTime(1, at + 3.6)
    env.gain.setValueAtTime(1, at + CHORD_SECONDS - 0.5)
    env.gain.linearRampToValueAtTime(0, end)
    filter.connect(env).connect(bus)
    for (const n of notes) {
      for (const [type, detune, level] of [
        ['sine', -4, 0.022],
        ['triangle', 5, 0.011],
      ] as const) {
        const osc = ctx.createOscillator()
        osc.type = type
        osc.frequency.value = midi(n)
        osc.detune.value = detune
        const g = ctx.createGain()
        g.gain.value = level
        osc.connect(g).connect(filter)
        osc.start(at)
        osc.stop(end + 0.1)
      }
    }
  }

  const bell = (note: number, at: number, level = 0.05) => {
    if (!ctx || !bus) return
    const pan = ctx.createStereoPanner()
    pan.pan.value = Math.random() * 0.8 - 0.4
    pan.connect(bus)
    const partials: Array<[number, number, number]> = [
      [1, level, 2.8],
      [2, level * 0.22, 1.4],
      [3, level * 0.06, 0.8],
    ]
    for (const [mult, gain, decay] of partials) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = midi(note) * mult
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(gain, at + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, at + decay)
      osc.connect(g).connect(pan)
      osc.start(at)
      osc.stop(at + decay + 0.05)
    }
  }

  const schedule = () => {
    if (!ctx) return
    const horizon = ctx.currentTime + 1.2
    while (nextChordAt < horizon) {
      padChord(CHORDS[chordIndex % CHORDS.length], nextChordAt)
      chordIndex++
      nextChordAt += CHORD_SECONDS
    }
    while (nextBellAt < horizon) {
      // Paseo melódico: pasos cortos sobre la escala, para que suene a frase y no a azar
      const move = [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]
      bellStep = Math.max(0, Math.min(BELL_SCALE.length - 1, bellStep + move))
      bell(BELL_SCALE[bellStep], nextBellAt)
      if (Math.random() < 0.25) {
        const lower = Math.max(0, bellStep - 2)
        bell(BELL_SCALE[lower], nextBellAt + 0.02, 0.03)
      }
      nextBellAt += 1.9 + Math.random() * 2.6
    }
  }

  return {
    async start() {
      if (stopTimer) {
        window.clearTimeout(stopTimer)
        stopTimer = null
      }
      if (!ctx) build()
      if (!ctx || !master) return
      await ctx.resume()
      const now = ctx.currentTime
      if (nextChordAt < now) nextChordAt = now + 0.05
      if (nextBellAt < now) nextBellAt = now + 2.5
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 3)
      schedule()
      if (timer === null) timer = window.setInterval(schedule, 300)
    },
    stop() {
      if (!ctx || !master) return
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 1.4)
      if (timer !== null) {
        window.clearInterval(timer)
        timer = null
      }
      const c = ctx
      stopTimer = window.setTimeout(() => {
        void c.suspend()
        nextChordAt = 0
      }, 1500)
    },
  }
}

export function createFileAmbient(src: string): Ambient {
  let audio: HTMLAudioElement | null = null
  let fade: number | null = null
  const ramp = (to: number, ms: number, done?: () => void) => {
    if (!audio) return
    if (fade) window.clearInterval(fade)
    const from = audio.volume
    const t0 = performance.now()
    fade = window.setInterval(() => {
      if (!audio) return
      const k = Math.min(1, (performance.now() - t0) / ms)
      audio.volume = from + (to - from) * k
      if (k >= 1 && fade) {
        window.clearInterval(fade)
        fade = null
        done?.()
      }
    }, 50)
  }
  return {
    async start() {
      if (!audio) {
        audio = new Audio(src)
        audio.loop = true
        audio.preload = 'auto'
        audio.volume = 0
      }
      await audio.play()
      ramp(0.55, 2500)
    },
    stop() {
      ramp(0, 1200, () => audio?.pause())
    },
  }
}
