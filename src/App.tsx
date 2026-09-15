import { BrowserRouter, Route, Routes } from 'react-router'
import { MotionConfig } from 'motion/react'
import { LightboxProvider } from '@/components/media/Lightbox'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BootIntro } from '@/components/layout/BootIntro'
import { RouteProgress } from '@/components/layout/PageTransition'
import {
  BackToTop,
  GrainOverlay,
} from '@/components/layout/Atmosphere'
import { TargetCursor } from '@/components/media/TargetCursor'
import { isStaticMode } from '@/components/ui/Reveal'
import HomePage from '@/features/home/HomePage'
import SeriesPage from '@/features/series/SeriesPage'
import GalleryPage from '@/features/gallery/GalleryPage'
import AboutPage from '@/features/about/AboutPage'
import TutorialsPage from '@/features/tutorials/TutorialsPage'
import TutorialArticlePage from '@/features/tutorials/TutorialArticlePage'
import ArchivePage from '@/features/archive/ArchivePage'
import ContactPage from '@/features/contact/ContactPage'
import SpotPlannerPage from '@/features/tools/SpotPlannerPage'
import PhotoGamesPage from '@/features/tools/PhotoGamesPage'

export default function App() {
  const isStatic = isStaticMode()
  return (
    <MotionConfig reducedMotion={isStatic ? 'always' : 'user'}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <LightboxProvider>
          {!isStatic && <BootIntro />}
          <RouteProgress />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/series/:slug" element={<SeriesPage />} />
          <Route path="/travel" element={<GalleryPage id="travel" />} />
          <Route path="/commercial" element={<GalleryPage id="commercial" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/tutorials/a/:slug" element={<TutorialArticlePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/spot-planner" element={<SpotPlannerPage />} />
          <Route path="/photo-games" element={<PhotoGamesPage />} />
        </Routes>
        <Footer />
        <BackToTop />
        <GrainOverlay />
        <TargetCursor />
        </LightboxProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}
