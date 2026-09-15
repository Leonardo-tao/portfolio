import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { PageRoot } from '@/components/layout/PageTransition'
import { Container } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { useDocumentTitle } from '@/lib/hooks'
import { tutorialBySlug } from '@/data/tutorials'

export default function TutorialArticlePage() {
  const { slug = '' } = useParams()
  const article = tutorialBySlug(slug)
  useDocumentTitle(article ? `${article.title} · 摄影教程` : '教程不存在')

  if (!article) {
    return (
      <PageRoot className="flex min-h-[70svh] items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="display-title text-4xl">文章不存在</h1>
          <Link to="/tutorials" className="mt-6 inline-block text-gold hover:underline">
            返回教程列表
          </Link>
        </div>
      </PageRoot>
    )
  }

  return (
    <PageRoot className="pt-24 md:pt-32">
      <Container className="max-w-[880px]">
        <Reveal>
          <Link
            to="/tutorials"
            className="inline-flex items-center gap-2 text-sm tracking-[0.2em] text-white/60 transition-colors hover:text-gold"
          >
            <ArrowLeft size={15} /> 全部教程
          </Link>
          <p className="kicker mt-8 mb-3">
            {article.group} · {article.date} · {article.minutes} 分钟
          </p>
          <h1 className="display-title text-[clamp(1.9rem,5vw,3.4rem)] leading-snug">
            {article.title}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <article className="mt-10 space-y-7 border-t border-white/10 pt-10">
            {article.body.map((para, i) => (
              <p key={i} className="text-[16px] leading-loose text-white/80">
                {para}
              </p>
            ))}
          </article>
        </Reveal>

        <aside className="mt-16 rounded-xl border border-gold/30 bg-gold/5 p-7 text-center">
          <p className="display-title text-xl">这是占位文章示例</p>
          <p className="mt-3 text-sm text-ink-60">
            接入真实教程系统后，此处渲染完整图文内容（含配图、代码块与交互示例）。
          </p>
        </aside>
      </Container>
    </PageRoot>
  )
}
