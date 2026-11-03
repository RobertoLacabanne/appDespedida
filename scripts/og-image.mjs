/**
 * Genera public/og-image.jpg (vista previa para WhatsApp) y
 * public/apple-touch-icon.png a partir de la app.
 *
 * Requiere Playwright:  npm i -D playwright && npx playwright install chromium
 * Uso: con `npm run dev` andando en otra terminal →  npm run og
 */
import { chromium } from 'playwright'

const base = process.env.OG_BASE ?? 'http://localhost:5173/'
const browser = await chromium.launch()

const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(`${base}?og-card`, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1500)
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 86 })

const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 })
await icon.goto(`${base}favicon.svg`)
await icon.setContent(
  `<html><body style="margin:0;background:#f7efe2"><img src="${base}favicon.svg" width="180" height="180" style="display:block"></body></html>`,
)
await icon.waitForTimeout(400)
await icon.screenshot({ path: 'public/apple-touch-icon.png' })

await browser.close()
console.log('Listo: public/og-image.jpg y public/apple-touch-icon.png')
