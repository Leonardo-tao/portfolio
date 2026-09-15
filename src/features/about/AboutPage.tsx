import { useState } from 'react'
import { PageRoot } from '@/components/layout/PageTransition'
import { Container } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { SmartImage } from '@/components/media/SmartImage'
import { useLightbox } from '@/components/media/Lightbox'
import { useDocumentTitle } from '@/lib/hooks'
import { site } from '@/data/site'
import { collectionPhotos } from '@/data/photos'
import { cn } from '@/lib/utils'

const AWARDS: [string, string][] = [
  ['2025', '年度环境影像奖（绿色未来系列）'],
  ['2024', '国际风光摄影大奖 年度专辑（北方之境）'],
  ['2023', '年度风光摄影大奖（高原铁路）'],
  ['2023', '年度纪实摄影提名（城市微光）'],
  ['2020-2025', '微博最具影响力摄影博主'],
  ['2019', '国家地理摄影大赛全球总冠军（首位中国得主）'],
  ['2019', '入选福布斯中国 30 岁以下精英榜'],
]

const EXHIBITIONS: [string, string][] = [
  ['2026', '北京 798 映画廊「绿色未来」系列'],
  ['2026', '重庆市群众艺术馆「绿色未来」系列'],
  ['2025', '中国平遥国际摄影大展「绿色未来」系列'],
  ['2024', '中国平遥国际摄影大展「北方之境」系列'],
  ['2023', '上海摄影艺术博览会 个展'],
  ['2022', '连州国际摄影年展 群展'],
]

const HONOR_CHIPS = [
  '国家地理全球总冠军',
  '索尼合作摄影师',
  '影像专栏作者',
  '高校摄影客座讲师',
  '福布斯30U30',
]

export default function AboutPage() {
  useDocumentTitle('个人介绍 · 关于我')
  return (
    <PageRoot className="pt-24 md:pt-32">
      {/* 页头 */}
      <Container className="text-center">
        <Reveal>
          <p className="kicker mb-4">About</p>
          <h1 className="display-title text-[clamp(2.6rem,7vw,5.5rem)]">个人介绍</h1>
        </Reveal>
      </Container>

      {/* 双栏：人像轮播 + 简介 */}
      <Container className="mt-16 grid gap-14 md:mt-24 md:grid-cols-[5fr_7fr] md:gap-20">
        <PortraitCarousel />
        <Reveal delay={0.1}>
          <div className="space-y-6 leading-loose text-white/80">
            <p>{site.name}，是一名 1992 年出生于重庆的职业摄影师。</p>
            <p>
              擅长风光、纪实、商业类摄影，获得过国家地理摄影大赛全球总冠军、年度风光摄影大奖等奖项，在社交平台上累计了超过 300 万关注者。
            </p>
            <p>
              摄影创作主要关注变化中的当代风景：从极地冰川到高原车窗，从城市微光到戈壁上的光伏海洋。多组作品引发主流媒体广泛报道，在国内外媒体获得亿级传播。
            </p>
            <p>
              曾任多所高校摄影协会艺术指导，原创发表摄影教程 300 余篇，在大众爱好者群体和专业摄影师圈子中均有广泛影响，服务过众多商业品牌。
            </p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-3">
            {HONOR_CHIPS.map((h) => (
              <li
                key={h}
                className="rounded-full border border-white/20 px-4 py-1.5 text-[13px] tracking-wider text-white/75"
              >
                {h}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      {/* 奖项时间线 */}
      <Container className="mt-24 md:mt-36">
        <Reveal>
          <header className="flex items-center gap-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">🏆</span>
            <div>
              <h2 className="display-title text-3xl md:text-4xl">获得奖项</h2>
              <p className="mt-1 text-xs tracking-[0.34em] text-ink-45">AWARDS</p>
            </div>
          </header>
        </Reveal>
        <ul className="mt-10">
          {AWARDS.map(([year, label], i) => (
            <Reveal key={label} delay={i * 0.04}>
              <li className="flex flex-wrap items-baseline gap-x-10 gap-y-1 border-t border-white/10 py-6 last:border-b">
                <span className="display-title w-32 shrink-0 text-2xl text-gold">{year}</span>
                <span className="text-[15px] tracking-wide text-white/85">{label}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>

      {/* 展览 */}
      <Container className="mt-24 pb-28 md:mt-36">
        <Reveal>
          <header className="flex items-center gap-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">#</span>
            <div>
              <h2 className="display-title text-3xl md:text-4xl">参加展览</h2>
              <p className="mt-1 text-xs tracking-[0.34em] text-ink-45">EXHIBITIONS</p>
            </div>
          </header>
        </Reveal>
        <div className="mt-10 grid gap-x-16 md:grid-cols-2">
          {EXHIBITIONS.map(([year, label], i) => (
            <Reveal key={label} delay={i * 0.04}>
              <div className="flex items-baseline gap-8 border-t border-white/10 py-5">
                <span className="w-14 shrink-0 text-sm text-ink-45">{year}</span>
                <span className="text-[15px] tracking-wide text-white/80">{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </PageRoot>
  )
}

/** 人像轮播（圆点分页 + 自动轮换） */
function PortraitCarousel() {
  const photos = collectionPhotos('commercial').slice(0, 5)
  const [i, setI] = useState(0)
  const p = photos[i]
  const { openAt } = useLightbox()

  return (
    <Reveal>
      <figure>
        <button
          onClick={() => openAt(photos, i)}
          className="group block w-full cursor-zoom-in"
          aria-label={`人像 ${i + 1}`}
        >
          <SmartImage
            key={p.id}
            src={p.src}
            lqip={p.lqip}
            w={p.w}
            h={p.h}
            alt={`${site.name} 人像`}
            className="aspect-[4/5] w-full rounded-lg"
            imgClassName="animate-fade-in"
          />
        </button>
        <figcaption className="mt-4">
          <p className="display-title text-xl">{site.name}</p>
          <p className="mt-1 text-xs tracking-[0.3em] text-ink-45">
            {site.nameEn} · b.1992 重庆
          </p>
          <div className="mt-4 flex gap-2" role="tablist" aria-label="人像分页">
            {photos.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === i}
                aria-label={`第 ${idx + 1} 张`}
                onClick={() => setI(idx)}
                className={cn(
                  'h-0.5 cursor-pointer transition-all duration-400',
                  idx === i ? 'w-7 bg-gold' : 'w-3.5 bg-white/25 hover:bg-white/50',
                )}
              />
            ))}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  )
}
