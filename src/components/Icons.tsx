import type { SVGProps } from 'react'

/** Íconos lineales propios, mismo trazo que las ilustraciones (1.5, puntas redondas). */
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
})

export const ArrowRight = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 12h15" />
    <path d="M13.5 6.5 19 12l-5.5 5.5" />
  </svg>
)

export const ArrowLeft = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M20 12H5" />
    <path d="M10.5 6.5 5 12l5.5 5.5" />
  </svg>
)

export const SoundOn = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 9.5h3l4.5-4v13L7 14.5H4z" />
    <path d="M15.5 9a4 4 0 0 1 0 6" />
    <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
)

export const SoundOff = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 9.5h3l4.5-4v13L7 14.5H4z" />
    <path d="m16 9.5 5 5" />
    <path d="m21 9.5-5 5" />
  </svg>
)

export const ShareIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 15V3.5" />
    <path d="M7.5 8 12 3.5 16.5 8" />
    <path d="M8 11H6a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 18 11h-2" />
  </svg>
)

export const LinkIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M10 14a4 4 0 0 0 5.7.3l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2" />
    <path d="M14 10a4 4 0 0 0-5.7-.3l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2" />
  </svg>
)

export const ChatIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6z" />
  </svg>
)

export const Wind = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M3 9h11a2.5 2.5 0 1 0-2.5-2.5" />
    <path d="M3 13h15a2.5 2.5 0 1 1-2.5 2.5" />
    <path d="M3 17h6" />
  </svg>
)

export const Restart = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.5 4v3.5H8" />
  </svg>
)
