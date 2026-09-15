import { useEffect, useRef, useState } from 'react'

/** 窗口滚动位置（rAF 节流） */
export function useScrollY(): number {
  const [y, setY] = useState(0)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setY(window.scrollY))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return y
}

/** 页面滚动进度 0..1 */
export function useScrollProgress(): number {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setP(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [])
  return p
}

/** 媒体查询 */
export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatch(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return match
}

/** 定时轮播 index（页面隐藏时暂停） */
export function useInterval(cb: () => void, delay: number | null) {
  const ref = useRef(cb)
  useEffect(() => {
    ref.current = cb
  }, [cb])
  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => ref.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

/** 文档标题 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
