/** Engineering readings. Concept specifications for a fictional product. */
export interface Spec {
  id: string
  pose: string
  term: string
  title: string
  body: string
  reading: string
  anchor: string
  /** Leader direction for the graticule (px) on desktop. */
  dx: number
  dy: number
}

export const SPECS: Spec[] = [
  {
    id: 'case',
    pose: 'eng-case',
    term: 'Case',
    title: 'Titanium Grade 5',
    body: 'Cut from a single billet, bead-blasted, then hand-polished along every chamfer. Forty percent lighter than steel and harder to mark.',
    reading: 'Ti-6Al-4V · 41.0 mm',
    anchor: 'lug',
    dx: -160,
    dy: -70,
  },
  {
    id: 'sapphire',
    pose: 'eng-sapphire',
    term: 'Sapphire',
    title: 'Sapphire crystal',
    body: 'Domed, nine on the Mohs scale, anti-reflective on the inside only, so the dial reads black and the dome still catches the light.',
    reading: 'Al₂O₃ · 9 Mohs',
    anchor: 'crystal',
    dx: -170,
    dy: -90,
  },
  {
    id: 'movement',
    pose: 'eng-movement',
    term: 'Movement',
    title: 'Precision automatic movement',
    body: 'Calibre N-01: seventy-two hours of reserve, a free-sprung balance, and a rotor you can watch through the caseback.',
    reading: '28 800 vph · 72 h',
    anchor: 'caseback',
    dx: -190,
    dy: 80,
  },
  {
    id: 'water',
    pose: 'eng-water',
    term: 'Water resistance',
    title: '100 M',
    body: 'A screw-down crown seated on twin gaskets. Pressure-tested to ten bar, then tested again before it leaves.',
    reading: '10 bar · ISO 22810',
    anchor: 'crown',
    dx: -150,
    dy: -110,
  },
]
