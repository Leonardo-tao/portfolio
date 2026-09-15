import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  Share2,
  Aperture,
  ZoomIn,
  X,
} from 'lucide-react'
import type { Photo, PhotoExif } from '@/data/types'
import { exifOf } from '@/data/photos'
import { cn, pad3 } from '@/lib/utils'

/* ================= 灯箱全局上下文 ================= */

interface LightboxState {
  photos: Photo[]
  index: number
  dir: 1 | -1
  open: boolean
  openAt: (photos: Photo[], index: number) => void
  close: () => void
  step: (dir: 1 | -1) => void
  jumpTo: (index: number) => void
}

const LightboxContext = createContext<LightboxState | null>(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox 必须在 LightboxProvider 内使用')
  return ctx
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [open, setOpen] = useState(false)

  const openAt = useCallback((p: Photo[], i: number) => {
    setPhotos(p)
    setIndex(i)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const step = useCallback(
    (d: 1 | -1) => {
      setDir(d)
      setIndex((i) => (i + d + photos.length) % Math.max(photos.length, 1))
    },
    [photos.length],
  )
  const jumpTo = useCallback(
    (i: number) => {
      setDir(i > index ? 1 : -1)
      setIndex(i)
    },
    [index],
  )

  const value = useMemo(
    () => ({ photos, index, dir, open, openAt, close, step, jumpTo }),
    [photos, index, dir, open, openAt, close, step, jumpTo],
  )

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <LightboxOverlay />
    </LightboxContext.Provider>
  )
}

/* ================= 灯箱浮层 ================= */

function LightboxOverlay() {
  const { photos, index, dir, open, close, step, jumpTo } = useLightbox()
  const [zoom, setZoom] = useState(false)
  const [immersive, setImmersive] = useState(false)
  const [tipOpen, setTipOpen] = useState(true)

  const photo = photos[index]

  const go = useCallback(
    (d: 1 | -1) => {
      setZoom(false)
      step(d)
    },
    [step],
  )

  /* 键盘：←→ 切换，Esc 关闭（Radix 自带），F 沉浸 */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key.toLowerCase() === 'f') setImmersive((v) => !v)
      else if (e.key.toLowerCase() === 'd') {
        if (photo) window.open(photo.src, '_blank')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, photo])

  /* 切图时同步地址栏 ?p= 参数（与参考站一致的深链行为） */
  useEffect(() => {
    if (!open) return
    const url = new URL(window.location.href)
    url.searchParams.set('p', String(index + 1))
    window.history.replaceState(null, '', url)
  }, [index, open])

  if (!photo) return null
  const exif: PhotoExif = exifOf(photo)

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-xl data-[state=closed]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed inset-0 z-[100] flex flex-col outline-none',
            immersive && 'chime-immersive',
          )}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* 氛围背景：当前照片模糊放大 */}
          <div
            aria-hidden
            className="absolute inset-0 overflow-hidden"
            style={{
              backgroundImage: `url(${photo.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(72px) brightness(0.5) saturate(1.1)',
              transform: 'scale(1.2)',
              opacity: immersive ? 1 : 0.55,
              transition: 'opacity 0.6s ease',
            }}
          />

          {/* 顶栏 */}
          <header className="relative z-10 flex items-center justify-between px-5 py-4 md:px-8">
            <Dialog.Title className="text-sm tracking-[0.3em] text-white/90">
              {pad3(index + 1)} / {pad3(photos.length)}
            </Dialog.Title>
            <div className="flex items-center gap-2.5">
              <LbButton
                label={immersive ? '退出沉浸' : '全屏沉浸（F）'}
                onClick={() => setImmersive((v) => !v)}
              >
                <Expand size={17} />
              </LbButton>
              <LbButton label="分享">
                <Share2 size={17} />
              </LbButton>
              <LbButton
                label="下载（D）"
                onClick={() => window.open(photo.src, '_blank')}
              >
                <Download size={17} />
              </LbButton>
              <LbButton
                label="缩放"
                onClick={() => setZoom((v) => !v)}
                active={zoom}
              >
                <ZoomIn size={17} />
              </LbButton>
              <Dialog.Close asChild>
                <LbButton label="关闭（Esc）">
                  <X size={17} />
                </LbButton>
              </Dialog.Close>
            </div>
          </header>

          {/* 小技巧提示卡 */}
          <AnimatePresence>
            {tipOpen && (
              <motion.aside
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="absolute right-5 top-16 z-20 hidden w-64 rounded-lg border border-gold/30 bg-black/85 p-4 text-[13px] leading-6 md:right-8 md:block"
              >
                <button
                  onClick={() => setTipOpen(false)}
                  aria-label="关闭提示"
                  className="absolute right-3 top-2.5 cursor-pointer text-white/40 hover:text-white"
                >
                  <X size={14} />
                </button>
                <p className="mb-1 text-gold">小技巧 · TIP</p>
                <p className="text-white/70">
                  <kbd className="text-gold">F</kbd> 全屏沉浸欣赏
                  <br />
                  <kbd className="text-gold">D</kbd> 下载原图 ·{' '}
                  <kbd className="text-gold">←→</kbd> 切换
                </p>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* 图片区 */}
          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-14 md:px-24">
            <LbArrow side="left" onClick={() => go(-1)} />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={photo.id}
                src={photo.src}
                alt={`${photo.collection} · ${pad3(photo.index)}`}
                initial={{ opacity: 0, x: 48 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 * dir }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setZoom((v) => !v)}
                className={cn(
                  'max-h-full max-w-full rounded-sm object-contain shadow-2xl shadow-black/60',
                  zoom
                    ? 'h-full w-auto max-w-none cursor-zoom-out'
                    : 'cursor-zoom-in',
                )}
              />
            </AnimatePresence>
            <LbArrow side="right" onClick={() => go(1)} />
          </div>

          {/* EXIF 栏 */}
          <footer className="relative z-10">
            <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-black/60 px-5 py-3 text-[12.5px] tracking-wider text-white/70 md:px-8">
              <p className="flex items-center gap-2">
                <Aperture size={14} className="text-gold" />
                {exif.body} · {exif.focal} · {exif.aperture} · {exif.shutter} ·
                ISO{exif.iso} · {exif.date}
              </p>
              <button className="cursor-pointer rounded-full border border-white/20 px-4 py-1.5 transition-colors hover:border-gold hover:text-gold">
                拍摄手记
              </button>
            </div>

            {/* 胶片条 */}
            <FilmStrip
              photos={photos}
              index={index}
              onSelect={(i) => {
                jumpTo(i)
                setZoom(false)
              }}
            />

            <p className="pb-3 pt-2 text-center text-[11px] tracking-[0.25em] text-white/35">
              ← → 切换 · 滚轮缩放 · F 全屏沉浸 · D 下载 · ESC 关闭
            </p>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function LbButton({
  children,
  label,
  active,
  ...rest
}: React.ComponentProps<'button'> & { label: string; active?: boolean }) {
  return (
    <button
      title={label}
      aria-label={label}
      className={cn(
        'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:border-gold hover:text-gold',
        active && 'border-gold bg-gold/15 text-gold',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

function LbArrow({
  side,
  onClick,
}: {
  side: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={side === 'left' ? '上一张' : '下一张'}
      className={cn(
        'absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur transition-all duration-300 hover:border-gold hover:text-gold',
        side === 'left' ? 'left-3 md:left-6' : 'right-3 md:right-6',
      )}
    >
      {side === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  )
}

function FilmStrip({
  photos,
  index,
  onSelect,
}: {
  photos: Photo[]
  index: number
  onSelect: (i: number) => void
}) {
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stripRef.current?.children[index] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [index])

  return (
    <div
      ref={stripRef}
      className="scrollbar-none flex gap-1.5 overflow-x-auto px-5 py-2 md:px-8"
      role="listbox"
      aria-label="缩略图导航"
    >
      {photos.map((p, i) => (
        <button
          key={p.id}
          role="option"
          aria-selected={i === index}
          onClick={() => onSelect(i)}
          className={cn(
            'relative h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded-sm border-2 transition-all duration-300',
            i === index
              ? 'border-gold opacity-100'
              : 'border-transparent opacity-50 hover:opacity-90',
          )}
        >
          <img src={p.lqip || p.src} alt="" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  )
}
