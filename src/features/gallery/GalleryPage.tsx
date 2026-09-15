import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { PageRoot } from '@/components/layout/PageTransition'
import { SmartImage } from '@/components/media/SmartImage'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/primitives'
import { useLightbox } from '@/components/media/Lightbox'
import { useDocumentTitle } from '@/lib/hooks'
import { collectionPhotos, featuredOf } from '@/data/photos'
import { collectionNames } from '@/data/site'
import { Masonry } from '@/features/series/SeriesPage'
import { FootprintMap } from '@/components/media/FootprintMap'
import type { CollectionId } from '@/data/types'

const PAGE_META: Record<
  'travel' | 'commercial',
  { title: string; titleEn: string; period?: string; tagline: string }
> = {
  travel: {
    title: '旅行风光',
    titleEn: 'Travel & Landscape',
    period: '2012 — 2019',
    tagline: '跨越山川湖海的环球影像',
  },
  commercial: {
    title: '商业拍摄',
    titleEn: 'Commercial Photography',
    tagline: '品牌视觉与商业委托创作',
  },
}

export default function GalleryPage({ id }: { id: CollectionId }) {
  const meta = PAGE_META[id as 'travel' | 'commercial'] ?? {
    title: collectionNames[id]?.zh ?? id,
    titleEn: collectionNames[id]?.en ?? id,
    tagline: '作品画廊',
  }
  useDocumentTitle(`${meta.title} · 作品画廊`)

  const photos = collectionPhotos(id)
  const cover = photos[0]
  const { openAt } = useLightbox()

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  return (
    <PageRoot>
      {/* Hero */}
      <div ref={ref} className="relative">
        <motion.div style={{ opacity }} className="pointer-events-none fixed inset-0 z-0">
          <motion.div style={{ scale }} className="h-full w-full">
            <img
              src={cover.src}
              alt=""
              fetchPriority="high"
              className="h-full w-full animate-hero-drift object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/45 to-deep-black/55" />
          </motion.div>
        </motion.div>

        <div className="relative z-10 flex h-[100svh] flex-col justify-end">
          <div className="mx-auto w-full max-w-[1800px] px-5 pb-20 md:px-10 md:pb-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
            >
              <motion.p variants={fadeUp} className="mb-3 flex items-center gap-3 text-xs tracking-[0.4em] text-white/70">
                <span className="inline-block h-px w-10 bg-gold" />
                {meta.titleEn}
                {meta.period ? ` · ${meta.period}` : ''}
              </motion.p>
              <motion.h1 variants={fadeUp} className="display-title text-[clamp(2.6rem,8vw,6.5rem)] leading-tight">
                {meta.title}
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-4 text-base tracking-[0.18em] text-white/85">
                {meta.tagline}
              </motion.p>
              <motion.p variants={fadeUp} className="mt-2 text-sm tracking-[0.3em] text-white/60">
                {photos.length} 张
              </motion.p>
            </motion.div>
          </div>
          <a
            href="#gallery"
            className="mx-auto mb-6 flex flex-col items-center gap-1.5 text-white/70 transition-colors hover:text-gold"
            aria-label="下滑进入画廊"
          >
            <span className="text-[11px] tracking-[0.4em]">下滑 · 进入画廊</span>
            <ChevronDown size={20} className="animate-bounce-soft" />
          </a>
        </div>
      </div>

      {/* 精选 + 全部 */}
      <div id="gallery" className="relative z-10 bg-deep-black/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1800px] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <SectionHeader kicker="Selected" title="精选作品" aside="每张都值得放大看" className="max-w-none" />
          </Reveal>
          <FeaturedStrip id={id} />
        </div>

        <div className="mx-auto max-w-[1800px] px-5 pb-24 md:px-10">
          <Reveal>
            <header className="flex flex-wrap items-end justify-between gap-4 pb-8">
              <h2 className="display-title text-4xl md:text-5xl">全部作品</h2>
              <p className="text-sm tracking-[0.2em] text-ink-45">{photos.length} 张</p>
            </header>
          </Reveal>
          <Masonry photos={photos} onPick={(i) => openAt(photos, i)} ariaLabel={meta.title} />
        </div>
      </div>

      {/* 足迹地图（仅 travel） */}
      {id === 'travel' && (
        <div id="map" className="relative z-10">
          <FootprintMap />
        </div>
      )}
    </PageRoot>
  )
}

function FeaturedStrip({ id }: { id: CollectionId }) {
  const { openAt } = useLightbox()
  const featured = featuredOf([id], 8)
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {featured.map((p, i) => (
        <button
          key={p.id}
          onClick={() => openAt(featured, i)}
          aria-label={`精选 ${i + 1}`}
          className="group relative cursor-zoom-in overflow-hidden rounded-md"
        >
          <SmartImage
            src={p.src}
            lqip={p.lqip}
            w={p.w}
            h={p.h}
            alt={`精选作品 ${i + 1}`}
            className="aspect-[4/5] w-full md:aspect-[3/4]"
            imgClassName="transition-transform duration-[1.2s] ease-expo-out group-hover:scale-[1.06]"
          />
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
        </button>
      ))}
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
}
