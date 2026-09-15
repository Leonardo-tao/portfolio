import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 序号 → 001 样式 */
export const pad3 = (n: number) => String(n).padStart(3, '0')

/** 照片路径 */
export const photoSrc = (collection: string, name: string) =>
  `/photos/${collection}/${name}`
