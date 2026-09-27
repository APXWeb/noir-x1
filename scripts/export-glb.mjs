// Builds public/models/noir-x1.glb from the procedural source (src/three/watch).
// 1. serve the dev export page with Vite, 2. serialise in Chromium, 3. optimise.
import { createServer } from 'vite'
import { chromium } from '@playwright/test'
import { mkdir, writeFile, stat } from 'node:fs/promises'
import { execSync } from 'node:child_process'

const RAW = 'scripts/.cache/noir-x1.raw.glb'
const OUT = 'public/models/noir-x1.glb'

const server = await createServer({ server: { port: 5199 }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
try {
  const page = await browser.newPage()
  page.on('console', (m) => m.type() === 'error' && console.error('[page]', m.text()))
  await page.goto('http://localhost:5199/export.html')
  await page.waitForFunction(() => window.__glb || window.__glbError, null, { timeout: 120_000 })
  const { glb, err, nodes } = await page.evaluate(() => ({ glb: window.__glb, err: window.__glbError, nodes: window.__nodes }))
  if (err) throw new Error(err)
  await mkdir('scripts/.cache', { recursive: true })
  await mkdir('public/models', { recursive: true })
  await writeFile(RAW, Buffer.from(glb, 'base64'))
  console.log('nodes:', nodes.filter(Boolean).join(', '))
} finally {
  await browser.close()
  await server.close()
}

execSync(`npx gltf-transform optimize ${RAW} ${OUT} --compress meshopt --texture-compress webp --texture-size 2048 --simplify false --join false --instance false --flatten false --palette false`, { stdio: 'inherit' })
const [a, b] = await Promise.all([stat(RAW), stat(OUT)])
console.log(`raw ${(a.size / 1024).toFixed(0)} KB → optimised ${(b.size / 1024).toFixed(0)} KB`)
