import * as THREE from 'three'

/**
 * Procedural canvas textures for the X1. Everything here is authored in code,
 * so the model carries no third-party imagery.
 */

export type DialStyle = 'calibre' | 'meridian' | 'abyss'
export type BezelStyle = 'calibre' | 'meridian' | 'abyss'

const DISPLAY = '"Archivo Variable", "Archivo", sans-serif'
const MONO = '"Geist Mono Variable", "Geist Mono", ui-monospace, monospace'

function canvas(w: number, h = w) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  return { c, ctx }
}

function toTexture(c: HTMLCanvasElement, opts: { srgb?: boolean; name: string; repeat?: [number, number] }) {
  const t = new THREE.CanvasTexture(c)
  t.name = opts.name
  t.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace
  t.anisotropy = 8
  if (opts.repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(opts.repeat[0], opts.repeat[1])
  }
  t.needsUpdate = true
  return t
}

function setFont(ctx: CanvasRenderingContext2D, weight: number, px: number, family = DISPLAY, stretch: CanvasFontStretch = 'normal') {
  ctx.font = `${weight} ${px}px ${family}`
  if ('fontStretch' in ctx) ctx.fontStretch = stretch
}

/** Draws text along an arc centred on `angle` (radians, 0 = 12 o'clock, clockwise). */
function arcText(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, r: number, angle: number, tracking: number, inward = true) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width + tracking)
  const total = widths.reduce((a, b) => a + b, 0) - tracking
  let a = angle - (inward ? 1 : -1) * (total / 2) / r
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ;[...text].forEach((ch, i) => {
    const w = widths[i]
    const mid = a + (inward ? 1 : -1) * (w - tracking) / 2 / r
    ctx.save()
    ctx.translate(cx + Math.sin(mid) * r, cy - Math.cos(mid) * r)
    ctx.rotate(inward ? mid : mid + Math.PI)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
    a += (inward ? 1 : -1) * w / r
  })
  ctx.restore()
}

/* ------------------------------------------------------------------ dial */

const DIAL_PALETTE: Record<DialStyle, { base: string; edge: string; print: string; faint: string }> = {
  calibre: { base: '#1d1f22', edge: '#121315', print: '#e7e3dc', faint: 'rgba(231,227,220,0.42)' },
  meridian: { base: '#dcd7cd', edge: '#bdb7ab', print: '#17181a', faint: 'rgba(23,24,26,0.5)' },
  abyss: { base: '#0b0c0d', edge: '#050505', print: '#ecE8e1', faint: 'rgba(236,232,225,0.38)' },
}

/**
 * Dial print. Mapped to a CircleGeometry, so the canvas centre is the dial
 * centre and the canvas edge is the dial edge (radius 1.64 units).
 */
