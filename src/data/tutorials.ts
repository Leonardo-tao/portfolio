import type { GeoPlace, TutorialGroup } from './types'

/** 教程内容（占位文章，交付时替换为真实教程系统） */
export const tutorialGroups: TutorialGroup[] = [
  {
    name: '精选必读',
    en: "Editor's Must-Reads",
    items: [
      {
        title: '拒绝偏色：摄影后期色彩管理流程与要点解析',
        slug: 'color-management',
        hot: true,
        excerpt: '从显示器校色到输出一致性，建立可靠的色彩工作流。',
        date: '2026-08-02',
        minutes: 12,
        body: [
          '色彩管理是后期一切调色的地基。没有统一的色彩参照，任何"好看"都是偶然。',
          '第一步是校准显示器：硬件校色仪 + D65 白点 + 120cd/m² 亮度是摄影显示的通用起点。第二步统一工作色彩空间：后期编辑使用广色域空间，输出前再转换到目标空间。',
          '养成"先看直方图、再看颜色"的习惯。偏色往往不是感觉问题，而是白平衡与通道直方图问题——把中性灰找回来，画面自然就正了。',
        ],
      },
      {
        title: '怎样调色才好看？从热门大片中总结出的调色规律',
        slug: 'color-grading-rules',
        hot: true,
        excerpt: '三个可以复用的调色公式：分离、收敛、统一。',
        date: '2026-07-18',
        minutes: 9,
        body: [
          '好看的调色几乎都遵守三条规律：明暗分离（主体亮、背景暗或相反）、色彩收敛（画面色彩数≤3）、氛围统一（全图共享同一色温倾向）。',
          '实操上先用曲线建立基调，再用 HSL 收敛杂色，最后用分离色调给高光阴影各一个倾向色。',
        ],
      },
      {
        title: '为什么我的照片没有层次感？这三点让作品大变样',
        slug: 'photo-depth',
        hot: true,
        excerpt: '前中后景、空气透视、明暗节奏——层次感的三块积木。',
        date: '2026-06-30',
        minutes: 8,
        body: [
          '层次感不是玄学，它来自三层结构：明确的前景、可阅读的中景、干净利落的远景。',
          '广角贴近前景是制造纵深最直接的手段；长焦则通过压缩与雾气制造空气透视。后期中，把亮度节奏做成"亮-暗-亮"的交替，画面会立刻立体起来。',
        ],
      },
      {
        title: '关于摄影比赛，这里有一份最详细的入门指南',
        slug: 'contest-guide',
        excerpt: '选赛、选片、写说明，三步提高获奖概率。',
        date: '2026-05-21',
        minutes: 15,
        body: [
          '选赛比选片更重要：看往届获奖作品判断口味，看组别设置判断竞争密度。',
          '参赛作品要满足"三秒原则"——评委停留时间只有三秒，画面必须有一眼可读的主体与情绪。作品说明用事实与现场信息说话，避免形容词堆砌。',
        ],
      },
    ],
  },
  {
    name: '前期拍摄',
    en: 'Field Techniques',
    items: [
      {
        title: '风光摄影的构图方法论：从"看见"到"组织"',
        slug: 'composition-method',
        excerpt: '构图不是套公式，而是一场关于注意力的组织。',
        date: '2026-04-11',
        minutes: 14,
        body: [
          '构图的起点是明确主体：先问"这张照片是关于什么的"，再决定元素的去留。',
          '常用组织手段：引导线、框架、重复与节奏、负空间。每种手段都服务于"让视线停留在主体上"这件事。',
        ],
      },
      {
        title: '车窗摄影完全指南：在行进中拍摄清晰照片',
        slug: 'train-window-guide',
        excerpt: '快门、角度、玻璃反光，列车拍摄的三个关键变量。',
        date: '2026-03-02',
        minutes: 10,
        body: [
          '车窗拍摄的核心矛盾是"移动"：快门速度决定一切，1/1000s 起步是清晰底线。',
          '贴窗、垂直、避开顺光反射；选择镜头时优先考虑轻便与近摄能力。让身体成为缓冲，用连发对冲颠簸。',
        ],
      },
    ],
  },
  {
    name: 'ACR/Lightroom 基础',
    en: 'Raw Processing',
    items: [
      {
        title: 'RAW 处理的标准流程：七步从原片到成片',
        slug: 'raw-workflow',
        excerpt: '镜头校正→曝光→白平衡→影调→色彩→局部→锐化输出。',
        date: '2026-02-14',
        minutes: 11,
        body: [
          '稳定的处理顺序能避免反复：先做技术性校正，再做审美性调整，最后做输出优化。',
          '每一步只解决一个问题，调不动时回到上一步检查，比在原地加量更有效。',
        ],
      },
    ],
  },
  {
    name: 'Photoshop 进阶',
    en: 'Advanced Photoshop',
    items: [
      {
        title: '亮度蒙版实战：精确控制每一个光区',
        slug: 'luminosity-masks',
        excerpt: '用通道选区把影调控制做到像素级。',
        date: '2026-01-09',
        minutes: 16,
        body: [
          '亮度蒙版的本质是"按亮度发选区"：亮部选区调亮部，暗部选区调暗部，互不干扰。',
          '叠加两三组不同强度的蒙版，就能实现从"整体调整"到"光区雕刻"的跨越。',
        ],
      },
    ],
  },
]

