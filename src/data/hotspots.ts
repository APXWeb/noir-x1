/** Hotspots do modo explorar, presos a pontos 3D nomeados (three/points.ts). */
export interface Hotspot {
  id: string
  anchor: string
  name: string
  line: string
}

export const HOTSPOTS: Hotspot[] = [
  { id: 'crown', anchor: 'crown', name: 'Coroa', line: 'Usinada para um controle tátil preciso. Rosqueia sobre duas juntas.' },
  { id: 'pusher', anchor: 'pusher', name: 'Botões', line: 'Levam o ponteiro das horas de um fuso a outro sem parar os segundos.' },
  { id: 'bezel', anchor: 'bezel', name: 'Luneta', line: 'Inserto cerâmico, 120 cliques, minutos gravados a laser. Não desbota.' },
  { id: 'crystal', anchor: 'crystal', name: 'Safira', line: 'Abaulada e tratada só por dentro: o mostrador continua preto e a cúpula guarda a luz.' },
  { id: 'dial', anchor: 'dial', name: 'Mostrador', line: 'Acabamento sunray sob onze índices aplicados e um doze duplo.' },
  { id: 'lug', anchor: 'lug', name: 'Alças', line: 'Curvadas para acompanhar o pulso. Faces escovadas, chanfros polidos.' },
  { id: 'caseback', anchor: 'caseback', name: 'Fundo', line: 'Uma janela para o Calibre N-01, com pontes, engrenagens e rotor à vista.' },
  { id: 'strap', anchor: 'strap', name: 'Pulseira', line: 'Borracha FKM com a face interna nervurada, fechada por uma fivela de titânio.' },
]
