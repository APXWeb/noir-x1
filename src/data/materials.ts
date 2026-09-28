/** Acabamentos de caixa do X1. Os valores são alvos PBR que o modelo persegue suavemente. */
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
    name: 'Titânio',
    line: 'Grau 5, jateado, com chanfros polidos. Quarenta por cento mais leve que o aço.',
    reading: '4,43 g/cm³',
    readingLabel: 'Densidade',
    metal: { color: '#9da2a7', roughness: 0.34, metalness: 1, clearcoat: 0 },
    polished: { color: '#c7cbcf', roughness: 0.12 },
    strap: '#151617',
    swatch: '#9da2a7',
  },
  {
    id: 'obsidian',
    name: 'Obsidiana',
    line: 'Titânio sob uma camada de carbono tipo diamante. Absorve a luz em vez de devolvê-la.',
    reading: '2.500 HV',
    readingLabel: 'Dureza superficial',
    metal: { color: '#27282b', roughness: 0.4, metalness: 1, clearcoat: 0 },
    polished: { color: '#3b3d41', roughness: 0.16 },
    strap: '#0e0e0f',
    swatch: '#2b2c2f',
  },
  {
    id: 'carbon',
    name: 'Carbono',
    line: 'Carbono forjado, prensado e cortado. Não existem duas caixas com o mesmo desenho.',
    reading: '1,55 g/cm³',
    readingLabel: 'Densidade',
    metal: { color: '#ffffff', roughness: 0.62, metalness: 0.1, clearcoat: 0.7, carbon: true },
    polished: { color: '#5d6166', roughness: 0.2 },
    strap: '#101011',
    swatch: '#3a3b3d',
  },
  {
    id: 'steel',
    name: 'Aço',
    line: 'Aço 904L, laterais acetinadas, luneta polida a espelho. O mais claro dos quatro.',
    reading: '8,0 g/cm³',
    readingLabel: 'Densidade',
    metal: { color: '#cdd0d3', roughness: 0.22, metalness: 1, clearcoat: 0 },
    polished: { color: '#e7e9eb', roughness: 0.06 },
    strap: '#1d1f21',
    swatch: '#cdd0d3',
  },
]

export const finishById = (id: MaterialId) => FINISHES.find((f) => f.id === id)!
