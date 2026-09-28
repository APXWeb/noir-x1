/** Tiny command bus between the DOM explore overlay and the 3D controls. */
export type ExploreCommand = 'left' | 'right' | 'up' | 'down' | 'in' | 'out' | 'reset' | 'profile'

const listeners = new Set<(c: ExploreCommand) => void>()

export const exploreBus = {
  on(fn: (c: ExploreCommand) => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
  emit(c: ExploreCommand) {
    listeners.forEach((fn) => fn(c))
  },
}
