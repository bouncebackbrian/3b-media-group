import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3B Media Group — Professional Business Presence for Entrepreneurs',
  description: 'Domain setup, logo design, website builds, and credibility packages. Built for entrepreneurs who need to look like they mean business.',
}

const services = [
  { title: 'Domain Setup', desc: 'The right domain found, purchased, and configured. Professional email included.', href: '/services/domain-setup', icon: '⬡' },
  { title: 'Logo Design', desc: 'A mark that holds up everywhere — digital, print, proposal, and pitch.', href: '/services/logo-design', icon: '◈' },
  { title: 'Website Build', desc: 'Mobile-first, fast, and built to convert. Not a template — a real business site.', href: '/services/websites', icon: '▣' },
  { title: 'Credibility Builder', desc: 'Full stack: domain, logo, site, Google Business, and LinkedIn — done together.', href: '/services/credibility', icon: '◆' },
  { title: 'Funding Readiness', desc: 'Your online presence configured to support the conversation, not work against it.', href: '/services/funding-readiness', icon: '◉' },
]

const steps = [
  { n: '01', title: 'Choose your package or book a call.', body: 'Start with a fixed package if you know what you need. Talk to us first if you want a recommendation.' },
  { n: '02', title: 'Complete your intake.', body: 'Tell us about your business. We ask the right questions so we build the right thing — no guesswork.' },
  { n: '03', title: 'We build. You review. We launch.', body: 'Revisions are included. You stay informed. We do not disappear mid-project.' },
]

const industries = [
  'Trucking & Logistics', 'Real Estate', 'Consulting', 'Service Contractors',
  'Online Sellers', 'Healthcare & Wellness', 'Startups', 'Creators & Coaches',
]

const packages = [
  {
    name: 'Brand Starter',
    price: '$499',
    desc: 'Logo design with full file delivery and brand color palette.',
    bullets: ['2–3 initial concepts', '2 revision rounds', 'SVG, PNG, PDF files', 'Full rights transfer'],
    slug: 'brand-starter',
    featured: false,
  },
  {
    name: 'Website Launch',
    price: '$1,800',
    desc: 'A professional 5-page site built to convert and built to last.',
    bullets: ['Up to 5 pages', 'Mobile-first design', 'Contact forms + SEO setup', '30-day post-launch support'],
    slug: 'website-launch',
    featured: true,
  },
  {
    name: 'Credibility Builder',
    price: '$2,500',
    desc: 'The full stack — domain, logo, website, and business profiles.',
    bullets: ['Everything in Website Launch', 'Logo design included', 'Domain + email setup', 'Google Business + LinkedIn'],
    slug: 'credibility-builder',
    featured: false,
  },
]

