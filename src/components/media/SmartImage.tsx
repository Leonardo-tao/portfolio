import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * 两层结构图片：LQIP 模糊占位（blur + 放大）→ 实图淡入覆盖
 * 懒加载进入视口才请求实图，布局用宽高比锁定避免跳动
 */
export function SmartImage({
  src,
  lqip,
  w,
  h,
  alt,
  className,
  imgClassName,
  priority = false,
}: {
  src: string
  lqip?: string
  w?: number
  h?: number
  alt: string
  className?: string
  imgClassName?: string
  priority?: boolean
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn('relative overflow-hidden bg-dark-gray', className)}
      style={w && h ? { aspectRatio: `${w} / ${h}` } : undefined}
    >
      {lqip && (
        <img
          src={lqip}
          alt=""
          aria-hidden
          className={cn(
            'absolute inset-0 h-full w-full scale-110 object-cover blur-md transition-opacity duration-700',
            loaded ? 'opacity-0' : 'opacity-100',
          )}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          'relative h-full w-full object-cover transition-opacity duration-700',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  )
}
