import { Suspense, lazy, useEffect, useMemo } from 'react'
import { Header } from '../components/Header'
import { Loader } from '../components/Loader'
import { PositionRail } from '../components/PositionRail'
import { Cursor } from '../components/Cursor'
import { ExploreOverlay } from '../components/ExploreOverlay'
import { FallbackStage } from '../components/FallbackStage'
import { Hero } from '../sections/Hero'
import { Approach } from '../sections/Approach'
import { Angles } from '../sections/Angles'
import { Sweep } from '../sections/Sweep'
import { Profile } from '../sections/Profile'
import { Engineering } from '../sections/Engineering'
import { Materials } from '../sections/Materials'
import { Complete } from '../sections/Complete'
import { ExploreIntro } from '../sections/ExploreIntro'
import { Collection } from '../sections/Collection'
import { Story } from '../sections/Story'
import { Finale } from '../sections/Finale'
import { Footer } from '../sections/Footer'
import { useStore } from '../state/store'
import { detectWebGL, initialQuality } from '../utils/device'
import { useIsMobile, useReducedMotion } from '../hooks/useMedia'
import { useTrackSync } from '../hooks/useTrackSync'
import { startScroll } from '../animation/smoothScroll'
import { StillMode } from './StillMode'

const Stage = lazy(() => import('../three/Stage'))

export function App() {
  const still = useMemo(() => new URLSearchParams(window.location.search).get('still'), [])
  if (still) return <StillMode pose={still} />
  return <Experience />
}

function Experience() {
  const webgl = useMemo(detectWebGL, [])
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const setQuality = useStore((s) => s.setQuality)
  const stageFailed = useStore((s) => s.stageFailed)

  useEffect(() => setQuality(initialQuality()), [setQuality])
  useEffect(() => startScroll({ reduced, mobile }), [reduced, mobile])
  useTrackSync()

  return (
    <>
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <Loader webgl={webgl} reduced={reduced} />
      <Header />
      {webgl && !stageFailed ? (
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      ) : (
        <FallbackStage />
      )}
      <Cursor />
      {webgl && !stageFailed && <ExploreOverlay />}
      <main id="main">
        <Hero />
        <Approach />
        <Angles />
        <Sweep />
        <Profile />
        <Engineering />
        <Materials />
        <Complete />
        {webgl && !stageFailed && <ExploreIntro />}
        <Collection />
        <Story />
        <Finale />
      </main>
      <Footer />
      {/* After the content in the DOM so keyboard users reach the story first. */}
      <PositionRail />
    </>
  )
}
