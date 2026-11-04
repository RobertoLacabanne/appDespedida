import { memo, useId, useMemo } from 'react'
import { buildTree, GROUND_Y, TREE_H, TREE_W, TRUNK_TOP, type TreeModel } from '../../lib/tree'

/** Aguadas para las hojas: variaciones de salvia y alguna hoja dorada */
const LEAF_TONES = ['fill-sage', 'fill-sage-soft', 'fill-sage-deep', 'fill-sage', 'fill-gold-soft']
const LEAF = 'M0 0C2.6-3.5 8.6-4 12.4 0C8.6 4 2.6 3.5 0 0Z'
const T = TRUNK_TOP
const G = GROUND_Y
const TRUNK = `M183 ${G + 1}C190 ${G - 3} 193.5 ${G - 14} 194 ${G - 30}C194.6 ${G - 52} 193 ${T + 26} 195.6 ${T}L204.6 ${T}C206.8 ${T + 24} 205.6 ${G - 52} 206.2 ${G - 30}C206.6 ${G - 14} 210 ${G - 3} 217 ${G + 1}Z`

let cached: TreeModel | null = null
export const getTreeModel = () => (cached ??= buildTree())

interface TreeProps {
  /** Qué regiones de la copa ya se descubrieron (8) */
  revealed: boolean[]
  /** Todas descubiertas: florece */
  complete: boolean
  /** 'mini' = versión quieta y completa para la escena final */
  variant?: 'grow' | 'mini'
  className?: string
}

export const Tree = memo(function Tree({ revealed, complete, variant = 'grow', className }: TreeProps) {
  const model = useMemo(getTreeModel, [])
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const count = revealed.filter(Boolean).length
  const mini = variant === 'mini'
  // Las raíces se van profundizando a medida que se descubren palabras
  const rootLevel = mini ? 5 : 1 + Math.ceil((count / revealed.length) * 4)

  return (
    <svg
      viewBox={`0 0 ${TREE_W} ${TREE_H}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <defs>
        <radialGradient id={`crown-wash-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-sage-soft)" stopOpacity="0.95" />
          <stop offset="62%" stopColor="var(--color-sage-mist)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--color-sage-mist)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`gold-wash-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-gold-light)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-gold-light)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`soil-${uid}`} cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="var(--color-sand)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--color-paper-deep)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-paper-deep)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aguada de la copa: se intensifica con cada descubrimiento */}
      <ellipse
        cx={TREE_W / 2}
        cy={182}
        rx={200}
        ry={182}
        fill={`url(#crown-wash-${uid})`}
        style={{
          opacity: mini ? 0.7 : 0.25 + count * 0.085,
          transition: 'opacity 1.4s var(--ease-soft)',
        }}
      />
      {complete && !mini && (
        <ellipse
          cx={TREE_W / 2}
          cy={170}
          rx={170}
          ry={150}
          fill={`url(#gold-wash-${uid})`}
          opacity={0.7}
          className="motion-loop animate-[glow-pulse_5s_ease-in-out_infinite]"
        />
      )}

      {/* Tierra y raíces */}
      {!mini && (
        <path
          d={`M4 ${GROUND_Y}A196 ${TREE_H - GROUND_Y} 0 0 0 396 ${GROUND_Y}Z`}
          fill={`url(#soil-${uid})`}
        />
      )}
      <g className="stroke-ink-soft" fill="none" strokeLinecap="round" opacity={0.6}>
        {model.roots.map((r, i) => {
          const visible = r.depth <= rootLevel
          return (
            <path
              key={i}
              d={r.d}
              strokeWidth={r.width}
              pathLength={1}
              strokeDasharray="1 1"
              style={{
                strokeDashoffset: visible ? 0 : 1,
                transition: mini ? undefined : `stroke-dashoffset 1.6s var(--ease-soft) ${(r.depth - 1) * 120}ms`,
              }}
            />
          )
        })}
      </g>

      {/* Línea de tierra, dibujada a mano */}
      <path
        d={`M16 ${GROUND_Y + 1}C70 ${GROUND_Y - 3} 120 ${GROUND_Y + 4} 200 ${GROUND_Y}S330 ${GROUND_Y - 2} 384 ${GROUND_Y + 2}`}
        className="stroke-ink"
        strokeWidth={1.1}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />

      {/* Ramas */}
      <g className="stroke-ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {model.branches.map((b, i) => {
          const alive = mini || b.region < 0 || revealed[b.region]
          return (
            <path
              key={i}
              d={b.d}
              strokeWidth={b.width}
              style={{
                strokeOpacity: alive ? 0.92 : 0.38,
                transition: 'stroke-opacity 1.2s var(--ease-soft)',
              }}
            />
          )
        })}
      </g>

      {/* Tronco: forma afinada con base ensanchada */}
      <path d={TRUNK} className="fill-ink" />
      <g fill="none" className="stroke-paper" strokeLinecap="round" opacity={0.45} strokeWidth={0.7}>
        <path d={`M197 ${GROUND_Y - 8}C195 ${GROUND_Y - 40} 198 ${TRUNK_TOP + 30} 197 ${TRUNK_TOP + 8}`} />
        <path d={`M203.5 ${GROUND_Y - 16}C203 ${GROUND_Y - 44} 202 ${TRUNK_TOP + 40} 203 ${TRUNK_TOP + 18}`} />
      </g>

      {/* Hojas */}
      <g>
        {model.leaves.map((l, i) => {
          const visible = mini || l.initial || revealed[l.region]
          return (
            <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(0)}) scale(${l.scale.toFixed(2)})`}>
              <g
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: '0% 50%',
                  transform: visible ? 'scale(1)' : 'scale(0)',
                  transition: mini ? undefined : `transform 900ms var(--ease-soft) ${visible ? l.delay : 0}ms`,
                }}
              >
                <path d={LEAF} transform="translate(0.9 0.9)" className={LEAF_TONES[l.tone]} opacity={0.9} />
                <path d={LEAF} fill="none" className="stroke-ink" strokeWidth={0.55} opacity={0.75} />
              </g>
            </g>
          )
        })}
      </g>

      {/* Floración final */}
      <g>
        {model.blossoms.map((b, i) => {
          const visible = complete
          return (
            <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) scale(${b.scale.toFixed(2)})`}>
              <g
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: '50% 50%',
                  transform: visible ? 'scale(1)' : 'scale(0)',
                  transition: mini ? undefined : `transform 1s var(--ease-soft) ${visible ? b.delay : 0}ms`,
                }}
              >
                {b.kind === 'rose' ? (
                  <>
                    {[0, 72, 144, 216, 288].map((a) => (
                      <circle
                        key={a}
                        cx={Math.cos((a * Math.PI) / 180) * 2.6}
                        cy={Math.sin((a * Math.PI) / 180) * 2.6}
                        r={2.4}
                        className="fill-rose-soft stroke-rose-deep"
                        strokeWidth={0.5}
                      />
                    ))}
                    <circle r={1.3} className="fill-gold" />
                  </>
                ) : (
                  <circle r={2.4} className="fill-gold-soft stroke-gold-deep" strokeWidth={0.5} />
                )}
              </g>
            </g>
          )
        })}
      </g>
    </svg>
  )
})
