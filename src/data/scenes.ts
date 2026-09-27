/**
 * The narrative as a certification run: each scene is a position the watch
 * is tested in. `poses` lists the pose anchors that belong to the scene.
 */
export interface Scene {
  id: string
  title: string
  poses: string[]
}

export const SCENES: Scene[] = [
  { id: 'top', title: 'Precision', poses: ['hero'] },
  { id: 'x1', title: 'Nothing extra', poses: ['approach'] },
  { id: 'angles', title: 'Every side', poses: ['rotate'] },
  { id: 'sweep', title: 'Eight beats', poses: ['detail'] },
  { id: 'profile', title: 'Profile', poses: ['profile'] },
  { id: 'craft', title: 'Engineered to endure', poses: ['eng-case', 'eng-sapphire', 'eng-movement', 'eng-water'] },
  { id: 'materials', title: 'Materials', poses: ['materials'] },
  { id: 'complete', title: 'Built around precision', poses: ['reveal'] },
  { id: 'explore', title: 'Explore', poses: ['explore'] },
  { id: 'collection', title: 'Collection', poses: ['x1', 'x2', 'x3'] },
  { id: 'about', title: 'Story', poses: ['story'] },
  { id: 'finale', title: 'Time, refined', poses: ['finale'] },
]

export const sceneIndexOfPose = (pose: string) => Math.max(0, SCENES.findIndex((s) => s.poses.includes(pose)))

export const NAV = [
  { href: '#collection', label: 'Collection' },
  { href: '#x1', label: 'X1' },
  { href: '#craft', label: 'Craft' },
  { href: '#about', label: 'About' },
]
