import { useMemo, useState } from 'react'
import { Compass, MapPin } from 'lucide-react'
import { PageRoot } from '@/components/layout/PageTransition'
import { Container, Chip } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { useDocumentTitle } from '@/lib/hooks'
import { geoPlaces } from '@/data/tutorials'

/** 机位规划（占位实现：地点清单 + 射线距离排序，接入后端后替换为地图选点） */
export default function SpotPlannerPage() {
  useDocumentTitle('机位规划 · 摄影工具')
  const [region, setRegion] = useState<'all' | 'cn' | 'abroad'>('all')

  const places = useMemo(
    () =>
      geoPlaces
        .filter((p) =>
          region === 'all' ? true : region === 'cn' ? p.country === '中国' : p.country !== '中国',
        )
        .sort((a, b) => b.n - a.n),
    [region],
  )

  return (
    <PageRoot className="pt-24 md:pt-32">
      <Container>
        <Reveal>
          <p className="kicker mb-4">Spot Planner</p>
          <h1 className="display-title text-[clamp(2.6rem,7vw,5rem)]">机位规划与复盘</h1>
          <p className="mt-5 max-w-2xl leading-loose text-ink-60">
            交互地图找机位、规划拍摄计划；拍完用 GPS 轨迹复盘踩点，让每次出行都有沉淀。
            当前为演示视图——接入高德/Leaflet 后此处渲染可拖拽地图与轨迹工具。
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 flex gap-2.5">
            {([['all', '全部'], ['cn', '国内'], ['abroad', '海外']] as const).map(([v, label]) => (
              <Chip key={v} active={region === v} onClick={() => setRegion(v)}>
                {label}
              </Chip>
            ))}
          </div>
        </Reveal>
      </Container>

      <Container className="mt-12 pb-28">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p, i) => (
            <Reveal key={p.zh} delay={Math.min(i, 8) * 0.05}>
              <li className="h-full rounded-xl border border-white/10 bg-dark-gray/40 p-6 transition-colors duration-500 hover:border-gold/40">
                <div className="flex items-center justify-between">
                  <p className="display-title flex items-center gap-2.5 text-xl">
                    <MapPin size={16} className="text-gold" />
                    {p.zh}
                  </p>
                  <span className="text-xs tracking-widest text-ink-45">{p.n} 个机位</span>
                </div>
                <p className="mt-2 text-sm text-ink-60">
                  {p.country} · {p.en}
                </p>
                <p className="mt-4 flex items-center gap-2 text-xs tracking-widest text-ink-45">
                  <Compass size={12} className="text-gold" />
                  {p.la.toFixed(2)}°, {p.lo.toFixed(2)}°
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </PageRoot>
  )
}
