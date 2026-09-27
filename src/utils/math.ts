export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
export const clamp01 = (v: number) => clamp(v, 0, 1)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
export const DEG = Math.PI / 180

/** Frame-rate independent exponential approach (lambda ≈ responsiveness). */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))
