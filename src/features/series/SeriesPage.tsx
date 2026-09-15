import { useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowLeft, ChevronDown, Trophy } from 'lucide-react'
import { PageRoot } from '@/components/layout/PageTransition'
import { SmartImage } from '@/components/media/SmartImage'
import { Reveal } from '@/components/ui/Reveal'
import { useLightbox } from '@/components/media/Lightbox'
import { useDocumentTitle } from '@/lib/hooks'
import { collectionPhotos } from '@/data/photos'
import type { CollectionId } from '@/data/types'
import { nextSeries, seriesById } from '@/data/series'
import { cn, pad3 } from '@/lib/utils'
import { useState } from 'react'
import { SeriesTrainMap } from './TrainMap'

export default function SeriesPage() {
  const { slug = '' } = useParams()
  const def = seriesById(slug)
  useDocumentTitle(def ? `${def.title} · 系列作品` : '系列作品')

  if (!def) {
    return (
      <PageRoot className="flex min-h-[70svh] items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="display-title text-4xl">系列不存在</h1>
          <Link to="/" className="mt-6 inline-block text-gold hover:underline">
            返回首页
          </Link>
        </div>
      </PageRoot>
    )
  }

  return (
    <PageRoot>
      <SeriesHero slug={slug} />
      <Statement slug={slug} />
      <RailGallery slug={slug} />
      {slug === 'tibet-train' && <SeriesTrainMap />}
      <NextSeriesLink slug={slug} />
    </PageRoot>
  )
}

/* ---------- Hero：媒体层 fixed，滚动时淡出（画廊"覆盖"上来） ---------- */
function SeriesHero({ slug }: { slug: string }) {
  const def = seriesById(slug)!
  const photos = collectionPhotos(slug as CollectionId)
  const cover = photos[0]
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  return (
    <div ref={ref} className="relative">
      {/* fixed 媒体层 */}
      <motion.div style={{ opacity }} className="fixed inset-0 z-0 pointer-events-none">
        <motion.div style={{ y, scale }} className="h-full w-full">
          <img
            src={cover.src}
            alt=""
            fetchPriority="high"
            className="h-full w-full animate-hero-drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/45 to-deep-black/55" />
        </motion.div>
      </motion.div>

      {/* 文案层 */}
      <div className="relative z-10 flex h-[100svh] flex-col justify-end">
        <div className="mx-auto w-full max-w-[1800px] px-5 pb-20 md:px-10 md:pb-24">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm tracking-[0.24em] text-white/70 transition-colors hover:text-gold"
          >
            <ArrowLeft size={15} />
            返回首页
          </Link>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
            }}
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 flex items-center gap-3 text-xs tracking-[0.4em] text-white/70"
            >
              <span className="inline-block h-px w-10 bg-gold" />
              {def.titleEn}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="display-title text-[clamp(2.6rem,8vw,6.5rem)] leading-tight"
            >
              {def.title}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base tracking-[0.18em] text-white/85 md:text-lg"
            >
              {def.tagline}
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-2 text-sm tracking-[0.3em] text-white/60"
            >
              {def.period} · {photos.length} 张
            </motion.p>
            {def.awards[0] && (
              <motion.p
                variants={fadeUp}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-[13px] tracking-wider text-gold"
              >
                <Trophy size={14} />
                {def.awards[0].year} {def.awards[0].label}
              </motion.p>
            )}
          </motion.div>
        </div>

        <a
          href="#statement"
          className="mx-auto mb-6 flex flex-col items-center gap-1.5 text-white/70 transition-colors hover:text-gold"
          aria-label="下滑进入画廊"
        >
          <span className="text-[11px] tracking-[0.4em]">下滑 · 进入画廊</span>
          <ChevronDown size={20} className="animate-bounce-soft" />
        </a>
      </div>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/* ---------- 系列阐述 ---------- */
