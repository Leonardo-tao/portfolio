import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { nav, site } from '@/data/site'
import { cn } from '@/lib/utils'
import { useScrollY } from '@/lib/hooks'

/** 光圈形 logo（SVG 原创绘制） */
export function ApertureMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1.6" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * 60 * Math.PI) / 180
        const x1 = 20 + 8 * Math.cos(a)
        const y1 = 20 + 8 * Math.sin(a)
        const x2 = 20 + 17 * Math.cos(a + 0.55)
        const y2 = 20 + 17 * Math.sin(a + 0.55)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.6"
          />
        )
      })}
    </svg>
  )
}

export function Header() {
  const y = useScrollY()
  const solid = y > 40
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => setMobileOpen(false), [location.pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-all duration-500',
        solid
          ? 'glass-bar border-white/10 py-1'
          : 'border-transparent bg-gradient-to-b from-black/55 to-transparent',
      )}
    >
      <nav
        aria-label="主导航"
        className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-3.5 md:px-10"
      >
        {/* 品牌 */}
        <Link to="/" className="group flex items-center gap-3">
          <ApertureMark />
          <span className="leading-tight">
            <span className="display-title block text-lg tracking-[0.2em]">
              {site.name}
            </span>
            <span className="block text-[10px] tracking-[0.34em] text-ink-45">
              {site.nameEn} <span className="mx-1 text-gold">·</span>{' '}
              {site.brandEn}
            </span>
          </span>
        </Link>

        {/* 桌面导航 */}
        <ul className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <li key={item.label}>
              {item.to ? (
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(navLinkCls, isActive && navActiveCls)
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <NavDropdown item={item} />
              )}
            </li>
          ))}
          <li>
            <button
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-semibold tracking-widest transition-colors hover:border-gold hover:text-gold"
              aria-label="Switch language / 切换语言"
            >
              ✦ EN
            </button>
          </li>
        </ul>

        {/* 移动端汉堡 */}
        <button
          className="cursor-pointer text-white lg:hidden"
          aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* 移动端抽屉 */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-bar overflow-hidden border-t border-white/10 lg:hidden"
          >
            <ul className="space-y-1 px-6 py-5">
              {nav.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="block py-2.5 text-lg tracking-widest"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <p className="pt-3 text-xs tracking-[0.3em] text-gold">
                        {item.label}
                      </p>
                      <ul>
                        {item.children?.map((c) => (
                          <li key={c.to}>
                            <Link
                              to={c.to}
                              className="block py-2 text-white/75 hover:text-white"
                            >
                              {c.label}
                              {c.desc && (
                                <span className="ml-3 text-xs text-ink-45">
                                  {c.desc}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

const navLinkCls =
  'relative py-1 text-[15px] tracking-[0.18em] text-white/80 transition-colors duration-300 hover:text-white'
const navActiveCls = 'text-gold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold'

/** 下拉菜单（hover + 键盘可达） */
function NavDropdown({
  item,
}: {
  item: { label: string; children?: { label: string; to: string; desc?: string }[] }
}) {
  const [open, setOpen] = useState(false)
  const timer = useRef<number>(0)
  const location = useLocation()
  const contains = item.children?.some((c) => {
    if (c.to.includes('#')) return false
    return location.pathname.startsWith(c.to)
  })

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        window.clearTimeout(timer.current)
        setOpen(true)
      }}
      onMouseLeave={() => {
        timer.current = window.setTimeout(() => setOpen(false), 160)
      }}
    >
      <button
        className={cn(navLinkCls, 'flex cursor-pointer items-center gap-1', (open || contains) && navActiveCls)}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={cn('transition-transform duration-300', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && item.children && (
          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="glass-bar absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-xl border border-white/10 p-2 shadow-2xl shadow-black/60"
          >
            {item.children.map((c) => (
              <li key={c.to}>
                <NavLink
                  to={c.to}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-4 py-3 transition-colors hover:bg-white/5',
                      isActive ? 'text-gold' : 'text-white/80 hover:text-white',
                    )
                  }
                >
                  <span className="block tracking-widest">{c.label}</span>
                  {c.desc && (
                    <span className="mt-0.5 block text-xs text-ink-45">
                      {c.desc}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
