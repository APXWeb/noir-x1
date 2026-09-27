// Renders studio stills of the real NOIR X1 model (no third-party imagery):
//  - Story imagery: crown, caseback, dial
//  - No-WebGL fallback: one frame per scroll pose, desktop and mobile
// Runs against the Vite dev server via the ?still=<pose> route.
import { createServer } from 'vite'
import { chromium } from '@playwright/test'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { execSync } from 'node:child_process'

const OUT = 'public/stills'
const TMP = 'scripts/.cache/stills'
await mkdir(OUT, { recursive: true })
await mkdir(TMP, { recursive: true })

const story = [
  ['crown', 'still-crown', 900, 1200],
  ['caseback', 'still-caseback', 1600, 1000],
  ['dial', 'still-dial', 900, 1200],
]
const poses = ['hero', 'approach', 'rotate', 'detail', 'profile', 'eng-case', 'eng-sapphire', 'eng-movement', 'eng-water', 'materials', 'reveal', 'x1', 'x2', 'x3', 'finale']
const jobs = [
  ...story.map(([name, pose, w, h]) => ({ name, pose, w, h, q: 82 })),
  ...poses.map((p) => ({ name: `pose-${p}`, pose: p, w: 1440, h: 900, q: 70 })),
  ...poses.map((p) => ({ name: `pose-${p}-m`, pose: p, w: 430, h: 932, q: 70 })),
]

const server = await createServer({ server: { port: 5198 }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch({ args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11'] })
try {
  for (const j of jobs) {
    const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: j.w < 600 ? 2 : 1.5 })
    // Collection variants are set from the pose's variant field by the app; do it directly here.
    const variant = ['x2', 'x3'].includes(j.pose) ? j.pose : 'x1'
    await page.goto(`http://localhost:5198/?still=${j.pose}&variant=${variant}`)
    await page.waitForFunction(() => window.__stillReady === true, null, { timeout: 90_000 })
    const png = `${TMP}/${j.name}.png`
    await page.screenshot({ path: png })
    execSync(`ffmpeg -v error -y -i ${png} -c:v libwebp -quality ${j.q} -compression_level 6 ${OUT}/${j.name}.webp`)
    console.log('still', j.name)
    await page.close()
  }
} finally {
  await browser.close()
  await server.close()
}

await writeFile(
  `${OUT}/PROVENANCE.md`,
  `# Stills provenance\n\nEvery image in this folder is a real-time render of the procedural NOIR X1 model\n(src/three/watch/buildWatch.ts → public/models/noir-x1.glb), captured by\n\`scripts/capture-stills.mjs\` through the \`?still=<pose>\` route and encoded to WebP with ffmpeg.\nNo photography, stock imagery, third-party models or HDRIs are used.\n`,
)
await rm(TMP, { recursive: true, force: true })