export default function HomePage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">

      {/* HERO */}
      <section className="px-6 py-28 md:py-36 border-b border-white/8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-5">
            3B Media Group
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.08] mb-6 tracking-tight">
            Your Business Needs to Look<br />
            <span className="text-[#F97316]">Like It Belongs.</span>
          </h1>
          <p className="text-lg text-white/55 max-w-2xl mx-auto leading-relaxed mb-10">
            We build the professional foundation that makes your business credible — domain, logo, website, and positioning — so you show up ready for customers, vendors, and lenders.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/start-project"
              className="bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-7 py-3.5 rounded-xl text-[15px] transition-colors"
            >
              Start Your Project →
            </Link>
            <Link
              href="/book"
              className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-7 py-3.5 rounded-xl text-[15px] transition-colors"
            >
              Book a Free Call
            </Link>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-12 max-w-2xl">
            Most entrepreneurs lose deals before the first conversation.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-10 h-0.5 bg-[#F97316] mb-5" />
              <p className="text-white/55 text-sm leading-relaxed">
                When someone searches your business and finds nothing — or finds something that looks amateur — the answer is already no.
              </p>
            </div>
            <div>
              <div className="w-10 h-0.5 bg-[#F97316] mb-5" />
              <p className="text-white/55 text-sm leading-relaxed">
                A bad domain, no logo, or a half-built site signals you are not ready. That costs you customers, vendor relationships, and funding conversations.
              </p>
            </div>
            <div>
              <div className="w-10 h-0.5 bg-[#F97316] mb-5" />
              <p className="text-white/55 text-sm leading-relaxed">
                You do not need a huge budget. You need the right infrastructure, built correctly, by people who understand what professionalism signals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-3">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-black">We build the infrastructure your business runs on.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="bg-[#111] border border-white/8 hover:border-[#F97316]/40 rounded-2xl p-7 group transition-colors"
              >
                <div className="text-[#F97316] text-2xl mb-4 font-mono">{s.icon}</div>
                <h3 className="font-bold text-[15px] mb-2 group-hover:text-[#F97316] transition-colors">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
            <Link
              href="/services"
              className="bg-transparent border border-white/8 hover:border-white/20 rounded-2xl p-7 flex items-center justify-center group transition-colors"
            >
              <span className="text-sm text-white/40 group-hover:text-white transition-colors">See all services →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PACKAGES PREVIEW */}
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-black">Choose your starting point.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div
                key={pkg.slug}
                className={`rounded-2xl p-7 flex flex-col ${
                  pkg.featured
                    ? 'bg-[#F97316]/10 border border-[#F97316]/40'
                    : 'bg-[#111] border border-white/8'
                }`}
              >
                {pkg.featured && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#F97316] mb-4">Most Popular</span>
                )}
                <h3 className="font-black text-lg mb-1">{pkg.name}</h3>
                <p className="text-3xl font-black text-[#F97316] mb-3">{pkg.price}</p>
                <p className="text-sm text-white/50 mb-5 leading-relaxed">{pkg.desc}</p>
                <ul className="space-y-2 mb-7 flex-1">
                  {pkg.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-white/65">
                      <span className="text-[#F97316] mt-0.5 shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout/${pkg.slug}`}
                  className={`text-center py-3 rounded-xl text-sm font-bold transition-colors ${
                    pkg.featured
                      ? 'bg-[#F97316] hover:bg-[#ea6c0a] text-white'
                      : 'border border-white/15 hover:border-white/30 text-white'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/packages" className="text-sm text-white/40 hover:text-white transition-colors">
              See all packages including Done-For-You Launch →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl font-black">From start to live in three steps.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="text-4xl font-black text-white/10 mb-4 font-mono">{s.n}</div>
                <h3 className="font-bold text-[15px] mb-3">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUNDING READINESS */}
      <section className="px-6 py-24 border-b border-white/8 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-5">Funding Readiness</p>
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            We help businesses look ready.<br />The rest is up to the conversation.
          </h2>
          <p className="text-white/55 leading-relaxed mb-6 max-w-2xl">
            Many of our clients are preparing for growth — approaching lenders, applying for vendor accounts, or building toward a funding conversation. A professional, complete online presence is part of that picture.
          </p>
          <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-2xl">
            We are not in the business of making promises about outcomes we cannot control. What we build is the infrastructure side of credibility — because it matters, and because too many capable founders show up without it.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/services/funding-readiness" className="bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              See Funding-Readiness Package
            </Link>
            <Link href="/disclaimer" className="border border-white/15 text-white/50 hover:text-white px-6 py-3 rounded-xl text-sm transition-colors">
              Read Our Disclaimer
            </Link>
          </div>
          <p className="text-white/25 text-xs mt-6 max-w-xl leading-relaxed">
            3B Media Group does not guarantee funding approvals, loan outcomes, or lender decisions. Services are designed to support professional business presentation only.
          </p>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-5">Who We Work With</p>
          <h2 className="text-2xl md:text-3xl font-black mb-10">Built for founders across industries.</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {industries.map((ind) => (
              <span
                key={ind}
                className="border border-white/10 text-white/50 text-sm px-4 py-2 rounded-full"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-28">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-5">
            Ready to look like the business you are building?
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Start with a package or talk to us first. Either way, we move fast.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/start-project"
              className="bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-7 py-3.5 rounded-xl text-[15px] transition-colors"
            >
              Start Your Project →
            </Link>
            <Link
              href="/book"
              className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-7 py-3.5 rounded-xl text-[15px] transition-colors"
            >
              Book a Free Call
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
