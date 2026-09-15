import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
} from 'motion/react'
import './TargetCursor.css'

/**
 * Target Cursor —— 十字准星光标（参考 reactbits.dev/animations/target-cursor 的交互模式，
 * 以 motion 实现的原版替代）：
 * - 圆点 + 四角 L 括号整体缓慢旋转，跟随鼠标略有拖尾
 * - 悬停可交互元素时：旋转暂停、四角"锁定"飞至元素四角并持续追踪
 * - 离开时四角回到光标四周，旋转恢复；按下有缩放反馈
 * - mix-blend-mode: difference 保证任意背景上可见
 */

const SPIN_DURATION = 2
const CORNER_SIZE = 12
const BORDER = 3
/** 四角括号中心相对光标中心的静息位（外沿距中心 1.5×size） */
const REST: [number, number][] = [
  [-CORNER_SIZE, -CORNER_SIZE], // tl
  [CORNER_SIZE, -CORNER_SIZE], // tr
  [CORNER_SIZE, CORNER_SIZE], // br
  [-CORNER_SIZE, CORNER_SIZE], // bl
]

export function TargetCursor({ targetSelector = 'a, button, [role="button"]' }: { targetSelector?: string }) {
  const [enabled, setEnabled] = useState(false)
  const [locked, setLocked] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rotation = useMotionValue(0)
  const scale = useMotionValue(1)
  const dotScale = useMotionValue(1)

  const cornerX = [useMotionValue(REST[0][0]), useMotionValue(REST[1][0]), useMotionValue(REST[2][0]), useMotionValue(REST[3][0])]
  const cornerY = [useMotionValue(REST[0][1]), useMotionValue(REST[1][1]), useMotionValue(REST[2][1]), useMotionValue(REST[3][1])]
  const cornerFx = useRef<AnimationPlaybackControls[]>([])
  const cornerFy = useRef<AnimationPlaybackControls[]>([])

  const spin = useRef<AnimationPlaybackControls | null>(null)
  const resumeTimer = useRef(0)
  const chaseRaf = useRef(0)
  const lockTarget = useRef<Element | null>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const bodyCursor = document.body.style.cursor
    document.body.classList.add('target-cursor-on')

    /* ---- 跟随移动：每次 mousemove 触发 0.12s ease-out 补间（拖尾感） ---- */
    const move = (e: MouseEvent) => {
      setVisible(true)
      animate(x, e.clientX, { duration: 0.12, ease: [0.22, 1, 0.36, 1] })
      animate(y, e.clientY, { duration: 0.12, ease: [0.22, 1, 0.36, 1] })
    }
    window.addEventListener('mousemove', move, { passive: true })

    /* ---- 旋转 ---- */
    const startSpin = () => {
      spin.current?.stop()
      const from = rotation.get()
      spin.current = animate(rotation, from + 360, {
        duration: SPIN_DURATION,
        ease: 'linear',
        repeat: Infinity,
      })
    }
    startSpin()

    /* ---- 四角补间控制 ---- */
    const tweenCorners = (
      targets: [number, number][],
      duration: number,
      ease: [number, number, number, number] | 'linear',
    ) => {
      cornerFx.current.forEach((a) => a.stop())
      cornerFy.current.forEach((a) => a.stop())
      cornerFx.current = cornerX.map((v, i) =>
        animate(v, targets[i][0], { duration, ease }),
      )
      cornerFy.current = cornerY.map((v, i) =>
        animate(v, targets[i][1], { duration, ease }),
      )
    }

    /* ---- 锁定追踪：rAF 循环把四角弹向目标元素实况四角 ---- */
    const stopChase = () => {
      cancelAnimationFrame(chaseRaf.current)
      chaseRaf.current = 0
    }
    const startChase = (el: Element) => {
      stopChase()
      const tick = () => {
        const rect = el.getBoundingClientRect()
        const cx = x.get()
        const cy = y.get()
        const o = BORDER
        const s = CORNER_SIZE
        // 括号外沿贴合元素边框外扩 o：左/上角取 +s/2（中心 = 外沿 + 半宽），右/下角取 -s/2
        const targets: [number, number][] = [
          [rect.left - o - cx + s / 2, rect.top - o - cy + s / 2],
          [rect.right + o - cx - s / 2, rect.top - o - cy + s / 2],
          [rect.right + o - cx - s / 2, rect.bottom + o - cy - s / 2],
          [rect.left - o - cx + s / 2, rect.bottom + o - cy - s / 2],
        ]
        cornerFx.current.forEach((a, i) => {
          a.stop()
          cornerFx.current[i] = animate(cornerX[i], targets[i][0], {
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          })
          cornerFy.current[i].stop()
          cornerFy.current[i] = animate(cornerY[i], targets[i][1], {
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          })
        })
        chaseRaf.current = requestAnimationFrame(tick)
      }
      chaseRaf.current = requestAnimationFrame(tick)
    }

    /* ---- 悬停进入/离开目标 ---- */
    const lockColor = '#c9a558'
    const enter = (e: MouseEvent) => {
      let el: Element | null = e.target as Element
      let target: Element | null = null
      while (el && el !== document.body) {
        if (el.matches(targetSelector)) {
          target = el
          break
        }
        el = el.parentElement
      }
      if (!target || lockTarget.current === target) return
      lockTarget.current = target
      window.clearTimeout(resumeTimer.current)

      // 旋转暂停归零，四角锁定
      spin.current?.stop()
      rotation.set(0)
      setLocked(true)
      startChase(target)
      void lockColor
    }

    const unlock = () => {
      if (!lockTarget.current) return
      lockTarget.current = null
      stopChase()
      setLocked(false)
      tweenCorners(REST, 0.3, [0.16, 1, 0.3, 1])
      // 短暂延迟后从当前角度归一化恢复旋转
      window.clearTimeout(resumeTimer.current)
      resumeTimer.current = window.setTimeout(() => {
        if (lockTarget.current) return
        const normalized = ((rotation.get() % 360) + 360) % 360
        spin.current?.stop()
        rotation.set(normalized)
        spin.current = animate(rotation, normalized + 360, {
          duration: SPIN_DURATION * (1 - normalized / 360),
          ease: 'linear',
          onComplete: startSpin,
        })
      }, 50)
    }

    const over = (e: MouseEvent) => {
      const t = e.target as Element
      if (t.matches?.(targetSelector) || t.closest?.(targetSelector)) enter(e)
      else unlock()
    }
    window.addEventListener('mouseover', over, { passive: true })

    // 滚动时若目标已不在鼠标下则解锁
    const onScroll = () => {
      if (!lockTarget.current) return
      const under = document.elementFromPoint(x.get(), y.get())
      if (!under || (under !== lockTarget.current && !under.closest(targetSelector))) {
        unlock()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    /* ---- 按下反馈 ---- */
    const down = () => {
      animate(dotScale, 0.7, { duration: 0.25 })
      animate(scale, 0.9, { duration: 0.18 })
    }
    const up = () => {
      animate(dotScale, 1, { duration: 0.25 })
      animate(scale, 1, { duration: 0.18 })
    }
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)

    return () => {
      document.body.classList.remove('target-cursor-on')
      document.body.style.cursor = bodyCursor
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      stopChase()
      spin.current?.stop()
      cornerFx.current.forEach((a) => a.stop())
      cornerFy.current.forEach((a) => a.stop())
      window.clearTimeout(resumeTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, targetSelector])

  if (!enabled) return null

  return createPortal(
    <motion.div
      aria-hidden
      className="target-cursor-wrapper"
      style={{ x, y, scale, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="target-cursor-rotor"
        style={{ rotate: rotation }}
      >
        <motion.div className="target-cursor-dot" style={{ scale: dotScale }} data-locked={locked || undefined} />
        {(['tl', 'tr', 'br', 'bl'] as const).map((pos, i) => (
          <motion.div
            key={pos}
            className={`target-cursor-corner corner-${pos}`}
            style={{ x: cornerX[i], y: cornerY[i] }}
            data-locked={locked || undefined}
          />
        ))}
      </motion.div>
    </motion.div>,
    document.body,
  )
}
