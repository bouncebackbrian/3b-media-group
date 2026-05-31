import Link from 'next/link'
import Image from 'next/image'

const services = [
  { label: 'Marketing', href: '/services/marketing' },
  { label: 'Websites', href: '/services/websites' },
  { label: 'AI Solutions', href: '/services/ai-solutions' },
  { label: 'Creative Services', href: '/services/creative' },
  { label: 'Business Growth', href: '/services/business-growth' },
]

const company = [
  { label: 'Business Growth Wizard', href: '/grow' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const legal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Funding Disclaimer', href: '/disclaimer' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#0A1A2F] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="mb-4">
              <Image
                src="/3b-media-logo.png"
                alt="3B Media Group"
                width={56}
                height={56}
                className="w-14 h-14 object-contain"
              />
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Professional business presence services for entrepreneurs who are serious about growth.
            </p>
            <p className="text-xs text-white/25 mt-4">
              Part of the{' '}
              <a href="https://bouncebackbrian.com" className="text-[#14B8A6] hover:underline">
                3B Ecosystem
              </a>
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} 3B Media Group. All rights reserved.
          </p>
          <p className="text-xs text-white/20 text-center md:text-right max-w-md">
            3B Media Group does not guarantee funding approvals, loan outcomes, or lender decisions. Services are designed to support professional business presentation only.
          </p>
        </div>
      </div>
    </footer>
  )
}
