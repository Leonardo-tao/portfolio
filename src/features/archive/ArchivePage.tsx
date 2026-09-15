import { useMemo, useState } from 'react'
import { Map as MapIcon } from 'lucide-react'
import { PageRoot } from '@/components/layout/PageTransition'
import { Container, Chip } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { useLightbox } from '@/components/media/Lightbox'
import { useDocumentTitle } from '@/lib/hooks'
import { allCollectionIds, photosOf } from '@/data/photos'
import { collectionNames } from '@/data/site'
import { Masonry } from '@/features/series/SeriesPage'
import { FootprintMap } from '@/components/media/FootprintMap'
import type { CollectionId, Photo } from '@/data/types'

type Scope = 'featured' | 'all' | 'landscape' | 'portrait' | 'square'
type Gear = 'all' | 'Sony' | 'DJI' | 'Hasselblad' | 'PhaseOne' | '手机'

const SCOPES: [Scope, string][] = [
  ['featured', '精选作品'],
  ['all', '全部照片'],
  ['landscape', '横构图'],
  ['portrait', '竖构图'],
  ['square', '方构图'],
]
const GEARS: Gear[] = ['all', 'Sony', 'DJI', 'Hasselblad', 'PhaseOne', '手机']

const YEARS = Array.from({ length: 15 }, (_, i) => 2026 - i)

export default function ArchivePage() {
  useDocumentTitle('全部照片索引 · 作品档案')
  const { openAt } = useLightbox()
  const [scope, setScope] = useState<Scope>('featured')
  const [series, setSeries] = useState<CollectionId | 'all'>('all')
  const [year, setYear] = useState<number | 'all'>('all')
  const [gear, setGear] = useState<Gear>('all')
  const [showMap, setShowMap] = useState(false)

  const photos = useMemo(() => {
    let pool: Photo[] =
      scope === 'all'
        ? photosOf(allCollectionIds)
        : photosOf(allCollectionIds).filter((_, i) => i % 3 === 0) // 精选：隔三取一占位
    if (scope === 'landscape') pool = pool.filter((p) => p.orientation === 'landscape')
    if (scope === 'portrait') pool = pool.filter((p) => p.orientation === 'portrait')
    if (scope === 'square') pool = pool.filter((p) => p.orientation === 'square')
    if (series !== 'all') pool = pool.filter((p) => p.collection === series)
    if (year !== 'all') pool = pool.filter((p) => p.year === year)
    if (gear !== 'all') pool = pool.filter((_, i) => (i + gear.length) % 4 !== 0) // 器材占位筛
    return pool
  }, [scope, series, year, gear])

  return (
    <PageRoot className="pt-24 md:pt-32">
      <Container>
        <Reveal>
          <p className="kicker mb-4">Archive Index · {photos.length} 张</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="display-title text-[clamp(2.4rem,6.5vw,5rem)]">全部照片索引</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMap((v) => !v)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[13px] tracking-wider text-white/80 transition-colors hover:border-gold hover:text-gold"
              >
                <MapIcon size={15} /> 拍摄足迹
              </button>
            </div>
          </div>
          <p className="mt-4 max-w-2xl leading-loose text-ink-60">
            全站每一个系列、每一张照片在这里汇成一条完整档案——按系列、年份与构图筛选，点击任意一张进入大图。
          </p>
        </Reveal>

        {/* 筛选器 */}
        <Reveal delay={0.08}>
          <div className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-dark-gray/40 p-6">
            <FilterRow label="作品范围">
              {SCOPES.map(([v, label]) => (
                <Chip key={v} active={scope === v} onClick={() => setScope(v)}>
                  {label}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="所属系列">
              <Chip active={series === 'all'} onClick={() => setSeries('all')}>
                全部
              </Chip>
              {allCollectionIds.map((id) => (
                <Chip key={id} active={series === id} onClick={() => setSeries(id)}>
                  {collectionNames[id].zh}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="拍摄年度">
              <Chip active={year === 'all'} onClick={() => setYear('all')}>
                全部
              </Chip>
              {YEARS.map((y) => (
                <Chip key={y} active={year === y} onClick={() => setYear(y)}>
                  {y}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="拍摄器材">
              {GEARS.map((g) => (
                <Chip key={g} active={gear === g} onClick={() => setGear(g)}>
                  {g === 'all' ? '全部' : g}
                </Chip>
              ))}
            </FilterRow>
          </div>
        </Reveal>
      </Container>

      {showMap ? (
        <div className="mt-16">
          <FootprintMap />
        </div>
      ) : (
        <Container className="mt-14 pb-28">
          {photos.length ? (
            <Masonry
              photos={photos}
              onPick={(i) => openAt(photos, i)}
              ariaLabel="全部照片"
              columns={5}
            />
          ) : (
            <p className="py-24 text-center text-ink-45">当前筛选条件下暂无作品</p>
          )}
        </Container>
      )}
    </PageRoot>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="mr-2 w-20 shrink-0 text-[13px] tracking-widest text-ink-45">
        {label}
      </span>
      {children}
    </div>
  )
}
