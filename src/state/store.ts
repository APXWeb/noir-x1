import { create } from 'zustand'
import type { MaterialId } from '../data/materials'
import type { VariantId } from '../data/collection'

export type Mode = 'scroll' | 'explore'
export type Quality = 'high' | 'mid' | 'low'

interface State {
  /** 3D assets finished loading and the loader has handed over. */
  ready: boolean
  introDone: boolean
  material: MaterialId
  variant: VariantId
  mode: Mode
  quality: Quality
  hotspot: string | null
  /** Index of the pose anchor nearest the viewport centre. */
  scene: number
  /** Asset loading, mirrored from inside the lazily loaded 3D stage. */
  loadProgress: number
  loadActive: boolean
  /** WebGL or the model failed at runtime: fall back to rendered stills. */
  stageFailed: boolean
  /** Monotonic counter bumped on every material change; drives the light sweep. */
  sweep: number
  setReady: (v: boolean) => void
  setIntroDone: (v: boolean) => void
  setMaterial: (m: MaterialId) => void
  setVariant: (v: VariantId) => void
  setMode: (m: Mode) => void
  setQuality: (q: Quality) => void
  setHotspot: (h: string | null) => void
  setScene: (i: number) => void
}

export const useStore = create<State>((set, get) => ({
  ready: false,
  introDone: false,
  material: 'titanium',
  variant: 'x1',
  mode: 'scroll',
  quality: 'high',
  hotspot: null,
  scene: 0,
  sweep: 0,
  loadProgress: 0,
  loadActive: false,
  stageFailed: false,
  setReady: (ready) => set({ ready }),
  setIntroDone: (introDone) => set({ introDone }),
  setMaterial: (material) => get().material !== material && set({ material, sweep: get().sweep + 1 }),
  setVariant: (variant) => get().variant !== variant && set({ variant, sweep: get().sweep + 1 }),
  setMode: (mode) => set({ mode, hotspot: null }),
  setQuality: (quality) => set({ quality }),
  setHotspot: (hotspot) => set({ hotspot }),
  setScene: (scene) => get().scene !== scene && set({ scene }),
}))
