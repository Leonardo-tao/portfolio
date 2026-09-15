import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useScrollY } from '@/lib/hooks'

/**
 * 全站胶片颗粒覆盖层
 * 用内联 SVG feTurbulence 生成噪点（data URI 平铺），grain-shift 关键帧随机抖动
 */
export function GrainOverlay() {
  const noise = useMemoNoise()
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed -inset-[100%] z-[80] opacity-[0.05] animate-grain"
      style={{ backgroundImage: `url(${noise})`, backgroundSize: '340px' }}
    />
  )
}

function useMemoNoise(): string {
  // 模块级只生成一次
  return grainDataUrl ??= (() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='340' height='340'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  })()
}
let grainDataUrl: string | undefined

/** 回到顶部（滚过一屏后出现） */
export function BackToTop() {
  const y = useScrollY()
  const show = y > window.innerHeight * 0.9
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="回到顶部 Back to top"
          className="fixed bottom-6 right-6 z-[60] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
