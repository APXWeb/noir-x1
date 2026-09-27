/**
 * Node and material names shared by the procedural source, the exported GLB
 * and the runtime. A replacement .glb only needs to follow these names.
 */
export const NODE = {
  root: 'NOIR_X1',
  head: 'Head',
  case: 'Case',
  lugs: 'Lugs',
  bezel: 'Bezel',
  bezelInsert: 'BezelInsert',
  crystal: 'Crystal',
  dial: 'Dial',
  rehaut: 'Rehaut',
  indices: 'Indices',
  indexLume: 'IndexLume',
  hourHand: 'HourHand',
  minuteHand: 'MinuteHand',
  secondHand: 'SecondHand',
  handCap: 'HandCap',
  crown: 'Crown',
  crownTube: 'CrownTube',
  pusherTop: 'PusherTop',
  pusherBottom: 'PusherBottom',
  caseback: 'Caseback',
  casebackGlass: 'CasebackGlass',
  movement: 'Movement',
  rotor: 'Rotor',
  balance: 'Balance',
  strapTop: 'StrapTop',
  strapBottom: 'StrapBottom',
  buckle: 'Buckle',
} as const

export const MAT = {
  metal: 'M_Metal',
  metalPolished: 'M_MetalPolished',
  ceramic: 'M_Ceramic',
  dial: 'M_Dial',
  lume: 'M_Lume',
  signal: 'M_Signal',
  sapphire: 'M_Sapphire',
  strap: 'M_Strap',
  movement: 'M_Movement',
  engraving: 'M_Engraving',
} as const

export type MatName = (typeof MAT)[keyof typeof MAT]

/** Geometry scale: 1 unit = 10 mm. */
export const MM = 0.1
