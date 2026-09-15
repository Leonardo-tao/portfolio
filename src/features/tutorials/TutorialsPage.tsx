import { Link } from 'react-router'
import { ArrowRight, Flame } from 'lucide-react'
import { PageRoot } from '@/components/layout/PageTransition'
import { Container } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { useDocumentTitle } from '@/lib/hooks'
import { allTutorials, tutorialGroups } from '@/data/tutorials'

export default function TutorialsPage() {
  useDocumentTitle('摄影教程 · 系统化方法论')
  const featured = allTutorials.filter((t) => t.hot)
  const latest = [...allTutorials].reverse()

  return (
    <PageRoot className="pt-24 md:pt-32">
      <Container>
        <Reveal>
          <p className="kicker mb-4">Tutorials</p>
          <h1 className="display-title text-[clamp(2.6rem,7vw,5.5rem)]">摄影教程</h1>
          <p className="mt-5 max-w-2xl leading-loose text-ink-60">
            300+ 篇原创教程——从前期拍摄到后期调色，系统化的摄影方法论与完整案例复盘。
          </p>
        </Reveal>
      </Container>

      {/* 精选必读 */}
      <Container className="mt-16">
        <Reveal>
          <h2 className="display-title text-3xl md:text-4xl">精选必读教程</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {featured.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.06}>
              <TutorialCard {...t} featured />
            </Reveal>
          ))}
        </div>
      </Container>

      {/* 课程 CTA */}
      <Container className="mt-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/15 via-transparent to-transparent p-8 md:p-12">
            <p className="kicker">Systematic Course</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">
              即刻加入摄影综合系统课
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-60">
              从审美体系、前期实拍到后期全流程，一年期陪伴式训练，把"看懂"变成"拍出来"。
            </p>
            <Link
              to="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-deep-black transition-all duration-400 hover:gap-3.5 hover:bg-gold-soft"
            >
              咨询课程 <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </Container>

      {/* 分类分区 */}
      {tutorialGroups.slice(1).map((g) => (
        <Container key={g.name} className="mt-20">
          <Reveal>
            <header className="flex items-end justify-between">
              <h2 className="display-title text-3xl md:text-4xl">{g.name}</h2>
              <span className="text-xs tracking-[0.3em] text-ink-45">{g.en}</span>
            </header>
          </Reveal>
          <ul className="mt-8">
            {g.items.map((t, i) => (
              <Reveal key={t.slug} delay={i * 0.04}>
                <li className="border-t border-white/10 last:border-b">
                  <TutorialCard {...t} />
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      ))}

      {/* 最新教程链接墙 */}
      <Container className="mt-20 pb-28">
        <Reveal>
          <h2 className="display-title text-3xl md:text-4xl">最新教程</h2>
        </Reveal>
        <ul className="mt-8 columns-1 gap-10 md:columns-2 lg:columns-3">
          {latest.map((t) => (
            <li key={t.slug} className="mb-3 break-inside-avoid">
              <Link
                to={`/tutorials/a/${t.slug}`}
                className="group inline-flex items-start gap-2 text-[15px] text-white/75 transition-colors hover:text-gold"
              >
                <span className="mt-2 h-px w-3 shrink-0 bg-white/30 transition-colors group-hover:bg-gold" />
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </PageRoot>
  )
}

function TutorialCard({
  title,
  slug,
  hot,
  excerpt,
  date,
  minutes,
  featured,
}: {
  title: string
  slug: string
  hot?: boolean
  excerpt: string
  date: string
  minutes: number
  featured?: boolean
}) {
  if (!featured) {
    return (
      <Link
        to={`/tutorials/a/${slug}`}
        className="group flex items-baseline justify-between gap-6 py-5"
      >
        <span className="flex items-center gap-3 text-[15px] text-white/80 transition-colors group-hover:text-gold">
          {hot && <Flame size={14} className="shrink-0 text-gold" />}
          {title}
        </span>
        <span className="shrink-0 text-xs tracking-widest text-ink-45">{minutes} 分钟</span>
      </Link>
    )
  }
  return (
    <Link
      to={`/tutorials/a/${slug}`}
      className="group block rounded-xl border border-white/10 bg-dark-gray/40 p-7 transition-all duration-500 hover:border-gold/40 hover:bg-dark-gray/70"
    >
      <div className="flex items-center justify-between">
        {hot && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">
            <Flame size={12} /> 必读
          </span>
        )}
        <span className="text-xs tracking-widest text-ink-45">
          {date} · {minutes} 分钟
        </span>
      </div>
      <h3 className="display-title mt-4 text-xl leading-snug">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-60">{excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-[13px] tracking-[0.2em] text-gold">
        阅读全文
        <ArrowRight size={14} className="transition-transform duration-400 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
