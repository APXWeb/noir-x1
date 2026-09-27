import { Component, useEffect, type ReactNode } from 'react'
import { useProgress } from '@react-three/drei'
import { useStore } from '../state/store'

/** Mirrors drei's loading manager into the app store, so the loader never imports three. */
export function ProgressBridge() {
  const { progress, active, errors } = useProgress()
  useEffect(() => {
    useStore.setState({ loadProgress: progress, loadActive: active })
    if (errors.length) useStore.setState({ stageFailed: true })
  }, [progress, active, errors.length])
  return null
}

/** If the model or the GL context fails, hand the narrative to the rendered stills. */
export class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('[NOIR] 3D stage unavailable, using stills.', error)
    useStore.setState({ stageFailed: true })
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
