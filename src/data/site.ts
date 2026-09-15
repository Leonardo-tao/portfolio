import type { CollectionId, StatItem } from './types'

/** 站点全局配置（品牌占位信息，交付时替换为摄影师本人资料） */
export const site = {
  name: '林远',
  nameEn: 'LIN YUAN',
  brand: 'LUMEN 看世界',
  brandEn: 'LUMEN',
  role: '职业摄影师',
  honors: '国家地理签约摄影师 · 索尼合作摄影师 · 影像专栏作者',
  motto: '用影像记录变化中的世界',
  manifesto:
    '「关注变化中的当代风景，创造性地展示脚下大地的时代面貌。」',
  manifestoNote:
    '从极地冰川到高原车窗，从城市微光到旷野光伏——镜头对准时代现场，让风景讲故事。',
  copyright:
    '本站所有作品版权归摄影师本人，未经许可不得转载或商用',
  socials: [
    { label: '微博', href: 'https://weibo.com' },
    { label: '哔哩哔哩', href: 'https://bilibili.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: '抖音', href: 'https://douyin.com' },
    { label: '小红书', href: 'https://xiaohongshu.com' },
    { label: '知乎', href: 'https://zhihu.com' },
    { label: '图虫', href: 'https://tuchong.com' },
    { label: '站酷', href: 'https://zcool.com.cn' },
  ],
} as const

export const stats: StatItem[] = [
  { value: '300万', label: '全网关注者' },
  { value: '180+', label: '拍摄城市' },
  { value: '300+', label: '原创摄影教程' },
  { value: '124', label: '本站收录作品' },
  { value: '52万', label: '本站文章字数' },
]

/** 主导航（含下拉分组） */
export interface NavItem {
  label: string
  to?: string
  children?: { label: string; to: string; desc?: string }[]
}

export const nav: NavItem[] = [
  { label: '首页', to: '/' },
  {
    label: '系列作品',
    children: [
      { label: '北方之境', to: '/series/greenland', desc: '十年北方的长期纪实' },
      { label: '高原铁路', to: '/series/tibet-train', desc: '车窗内外的高原叙事' },
      { label: '城市微光', to: '/series/faint-light', desc: '转向社会纪实的代表作' },
      { label: '绿色未来', to: '/series/green-future', desc: '能源转型的绿色叙事' },
      { label: '列车看世界', to: '/series/train-world', desc: '车窗叙事的全球延伸' },
    ],
  },
  { label: '旅行风光', to: '/travel' },
  { label: '商业拍摄', to: '/commercial' },
  {
    label: '摄影学习',
    children: [
      { label: '摄影教程', to: '/tutorials', desc: '300+ 篇系统化原创教程' },
      { label: '机位规划', to: '/spot-planner', desc: '交互地图与 GPS 复盘' },
      { label: '照片游戏', to: '/photo-games', desc: '训练摄影眼的互动小游戏' },
    ],
  },
  {
    label: '摄影工具',
    children: [
      { label: '全部照片索引', to: '/archive', desc: '按系列/年份/器材筛选' },
      { label: '拍摄足迹地图', to: '/travel#map', desc: '世界足迹一览' },
    ],
  },
  {
    label: '关于我',
    children: [
      { label: '个人介绍', to: '/about', desc: '履历、奖项与展览' },
      { label: '联系合作', to: '/contact', desc: '商务与留言墙' },
    ],
  },
]

export const collectionNames: Record<CollectionId, { zh: string; en: string }> = {
  greenland: { zh: '北方之境', en: 'Northern Lands' },
  'tibet-train': { zh: '高原铁路', en: 'Plateau Railway' },
  'faint-light': { zh: '城市微光', en: 'Faint Light' },
  'green-future': { zh: '绿色未来', en: 'Green Future' },
  'train-world': { zh: '列车看世界', en: 'Trains & World' },
  travel: { zh: '旅行风光', en: 'Travel & Landscape' },
  commercial: { zh: '商业拍摄', en: 'Commercial' },
}
