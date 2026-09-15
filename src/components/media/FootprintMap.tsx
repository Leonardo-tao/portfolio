import { useMemo, useRef } from 'react'
import { motion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { geoPlaces } from '@/data/tutorials'

/**
 * 拍摄足迹地图：世界轮廓点阵 + 城市脉冲标记（进入视口时点亮）
 * 占位实现：等距柱状投影 + 手工简化大陆点阵（交付时可替换为 Leaflet 真实地图）
 */
export function FootprintMap() {
  const ref = useRef<HTMLDivElement>(null)

  const dots = useMemo(() => continentsDots(), [])

  return (
    <section ref={ref} aria-label="拍摄足迹地图" className="border-t border-white/10 bg-[#0d1117] py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker mb-3">Footprint Map</p>
              <h2 className="display-title text-4xl md:text-5xl">拍摄足迹 · 世界地图</h2>
            </div>
            <p className="text-sm tracking-[0.2em] text-ink-45">
              {geoPlaces.length} 个城市 · {geoPlaces.reduce((a, b) => a + b.n, 0)} 个拍摄点
            </p>
          </header>
        </Reveal>

        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <svg viewBox="0 0 360 160" className="h-auto w-full" role="img" aria-label="世界足迹点阵图">
            {/* 大陆点阵 */}
            {dots.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="0.7" fill="rgba(255,255,255,.13)" />
            ))}
            {/* 城市标记（滚动点亮） */}
            {geoPlaces.map((p, i) => {
              const x = (p.lo + 180) * (360 / 360)
              const y = (90 - p.la) * (160 / 180)
              return (
                <motion.g
                  key={p.zh}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <circle cx={x} cy={y} r={1.4 + Math.min(p.n, 10) * 0.25} fill="rgba(201,165,88,.18)">
                    <animate attributeName="r" values={`${1.4 + Math.min(p.n, 10) * 0.25};${2.4 + Math.min(p.n, 10) * 0.25};${1.4 + Math.min(p.n, 10) * 0.25}`} dur="3.2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={x} cy={y} r="1.2" fill="#c9a558" />
                  {(p.n >= 6 || i < 8) && (
                    <text x={x + 2.6} y={y + 1.2} fontSize="3" fill="rgba(255,255,255,.55)">
                      {p.zh}
                    </text>
                  )}
                </motion.g>
              )
            })}
          </svg>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {geoPlaces.slice(0, 10).map((p) => (
            <li key={p.zh} className="text-sm tracking-wider text-white/60">
              <span className="text-gold">{p.zh}</span> · {p.country}（{p.n}）
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** 粗略大陆轮廓点阵（等距柱状投影，viewBox 360x160）—— 原创手工近似数据 */
function continentsDots(): [number, number][] {
  const pts: [number, number][] = []
  // 北美
  pushBlob(pts, 78, 42, 16, 11, 26)
  // 南美
  pushBlob(pts, 108, 96, 7, 16, 22)
  // 欧洲
  pushBlob(pts, 178, 36, 9, 7, 16)
  // 非洲
  pushBlob(pts, 182, 84, 11, 13, 24)
  // 亚洲
  pushBlob(pts, 235, 48, 22, 13, 42)
  // 东南亚群岛
  pushBlob(pts, 250, 92, 9, 5, 12)
  // 澳洲
  pushBlob(pts, 298, 112, 9, 6, 16)
  return pts
}

function pushBlob(
  pts: [number, number][],
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  count: number,
) {
  let seed = cx * 31 + cy * 17
  for (let i = 0; i < count; i++) {
    seed = (seed * 9301 + 49297) % 233280
    const a = (seed / 233280) * Math.PI * 2
    const r = Math.sqrt((seed % 97) / 97)
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r])
  }
}
