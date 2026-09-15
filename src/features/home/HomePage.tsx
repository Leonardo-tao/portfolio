import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, BookOpen, Gamepad2, MapPinned } from 'lucide-react'
import { PageRoot } from '@/components/layout/PageTransition'
import { Reveal } from '@/components/ui/Reveal'
import { Container, SectionHeader } from '@/components/ui/primitives'
import { useDocumentTitle } from '@/lib/hooks'
import { HeroCarousel } from './HeroCarousel'
import { site, stats, collectionNames } from '@/data/site'
import { seriesDefs } from '@/data/series'
import { collectionPhotos } from '@/data/photos'
import type { CollectionId } from '@/data/types'
import { SmartImage } from '@/components/media/SmartImage'

export default function HomePage() {
  useDocumentTitle('林远 · 摄影作品集 | LUMEN PHOTOGRAPHY')

  return (
    <PageRoot>
      <HeroCarousel />
      <Manifesto />
      <SeriesSection />
      <MoreWorks />
      <LearnSection />
      <StatsBand />
    </PageRoot>
  )
}

/* ---------- 宣言区 ---------- */
function Manifesto() {
  return (
    <section id="intro" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
      <Reveal>
        <blockquote className="display-title max-w-5xl text-[clamp(1.6rem,3.6vw,3rem)] leading-snug">
          {renderManifesto(site.manifesto)}
        </blockquote>
        <p className="mt-8 max-w-3xl leading-loose text-ink-60">
          {site.manifestoNote}
        </p>
      </Reveal>
    </section>
  )
}

/** 给「」内的关键词上金色 */
function renderManifesto(text: string) {
  const inner = text.replace(/^「/, '').replace(/」$/, '')
  const goldStart = inner.indexOf('变化中的')
  const goldEnd = inner.indexOf('，')
  if (goldStart < 0 || goldEnd < 0) return text
  return (
    <>
      「{inner.slice(0, goldStart)}
      <span className="text-gold">{inner.slice(goldStart, goldEnd)}</span>
      {inner.slice(goldEnd)}」
    </>
  )
}

/* ---------- 系列作品 ---------- */
function SeriesSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10 md:pb-36">
      <Reveal>
        <SectionHeader kicker="Selected Series" title="系列作品" aside="五个长期摄影专题" />
      </Reveal>
      <div className="space-y-8 md:space-y-12">
        {seriesDefs.map((s) => (
          <Reveal key={s.id} delay={0.05}>
            <SeriesCard slug={s.id} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function SeriesCard({ slug }: { slug: string }) {
  const def = seriesDefs.find((s) => s.id === slug)!
  const photos = collectionPhotos(slug as CollectionId)
  const cover = photos[0]

  return (
    <Link
      to={`/series/${slug}`}
      className="group relative block overflow-hidden rounded-lg"
      aria-label={`${def.title} · ${def.tagline} · ${photos.length} 张作品`}
    >
      <SmartImage
        src={cover.src}
        lqip={cover.lqip}
        w={cover.w}
        h={cover.h}
        alt={def.title}
        className="aspect-[16/8] w-full md:aspect-[16/7]"
        imgClassName="transition-transform duration-[1.4s] ease-expo-out group-hover:scale-[1.06]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-10">
        <div>
          <p className="text-xs tracking-[0.34em] text-white/70">
            {def.titleEn} · {def.period}
          </p>
          <h3 className="display-title mt-3 text-3xl md:text-5xl">{def.title}</h3>
          <p className="mt-2 text-sm text-white/75 md:text-base">{def.tagline}</p>
          <p className="mt-3 text-[13px] font-semibold tracking-[0.2em] text-gold">
            {photos.length} 张作品
          </p>
        </div>
        <span
          aria-hidden
          className="mb-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-deep-black"
        >
          <ArrowUpRight size={20} />
        </span>
      </div>
    </Link>
  )
}

/* ---------- 更多作品 ---------- */
function MoreWorks() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10 md:pb-36">
      <Reveal>
        <SectionHeader kicker="More Works" title="更多作品" aside="旅行风光 · 商业拍摄" />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {(['travel', 'commercial'] as const).map((id) => (
          <Reveal key={id} delay={0.06}>
            <CollectionCard id={id} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function CollectionCard({ id }: { id: 'travel' | 'commercial' }) {
  const photos = collectionPhotos(id)
  const cover = photos[0]
  const names = collectionNames[id]
  const sub =
    id === 'travel' ? '跨越山川湖海的环球影像' : '品牌视觉与商业委托创作'
  const en =
    id === 'travel' ? 'Travel & Landscape · 2012 — 2019' : 'Commercial Photography'

  return (
    <Link
      to={`/${id}`}
      className="group relative block overflow-hidden rounded-lg"
      aria-label={`${names.zh} · ${sub} · ${photos.length} 张作品`}
    >
      <SmartImage
        src={cover.src}
        lqip={cover.lqip}
        w={cover.w}
        h={cover.h}
        alt={names.zh}
        className="aspect-[16/10] w-full"
        imgClassName="transition-transform duration-[1.4s] ease-expo-out group-hover:scale-[1.06]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
        <div>
          <p className="text-xs tracking-[0.34em] text-white/70">{en}</p>
          <h3 className="display-title mt-2.5 text-3xl md:text-4xl">{names.zh}</h3>
          <p className="mt-1.5 text-sm text-white/75">{sub}</p>
          <p className="mt-2.5 text-[13px] font-semibold tracking-[0.2em] text-gold">
            {photos.length} 张作品
          </p>
        </div>
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-deep-black"
        >
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  )
}

/* ---------- 学习摄影 ---------- */
const learnCards = [
  {
    icon: BookOpen,
    title: '摄影教程',
    desc: '300+ 篇原创教程——从前期拍摄到后期调色，系统化的摄影方法论与完整案例复盘。',
    meta: '300+ 篇原创教程',
    to: '/tutorials',
  },
  {
    icon: MapPinned,
    title: '机位规划与复盘',
    desc: '交互地图找机位、规划拍摄计划；拍完用 GPS 轨迹复盘踩点，让每次出行都有沉淀。',
    meta: '交互地图 · GPS 复盘',
    to: '/spot-planner',
  },
  {
    icon: Gamepad2,
    title: '照片游戏',
    desc: '把学习变成玩——在互动小游戏中磨练观察力与构图直觉。',
    meta: '训练摄影眼',
    to: '/photo-games',
  },
]

function LearnSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10 md:pb-36">
      <Reveal>
        <SectionHeader kicker="Learn Photography" title="学习摄影" aside="教程 · 机位 · 游戏" />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-3">
        {learnCards.map((c, i) => (
          <Reveal key={c.to} delay={i * 0.08}>
            <Link
              to={c.to}
              className="group block rounded-xl border border-white/10 bg-dark-gray/40 p-7 transition-all duration-500 hover:border-gold/40 hover:bg-dark-gray/70"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <c.icon size={20} />
                </span>
                <ArrowRight
                  size={18}
                  className="text-white/40 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-gold"
                />
              </div>
              <h3 className="display-title mt-6 text-2xl">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-60">{c.desc}</p>
              <p className="mt-5 text-[13px] font-semibold tracking-[0.18em] text-gold">
                {c.meta}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- 数据带 ---------- */
function StatsBand() {
  return (
    <section className="border-t border-white/10 bg-dark-gray/40">
      <Container className="py-16 md:py-20">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="text-center md:text-left">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="display-title block text-4xl md:text-[2.6rem]">
                    {s.value}
                  </span>
                  <span className="mt-2 block text-[13px] tracking-[0.24em] text-ink-45">
                    {s.label}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}
