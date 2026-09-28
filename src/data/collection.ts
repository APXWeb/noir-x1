import type { MaterialId } from './materials'
import type { DialStyle, BezelStyle } from '../three/watch/textures'

export type VariantId = 'x1' | 'x2' | 'x3'

export interface Variant {
  id: VariantId
  code: string
  name: string
  line: string
  readings: [string, string][]
  finish: MaterialId | null
  dial: DialStyle
  bezel: BezelStyle
}

export const VARIANTS: Variant[] = [
  {
    id: 'x1',
    code: 'X1',
    name: 'Calibre',
    line: 'A referência. Tudo em que a NOIR acredita, em quarenta e um milímetros.',
    readings: [
      ['Caixa', '41 mm · 11,4 mm'],
      ['Movimento', 'N-01 automático'],
      ['Água', '100 m'],
    ],
    finish: null,
    dial: 'calibre',
    bezel: 'calibre',
  },
  {
    id: 'x2',
    code: 'X2',
    name: 'Meridian',
    line: 'Um segundo fuso horário lido numa luneta bicolor. Para quem vive em duas cidades.',
    readings: [
      ['Caixa', '40 mm · aço'],
      ['Função', 'GMT, luneta 24 h'],
      ['Água', '100 m'],
    ],
    finish: 'steel',
    dial: 'meridian',
    bezel: 'meridian',
  },
  {
    id: 'x3',
    code: 'X3',
    name: 'Abyss',
    line: 'Luneta de mergulho unidirecional, caixa toda escura. O único NOIR autorizado a usar cor.',
    readings: [
      ['Caixa', '42 mm · obsidiana'],
      ['Luneta', 'Unidirecional'],
      ['Água', '300 m'],
    ],
    finish: 'obsidian',
    dial: 'abyss',
    bezel: 'abyss',
  },
]
