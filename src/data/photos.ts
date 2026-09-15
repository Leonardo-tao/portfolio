import manifestJson from '../../public/data/manifest.json'
import { withBase } from '@/lib/utils'
import type {
  CollectionId,
  Manifest,
  Photo,
  PhotoExif,
  PhotoRec,
} from './types'

const manifest = manifestJson as unknown as Manifest

const COLLECTION_IDS = Object.keys(manifest) as CollectionId[]

/** 文件名中的日期前缀（YYYYMMDD_HHMMSS_*）→ 年份；无日期文件名回退集合默认年 */
function yearFromName(n: string, fallback: number): number {
  const m = /^(\d{4})\d{4}_/.exec(n)
  return m ? Number(m[1]) : fallback
}

function orientationOf(ratio: number): Photo['orientation'] {
  if (ratio > 1.15) return 'landscape'
  if (ratio < 0.95) return 'portrait'
  return 'square'
}

const CAMERA_BODIES = ['Sony a7R V', 'Sony a7R IV', 'Hasselblad X2D', 'DJI Mavic 3 Pro', 'Phase One XT']
const FOCALS = ['16mm', '24mm', '35mm', '50mm', '105mm', '200mm']

/** 稳定伪随机（同一照片每次派生结果一致） */
function hash(n: number, salt: number): number {
  const x = Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const cache = new Map<CollectionId, Photo[]>()

/** 集合 → 派生照片数组（懒加载 + 缓存） */
export function collectionPhotos(id: CollectionId): Photo[] {
  const cached = cache.get(id)
  if (cached) return cached
  const recs: PhotoRec[] = manifest[id] ?? []
  const fallbackYear = 2018
  const photos = recs.map((r, i) => {
    const ratio = r.w / r.h
    return {
      id: `${id}/${r.n}`,
      collection: id,
      index: i + 1,
      src: withBase(`/photos/${id}/${r.n}`),
      lqip: r.q,
      w: r.w,
      h: r.h,
      ratio,
      orientation: orientationOf(ratio),
      year: yearFromName(r.n, fallbackYear),
    }
  })
  cache.set(id, photos)
  return photos
}

export function photosOf(ids: CollectionId[]): Photo[] {
  return ids.flatMap(collectionPhotos)
}

export const allCollectionIds = COLLECTION_IDS

export const totalCount = COLLECTION_IDS.reduce(
  (sum, id) => sum + collectionPhotos(id).length,
  0,
)

/** 灯箱 EXIF 派生（占位数据：交付时替换为真实 EXIF JSON） */
export function exifOf(photo: Photo): PhotoExif {
  const h1 = hash(photo.index, photo.collection.length)
  const h2 = hash(photo.index, 7)
  const h3 = hash(photo.index, 13)
  const shutterPool = ['1/500s', '1/1000s', '1/1250s', '1/640s', '1/320s', '1.6s', '8s']
  const day = 1 + Math.floor(h3 * 27)
  const month = 1 + Math.floor(h2 * 11)
  return {
    body: CAMERA_BODIES[Math.floor(h1 * CAMERA_BODIES.length)],
    focal: FOCALS[Math.floor(h2 * FOCALS.length)],
    aperture: `f/${[2.8, 4, 5.6, 8, 11][Math.floor(h3 * 5)]}`,
    shutter: shutterPool[Math.floor(h1 * shutterPool.length)],
    iso: [100, 200, 400, 800, 1600][Math.floor((h1 + h2) / 2 * 5)],
    date: `${photo.year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  }
}

/** 精选（每个集合取前 N 张构图差异最大的） */
export function featuredOf(ids: CollectionId[], per = 8): Photo[] {
  return ids.flatMap((id) => {
    const photos = collectionPhotos(id)
    const seen = new Set<string>()
    const picked: Photo[] = []
    for (const p of photos) {
      if (seen.has(p.orientation)) continue
      seen.add(p.orientation)
      picked.push(p)
      if (picked.length >= per) break
    }
    return picked
  })
}
