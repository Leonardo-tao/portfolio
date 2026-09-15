/**
 * 占位照片资源生成脚本
 * - 从 picsum.photos 下载免费占位图（可随时替换为摄影师自己的作品）
 * - 用 sharp 生成 24px 宽的 LQIP（base64 内联 webp）
 * - 输出 public/data/manifest.json（与参考站同构的数据模型）
 *
 * 用法：node scripts/generate-photos.mjs [--count-scale=1]
 */
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(process.cwd())
const PHOTOS_DIR = path.join(ROOT, 'public', 'photos')
const DATA_DIR = path.join(ROOT, 'public', 'data')

/** 集合定义：id / 中文与英文名 / 张数 / 横竖构图混合比例 */
const COLLECTIONS = [
  { id: 'greenland',    count: 24, name: { zh: '北方之境', en: 'Northern Lands' } },
  { id: 'tibet-train',  count: 20, name: { zh: '高原铁路', en: 'Plateau Railway' } },
  { id: 'faint-light',  count: 12, name: { zh: '城市微光', en: 'Faint Light' } },
  { id: 'green-future', count: 16, name: { zh: '绿色未来', en: 'Green Future' } },
  { id: 'train-world',  count: 12, name: { zh: '列车看世界', en: 'Trains & World' } },
  { id: 'travel',       count: 30, name: { zh: '旅行风光', en: 'Travel & Landscape' } },
  { id: 'commercial',   count: 10, name: { zh: '商业拍摄', en: 'Commercial' } },
]

/** 构图轮换：横 / 横 / 方 / 竖 —— 保证瀑布流有节奏 */
const SHAPES = [
  { w: 1600, h: 1000 },
  { w: 1600, h: 900 },
  { w: 1400, h: 1400 },
  { w: 1100, h: 1500 },
]

async function download(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { redirect: 'follow' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 1000) throw new Error('too small')
      return buf
    } catch (e) {
      if (i === retries) throw e
      await new Promise(r => setTimeout(r, 800 * (i + 1)))
    }
  }
}

async function makeLqip(buf) {
  const webp = await sharp(buf)
    .resize(24)
    .blur(1)
    .webp({ quality: 32 })
    .toBuffer()
  return `data:image/webp;base64,${webp.toString('base64')}`
}

await mkdir(DATA_DIR, { recursive: true })
const manifest = {}

for (const col of COLLECTIONS) {
  const dir = path.join(PHOTOS_DIR, col.id)
  await mkdir(dir, { recursive: true })
  const items = []
  for (let i = 0; i < col.count; i++) {
    const shape = SHAPES[(i + COLLECTIONS.indexOf(col)) % SHAPES.length]
    const seed = `${col.id}-${String(i + 1).padStart(3, '0')}`
    const file = `${String(i + 1).padStart(3, '0')}.webp`
    const filePath = path.join(dir, file)
    let buf
    if (existsSync(filePath)) {
      buf = await sharp(filePath).toBuffer()
    } else {
      const url = `https://picsum.photos/seed/${seed}/${shape.w}/${shape.h}.webp`
      process.stdout.write(`[${col.id}] ${file} <- ${url}\n`)
      buf = await download(url)
      await writeFile(filePath, buf)
    }
    const meta = await sharp(buf).metadata()
    items.push({ n: file, w: meta.width, h: meta.height, q: await makeLqip(buf) })
  }
  manifest[col.id] = items
  process.stdout.write(`✓ ${col.id}: ${items.length} 张\n`)
}

await writeFile(
  path.join(DATA_DIR, 'manifest.json'),
  JSON.stringify(manifest),
)
process.stdout.write('✓ public/data/manifest.json 已生成\n')