export const allTutorials = tutorialGroups.flatMap((g) =>
  g.items.map((it) => ({ ...it, group: g.name, groupEn: g.en })),
)

export const tutorialBySlug = (slug: string) =>
  allTutorials.find((t) => t.slug === slug)

/** 拍摄足迹（占位坐标，交付时替换为真实 geo 数据） */
export const geoPlaces: GeoPlace[] = [
  { la: 64.18, lo: -51.72, zh: '努克', en: 'Nuuk', country: '格陵兰', n: 6 },
  { la: 70.67, lo: -23.69, zh: '乌玛纳克', en: 'Uummannaq', country: '格陵兰', n: 8 },
  { la: 29.65, lo: 91.14, zh: '拉萨', en: 'Lhasa', country: '中国', n: 12 },
  { la: 36.62, lo: 101.78, zh: '西宁', en: 'Xining', country: '中国', n: 9 },
  { la: 40.14, lo: 94.66, zh: '敦煌', en: 'Dunhuang', country: '中国', n: 7 },
  { la: 43.82, lo: 87.62, zh: '乌鲁木齐', en: 'Ürümqi', country: '中国', n: 5 },
  { la: 35.0, lo: 138.0, zh: '富士山', en: 'Mt. Fuji', country: '日本', n: 4 },
  { la: 64.14, lo: -21.94, zh: '雷克雅未克', en: 'Reykjavík', country: '冰岛', n: 6 },
  { la: 47.5, lo: 10.5, zh: '巴伐利亚', en: 'Bavaria', country: '德国', n: 3 },
  { la: 48.85, lo: 2.35, zh: '巴黎', en: 'Paris', country: '法国', n: 4 },
  { la: -33.92, lo: 18.42, zh: '开普敦', en: 'Cape Town', country: '南非', n: 3 },
  { la: -13.16, lo: -72.54, zh: '马丘比丘', en: 'Machu Picchu', country: '秘鲁', n: 4 },
  { la: 55.75, lo: 37.62, zh: '莫斯科', en: 'Moscow', country: '俄罗斯', n: 3 },
  { la: 28.61, lo: 77.21, zh: '德里', en: 'Delhi', country: '印度', n: 3 },
  { la: 41.0, lo: 28.97, zh: '伊斯坦布尔', en: 'Istanbul', country: '土耳其', n: 4 },
  { la: 30.57, lo: 114.3, zh: '武汉', en: 'Wuhan', country: '中国', n: 6 },
  { la: 31.23, lo: 121.47, zh: '上海', en: 'Shanghai', country: '中国', n: 8 },
  { la: 45.815, lo: 15.98, zh: '萨格勒布', en: 'Zagreb', country: '克罗地亚', n: 2 },
]
