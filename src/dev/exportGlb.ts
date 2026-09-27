/**
 * Dev-only: builds the procedural X1 and serialises it to GLB.
 * Driven by scripts/export-glb.mjs through Playwright; never shipped.
 */
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/geist-mono'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { buildWatch } from '../three/watch/buildWatch'

declare global {
  interface Window {
    __glb?: string
    __glbError?: string
    __nodes?: string[]
  }
}

async function run() {
  await Promise.all([
    document.fonts.load('640 64px "Archivo Variable"'),
    document.fonts.load('500 64px "Geist Mono Variable"'),
  ])
  const { root } = buildWatch()
  root.updateMatrixWorld(true)
  const names: string[] = []
  root.traverse((o) => names.push(o.name))
  window.__nodes = names
  const exporter = new GLTFExporter()
  const result = (await exporter.parseAsync(root, { binary: true, onlyVisible: false, maxTextureSize: 2048 })) as ArrayBuffer
  const bytes = new Uint8Array(result)
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  window.__glb = btoa(bin)
}

run().catch((e: unknown) => {
  window.__glbError = String(e instanceof Error ? e.stack : e)
})
