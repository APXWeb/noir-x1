/** Leituras de engenharia. Especificações conceituais de um produto fictício. */
export interface Spec {
  id: string
  pose: string
  term: string
  title: string
  body: string
  reading: string
  anchor: string
  /** Boletim de certificação: [sigla da posição, marcha diária, posição por extenso]. */
  bulletin?: [string, string, string][]
  /** Leader direction for the graticule (px) on desktop. */
  dx: number
  dy: number
}

export const SPECS: Spec[] = [
  {
    id: 'case',
    pose: 'eng-case',
    term: 'Caixa',
    title: 'Titânio Grau 5',
    body: 'Usinada a partir de um único bloco, jateada e polida à mão em cada chanfro. Quarenta por cento mais leve que o aço, e mais difícil de marcar.',
    reading: 'Ti-6Al-4V · 41,0 mm',
    anchor: 'lug',
    dx: 160,
    dy: -70,
  },
  {
    id: 'sapphire',
    pose: 'eng-sapphire',
    term: 'Safira',
    title: 'Cristal de safira',
    body: 'Abaulado, nove na escala Mohs, com antirreflexo só na face interna: o mostrador lê preto e a cúpula ainda pega a luz.',
    reading: 'Al₂O₃ · 9 Mohs',
    anchor: 'crystal',
    dx: 170,
    dy: -90,
  },
  {
    id: 'movement',
    pose: 'eng-movement',
    term: 'Movimento',
    title: 'Movimento automático de precisão',
    body: 'Calibre N-01: setenta e duas horas de reserva, balanço de espiral livre e um rotor que se vê pelo fundo.',
    reading: '28.800 alt/h · 72 h',
    anchor: 'caseback',
    bulletin: [
      ['MA', '+1,2', 'Mostrador acima'],
      ['MB', '+0,8', 'Mostrador abaixo'],
      ['CA', '−0,4', 'Coroa acima'],
      ['CB', '+0,6', 'Coroa abaixo'],
      ['CE', '+1,0', 'Coroa à esquerda'],
      ['CD', '−0,2', 'Coroa à direita'],
    ],
    dx: 190,
    dy: 80,
  },
  {
    id: 'water',
    pose: 'eng-water',
    term: 'Resistência à água',
    title: '100 m',
    body: 'Coroa de rosca assentada sobre duas juntas. Testada a dez bar e testada de novo antes de sair.',
    reading: '10 bar · ISO 22810',
    anchor: 'crown',
    dx: 150,
    dy: -110,
  },
]
