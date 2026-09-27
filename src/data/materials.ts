/** Case finishes offered for the X1. Values are physically-based targets the model damps toward. */
export type MaterialId = 'titanium' | 'obsidian' | 'carbon' | 'steel'

export interface Finish {
  id: MaterialId
  name: string
  /** Short material line shown in the Materials scene. */
  line: string
  /** Measured spec (concept) and what it measures. */
  reading: string
  readingLabel: string
  metal: { color: string; roughness: number; metalness: number; clearcoat: number; carbon?: boolean }
  polished: { color: string; roughness: number }
  strap: string
  /** Swatch tone for the selector, never used as a surface fill. */
  swatch: string
}

export const FINISHES: Finish[] = [
  {
    id: 'titanium',
    name: 'Titanium',
    line: 'Grade 5, bead-blasted, polished chamfers. Forty percent lighter than steel.',
    reading: '4.43 g/cm³',
    readingLabel: 'Density',
    metal: { color: '#9da2a7', roughness: 0.34, metalness: 1, clearcoat: 0 },
    polished: { color: '#c7cbcf', roughness: 0.12 },
    strap: '#151617',
    swatch: '#9da2a7',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    line: 'Titanium under a diamond-like carbon coat. It absorbs light instead of returning it.',
    reading: '2 500 HV',
    readingLabel: 'Surface hardness',
    metal: { color: '#27282b', roughness: 0.4, metalness: 1, clearcoat: 0 },
    polished: { color: '#3b3d41', roughness: 0.16 },
    strap: '#0e0e0f',
    swatch: '#2b2c2f',
  },
  {
    id: 'carbon',
    name: 'Carbon',
    line: 'Forged carbon, pressed and cut. No two cases carry the same pattern.',
    reading: '1.55 g/cm³',
    readingLabel: 'Density',
    metal: { color: '#ffffff', roughness: 0.62, metalness: 0.1, clearcoat: 0.7, carbon: true },
    polished: { color: '#5d6166', roughness: 0.2 },
    strap: '#101011',
    swatch: '#3a3b3d',
  },
  {
    id: 'steel',
    name: 'Steel',
    line: '904L steel, satin-brushed flanks, mirror-polished bezel. The brightest of the four.',
    reading: '8.0 g/cm³',
    readingLabel: 'Density',
    metal: { color: '#cdd0d3', roughness: 0.22, metalness: 1, clearcoat: 0 },
    polished: { color: '#e7e9eb', roughness: 0.06 },
    strap: '#1d1f21',
    swatch: '#cdd0d3',
  },
]

export const finishById = (id: MaterialId) => FINISHES.find((f) => f.id === id)!
