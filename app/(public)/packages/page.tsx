import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Packages & Pricing',
  description: 'Fixed-price packages for domain setup, logo design, website builds, and business credibility. No surprise costs.',
}

const packages = [
  {
    name: 'Domain Starter',
    price: '$199',
    priceNote: '+ domain cost',
    desc: 'For businesses that need a professional domain and email — fast.',
    bullets: ['Domain availability search', 'Domain acquisition support', 'DNS configuration', 'Professional email setup', 'Forwarding and redirect setup'],
    excludes: 'Logo, website, hosting, content',
    slug: 'domain-starter',
    type: 'Fixed Price',
    cta: 'Get Started',
  },
  {
    name: 'Brand Starter',
    price: '$499',
    priceNote: null,
    desc: 'A logo that holds up in every context — delivered with full files and rights.',
    bullets: ['2–3 initial logo concepts', '2 revision rounds', 'SVG, PNG, PDF — light + dark', 'Brand color palette', 'Full rights transfer on delivery'],
    excludes: 'Website, domain, brand guidelines doc',
    slug: 'brand-starter',
    type: 'Fixed Price',
    cta: 'Get Started',
  },
  {
    name: 'Website Launch',
    price: '$1,800',
    priceNote: null,
    desc: 'A professional 5-page site designed to convert — not just to exist.',
    bullets: ['Up to 5 pages', 'Mobile-first responsive design', 'Contact/lead form', 'SEO foundation', 'Google Analytics setup', '2 revision rounds', '30-day post-launch support'],
    excludes: 'Copywriting (client provides content), photography',
    slug: 'website-launch',
    type: 'Fixed Price',
    cta: 'Get Started',
    featured: true,
  },
  {
    name: 'Credibility Builder',
    price: '$2,500',
    priceNote: null,
    desc: 'The complete professional stack for businesses preparing for real growth.',
    bullets: ['Everything in Website Launch', 'Logo design (Brand Starter)', 'Domain setup (Domain Starter)', 'Professional email setup', 'Google Business Profile', 'LinkedIn company page', 'Business description copy'],
    excludes: 'Financial services, lender introductions',
    slug: 'credibility-builder',
    type: 'Fixed Price',
    cta: 'Get Started',
  },
  {
    name: 'Funding-Readiness Web Package',
    price: '$3,500',
    priceNote: null,
    desc: 'Built for founders preparing for a funding conversation, vendor account, or loan application.',
    bullets: ['Everything in Credibility Builder', 'Full website copywriting', 'Business summary document', 'Domain, email, logo, site — full stack', 'Pre-launch review checklist'],
    excludes: 'Financial consultation, loan preparation, lender matching',
    slug: 'funding-readiness-web',
    type: 'Fixed Price',
    cta: 'Get Started',
    disclaimer: true,
  },
  {
    name: 'Done-For-You Launch',
    price: '$5,000',
    priceNote: '50% deposit to start',
    desc: 'Everything handled. You answer questions and approve. We do the rest.',
    bullets: ['Brand strategy call (45 min)', 'Domain, logo, 7-page website', 'Full copywriting for all pages', 'Google Business + LinkedIn', 'Social profile setup (2–3 platforms)', '30-day post-launch support', 'Launch checklist + handoff call'],
    excludes: 'Paid ad campaigns, ongoing content, SEO retainer',
    slug: 'done-for-you-launch',
    type: 'Deposit Model',
    cta: 'Request This Package',
  },
]

const addons = [
  { name: 'Full brand guidelines PDF', price: '$150–$250' },
  { name: 'Additional website pages', price: '$150–$350 each' },
  { name: 'Copywriting per page', price: '$75–$150' },
  { name: 'Monthly care plan — Basic', price: '$99/mo' },
  { name: 'Monthly care plan — Standard', price: '$199/mo' },
  { name: 'Business card design', price: '$99–$199' },
  { name: 'Email signature design', price: '$49–$99' },
  { name: 'Social media profile graphics pack', price: '$149–$299' },
]

export default function PackagesPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-4">Packages & Pricing</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">Clear scope. Fixed prices. No surprises.</h1>
          <p className="text-white/50 leading-relaxed">
            Every package has defined deliverables and a clear price. If your situation is more complex, we offer custom quotes. Start with a package or book a call if you are unsure.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.slug}
              className={`rounded-2xl p-7 flex flex-col ${
                pkg.featured
                  ? 'bg-[#F97316]/10 border border-[#F97316]/40'
                  : 'bg-[#111] border border-white/8'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                  pkg.type === 'Deposit Model'
                    ? 'bg-white/8 text-white/50'
                    : 'bg-[#F97316]/15 text-[#F97316]'
                }`}>
                  {pkg.type}
                </span>
                {pkg.featured && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#F97316]">Popular</span>
                )}
              </div>

              <h3 className="font-black text-lg mb-1">{pkg.name}</h3>
              <div className="mb-1">
                <span className="text-3xl font-black text-[#F97316]">{pkg.price}</span>
                {pkg.priceNote && (
                  <span className="text-xs text-white/35 ml-2">{pkg.priceNote}</span>
                )}
              </div>
              <p className="text-sm text-white/50 mb-5 leading-relaxed">{pkg.desc}</p>

              <ul className="space-y-2 mb-4 flex-1">
                {pkg.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-white/65">
                    <span className="text-[#F97316] mt-0.5 shrink-0">✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              <p className="text-xs text-white/25 mb-6">
                <span className="text-white/35">Excludes:</span> {pkg.excludes}
              </p>

              {pkg.disclaimer && (
                <p className="text-[11px] text-white/25 mb-4 leading-relaxed border-t border-white/8 pt-4">
                  Does not guarantee funding approval or lender decisions. See full disclaimer.
                </p>
              )}

              <Link
                href={`/checkout/${pkg.slug}`}
                className={`text-center py-3 rounded-xl text-sm font-bold transition-colors ${
                  pkg.featured
                    ? 'bg-[#F97316] hover:bg-[#ea6c0a] text-white'
                    : 'border border-white/15 hover:border-white/30 text-white'
                }`}
              >
                {pkg.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black mb-2">Add-ons</h2>
          <p className="text-white/45 text-sm mb-8">Available at checkout or after your project is underway.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {addons.map((a) => (
              <div key={a.name} className="flex justify-between items-center bg-[#111] border border-white/8 rounded-xl px-5 py-4">
                <span className="text-sm text-white/70">{a.name}</span>
                <span className="text-sm font-bold text-[#F97316] shrink-0 ml-4">{a.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-black mb-4">Not sure which package fits?</h2>
        <p className="text-white/50 mb-8">Book a free 20-minute call. We will tell you exactly what you need and what you do not.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/book" className="bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
            Book a Free Call
          </Link>
          <Link href="/start-project" className="border border-white/15 hover:border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  )
}
