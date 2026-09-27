import type { Quality } from '../state/store'

const params = () => new URLSearchParams(window.location.search)

export function detectWebGL(): boolean {
  if (params().has('nowebgl')) return false
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * First guess at a quality tier before any frame is rendered. The runtime
 * PerformanceMonitor refines it afterwards.
 */
export function initialQuality(): Quality {
  const forced = params().get('quality')
  if (forced === 'high' || forced === 'mid' || forced === 'low') return forced
  let renderer = ''
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    const ext = gl?.getExtension('WEBGL_debug_renderer_info')
    renderer = ext && gl ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''
  } catch {
    /* ignore */
  }
  if (/swiftshader|llvmpipe|software|mali-4|adreno \(tm\) [34]/i.test(renderer)) return 'low'
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const coarse = window.matchMedia('(pointer: coarse)').matches
  if (cores <= 4 || memory <= 4) return coarse ? 'low' : 'mid'
  return coarse ? 'mid' : 'high'
}
