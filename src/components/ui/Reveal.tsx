import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const variants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

/** 静态模式：?static=1 时跳过全部入场动画（截图/e2e 用） */
export const isStaticMode = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('static')

/** 滚动渐入包装器（进入视口触发一次） */
export function Reveal({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode
  delay?: number
  className?: string
  once?: boolean
}) {
  const reduced = useReducedMotion()

  // 无障碍：用户偏好减少动态时直接呈现终态
  if (reduced || isStaticMode()) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '0px 0px -60px 0px' }}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}
