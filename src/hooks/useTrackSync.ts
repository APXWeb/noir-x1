import { useEffect } from 'react'
import { onTrackChange, poseOf, track } from '../animation/poseTrack'
import { sceneIndexOfPose } from '../data/scenes'
import { useStore } from '../state/store'

/** Mirrors the dominant scroll pose into discrete app state (scene index, collection variant). */
export function useTrackSync() {
  useEffect(
    () =>
      onTrackChange(() => {
        const { setScene, setVariant } = useStore.getState()
        setScene(sceneIndexOfPose(track.nearestName))
        // The collection re-parameterises the one model; everywhere else it is the X1.
        setVariant(poseOf(track.nearestName).variant ?? 'x1')
      }),
    [],
  )
}
