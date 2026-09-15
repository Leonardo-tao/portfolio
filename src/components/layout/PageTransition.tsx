import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { motion } from 'motion/react'

/**
 * 路由切换过场：顶部金色进度条 + 新页内容整体上升渐入
 * 内容动画由各页面根节点的 motion.main key=pathname 驱动
 */
export function RouteProgress() {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(t)
  }, [pathname])

  if (!loading) return null
  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-0.5" aria-hidden>
      <div className="h-full w-full origin-left animate-progress bg-gold" />
    </div>
  )
}

/** 页面根节点：key 切换时触发上升入场 */
export function PageRoot({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.main
      id="main"
      className={className}
      initial={{ opacity: 0, y: 44 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.main>
  )
}
