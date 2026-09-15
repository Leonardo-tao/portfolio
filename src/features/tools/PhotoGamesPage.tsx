import { useMemo, useRef, useState } from 'react'
import { PageRoot } from '@/components/layout/PageTransition'
import { Container, Button } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { SmartImage } from '@/components/media/SmartImage'
import { useDocumentTitle } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { photosOf, allCollectionIds } from '@/data/photos'

/**
 * 照片游戏「猜构图」：看 LQIP 模糊图猜横竖构图
 * 占位小游戏——训练构图直觉的最小可玩实现
 */
export default function PhotoGamesPage() {
  useDocumentTitle('照片游戏 · 训练摄影眼')

  const pool = useMemo(
    () => photosOf(allCollectionIds).filter((_, i) => i % 5 === 0),
    [],
  )
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const nextTimer = useRef<number>(0)

  const photo = pool[round % pool.length]
  const finished = round >= 10

  const guess = (o: string) => {
    if (picked) return
    setPicked(o)
    if (o === photo.orientation) setScore((s) => s + 1)
    nextTimer.current = window.setTimeout(() => {
      setPicked(null)
      setRound((r) => r + 1)
    }, 1400)
  }

  const restart = () => {
    setRound(0)
    setScore(0)
    setPicked(null)
  }

  return (
    <PageRoot className="pt-24 md:pt-32">
      <Container className="text-center">
        <Reveal>
          <p className="kicker mb-4">Photo Games</p>
          <h1 className="display-title text-[clamp(2.6rem,7vw,5rem)]">猜构图</h1>
          <p className="mt-5 text-ink-60">
            看模糊缩略图，猜照片的原始构图。10 题一轮，训练你的构图直觉。
          </p>
          <p className="mt-4 text-sm tracking-[0.24em] text-gold">
            得分 {score} / {Math.min(round + (picked ? 1 : 0), 10)}
          </p>
        </Reveal>
      </Container>

      <Container className="mt-12 pb-28">
        {finished ? (
          <div className="mx-auto max-w-md rounded-2xl border border-gold/40 bg-dark-gray/40 p-10 text-center">
            <p className="display-title text-5xl text-gold">{score} / 10</p>
            <p className="mt-4 text-ink-60">
              {score >= 8 ? '构图直觉非常敏锐！' : score >= 5 ? '不错，继续磨练。' : '多逛逛画廊再回来挑战。'}
            </p>
            <Button className="mt-8" onClick={restart}>
              再来一轮
            </Button>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-xl border border-white/10">
              <SmartImage
                key={photo.id}
                src={photo.src}
                lqip={photo.lqip}
                w={photo.w}
                h={photo.h}
                alt="猜构图题目"
                className={cn('w-full', picked ? '' : 'blur-2xl scale-[1.02]')}
                imgClassName="transition-all duration-700"
              />
            </div>
            <div className="mt-8 flex justify-center gap-4">
              {(['landscape', 'portrait', 'square'] as const).map((o) => {
                const isRight = o === photo.orientation
                return (
                  <button
                    key={o}
                    onClick={() => guess(o)}
                    disabled={!!picked}
                    className={cn(
                      'min-w-28 cursor-pointer rounded-full border px-6 py-3 text-sm tracking-widest transition-all duration-300',
                      picked
                        ? isRight
                          ? 'border-gold bg-gold/15 text-gold'
                          : picked === o
                            ? 'border-red-500/60 text-red-400'
                            : 'border-white/10 text-ink-30'
                        : 'border-white/25 text-white/80 hover:border-gold hover:text-gold',
                    )}
                  >
                    {o === 'landscape' ? '横构图' : o === 'portrait' ? '竖构图' : '方构图'}
                  </button>
                )
              })}
            </div>
            <p className="mt-6 text-center text-xs tracking-[0.3em] text-ink-30">
              第 {Math.min(round + 1, 10)} / 10 题
            </p>
          </div>
        )}
      </Container>
    </PageRoot>
  )
}
