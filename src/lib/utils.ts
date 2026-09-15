import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 序号 → 001 样式 */
export const pad3 = (n: number) => String(n).padStart(3, '0')

/** 基于 Vite base 的资源路径（部署到子路径时自动加前缀） */
export const withBase = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/** 照片路径 */
export const photoSrc = (collection: string, name: string) =>
  withBase(`/photos/${collection}/${name}`)