function Statement({ slug }: { slug: string }) {
  const def = seriesById(slug)!
  const [expanded, setExpanded] = useState(false)
  return (
    <section id="statement" className="relative z-10 bg-deep-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1800px] px-5 py-20 md:px-10 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="kicker mb-5">系列阐述 · STATEMENT</p>
          <p
            className={cn(
              'text-[15px] leading-loose text-white/80 md:text-base',
              !expanded && 'line-clamp-4',
            )}
          >
            {def.statement}
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-5 cursor-pointer text-[13px] tracking-[0.24em] text-gold hover:underline"
          >
            {expanded ? '收起' : '展开全文'}
          </button>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- 胶片轨道画廊（多列瀑布 + 虚拟渲染 + 灯箱） ---------- */
function RailGallery({ slug }: { slug: string }) {
  const def = seriesById(slug)!
  const photos = collectionPhotos(slug as CollectionId)
  const { openAt } = useLightbox()

  return (
    <section className="relative z-10 bg-deep-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1800px] px-5 pb-24 md:px-10">
        <Reveal>
          <header className="flex flex-wrap items-end justify-between gap-4 pb-8">
            <h2 className="display-title text-4xl md:text-5xl">全部作品</h2>
            <div className="flex items-center gap-5">
              <p className="text-sm tracking-[0.2em] text-ink-45">
                {photos.length} 张
              </p>
              <button className="cursor-pointer text-[13px] tracking-[0.2em] text-white/70 transition-colors hover:text-gold">
                分享
              </button>
            </div>
          </header>
        </Reveal>

        <Masonry
          photos={photos}
          onPick={(i) => openAt(photos, i)}
          ariaLabel={def.title}
        />
      </div>
    </section>
  )
}

/** 多列瀑布流：按列高最小值分配 + 视口内才渲染实图（虚拟化） */
export function Masonry({
  photos,
  onPick,
  ariaLabel,
  columns = 4,
}: {
  photos: ReturnType<typeof collectionPhotos>
  onPick: (index: number) => void
  ariaLabel: string
  columns?: number
}) {
  const [colsData, setColsData] = useState(0)
  const cols = useMemo(() => {
    const n = colsData || columns
    const buckets: { photo: (typeof photos)[0]; h: number; i: number }[][] = Array.from(
      { length: n },
      () => [],
    )
    const heights = Array.from({ length: n }, () => 0)
    photos.forEach((p, i) => {
      const k = heights.indexOf(Math.min(...heights))
      buckets[k].push({ photo: p, h: 1 / p.ratio, i })
      heights[k] += 1 / p.ratio + 0.06
    })
    return buckets
  }, [photos, columns, colsData])

  const globalIndex = new Map(photos.map((p, i) => [p.id, i]))

  return (
    <div
      className="grid grid-cols-2 gap-1.5 md:grid-cols-3 lg:grid-cols-4 md:gap-2"
      role="list"
      aria-label={`${ariaLabel} 作品画廊`}
      ref={(el) => {
        if (el && !colsData) {
          const w = el.clientWidth
          const n = w > 1280 ? 4 : w > 720 ? 3 : 2
          if (n !== columns) setColsData(n)
        }
      }}
    >
      {cols.map((bucket, k) => (
        <div key={k} className="flex flex-col gap-1.5 md:gap-2">
          {bucket.map(({ photo, i }) => (
            <GalleryItem
              key={photo.id}
              photo={photo}
              index={globalIndex.get(photo.id) ?? i}
              onPick={onPick}
              label={ariaLabel}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function GalleryItem({
  photo,
  index,
  onPick,
  label,
}: {
  photo: ReturnType<typeof collectionPhotos>[0]
  index: number
  onPick: (i: number) => void
  label: string
}) {
  return (
    <button
      onClick={() => onPick(index)}
      className="rail-item group relative block w-full cursor-zoom-in overflow-hidden rounded-sm"
      aria-label={`${label} · ${index + 1}`}
      role="listitem"
    >
      <SmartImage
        src={photo.src}
        lqip={photo.lqip}
        w={photo.w}
        h={photo.h}
        alt={`${label} · ${pad3(index + 1)}`}
        className="w-full"
        imgClassName="transition-transform duration-[1.2s] ease-expo-out group-hover:scale-[1.05]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25"
      />
      <span className="pointer-events-none absolute bottom-2 right-2.5 text-[11px] tracking-[0.2em] text-white/0 transition-all duration-500 group-hover:text-white/90">
        {pad3(index + 1)}
      </span>
    </button>
  )
}

/* ---------- 下一系列 ---------- */
function NextSeriesLink({ slug }: { slug: string }) {
  const next = nextSeries(slug)
  const photos = collectionPhotos(next.id as CollectionId)
  const cover = photos[0]

  return (
    <Link
      to={`/series/${next.id}`}
      className="group relative block overflow-hidden border-t border-white/10"
      aria-label={`下一系列：${next.title}`}
    >
      <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
        <SmartImage
          src={cover.src}
          lqip={cover.lqip}
          w={cover.w}
          h={cover.h}
          alt={next.title}
          className="absolute inset-0 h-full w-full"
          imgClassName="transition-transform duration-[1.6s] ease-expo-out group-hover:scale-[1.07]"
        />
        <div aria-hidden className="absolute inset-0 bg-deep-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-xs tracking-[0.44em] text-white/70">
            下一系列 NEXT SERIES
          </p>
          <h2 className="display-title text-[clamp(2rem,6vw,4.6rem)]">
            {next.title}
          </h2>
          <p className="text-[13px] tracking-[0.34em] text-white/60">
            {next.titleEn}
          </p>
        </div>
      </div>
    </Link>
  )
}
