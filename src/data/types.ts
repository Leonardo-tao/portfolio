/** 数据模型 —— 与静态 JSON 数据文件一一对应 */

export type CollectionId =
  | 'greenland'
  | 'tibet-train'
  | 'faint-light'
  | 'green-future'
  | 'train-world'
  | 'travel'
  | 'commercial'

/** manifest.json 单条照片记录：文件名 / 宽 / 高 / base64 LQIP */
export interface PhotoRec {
  n: string
  w: number
  h: number
  q: string
}

export type Manifest = Record<CollectionId, PhotoRec[]>

/** 派生后的照片对象（合并文件名内日期与集合信息） */
export interface Photo {
  id: string
  collection: CollectionId
  index: number
  src: string
  lqip: string
  w: number
  h: number
  ratio: number
  orientation: 'landscape' | 'portrait' | 'square'
  year: number
}

/** 照片展示元数据（灯箱 EXIF 等，复刻期随机派生） */
export interface PhotoExif {
  body: string
  focal: string
  aperture: string
  shutter: string
  iso: number
  date: string
}

export type SeriesId = Extract<
  CollectionId,
  'greenland' | 'tibet-train' | 'faint-light' | 'green-future' | 'train-world'
>

export interface SeriesAward {
  year: string
  label: string
}

export interface SeriesDef {
  id: SeriesId
  title: string
  titleEn: string
  period: string
  tagline: string
  statement: string
  awards: SeriesAward[]
  cover: string
}

export interface StatItem {
  value: string
  label: string
}

export interface TutorialArticle {
  title: string
  slug: string
  hot?: boolean
  excerpt: string
  date: string
  minutes: number
  body: string[]
}

export interface TutorialGroup {
  name: string
  en: string
  items: TutorialArticle[]
}

export interface GeoPlace {
  la: number
  lo: number
  zh: string
  en: string
  country: string
  n: number
}
