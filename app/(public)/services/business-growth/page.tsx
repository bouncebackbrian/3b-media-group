import type { Metadata } from 'next'
import Link from 'next/link'
import QuoteRequestForm from '@/components/forms/QuoteRequestForm'

export const metadata: Metadata = {
  title: 'Business Growth',
  description: 'Strategy, lead generation, and consulting — plus direct access to the 3B Ecosystem: Funding Machine, Credit Builder, and Fleet Commander.',
}

const coreServices = [
  { title: 'Growth Strategy', desc: 'A clear plan for where to focus next — built around your goals, stage, and budget.' },
  { title: 'Lead Generation', desc: 'Funnels and campaigns that capture and qualify leads automatically.' },
  { title: 'Business Consulting', desc: 'Hands-on guidance to improve operations, positioning, and revenue.' },
]

const ecosystem = [
  {
    id: 'funding',
    name: '3B Funding Machine',
    tagline: 'Get funding-ready and access capital.',
    desc: 'Whether you need working capital, equipment financing, or a growth line, the 3B Funding Machine helps you prepare and pursue the right options.',
  },
  {
    id: 'credit',
    name: '3B Credit Builder',
    tagline: 'Build strong business credit.',
    desc: 'Establish and grow your business credit profile to unlock better funding terms, vendor accounts, and lower costs.',
  },
  {
    id: 'fleet',
    name: '3B Fleet Commander',
    tagline: 'Run your transportation business.',
    desc: 'Dispatch, recruiting, and fleet operations tools built for trucking and logistics companies.',
  },
]

export default function BusinessGrowthPage() {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Business Growth Division</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">Grow with the full 3B Ecosystem.</h1>
          <p className="text-lg text-white/55 leading-relaxed max-w-2xl mb-8">
            Strategy, lead generation, and consulting from 3B Media Group — plus direct access to funding, credit, and fleet solutions across the ecosystem.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/grow" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Get My Growth Plan
            </Link>
            <Link href="#quote" className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
              Request a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Core services */}
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-10">Our growth services</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {coreServices.map((s) => (
              <div key={s.title} className="bg-[#11243D] border border-white/8 rounded-2xl p-7">
                <div className="w-10 h-0.5 bg-[#14B8A6] mb-5" />
                <h3 className="font-bold text-[15px] mb-2">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem cross-sell — anchors target the wizard recommendations */}
      <section className="px-6 py-20 border-b border-white/8 bg-[#081320]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">3B Ecosystem</p>
          <h2 className="text-2xl md:text-3xl font-black mb-10">More ways to grow.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {ecosystem.map((e) => (
              <div key={e.id} id={e.id} className="bg-[#11243D] border border-white/8 rounded-2xl p-7 scroll-mt-24">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded-full">3B Ecosystem</span>
                <h3 className="font-black text-lg mt-4 mb-1">{e.name}</h3>
                <p className="text-sm text-[#14B8A6] mb-3">{e.tagline}</p>
                <p className="text-sm text-white/50 leading-relaxed mb-5">{e.desc}</p>
                <Link href="#quote" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
                  Request info →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote / consultation */}
      <section id="quote" className="px-6 py-20">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">Get Started</p>
            <h2 className="text-3xl font-black mb-3">Request a consultation.</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Tell us your goals and we&apos;ll point you to the right mix of services and ecosystem products.
            </p>
          </div>
          <QuoteRequestForm defaultService="Business Growth" source="service_business_growth" heading="" cta="Request Consultation →" />
        </div>
      </section>
    </div>
  )
}
