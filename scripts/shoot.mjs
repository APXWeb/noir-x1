// QA capture: visits each pose anchor and screenshots it, then tiles a contact sheet.
// usage: node scripts/shoot.mjs [baseUrl] [outDir] [width] [height] [poses,comma] [--mobile]
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { execSync } from 'node:child_process'

const [base = 'http://localhost:5173', out = '.impeccable/review/poses', w = '1440', h = '900', only = ''] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const mobile = process.argv.includes('--mobile')
const reduced = process.argv.includes('--reduced')
await mkdir(out, { recursive: true })

const browser = await chromium.launch({ args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11'] })
const ctx = await browser.newContext({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: mobile ? 2 : 1,
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: reduced ? 'reduce' : 'no-preference',
  locale: 'en-US',
})
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await page.goto(`${base}/?quality=high`)
await page.waitForFunction(() => !document.querySelector('[role="status"]'), null, { timeout: 60_000 })
await page.waitForTimeout(2500)

const names = await page.evaluate(() => [...document.querySelectorAll('[data-pose]')].map((e) => e.dataset.pose))
const list = only ? names.filter((n) => only.split(',').includes(n)) : names
let i = 0
for (const n of list) {
  await page.evaluate((n) => {
    const el = document.querySelector(`[data-pose="${n}"]`)
    const r = el.getBoundingClientRect()
    window.scrollTo(0, r.top + window.scrollY + r.height / 2 - window.innerHeight / 2)
  }, n)
  await page.waitForTimeout(2400)
  await page.screenshot({ path: `${out}/${String(i++).padStart(2, '0')}.png` })
  console.log('shot', n)
}
await browser.close()
if (list.length > 1) {
  execSync(`ffmpeg -v error -y -start_number 0 -i ${out}/%02d.png -vf "scale=${mobile ? 240 : 480}:-1,tile=${mobile ? 6 : 4}x${Math.ceil(list.length / (mobile ? 6 : 4))}:padding=4" -frames:v 1 ${out}/sheet.png`)
}
console.log('poses:', list.join(', '))
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors')