export function createDialTexture(style: DialStyle = 'calibre', size = 2048) {
  const { c, ctx } = canvas(size)
  const p = DIAL_PALETTE[style]
  const cx = size / 2
  const R = size / 2

  // Base with a very soft vignette towards the rehaut.
  const g = ctx.createRadialGradient(cx, cx, R * 0.1, cx, cx, R)
  g.addColorStop(0, p.base)
  g.addColorStop(0.82, p.base)
  g.addColorStop(1, p.edge)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  // Sunray grain: hair-fine radial strokes, barely visible in colour; the
  // anisotropic highlight does the real work.
  ctx.save()
  ctx.translate(cx, cx)
  for (let i = 0; i < 1440; i++) {
    const a = (i / 1440) * Math.PI * 2
    ctx.strokeStyle = i % 2 ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.03)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(Math.sin(a) * R * 0.06, -Math.cos(a) * R * 0.06)
    ctx.lineTo(Math.sin(a) * R, -Math.cos(a) * R)
    ctx.stroke()
  }
  ctx.restore()

  // Inner chapter ring: 240 fine divisions (quarter seconds, a nod to 4 Hz),
  // just inside the applied indices.
  const rTrack = R * 0.955
  ctx.save()
  ctx.translate(cx, cx)
  for (let i = 0; i < 240; i++) {
    const a = (i / 240) * Math.PI * 2
    const major = i % 4 === 0
    const len = major ? R * 0.028 : R * 0.014
    ctx.strokeStyle = major ? p.print : p.faint
    ctx.lineWidth = major ? size * 0.0016 : size * 0.0009
    ctx.beginPath()
    ctx.moveTo(Math.sin(a) * rTrack, -Math.cos(a) * rTrack)
    ctx.lineTo(Math.sin(a) * (rTrack - len), -Math.cos(a) * (rTrack - len))
    ctx.stroke()
  }
  ctx.restore()

  // Wordmark under 12.
  ctx.fillStyle = p.print
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  setFont(ctx, 640, size * 0.048, DISPLAY, 'expanded')
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${size * 0.012}px`
  ctx.fillText('NOIR', cx + size * 0.006, cx - R * 0.44)

  // Signature line at 6.
  setFont(ctx, 560, size * 0.022, DISPLAY, 'expanded')
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${size * 0.006}px`
  const model = style === 'calibre' ? 'X1 CALIBRE' : style === 'meridian' ? 'X2 MERIDIAN' : 'X3 ABYSS'
  ctx.fillText(model, cx, cx + R * 0.4)
  setFont(ctx, 420, size * 0.0135, MONO)
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${size * 0.003}px`
  ctx.fillStyle = p.faint
  ctx.fillText(style === 'abyss' ? 'AUTOMÁTICO · 300 M' : 'AUTOMÁTICO · 100 M', cx, cx + R * 0.47)

  // Meridian: printed 24-hour inner track.
  if (style === 'meridian') {
    setFont(ctx, 500, size * 0.018, MONO)
    ctx.fillStyle = p.faint
    for (let h = 0; h < 24; h += 2) {
      const a = (h / 24) * Math.PI * 2
      ctx.save()
      ctx.translate(cx + Math.sin(a) * R * 0.63, cx - Math.cos(a) * R * 0.63)
      ctx.fillText(String(h === 0 ? 24 : h).padStart(2, '0'), 0, 0)
      ctx.restore()
    }
  }

  // Small circular text above 6 — the certification ritual.
  setFont(ctx, 460, size * 0.0115, MONO)
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px'
  ctx.fillStyle = p.faint
  arcText(ctx, 'TESTADO EM SEIS POSIÇÕES', cx, cx, R * 0.86, Math.PI, size * 0.003, false)

  return toTexture(c, { name: `dial-${style}` })
}

/**
 * Anisotropy direction map for a sunray dial: brushing radiates from the
 * centre, so the highlight sweeps as a single bright radial bar.
 */
export function createSunrayAnisotropy(size = 512) {
  const { c, ctx } = canvas(size)
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x + 0.5) / size - 0.5
      const dy = 0.5 - (y + 0.5) / size
      const l = Math.hypot(dx, dy) || 1
      // Tangential direction gives the radial "sunray" streak.
      const tx = -dy / l
      const ty = dx / l
      const i = (y * size + x) * 4
      img.data[i] = (tx * 0.5 + 0.5) * 255
      img.data[i + 1] = (ty * 0.5 + 0.5) * 255
      img.data[i + 2] = 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const t = toTexture(c, { name: 'dial-anisotropy', srgb: false })
  return t
}

/* ----------------------------------------------------------------- bezel */

const BEZEL_INNER = 1.8
const BEZEL_OUTER = 1.98

/** Ceramic bezel insert. Mapped to a RingGeometry with planar UVs. */
export function createBezelTexture(style: BezelStyle = 'calibre', size = 2048) {
  const { c, ctx } = canvas(size)
  const cx = size / 2
  const scale = size / 2 / BEZEL_OUTER
  const rIn = BEZEL_INNER * scale
  const rOut = BEZEL_OUTER * scale
  const mid = (rIn + rOut) / 2
  const base = style === 'meridian' ? '#17181a' : '#0e0f10'
  const ink = style === 'meridian' ? '#d8d3c8' : '#bdb8b0'

  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  if (style === 'meridian') {
    // Two-tone day/night: the night half slightly lighter graphite.
    ctx.beginPath()
    ctx.moveTo(cx, cx)
    ctx.arc(cx, cx, rOut + 4, Math.PI / 2, Math.PI * 1.5)
    ctx.closePath()
    ctx.fillStyle = '#2a2c2f'
    ctx.fill()
  }

  ctx.save()
  ctx.translate(cx, cx)
  ctx.fillStyle = ink
  ctx.strokeStyle = ink
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (style === 'meridian') {
    setFont(ctx, 600, size * 0.03, DISPLAY, 'expanded')
    for (let h = 0; h < 24; h++) {
      const a = (h / 24) * Math.PI * 2
      ctx.save()
      ctx.rotate(a)
      if (h % 2 === 0) {
        ctx.fillText(h === 0 ? '24' : String(h), 0, -mid)
      } else {
        ctx.fillRect(-size * 0.0018, -mid - size * 0.012, size * 0.0036, size * 0.024)
      }
      ctx.restore()
    }
  } else {
    for (let m = 0; m < 60; m++) {
      const a = (m / 60) * Math.PI * 2
      ctx.save()
      ctx.rotate(a)
      const diveZone = style === 'abyss' && m <= 15
      if (m === 0) {
        // 12 o'clock marker: a precise inverted triangle.
        ctx.fillStyle = style === 'abyss' ? '#ff5a1f' : ink
        ctx.beginPath()
        ctx.moveTo(0, -mid + size * 0.022)
        ctx.lineTo(-size * 0.02, -mid - size * 0.018)
        ctx.lineTo(size * 0.02, -mid - size * 0.018)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = ink
      } else if (m % 10 === 0) {
        setFont(ctx, 600, size * 0.034, DISPLAY, 'expanded')
        ctx.fillText(String(m), 0, -mid)
      } else if (m % 5 === 0) {
        ctx.fillRect(-size * 0.0035, -mid - size * 0.018, size * 0.007, size * 0.036)
      } else if (diveZone || style === 'calibre') {
        ctx.fillRect(-size * 0.0015, -mid - size * 0.01, size * 0.003, size * 0.02)
      }
      ctx.restore()
    }
  }
  ctx.restore()
  return toTexture(c, { name: `bezel-${style}` })
}

/* ---------------------------------------------------------------- rehaut */

/** Minute track printed on the inclined flange. u wraps once around. */
export function createRehautTexture(width = 2048, height = 96) {
  const { c, ctx } = canvas(width, height)
  ctx.fillStyle = '#16171a'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#d9d5cd'
  for (let i = 0; i < 60; i++) {
    const x = (i / 60) * width
    const major = i % 5 === 0
    const w = major ? 4 : 2
    const h = major ? height * 0.62 : height * 0.36
    ctx.fillRect(x - w / 2, height - h, w, h)
  }
  const t = toTexture(c, { name: 'rehaut' })
  t.wrapS = THREE.RepeatWrapping
  return t
}

/* -------------------------------------------------------------- caseback */

export function createCasebackTexture(size = 1024) {
  const { c, ctx } = canvas(size)
  const cx = size / 2
  // Ring spans r 1.1 → 1.75; canvas edge = 1.75.
  const scale = size / 2 / 1.75
  ctx.fillStyle = '#8f9397'
  ctx.fillRect(0, 0, size, size)
  // Circular graining.
  for (let r = 1.1 * scale; r < 1.75 * scale; r += 1.5) {
    ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
    ctx.beginPath()
    ctx.arc(cx, cx, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = '#2b2d30'
  setFont(ctx, 520, size * 0.028, MONO)
  const text = 'NOIR X1 · ESPECIFICAÇÃO CONCEITUAL · TITÂNIO GRAU 5 · SAFIRA · 100 M · Nº 001 / 500 · '
  arcText(ctx, text, cx, cx, 1.44 * scale, 0, size * 0.0035, true)
  // Engraved hairlines framing the text band.
  ctx.strokeStyle = 'rgba(30,31,33,0.8)'
  ctx.lineWidth = 2
  for (const r of [1.3, 1.58]) {
    ctx.beginPath()
    ctx.arc(cx, cx, r * scale, 0, Math.PI * 2)
    ctx.stroke()
  }
  return toTexture(c, { name: 'caseback' })
}

/* -------------------------------------------------------------- movement */

/** Côtes de Genève + perlage on a rhodium plate. */
export function createMovementTexture(size = 1024) {
  const { c, ctx } = canvas(size)
  ctx.fillStyle = '#a9adb2'
  ctx.fillRect(0, 0, size, size)
  const stripe = size / 14
  ctx.save()
  ctx.translate(size / 2, size / 2)
  ctx.rotate(-Math.PI / 5)
  for (let i = -14; i < 14; i++) {
    const g = ctx.createLinearGradient(i * stripe, 0, (i + 1) * stripe, 0)
    g.addColorStop(0, '#8e9297')
    g.addColorStop(0.45, '#d4d7da')
    g.addColorStop(0.55, '#c3c6ca')
    g.addColorStop(1, '#8e9297')
    ctx.fillStyle = g
    ctx.fillRect(i * stripe, -size, stripe, size * 2)
  }
  ctx.restore()
  // Perlage near the centre.
  for (let k = 0; k < 90; k++) {
    const a = k * 2.399
    const r = Math.sqrt(k) * size * 0.018
    const x = size / 2 + Math.cos(a) * r
    const y = size / 2 + Math.sin(a) * r
    const g = ctx.createRadialGradient(x, y, 1, x, y, size * 0.02)
    g.addColorStop(0, 'rgba(255,255,255,0.35)')
    g.addColorStop(1, 'rgba(90,95,100,0.2)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, size * 0.02, 0, Math.PI * 2)
    ctx.fill()
  }
  // Engraving on the bridge.
  ctx.fillStyle = '#2e3033'
  setFont(ctx, 560, size * 0.03, MONO)
  ctx.textAlign = 'center'
  ctx.fillText('NOIR CALIBRE N-01', size / 2, size * 0.78)
  setFont(ctx, 420, size * 0.022, MONO)
  ctx.fillText('31 RUBIS · 28.800 A/H · AUTOMÁTICO', size / 2, size * 0.82)
  return toTexture(c, { name: 'movement' })
}

/** Rotor: tungsten-look half disc with fine circular graining. */
export function createRotorTexture(size = 1024) {
  const { c, ctx } = canvas(size)
  ctx.fillStyle = '#3a3c40'
  ctx.fillRect(0, 0, size, size)
  for (let r = 0; r < size / 2; r += 2) {
    ctx.strokeStyle = r % 4 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = '#c9ccd0'
  ctx.textAlign = 'center'
  setFont(ctx, 640, size * 0.05, DISPLAY, 'expanded')
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${size * 0.012}px`
  ctx.fillText('NOIR', size / 2, size * 0.3)
  return toTexture(c, { name: 'rotor' })
}

