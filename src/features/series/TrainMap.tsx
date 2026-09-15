import { useMemo, useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'

/**
 * 列车线路图（滚动驱动）：SVG 山水化线路 + 站点节点
 * 页面滚动进度映射列车位置，标题随站点区间切换 —— 与参考站"滚动驾驶"一致的交互
 */
const STOPS = [
  { name: '西宁', km: 0, alt: 2261 },
  { name: '青海湖', km: 138, alt: 3200 },
  { name: '德令哈', km: 383, alt: 2981 },
  { name: '格尔木', km: 604, alt: 2780 },
  { name: '可可西里', km: 940, alt: 4600 },
  { name: '沱沱河', km: 1180, alt: 4500 },
  { name: '安多', km: 1420, alt: 4700 },
  { name: '那曲', km: 1650, alt: 4507 },
  { name: '当雄', km: 1878, alt: 4293 },
  { name: '拉萨', km: 1956, alt: 3650 },
]

export function SeriesTrainMap() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.6'],
  })

  /* 线路折线（归一化坐标） */
  const path = useMemo(() => {
    const pts = STOPS.map((_, i) => ({
      x: 6 + (i / (STOPS.length - 1)) * 88,
      y: 56 - Math.sin((i / (STOPS.length - 1)) * Math.PI) * 16 + (i % 2 ? 5 : -4),
    }))
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')
  }, [])

  const totalKm = STOPS[STOPS.length - 1].km

  return (
    <section
      ref={ref}
      aria-label="列车线路图"
      className="relative z-10 overflow-hidden border-y border-white/10 bg-[#0d1117] py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <RouteTitle progress={scrollYProgress} />
            <p className="text-sm tracking-[0.2em] text-white/60">
              {totalKm.toLocaleString()} KM · 全程滚动驾驶
            </p>
          </div>
        </Reveal>

        {/* SVG 线路 */}
        <div className="relative mt-10">
          <svg
            viewBox="0 0 100 80"
            className="h-44 w-full md:h-56"
            preserveAspectRatio="none"
            aria-hidden
          >
            {/* 地形装饰线 */}
            <path d="M0 70 Q 20 62 40 69 T 80 66 T 100 70" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="0.4" />
            <path d="M0 16 Q 25 8 50 15 T 100 13" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="0.4" />
            {/* 线路底轨 */}
            <path d={path} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="0.55" strokeDasharray="1.6 1.2" />
            {/* 已驶过部分（金色） */}
            <TrainProgressPath d={path} progress={scrollYProgress} />
            {/* 站点 */}
            {STOPS.map((s, i) => {
              const x = 6 + (i / (STOPS.length - 1)) * 88
              const y = 56 - Math.sin((i / (STOPS.length - 1)) * Math.PI) * 16 + (i % 2 ? 5 : -4)
              return (
                <g key={s.name}>
                  <circle cx={x} cy={y} r="0.9" fill={i === 0 || i === STOPS.length - 1 ? '#c9a558' : 'rgba(255,255,255,.55)'} />
                  <text
                    x={x}
                    y={i % 2 ? y + 7 : y - 4}
                    textAnchor="middle"
                    fill="rgba(255,255,255,.62)"
                    fontSize="2.6"
                    paintOrder="stroke"
                    stroke="#0d1117"
                    strokeWidth="0.8"
                  >
                    {s.name}
                  </text>
                </g>
              )
            })}
            <TrainMarker progress={scrollYProgress} />
          </svg>
        </div>

        <p className="mt-6 text-center text-xs tracking-[0.36em] text-white/40">
          列车行驶中 · 滚动页面即可驾驶列车
        </p>
      </div>
    </section>
  )
}

/** 标题：当前区间 + 里程/海拔（跟随滚动插值） */
function RouteTitle({ progress }: { progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const km = useTransform(progress, [0, 1], [0, STOPS[STOPS.length - 1].km])
  const alt = useTransform(progress, [0, 1], [STOPS[0].alt, STOPS[STOPS.length - 1].alt])
  const stopIndex = useTransform(progress, (p) =>
    Math.min(STOPS.length - 2, Math.floor(p * (STOPS.length - 1))),
  )
  const from = useTransform(stopIndex, (i) => STOPS[i].name)
  const to = useTransform(stopIndex, (i) => STOPS[Math.min(i + 1, STOPS.length - 1)].name)
  const kmText = useTransform(km, (v) => Math.round(v).toLocaleString())
  const altText = useTransform(alt, (v) => `约 ${Math.round(v).toLocaleString()} M`)

  return (
    <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
      <motion.p className="display-title text-3xl md:text-4xl">
        <motion.span>{from}</motion.span>
        <span className="mx-3 text-gold">→</span>
        <motion.span>{to}</motion.span>
      </motion.p>
      <p className="text-sm tracking-[0.2em] text-white/60">
        <motion.span>{kmText}</motion.span> / {STOPS[STOPS.length - 1].km.toLocaleString()} KM · 海拔{' '}
        <motion.span>{altText}</motion.span>
      </p>
    </div>
  )
}

/** 金色已驶路径：stroke-dashoffset 由滚动驱动 */
function TrainProgressPath({ d, progress }: { d: string; progress: MotionValue<number> }) {
  const length = 300
  const dash = useTransform(progress, [0, 1], [length, 0])
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="#c9a558"
      strokeWidth="0.7"
      strokeLinecap="round"
      strokeDasharray={length}
      style={{ strokeDashoffset: dash }}
    />
  )
}

/** 列车标记：沿路径插值移动 */
function TrainMarker({ progress }: { progress: MotionValue<number> }) {
  // 简化：在 SVG 视口内按进度沿 x 轴移动，y 用路径近似（与站点 y 序列一致的插值）
  const x = useTransform(progress, [0, 1], [6, 94])
  const y = useTransform(
    progress,
    [0, 0.5, 1],
    [
      56 - Math.sin(0) * 16 - 4,
      56 - Math.sin(Math.PI / 2) * 16 + 5 * 0.5,
      56 - Math.sin(Math.PI) * 16 + 5,
    ],
  )
  return (
    <motion.g style={{ x, y }}>
      <rect x="-2.2" y="-4.3" width="4.4" height="2.6" rx="0.6" fill="#c9a558" />
      <circle cx="0" cy="-5.4" r="0.5" fill="#c9a558" />
    </motion.g>
  )
}
