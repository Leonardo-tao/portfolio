import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ApertureMark } from './Header'
import { site } from '@/data/site'

const SEEN_KEY = 'boot-intro-seen'

/**
 * 开场动画：快门叶片开合 + 光圈旋转 + 品牌标题
 * 每个浏览器会话仅首次显示（sessionStorage 记忆）
 */
export function BootIntro() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      document.documentElement.classList.remove('boot-lock')
      return
    }
    setShow(true)
    const t = window.setTimeout(() => finish(), 2100)
    return () => window.clearTimeout(t)
  }, [])

  const finish = () => {
    sessionStorage.setItem(SEEN_KEY, '1')
    setShow(false)
    document.documentElement.classList.remove('boot-lock')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden
        >
          {/* 快门叶片（六叶开合） */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-deep-black"
              style={{
                clipPath: `polygon(50% 50%, ${bladePolygon(i)})`,
                transformOrigin: '50% 50%',
              }}
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: 14, rotate: 18 }}
              exit={{ scale: 14, opacity: 0 }}
              transition={{
                duration: 1.15,
                delay: 0.85 + i * 0.045,
                ease: [0.87, 0, 0.13, 1],
              }}
            />
          ))}

          {/* 金色闪光 */}
          <motion.div
            className="absolute inset-0 bg-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.22, 0] }}
            transition={{ duration: 0.7, delay: 0.9, times: [0, 0.3, 1] }}
          />

          {/* 品牌标识 */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
            transition={{
              duration: 2,
              times: [0, 0.25, 0.8, 1],
              ease: 'easeOut',
            }}
          >
            <ApertureMark size={64} />
            <p className="display-title text-2xl tracking-[0.5em] text-white">
              {site.name}
            </p>
            <p className="text-xs tracking-[0.6em] text-gold">{site.brandEn}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** 六片扇叶的三角形顶点（快门合拢形态） */
function bladePolygon(i: number): string {
  const a1 = (i * 60 - 90) * (Math.PI / 180)
  const a2 = ((i + 1) * 60 - 90) * (Math.PI / 180)
  const R = 150 // 覆盖到屏幕外的半径
  const p1 = `${50 + R * Math.cos(a1)} ${50 + R * Math.sin(a1)}`
  const p2 = `${50 + R * Math.cos(a2)} ${50 + R * Math.sin(a2)}`
  return `${p1}, ${p2}`
}
