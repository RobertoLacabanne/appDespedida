import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { experience } from './src/config/experience.ts'

/**
 * Inyecta en index.html los metadatos de la vista previa (WhatsApp, Telegram,
 * redes) a partir de la configuración central. WhatsApp exige URLs absolutas
 * para la imagen: por eso hace falta definir VITE_SITE_URL al publicar.
 */
function previewMeta(siteUrl: string): Plugin {
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const base = siteUrl.replace(/\/+$/, '')
  const abs = (p: string) => (base ? `${base}${p}` : `.${p}`)
  return {
    name: 'preview-meta',
    transformIndexHtml(html) {
      const { title, previewDescription, themeColor } = experience.meta
      const tags = [
        `<title>${escape(title)}</title>`,
        `<meta name="description" content="${escape(previewDescription)}" />`,
        `<meta name="theme-color" content="${themeColor}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="es_AR" />`,
        `<meta property="og:title" content="${escape(title)}" />`,
        `<meta property="og:description" content="${escape(previewDescription)}" />`,
        `<meta property="og:image" content="${abs('/og-image.jpg')}" />`,
        `<meta property="og:image:type" content="image/jpeg" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${escape(`${title}. Un árbol al atardecer dentro de un círculo de luz que queda abierto.`)}" />`,
        base ? `<meta property="og:url" content="${base}/" />` : '',
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${escape(title)}" />`,
        `<meta name="twitter:description" content="${escape(previewDescription)}" />`,
        `<meta name="twitter:image" content="${abs('/og-image.jpg')}" />`,
      ]
        .filter(Boolean)
        .join('\n    ')
      return html.replace('<!--preview-meta-->', tags)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    plugins: [react(), tailwindcss(), previewMeta(env.VITE_SITE_URL ?? '')],
    build: {
      target: 'es2020',
      cssTarget: ['safari15', 'chrome100'],
      assetsInlineLimit: 2048,
    },
    server: { host: true },
  }
})
