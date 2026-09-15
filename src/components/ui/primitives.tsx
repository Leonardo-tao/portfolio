import type { ReactNode, ComponentProps } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

/* ---------- 容器 ---------- */
export function Container({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('mx-auto max-w-[1600px] px-5 md:px-10', className)}>
      {children}
    </div>
  )
}

/* ---------- 按钮 ---------- */
const buttonBase =
  'inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-500 ease-expo-out select-none cursor-pointer'

const variants = {
  solid:
    'bg-white text-deep-black hover:bg-gold hover:text-deep-black px-7 py-3.5 hover:gap-4',
  ghost:
    'border border-white/25 text-white hover:border-gold hover:text-gold px-7 py-3.5 hover:gap-4',
  gold: 'bg-gold text-deep-black hover:bg-gold-soft px-7 py-3.5 hover:gap-4',
} as const

type ButtonVariant = keyof typeof variants

export function Button({
  variant = 'solid',
  className,
  children,
  ...rest
}: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return (
    <button className={cn(buttonBase, variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'solid',
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link className={cn(buttonBase, variants[variant], className)} {...rest}>
      {children}
    </Link>
  )
}

/* ---------- 圆形图标按钮 ---------- */
export function IconButton({
  className,
  children,
  ...rest
}: ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80',
        'transition-all duration-400 ease-expo-out hover:border-gold hover:text-gold',
        'cursor-pointer bg-black/30 backdrop-blur-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ---------- 胶囊标签 ---------- */
export function Chip({
  active,
  className,
  children,
  ...rest
}: ComponentProps<'button'> & { active?: boolean }) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        'cursor-pointer rounded-full border px-4 py-1.5 text-[13px] tracking-wide transition-all duration-300',
        active
          ? 'border-gold bg-gold/10 text-gold'
          : 'border-white/15 text-ink-60 hover:border-white/40 hover:text-white',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ---------- 分区标题（小金标 + 大宋体 + 右注） ---------- */
export function SectionHeader({
  kicker,
  title,
  aside,
  id,
  className,
}: {
  kicker: string
  title: string
  aside?: string
  id?: string
  className?: string
}) {
  return (
    <header className={cn('mb-10 md:mb-14', className)}>
      <p className="kicker mb-3">{kicker}</p>
      <div className="flex items-end justify-between gap-6">
        <h2
          id={id}
          className="display-title text-[clamp(2.4rem,6vw,4.5rem)] leading-none"
        >
          {title}
        </h2>
        {aside && (
          <p className="hidden pb-2 text-sm tracking-widest text-ink-45 md:block">
            {aside}
          </p>
        )}
      </div>
    </header>
  )
}

/* ---------- 金色细线 ---------- */
export function GoldRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-block h-px w-12 bg-gold align-middle', className)}
    />
  )
}
