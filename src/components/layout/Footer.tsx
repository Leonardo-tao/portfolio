import { Link } from 'react-router'
import { site } from '@/data/site'
import { Container } from '@/components/ui/primitives'
import { ApertureMark } from './Header'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <ApertureMark size={30} />
              <span className="display-title text-xl tracking-[0.18em]">
                {site.name} · {site.brand}
              </span>
            </Link>
            <p className="mt-4 text-sm tracking-wider text-ink-45">
              {site.role} | {site.honors}
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm tracking-wider text-white/70">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-300 hover:text-gold"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs tracking-[0.2em] text-white/35">
          © {new Date().getFullYear()} {site.name} {site.nameEn} ·{' '}
          {site.copyright} ·{' '}
          <Link to="/contact" className="text-white/55 hover:text-gold">
            商务合作
          </Link>
        </div>
      </Container>
    </footer>
  )
}
