import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for marketing plans, websites, and one-time services. Plans from $99/month.',
}

const monthly = [
  {
    name: 'Starter',
    price: '$99',
    period: '/mo',
    desc: 'Get consistent and look professional.',
    bullets: ['4 social media posts', 'AI graphics', 'Caption writing'],
    featured: false,
  },
  {
    name: 'Growth',
    price: '$199',
    period: '/mo',
    desc: 'Build momentum across your channels.',
    bullets: ['8 social media posts', '2 reels', 'Open house promotion', 'Content calendar'],
    featured: true,
  },
  {
    name: 'Business Pro',
    price: '$349',
    period: '/mo',
    desc: 'Full marketing support for serious growth.',
    bullets: ['12 posts', '4 reels', 'Marketing support', 'Priority turnaround'],
    featured: false,
  },
]

const websites = [
  { name: 'Starter Website', price: '$299', desc: 'A clean one-page presence to get online fast.' },
  { name: 'Business Website', price: '$599', desc: 'A multi-page business website built to convert.' },
  { name: 'Professional Website', price: '$999+', desc: 'Premium build with advanced features and integrations.' },
  { name: 'Custom Project', price: 'Quote', desc: 'E-commerce, membership, or fully custom builds.' },
]

const oneTime = [
  { name: 'Open House Blast', price: '$29' },
  { name: 'Listing Marketing Package', price: '$49' },
  { name: 'Reel Creation', price: '$25' },
  { name: 'Custom Project', price: 'Quote' },
]

export default function PricingPage() {
  return (
    <div className="bg-[#0A1A2F] text-white">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">Simple, transparent pricing.</h1>
          <p className="text-lg text-white/55 leading-relaxed max-w-2xl mx-auto">
            Start where you are. Scale as you grow. No long-term contracts, no surprises.
          </p>
        </div>
      </section>

      {/* Monthly marketing plans */}
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-2">Monthly marketing plans</h2>
          <p className="text-white/45 text-sm mb-10">Done-for-you content and marketing, billed monthly.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {monthly.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-7 flex flex-col ${
                  p.featured ? 'bg-[#14B8A6]/10 border border-[#14B8A6]/40' : 'bg-[#11243D] border border-white/8'
                }`}
              >
                {p.featured && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#14B8A6] mb-4">Most Popular</span>
                )}
                <h3 className="font-black text-lg mb-1">{p.name}</h3>
                <p className="mb-3">
                  <span className="text-3xl font-black text-[#14B8A6]">{p.price}</span>
                  <span className="text-white/40 text-sm">{p.period}</span>
                </p>
                <p className="text-sm text-white/50 mb-5 leading-relaxed">{p.desc}</p>
                <ul className="space-y-2 mb-7 flex-1">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-white/65">
                      <span className="text-[#14B8A6] mt-0.5 shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/grow"
                  className={`text-center py-3 rounded-xl text-sm font-bold transition-colors ${
                    p.featured ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white' : 'border border-white/15 hover:border-white/30 text-white'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Websites */}
      <section className="px-6 py-20 border-b border-white/8 bg-[#081320]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-2">Websites</h2>
          <p className="text-white/45 text-sm mb-10">One-time builds. Care plans available after launch.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {websites.map((w) => (
              <div key={w.name} className="bg-[#11243D] border border-white/8 rounded-2xl p-6 flex flex-col">
                <h3 className="font-bold text-[15px] mb-1">{w.name}</h3>
                <p className="text-2xl font-black text-[#14B8A6] mb-3">{w.price}</p>
                <p className="text-sm text-white/45 leading-relaxed mb-5 flex-1">{w.desc}</p>
                <Link href="/services/websites#quote" className="text-sm font-semibold text-[#14B8A6] hover:text-[#5eead4] transition-colors">
                  Request a quote →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One-time services */}
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-2">One-time services</h2>
          <p className="text-white/45 text-sm mb-8">Quick wins, no commitment.</p>
          <div className="bg-[#11243D] border border-white/8 rounded-2xl divide-y divide-white/5">
            {oneTime.map((o) => (
              <div key={o.name} className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-white/75">{o.name}</span>
                <span className="font-black text-[#14B8A6]">{o.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Not sure which plan fits?</h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Take the Business Growth Wizard and get a personalized recommendation in under two minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/grow" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
              Start the Growth Wizard →
            </Link>
            <Link href="/contact" className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
