import { withBase } from '@/lib/utils'
import type { SeriesDef } from './types'

/** 系列专题内容（占位文案，交付时替换为摄影师本人项目阐述） */
export const seriesDefs: SeriesDef[] = [
  {
    id: 'greenland',
    title: '北方之境',
    titleEn: 'Northern Lands',
    period: '2016 — 2026',
    tagline: '十年北赴极地的长期纪实项目',
    statement:
      '「北方之境」是一个持续十年的长期拍摄计划。创作者多次深入高纬度地带，记录极地村落、冰川与浮海之间的日常现场：彩色木屋在暴风雪中明灭，渔火与极光共存于同一片夜空。项目试图在极端地理与日常生活之间找到平衡——既呈现自然的壮阔，也呈现人如何在这样的土地上安放生活。',
    awards: [{ year: '2024', label: '国际风光摄影大奖 年度专辑' }],
    cover: withBase('/photos/greenland/001.webp'),
  },
  {
    id: 'tibet-train',
    title: '高原铁路',
    titleEn: 'Plateau Railway',
    period: '2020 — 2026',
    tagline: '车窗内外的高原叙事 · 年度风光大奖',
    statement:
      '「高原铁路」以列车车窗为天然画框，历时数年、数十次搭乘高原铁路线往返雪域，将车厢内的日常现场与窗外的高原大地并置。湖岸、戈壁、雪山与经幡从窗框中缓缓流过，构成一组兼具风光美学与时代质感的当代影像，为高原的地理与人文叙事提供了新的观看视角。',
    awards: [{ year: '2023', label: '年度风光摄影大奖' }],
    cover: withBase('/photos/tibet-train/001.webp'),
  },
  {
    id: 'faint-light',
    title: '城市微光',
    titleEn: 'Faint Light',
    period: '2022 — 2023',
    tagline: '从风光转向社会纪实的代表作',
    statement:
      '「城市微光」把镜头从旷野收回城市内部：在待拆与在建的楼宇之间，记录 Temporary 居住者的灯光、晾衣绳与窗台绿植。画面安静克制，却在明暗之间透露出城市变迁中个体的韧性与体面。这是一组关于"居住"的社会纪实，也是创作者从风光摄影转向人文现场的重要转折。',
    awards: [{ year: '2023', label: '年度纪实摄影提名' }],
    cover: withBase('/photos/faint-light/001.webp'),
  },
  {
    id: 'green-future',
    title: '绿色未来',
    titleEn: 'Green Future',
    period: '2020 — 2026',
    tagline: '能源转型的绿色叙事',
    statement:
      '「绿色未来」聚焦中国能源转型的现场：戈壁上的光伏海洋、沿海的巨型风车、峡谷间的抽水蓄能电站。传统能源地理正在被重新书写，而这些新基础设施同样具有一种冷峻的几何美学。项目用大画幅式的严谨构图，为能源叙事提供视觉档案。',
    awards: [{ year: '2025', label: '年度环境影像奖' }],
    cover: withBase('/photos/green-future/001.webp'),
  },
  {
    id: 'train-world',
    title: '列车看世界',
    titleEn: 'Trains & World',
    period: '2022 — 2026',
    tagline: '车窗叙事向全球疆域的延伸',
    statement:
      '「列车看世界」是车窗叙事的全球延伸：从西伯利亚的雪原到北欧的峡湾，从高原到海岛，创作者持续在长途列车上拍摄窗外的世界。车窗既是取景框，也是一条移动的时间线——它把地理距离转换成可以凝视的时间流逝。',
    awards: [],
    cover: withBase('/photos/train-world/001.webp'),
  },
]

export const seriesById = (id: string) => seriesDefs.find((s) => s.id === id)

/** 系列页互链顺序（下一系列） */
export function nextSeries(id: string): SeriesDef {
  const i = seriesDefs.findIndex((s) => s.id === id)
  return seriesDefs[(i + 1) % seriesDefs.length]
}