/* ----------------------------------------------------------------- strap */

/** Height pattern → tangent-space normal map. */
function heightToNormal(src: HTMLCanvasElement, strength = 2) {
  const w = src.width
  const h = src.height
  const sctx = src.getContext('2d')!
  const data = sctx.getImageData(0, 0, w, h).data
  const { c, ctx } = canvas(w, h)
  const out = ctx.createImageData(w, h)
  const H = (x: number, y: number) => data[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (H(x + 1, y) - H(x - 1, y)) * strength
      const dy = (H(x, y + 1) - H(x, y - 1)) * strength
      const nz = 1
      const l = Math.hypot(dx, dy, nz)
      const i = (y * w + x) * 4
      out.data[i] = (-dx / l * 0.5 + 0.5) * 255
      out.data[i + 1] = (dy / l * 0.5 + 0.5) * 255
      out.data[i + 2] = (nz / l * 0.5 + 0.5) * 255
      out.data[i + 3] = 255
    }
  }
  ctx.putImageData(out, 0, 0)
  return c
}

/** FKM rubber strap: fine transverse ribs and a centre channel. u = along strap. */
export function createStrapNormal(w = 1024, h = 256) {
  const { c, ctx } = canvas(w, h)
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, w, h)
  // Transverse ribs.
  for (let x = 0; x < w; x += 8) {
    ctx.fillStyle = '#9a9a9a'
    ctx.fillRect(x, 0, 3, h)
  }
  // A channel down the centre of the top face (v ≈ 0.25 on the profile).
  ctx.fillStyle = '#5a5a5a'
  ctx.fillRect(0, h * 0.2, w, h * 0.02)
  ctx.fillRect(0, h * 0.28, w, h * 0.02)
  const n = heightToNormal(c, 3)
  return toTexture(n, { name: 'strap-normal', srgb: false })
}

/* ---------------------------------------------------------------- carbon */

/** Forged carbon: layered chopped-fibre flakes. Runtime-only variant map. */
export function createForgedCarbon(repeat: [number, number] = [3, 0.5], size = 1024) {
  const { c, ctx } = canvas(size)
  ctx.fillStyle = '#0d0e0f'
  ctx.fillRect(0, 0, size, size)
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 900; i++) {
    const x = rnd() * size
    const y = rnd() * size
    const w = 50 + rnd() * 170
    const hgt = 14 + rnd() * 46
    // Wide value range so the chopped fibres survive tone mapping at stage scale.
    const shade = 10 + Math.floor(rnd() * rnd() * 110)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rnd() * Math.PI)
    ctx.fillStyle = `rgb(${shade},${shade + 1},${shade + 3})`
    ctx.beginPath()
    ctx.moveTo(-w / 2, 0)
    ctx.quadraticCurveTo(0, -hgt, w / 2, 0)
    ctx.quadraticCurveTo(0, hgt * (0.3 + rnd()), -w / 2, 0)
    ctx.fill()
    ctx.restore()
  }
  return toTexture(c, { name: 'forged-carbon', repeat })
}
