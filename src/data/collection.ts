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
    line: 'The reference. Everything NOIR believes, in forty-one millimetres.',
    readings: [
      ['Case', '41 mm · 11.4 mm'],
      ['Movement', 'N-01 automatic'],
      ['Water', '100 m'],
    ],
    finish: null,
    dial: 'calibre',
    bezel: 'calibre',
  },
  {
    id: 'x2',
    code: 'X2',
    name: 'Meridian',
    line: 'A second time zone read on a two-tone bezel. For people who live in two cities.',
    readings: [
      ['Case', '40 mm · steel'],
      ['Function', 'GMT, 24 h bezel'],
      ['Water', '100 m'],
    ],
    finish: 'steel',
    dial: 'meridian',
    bezel: 'meridian',
  },
  {
    id: 'x3',
    code: 'X3',
    name: 'Abyss',
    line: 'Unidirectional dive bezel, blacked-out case. The only NOIR allowed to use colour.',
    readings: [
      ['Case', '42 mm · obsidian'],
      ['Bezel', 'Unidirectional'],
      ['Water', '300 m'],
    ],
    finish: 'obsidian',
    dial: 'abyss',
    bezel: 'abyss',
  },
]
