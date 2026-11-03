import { experience } from './config/experience'
import { OpenCircle } from './components/illustrations/OpenCircle'
import { Tree } from './components/illustrations/Tree'
import { Sunflower } from './components/illustrations/Sunflower'
import { OliveBranch } from './components/illustrations/OliveBranch'
import { Rose } from './components/illustrations/Rose'
import { Butterfly } from './components/illustrations/Butterfly'
import { listJoin } from './lib/text'

/**
 * Tarjeta de vista previa (1200×630) para WhatsApp y redes.
 * Solo se usa para generar public/og-image.jpg con `npm run og`.
 * Composición centrada: si WhatsApp la recorta en cuadrado, el círculo queda entero.
 */
export default function OgCard() {
  const ALL = Array(8).fill(true)
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1200,
        height: 630,
        background:
          'radial-gradient(70% 90% at 50% 40%, #fbf1df 0%, #f7e2c2 45%, #f1c9a0 80%, #eab48d 100%)',
      }}
    >
      <div className="absolute left-1/2 top-[34px] aspect-square w-[400px] -translate-x-1/2">
        <div
          className="absolute inset-[9%] overflow-hidden rounded-full"
          style={{ background: 'linear-gradient(180deg, #fbf1df 0%, #f8dcb2 42%, var(--color-peach) 66%, var(--color-apricot) 84%)' }}
        >
          <div
            className="absolute left-1/2 top-[64%] aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 42%, #fffaf0 0%, var(--color-gold-light) 50%, var(--color-amber) 100%)',
              boxShadow: '0 0 40px 8px rgb(255 226 170 / 0.6)',
            }}
          />
          <svg className="absolute inset-x-0 bottom-0 h-[34%] w-full" viewBox="0 0 100 34" preserveAspectRatio="none">
            <path d="M0 10C20 4 40 6 56 9S84 6 100 8V34H0Z" className="fill-sage-soft" />
            <path d="M0 18C24 12 44 16 64 15S88 12 100 16V34H0Z" className="fill-sage" opacity={0.75} />
          </svg>
          <div className="absolute bottom-[14%] left-1/2 w-[58%] -translate-x-1/2">
            <Tree revealed={ALL} complete variant="mini" className="w-full" />
          </div>
        </div>
        <OpenCircle drawn duration={1} gap={38} gapAt={40} strokeWidth={1.5} className="absolute inset-0 h-full w-full" />
        <div className="absolute left-[-4%] top-[28%] w-[17%] rotate-[-14deg]">
          <OliveBranch className="w-full" />
        </div>
        <div className="absolute left-[2%] top-[64%] w-[22%]">
          <Sunflower className="w-full" />
        </div>
        <div className="absolute left-[21%] top-[80%] w-[15%] rotate-[-8deg]">
          <Rose className="w-full" />
        </div>
        <div className="absolute left-[74%] top-[-3%] w-[15%] rotate-[18deg]">
          <Butterfly flapping={false} className="w-full" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[38px] text-center">
        <p className="font-display text-[64px] leading-none text-ink">{experience.meta.title}</p>
        <p className="font-display mt-3 text-[22px] italic text-ink-soft">Para {listJoin(experience.recipients)}</p>
      </div>
      <div className="paper-grain" style={{ position: 'absolute' }} />
    </div>
  )
}
