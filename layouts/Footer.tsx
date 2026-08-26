import Link from 'next/link'
import logoSvg from '../assets/fav_icon_black.svg'

const ENTITY_TYPES = [
  { label: 'Knowledge base', to: '/knowledge-base' },
  { label: 'Security', to: '/security' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Partners', to: '/partners' },
  { label: 'About us', to: '/about' },
]

const SERVICES = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Press', to: '/press' },
  { label: 'Payrool', to: '/payrool' },
  { label: 'Library', to: '/library' },
  { label: 'Blog', to: '/blog' },
  { label: 'Help Center', to: '/help' },
]

const RESOURCES = [
  { label: 'Pricing', to: '/pricing' },
  { label: 'FAQs', to: '/faq' },
  { label: 'Contact Support', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
]

const SUPPORT = [
  { label: 'Contact', to: '/contact' },
  { label: 'Affiliates', to: '/affiliates' },
  { label: 'Sitemap', to: '/sitemap' },
  { label: 'Cancelation Policy', to: '/cancelation' },
  { label: 'Pricing', to: '/pricing' },
]

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#0a3d40', fontFamily: 'Montserrat, sans-serif' }}>
        {title}
      </h4>
      <ul className="flex flex-col gap-3 list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.to} className="text-sm transition-colors hover:text-[#005C66]" style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[#005C66]/10"
      style={{ border: '1px solid #e5e4e7', color: '#005C66' }}
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[#f9f9f9]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto] lg:grid-cols-[260px_1fr]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <img src={(logoSvg as { src?: string }).src ?? (logoSvg as string)} alt="White Line logo" style={{ width: 28, height: 30, flexShrink: 0 }} />
              <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: '#111118', fontFamily: 'Montserrat, sans-serif' }}>
                White Line
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
              Optix seamlessly connects your members with the community, resources.
            </p>
            <div className="flex items-center gap-2.5">
              <SocialIcon href="#" label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Pinterest">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
              </SocialIcon>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <FooterColumn title="Entity types" links={ENTITY_TYPES} />
            <FooterColumn title="Services" links={SERVICES} />
            <FooterColumn title="Resources" links={RESOURCES} />
            <FooterColumn title="Support" links={SUPPORT} />
          </div>
        </div>
      </div>
    </footer>
  )
}
