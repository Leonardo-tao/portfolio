import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { ButtonLink, GoldRule } from '@/components/ui/primitives'
import { site } from '@/data/site'
import { seriesDefs } from '@/data/series'
import { collectionPhotos } from '@/data/photos'
import { cn } from '@/lib/utils'
import { useInterval } from '@/lib/hooks'

/** 轮播幻灯：5 个系列 + 旅行 */
interface Slide {
  title: string
  titleEn: string
  to: string
  cover: string
  coverLqip: string
}

const slides: Slide[] = [
  ...seriesDefs.map((s) => {
    const p = collectionPhotos(s.id)[0]
    return {
      title: s.title,
      titleEn: s.titleEn,
      to: `/series/${s.id}`,
      cover: s.cover,
      coverLqip: p?.lqip ?? '',
    }
  }),
  (() => {
    const p = collectionPhotos('travel')[0]
    return {
      title: '旅行风光',
      titleEn: 'Travel & Landscape',
      to: '/travel',
      cover: p?.src ?? '',
      coverLqip: p?.lqip ?? '',
    }
  })(),
]

export function HeroCarousel() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const slide = slides[i]

  useInterval(() => setI((v) => (v + 1) % slides.length), paused ? null : 5200)

  return (
    <section
      aria-label="精选作品轮播"
      className="relative flex h-[100svh] items-end overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 背景层（带缓慢漂移缩放） */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.to}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <img
            src={slide.cover}
            alt=""
            fetchPriority="high"
            className="h-full w-full animate-hero-drift object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* 遮罩：底部渐暗 + 暗角 */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/35 to-deep-black/55"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,.55) 100%)',
        }}
      />

      {/* 内容（左下） */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-24 md:px-10 md:pb-28">
        <motion.p
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 flex items-center gap-3 text-[13px] tracking-[0.42em] text-white/85"
        >
          <GoldRule />
          {site.motto}
        </motion.p>

        {/* 逐字入场大标题 */}
        <h1 className="display-title text-[clamp(3.4rem,11vw,8.5rem)] leading-[1.02]">
          <SplitChars text={site.name} delayBase={0.15} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 text-[clamp(1.5rem,4.4vw,3.2rem)] font-extrabold leading-tight tracking-wide"
        >
          <span className="text-white">{site.brandEn}</span>{' '}
          <span className="text-gold">{site.brand.replace(site.brandEn, '').trim()}</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.75 }}
          className="mt-4 text-sm tracking-[0.2em] text-white/70 md:text-base"
        >
          {site.honors}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <ButtonLink to={slide.to}>
            进入{slides[i].title}
            <ArrowRight size={16} />
          </ButtonLink>
          <ButtonLink to="/about" variant="ghost">
            了解摄影师
          </ButtonLink>
        </motion.div>
      </div>

      {/* 右下：当前幻灯标题 + 指示器 */}
      <div className="absolute bottom-24 right-5 z-10 flex items-center gap-4 md:right-10 md:bottom-28">
        <AnimatePresence mode="wait">
          <motion.span
            key={slide.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-[13px] tracking-[0.3em] text-white/75"
          >
            {slide.title}
          </motion.span>
        </AnimatePresence>
        <div className="flex flex-col gap-2.5" role="tablist" aria-label="轮播指示器">
          {slides.map((s, idx) => (
            <button
              key={s.to}
              role="tab"
              aria-selected={idx === i}
              aria-label={s.title}
              onClick={() => setI(idx)}
              className={cn(
                'h-px cursor-pointer transition-all duration-500',
                idx === i ? 'w-9 bg-gold' : 'w-4 bg-white/30 hover:bg-white/60',
              )}
            />
          ))}
        </div>
      </div>

      {/* 底部下滚提示 */}
      <a
        href="#intro"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-gold"
        aria-label="向下滚动"
      >
        <ChevronDown size={26} className="animate-bounce-soft" />
      </a>
    </section>
  )
}

/** 逐字上升入场 */
function SplitChars({ text, delayBase = 0 }: { text: string; delayBase?: number }) {
  return (
    <span aria-label={text}>
      {[...text].map((ch, idx) => (
        <motion.span
          key={`${ch}-${idx}`}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: 90, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 1,
            delay: delayBase + idx * 0.14,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}
