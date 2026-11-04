import { seeded, lerp } from './random'

/** Lienzo del árbol en unidades del viewBox */
export const TREE_W = 400
export const TREE_H = 480
export const GROUND_Y = 360

export interface Segment {
  d: string
  width: number
  depth: number
  region: number
}

export interface Leaf {
  x: number
  y: number
  rot: number
  scale: number
  tone: number
  region: number
  initial: boolean
  delay: number
}

export interface Blossom {
  x: number
  y: number
  region: number
  kind: 'rose' | 'gold'
  scale: number
  delay: number
}

export interface TreeModel {
  branches: Segment[]
  roots: Segment[]
  leaves: Leaf[]
  blossoms: Blossom[]
  hotspots: Array<{ x: number; y: number }>
}

interface RawSeg {
  x1: number
  y1: number
  cx: number
  cy: number
  x2: number
  y2: number
  width: number
  depth: number
  angle: number
  tip: boolean
}

const MAX_DEPTH = 6
export const TRUNK_TOP = GROUND_Y - 92

/**
 * Ocho brotes, cada uno con su rótulo en una zona libre del dibujo
 * (arriba de la copa o entre la copa y el suelo), unido por una línea de
 * tinta como en las láminas botánicas. Así las palabras nunca se pisan.
 *   target: dónde buscar la rama   label: dónde va el rótulo
 */
export interface Slot {
  target: [number, number]
  label: [number, number]
  align: 'start' | 'middle' | 'end'
  /** El rótulo queda arriba o abajo del punto `label` */
  side: 'above' | 'below'
}

export const SLOTS: Slot[] = [
  { target: [104, 118], label: [70, 52], align: 'middle', side: 'above' },
  { target: [168, 84], label: [158, 22], align: 'middle', side: 'above' },
  { target: [234, 84], label: [242, 22], align: 'middle', side: 'above' },
  { target: [298, 118], label: [330, 52], align: 'middle', side: 'above' },
  { target: [58, 232], label: [16, 300], align: 'start', side: 'below' },
  { target: [128, 214], label: [62, 334], align: 'start', side: 'below' },
  { target: [344, 232], label: [384, 300], align: 'end', side: 'below' },
  { target: [272, 214], label: [338, 334], align: 'end', side: 'below' },
]

function growCrown(rand: () => number): RawSeg[] {
  const segs: RawSeg[] = []
  const spreads = [0, 0.52, 0.48, 0.44, 0.4, 0.38, 0.36]

  const rec = (x: number, y: number, angle: number, len: number, width: number, depth: number) => {
    const x2 = x + Math.cos(angle) * len
    const y2 = y + Math.sin(angle) * len
    const bend = (rand() - 0.5) * len * 0.3
    const cx = (x + x2) / 2 + Math.cos(angle + Math.PI / 2) * bend
    const cy = (y + y2) / 2 + Math.sin(angle + Math.PI / 2) * bend
    const tip = depth === MAX_DEPTH
    segs.push({ x1: x, y1: y, cx, cy, x2, y2, width, depth, angle, tip })
    if (tip) return

    const kids = 2
    const spread = spreads[depth] * (0.8 + rand() * 0.4)
    for (let i = 0; i < kids; i++) {
      let a = angle + (i === 0 ? -spread : spread) * (0.8 + rand() * 0.4)
      // Las ramas buscan la luz: curvan hacia arriba y forman una cúpula
      a = lerp(a, -Math.PI / 2, depth >= 2 ? 0.16 : 0.06)
      const l = len * (0.72 + rand() * 0.1)
      rec(x2, y2, a, l, Math.max(0.65, width * 0.62), depth + 1)
    }
  }

  // Cinco ramas maestras en abanico desde lo alto del tronco
  const baseX = TREE_W / 2
  const limbs = [-0.89, -0.72, -0.5, -0.28, -0.11]
  limbs.forEach((k, i) => {
    const side = Math.abs(k + 0.5) * 2
    const a = Math.PI * k + (rand() - 0.5) * 0.08
    rec(baseX + (i - 2) * 1.6, TRUNK_TOP + Math.abs(i - 2) * 3, a, 62 + side * 22, 6.2 - side * 1.4, 1)
  })
  return segs
}

function growRoots(rand: () => number): RawSeg[] {
  const segs: RawSeg[] = []
  const rec = (x: number, y: number, angle: number, len: number, width: number, depth: number) => {
    const x2 = x + Math.cos(angle) * len
    const y2 = y + Math.sin(angle) * len * 0.62
    const bend = (rand() - 0.5) * len * 0.4
    const cx = (x + x2) / 2 + Math.cos(angle + Math.PI / 2) * bend
    const cy = (y + y2) / 2 + Math.sin(angle + Math.PI / 2) * bend * 0.6
    segs.push({ x1: x, y1: y, cx, cy, x2, y2, width, depth, angle, tip: depth === 5 })
    if (depth === 5) return
    const kids = depth < 2 ? 2 : rand() < 0.5 ? 2 : 1
    for (let i = 0; i < kids; i++) {
      const off = kids === 1 ? (rand() - 0.5) * 0.5 : (i === 0 ? -1 : 1) * (0.32 + rand() * 0.18)
      let a = angle + off
      a = Math.min(Math.PI * 0.94, Math.max(Math.PI * 0.06, a))
      rec(x2, y2, a, len * (0.72 + rand() * 0.12), Math.max(0.6, width * 0.62), depth + 1)
    }
  }
  const baseX = TREE_W / 2
  const starts = [0.16, 0.36, 0.52, 0.68, 0.86]
  for (const s of starts) {
    rec(baseX + (s - 0.5) * 16, GROUND_Y + 1, Math.PI * s, 40 + rand() * 12, 3.6, 1)
  }
  return segs
}

