import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Domain setup, logo design, website builds, credibility packages, and funding-readiness positioning for entrepreneurs.',
}

const services = [
  {
    title: 'Domain Setup',
    slug: 'domain-setup',
    desc: 'The right domain found, purchased, and configured — with professional email included. Your first signal of a real business.',
    bullets: ['Domain search and acquisition', 'DNS configuration', 'Professional email setup', 'Forwarding and redirects'],
    from: '$199',
  },
  {
    title: 'Logo Design',
    slug: 'logo-design',
    desc: 'A mark built for long-term use. Works at 16px and 16 inches. Delivered with full file package and rights transfer.',
    bullets: ['2–3 initial concepts', '2 revision rounds', 'SVG, PNG, PDF files', 'Full rights transfer'],
    from: '$499',
  },
  {
    title: 'Website Build',
    slug: 'websites',
    desc: 'Mobile-first, fast, and built to convert. Not a template installation — a real business site built for your goals.',
    bullets: ['Up to 5 pages', 'Mobile-first design', 'SEO foundation', 'Contact forms'],
    from: '$1,800',
  },
  {
    title: 'Credibility Builder',
    slug: 'credibility',
    desc: 'The complete professional stack — domain, logo, website, Google Business, and LinkedIn — built together and consistent.',
    bullets: ['Full website build', 'Logo design', 'Domain + email', 'Google Business + LinkedIn'],
    from: '$2,500',
  },
  {
    title: 'Funding-Readiness Web Package',
    slug: 'funding-readiness',
    desc: 'Built for founders preparing for lenders, vendor accounts, or investors. Professional presence that can withstand scrutiny.',
    bullets: ['Full credibility stack', 'Professional copywriting', 'Business summary document', 'Pre-launch review'],
    from: '$3,500',
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-4">Services</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">Everything your business needs to look legitimate.</h1>
          <p className="text-white/50 leading-relaxed">
            We offer five core services — each scoped, priced, and delivered by people who understand what professional presence signals to customers, vendors, and lenders.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto space-y-5">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group block bg-[#111] border border-white/8 hover:border-[#F97316]/40 rounded-2xl p-8 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="text-4xl font-black text-white/8 font-mono w-12 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="font-black text-xl group-hover:text-[#F97316] transition-colors">{s.title}</h2>
                    <span className="text-xs font-bold text-[#F97316] bg-[#F97316]/10 px-2.5 py-1 rounded-full">From {s.from}</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-1">
                    {s.bullets.map((b) => (
                      <li key={b} className="text-xs text-white/35 flex items-center gap-1.5">
                        <span className="text-[#F97316]">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-white/20 group-hover:text-[#F97316] transition-colors text-xl shrink-0">→</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 border-t border-white/8 text-center">
        <p className="text-white/40 mb-4 text-sm">Not sure where to start?</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/packages" className="bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            See All Packages
          </Link>
          <Link href="/book" className="border border-white/15 hover:border-white/30 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
            Book a Free Call
          </Link>
        </div>
      </section>
    </div>
  )
}
