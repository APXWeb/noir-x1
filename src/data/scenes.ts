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
  { id: 'top', title: 'Precisão', poses: ['hero'] },
  { id: 'x1', title: 'Nada a mais', poses: ['approach'] },
  { id: 'angles', title: 'Todos os lados', poses: ['rotate'] },
  { id: 'sweep', title: 'Oito batidas', poses: ['detail'] },
  { id: 'profile', title: 'Perfil', poses: ['profile'] },
  { id: 'craft', title: 'Feito para durar', poses: ['eng-case', 'eng-sapphire', 'eng-movement', 'eng-water'] },
  { id: 'materials', title: 'Materiais', poses: ['materials'] },
  { id: 'complete', title: 'Construído sobre a precisão', poses: ['reveal'] },
  { id: 'explore', title: 'Explorar', poses: ['explore'] },
  { id: 'collection', title: 'Coleção', poses: ['x1', 'x2', 'x3'] },
  { id: 'about', title: 'História', poses: ['story'] },
  { id: 'finale', title: 'Tempo, refinado', poses: ['finale', 'end'] },
]

export const sceneIndexOfPose = (pose: string) => Math.max(0, SCENES.findIndex((s) => s.poses.includes(pose)))

export const NAV = [
  { href: '#collection', label: 'Coleção' },
  { href: '#x1', label: 'X1' },
  { href: '#craft', label: 'Engenharia' },
  { href: '#about', label: 'Sobre' },
]