const path = (s: RawSeg) =>
  `M${s.x1.toFixed(1)} ${s.y1.toFixed(1)}Q${s.cx.toFixed(1)} ${s.cy.toFixed(1)} ${s.x2.toFixed(1)} ${s.y2.toFixed(1)}`

/** Escala la copa para que entre en el lienzo, anclada en la base del tronco. */
function fitCrown(segs: RawSeg[]) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  for (const s of segs) {
    minX = Math.min(minX, s.x2, s.x1)
    maxX = Math.max(maxX, s.x2, s.x1)
    minY = Math.min(minY, s.y2, s.y1)
  }
  const ox = TREE_W / 2
  const oy = TRUNK_TOP
  const sx = (TREE_W / 2 - 22) / Math.max(ox - minX, maxX - ox)
  const k = sx
  // La copa se estira un poco en vertical para ocupar el lienzo (con tope, para no deformarla)
  const ky = Math.min(k * 1.38, (oy - 70) / (oy - minY))
  const fx = (x: number) => ox + (x - ox) * k
  const fy = (y: number) => oy + (y - oy) * ky
  for (const s of segs) {
    s.x1 = fx(s.x1)
    s.x2 = fx(s.x2)
    s.cx = fx(s.cx)
    s.y1 = fy(s.y1)
    s.y2 = fy(s.y2)
    s.cy = fy(s.cy)
    s.width *= Math.max(0.8, k)
  }
}

export function buildTree(seed = 20261103): TreeModel {
  const rand = seeded(seed)
  const crown = growCrown(rand)
  fitCrown(crown)
  const roots = growRoots(rand)

  // Ajustar cada punto de interés al extremo de rama más cercano (profundidad 3–5)
  const joints = crown.filter((s) => s.depth >= 3 && s.depth <= 5)
  const hotspots = SLOTS.map(({ target: [tx, ty] }) => {
    let best = joints[0]
    let bestD = Infinity
    for (const j of joints) {
      const d = (j.x2 - tx) ** 2 + (j.y2 - ty) ** 2
      if (d < bestD) {
        bestD = d
        best = j
      }
    }
    return { x: best.x2, y: best.y2 }
  })

  const regionOf = (x: number, y: number) => {
    let r = 0
    let bestD = Infinity
    hotspots.forEach((h, i) => {
      const d = (h.x - x) ** 2 + (h.y - y) ** 2
      if (d < bestD) {
        bestD = d
        r = i
      }
    })
    return r
  }

  const branches: Segment[] = crown.map((s) => ({
    d: path(s),
    width: s.width,
    depth: s.depth,
    region: s.depth >= 4 ? regionOf(s.x2, s.y2) : -1,
  }))

  const leaves: Leaf[] = []
  const blossoms: Blossom[] = []
  const tips = crown.filter((s) => s.tip || (s.depth >= 4 && rand() < 0.45))
  for (const t of tips) {
    const region = regionOf(t.x2, t.y2)
    const count = t.tip ? 2 : 1
    for (let i = 0; i < count; i++) {
      const along = t.tip ? [1, 0.55][i] : 0.75
      // Punto sobre la curva cuadrática
      const u = along
      const x = (1 - u) ** 2 * t.x1 + 2 * (1 - u) * u * t.cx + u * u * t.x2
      const y = (1 - u) ** 2 * t.y1 + 2 * (1 - u) * u * t.cy + u * u * t.y2
      const side = i === 0 ? (rand() - 0.5) * 0.6 : rand() < 0.5 ? 0.95 : -0.95
      leaves.push({
        x,
        y,
        rot: ((t.angle + side + (rand() - 0.5) * 0.5) * 180) / Math.PI,
        scale: 0.85 + rand() * 0.55,
        tone: Math.floor(rand() * 5),
        region,
        initial: false,
        delay: Math.round(rand() * 700),
      })
    }
  }

  // Pocas hojas visibles al principio, repartidas en toda la copa
  const byRegion = new Map<number, Leaf[]>()
  for (const l of leaves) {
    const list = byRegion.get(l.region) ?? []
    list.push(l)
    byRegion.set(l.region, list)
  }
  for (const list of byRegion.values()) {
    const n = Math.max(2, Math.round(list.length * 0.1))
    for (let i = 0; i < n; i++) list[Math.floor(rand() * list.length)].initial = true
  }

  // Flores que aparecen cuando el árbol termina de crecer
  for (const list of byRegion.values()) {
    const picks = 3
    for (let i = 0; i < picks; i++) {
      const l = list[Math.floor(rand() * list.length)]
      blossoms.push({
        x: l.x + (rand() - 0.5) * 6,
        y: l.y + (rand() - 0.5) * 6,
        region: l.region,
        kind: rand() < 0.62 ? 'rose' : 'gold',
        scale: 0.8 + rand() * 0.5,
        delay: Math.round(300 + rand() * 1400),
      })
    }
  }

  return {
    branches,
    roots: roots.map((s) => ({ d: path(s), width: s.width, depth: s.depth, region: -1 })),
    leaves,
    blossoms,
    hotspots,
  }
}
