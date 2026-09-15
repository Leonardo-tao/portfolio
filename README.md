# LUMEN · 摄影作品集网站

参考 chuweimin.com 的设计模式一比一复刻的摄影作品集 SPA。暗黑摄影画廊美学：深黑底 × 金色强调 × 思源宋体展示标题 × Manrope 正文。

> 当前全部使用占位照片（`public/photos/`，picsum 随机图）与占位文案（品牌"林远 LUMEN"）。交付使用前替换为摄影师本人的作品与资料。

## 技术选型

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | React 19 + TypeScript + Vite 8 | 与参考站同构（其亦是 Vite SPA） |
| 路由 | react-router v7（BrowserRouter） | 真实路径 `/series/:slug` 等 |
| 样式 | Tailwind CSS v4 | `@theme` 设计令牌集中在 `src/index.css` |
| 动画 | motion（framer-motion）+ CSS keyframes | 参考站为手写 rAF+IO，复刻用 motion 等价实现更易维护 |
| UI 基建 | Radix 原语（Dialog 等）+ 自绘组件 | 灯箱/下拉等全定制视觉，只借用无头可访问性 |
| 图标 | lucide-react | |
| 字体 | @fontsource Manrope Variable + Noto Serif SC（unicode-range 分片） | |
| 数据 | 静态 JSON（`public/data/`） | 与参考站同构的数据模型 |
| 图片管线 | sharp（`scripts/generate-photos.mjs`） | 下载占位图 + 生成 base64 LQIP + manifest |

**后端（长期预留）**：当前零后端。留言墙/机位收藏/后台管理（参考站 `/backstage`）预留 API 接口层，建议路线：Hono + Cloudflare Pages Functions（与现有静态部署同源）。

## 目录结构

```
src/
  components/
    ui/                 # 原子组件：Button/Chip/SectionHeader/Reveal…
    media/              # SmartImage(LQIP blur-up)/Lightbox/FootprintMap
    layout/             # Header/Footer/BootIntro/PageTransition/Atmosphere(颗粒/光标/回顶)
  features/             # 按领域分包
    home/               # 首页（Hero轮播/宣言/系列卡/统计带）
    series/             # 系列详情（固定Hero转场/阐述/瀑布流/列车地图/下一系列）
    gallery/            # travel & commercial 共用画廊页
    about/ tutorials/ archive/ contact/ tools/
  data/                 # 类型 + 站点配置 + 系列内容 + 照片派生 + 教程/地理数据
  lib/                  # cn 工具 + hooks(useScrollY/useScrollProgress/…)
public/
  photos/<collection>/  # 001.webp…（占位）
  data/manifest.json    # { [collection]: [{n,w,h,q(LQIP base64)}] }
scripts/
  generate-photos.mjs   # 占位图+LQIP+manifest 生成器
```

## 数据规范（与参考站同构）

- 照片文件名建议 `YYYYMMDD_HHMMSS_E.webp`——日期可从文件名派生年份，无需额外字段
- `manifest.json`：`n`(文件名) `w`/`h`(尺寸→构图派生) `q`(24px 模糊缩略 base64)
- 替换真实作品流程：照片放入 `public/photos/<collection>/` → `node scripts/generate-photos.mjs`（跳过已存在文件并重算 LQIP）→ 修改 `src/data/site.ts` / `src/data/series.ts` 文案

## 关键实现（对应参考站行为）

- **开场快门动画** `BootIntro`：六叶 clip-path 快门开合 + 品牌浮现，sessionStorage 每会话一次
- **Hero 轮播**：背景 `hero-drift` 漂移缩放 + 交叉淡入；标题逐字入场；右下横线指示器
- **系列页固定转场**：Hero 媒体层 `position:fixed`，`useScroll` 驱动 opacity/scale，画廊（半透明深底）滑上覆盖
- **LQIP blur-up** `SmartImage`：两层 img（模糊 LQIP → 实图淡入），宽高比锁定布局
- **灯箱**：Radix Dialog + 同图模糊氛围背景 + EXIF 栏 + 胶片条导航 + 键盘（←→/F/D/Esc）+ `?p=` 深链
- **列车地图**：SVG 线路 + `useScroll` 驱动金色进度线与列车标记，区间标题/里程/海拔实时插值
- **Target Cursor 准星光标**（参考 reactbits.dev 同名组件的交互，以 motion 原创实现）：圆点 + 四角 L 括号缓慢旋转，悬停 `a/button/[role=button]` 时四角锁定飞至元素边框并持续追踪（变金色），离开回位恢复旋转，按下缩放反馈；`mix-blend-mode: difference` 全背景可见，仅精确指针设备启用
- **全站氛围**：feTurbulence 胶片颗粒覆盖层、回到顶部

**`?static=1` 静态模式**：跳过开场动画、所有入场动画直出终态（配合 MotionConfig，同时尊重系统"减少动态"偏好）。用于截图/e2e 测试。

## 命令

```bash
npm install
npm run dev        # 开发
npm run build      # 类型检查 + 生产构建
npm run preview    # 预览产物
node scripts/generate-photos.mjs   # 重新生成占位图/LQIP/manifest
```

## 长期路线图

1. **路由级代码分割**：React.lazy + Suspense 按页分包（当前单 chunk ~575KB，构建有体积提示）
2. **真实内容接入**：替换占位照片/文案/EXIF；EXIF 建议独立 `photo-meta.json`
3. **i18n**：/en 英文版（数据文件已按 zh/en 双语字段设计）
4. **后端**：Hono + CF Functions——留言墙持久化、机位收藏、`/backstage` 管理后台（照片上传 → 自动 LQIP/manifest）
5. **地图升级**：列车地图/足迹图替换为 Leaflet + 暗色瓦片（无 key）或高德（国内精度）
6. **PWA**：vite-plugin-pwa（manifest/离线缓存/iOS 启动屏）
7. **SEO**：参考站方案——每路由预渲染静态壳 + JSON-LD + OG 卡片生成脚本
8. **e2e**：Playwright（`?static=1` 模式下跑视觉断言）

## 研究资料

参考站逐页分析笔记见 `../_reference/NOTES.md`（页面结构、动画清单、数据模型、设计令牌）；QA 截图见 `../_qa/`。
