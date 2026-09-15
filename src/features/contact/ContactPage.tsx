import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Send } from 'lucide-react'
import { PageRoot } from '@/components/layout/PageTransition'
import { Container } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { useDocumentTitle } from '@/lib/hooks'
import { site } from '@/data/site'

/** 留言墙（占位：本地状态，接后端后改为 API 提交） */
interface WallMessage {
  name: string
  text: string
  time: string
}

const seedMessages: WallMessage[] = [
  { name: '山与海', text: '高原铁路那组照片看了很多遍，车窗像一幅幅流动的画。', time: '2026-09-10' },
  { name: '北纬66度', text: '请问北方之境系列什么时候出画册？一定支持！', time: '2026-09-08' },
  { name: 'Momo', text: '教程写得太系统了，跟着练了三个月，照片终于有了层次感。', time: '2026-09-05' },
  { name: '老周', text: '商务合作已发邮件，期待回复。', time: '2026-09-01' },
  { name: '追光者', text: '在现场看过一次展览，印刷品的质感太震撼了。', time: '2026-08-28' },
]

export default function ContactPage() {
  useDocumentTitle('联系与合作')
  const [messages, setMessages] = useState<WallMessage[]>(seedMessages)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [ok, setOk] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setMessages((m) => [
      { name: name.trim(), text: text.trim(), time: new Date().toISOString().slice(0, 10) },
      ...m,
    ])
    setName('')
    setText('')
    setOk(true)
    window.setTimeout(() => setOk(false), 2600)
  }

  return (
    <PageRoot className="pt-24 md:pt-32">
      <Container className="text-center">
        <Reveal>
          <p className="kicker mb-4">Contact</p>
          <h1 className="display-title text-[clamp(2.6rem,7vw,5.5rem)]">联系与合作</h1>
          <p className="mt-6 text-ink-60">
            商务合作与拍摄委托请通过社交平台私信或邮件联系；也欢迎在留言墙说点什么。
          </p>
        </Reveal>
      </Container>

      {/* 社交矩阵 */}
      <Container className="mt-16">
        <Reveal>
          <h2 className="display-title text-center text-2xl md:text-3xl">
            社交媒体全网同名 <span className="text-gold">{site.brandEn}</span>
          </h2>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {site.socials.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <li>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-dark-gray/40 px-6 py-5 transition-all duration-500 hover:border-gold/40 hover:bg-dark-gray/70"
                >
                  <span className="tracking-widest text-white/85">{s.label}</span>
                  <span className="text-ink-30 transition-all duration-400 group-hover:translate-x-1 group-hover:text-gold">↗</span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>

      {/* 留言墙 */}
      <Container className="mt-24 pb-28">
        <Reveal>
          <h2 className="display-title text-3xl md:text-4xl">留言墙</h2>
        </Reveal>

        <Reveal delay={0.06}>
          <form
            onSubmit={submit}
            className="mt-8 rounded-2xl border border-white/10 bg-dark-gray/40 p-6 md:p-8"
          >
            <div className="grid gap-4 md:grid-cols-[240px_1fr_auto]">
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 16))}
                placeholder="你的昵称（16 字以内）"
                aria-label="昵称"
                className="rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-30 focus:border-gold"
              />
              <input
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 200))}
                placeholder="写下你想对摄影师说的话（200 字以内）"
                aria-label="留言内容"
                className="rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-30 focus:border-gold"
              />
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-deep-black transition-all duration-400 hover:gap-3 hover:bg-gold-soft"
              >
                <Send size={15} /> 送出留言
              </button>
            </div>
            <AnimatePresence>
              {ok && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-sm text-gold"
                >
                  留言已贴上墙（当前为演示模式，接入后端后持久保存）
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((m, i) => (
            <Reveal key={`${m.time}-${i}`} delay={Math.min(i, 6) * 0.05}>
              <li className="h-full rounded-xl border border-white/10 bg-dark-gray/40 p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-semibold tracking-wider text-gold">{m.name}</p>
                  <p className="text-xs text-ink-30">{m.time}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{m.text}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </PageRoot>
  )
}
