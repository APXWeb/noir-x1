/**
 * One motion vocabulary for the whole experience.
 * - out: entrances and responses (strong ease-out)
 * - inOut: things already on screen moving to a new place
 * - silk: the slow, weighted curve used for camera and hero choreography
 */
export const EASE = {
  out: 'expo.out',
  inOut: 'power3.inOut',
  silk: 'power4.inOut',
} as const

export const CSS_EASE = {
  out: 'cubic-bezier(0.23, 1, 0.32, 1)',
  inOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
} as const
