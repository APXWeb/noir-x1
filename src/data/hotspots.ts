/** Explore-mode hotspots, anchored to named 3D points (three/anchors.ts). */
export interface Hotspot {
  id: string
  anchor: string
  name: string
  line: string
}

export const HOTSPOTS: Hotspot[] = [
  { id: 'crown', anchor: 'crown', name: 'Crown', line: 'Machined for precise tactile control. It screws down onto twin gaskets.' },
  { id: 'pusher', anchor: 'pusher', name: 'Pushers', line: 'Move the hour hand between time zones without stopping the seconds.' },
  { id: 'bezel', anchor: 'bezel', name: 'Bezel', line: 'Ceramic insert, 120 clicks, laser-engraved minutes. It will not fade.' },
  { id: 'crystal', anchor: 'crystal', name: 'Sapphire', line: 'Domed and coated on the inside only, so the dial stays black and the dome keeps its light.' },
  { id: 'dial', anchor: 'dial', name: 'Dial', line: 'Sunray finish beneath eleven applied indices and a doubled twelve.' },
  { id: 'lug', anchor: 'lug', name: 'Lugs', line: 'Curved to follow the wrist. Brushed faces, polished chamfers.' },
  { id: 'caseback', anchor: 'caseback', name: 'Caseback', line: 'An exhibition window onto calibre N-01 and its rotor.' },
  { id: 'strap', anchor: 'strap', name: 'Strap', line: 'FKM rubber with a ribbed underside, closed by a titanium tang buckle.' },
]
