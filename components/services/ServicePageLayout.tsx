import Link from 'next/link'
import QuoteRequestForm from '@/components/forms/QuoteRequestForm'

export interface ServiceOffering {
  title: string
  desc: string
}

export interface ServicePageData {
  eyebrow: string
  title: string
  intro: string
  offerings: ServiceOffering[]
  outcomes: string[]
  quoteService: string
  related?: { label: string; href: string }[]
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">{data.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">{data.title}</h1>
          <p className="text-lg text-white/55 leading-relaxed max-w-2xl mb-8">{data.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="#quote" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Get Started
            </Link>
            <Link href="/grow" className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
              Try the Growth Wizard
            </Link>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-10">What we offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.offerings.map((o) => (
              <div key={o.title} className="bg-[#11243D] border border-white/8 rounded-2xl p-7">
                <div className="w-10 h-0.5 bg-[#14B8A6] mb-5" />
                <h3 className="font-bold text-[15px] mb-2">{o.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="px-6 py-20 border-b border-white/8 bg-[#081320]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-8">What you get</h2>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {data.outcomes.map((o) => (
              <li key={o} className="flex gap-3 text-sm text-white/65 leading-relaxed">
                <span className="text-[#14B8A6] mt-0.5 shrink-0">✓</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="px-6 py-20">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">Get Started</p>
            <h2 className="text-3xl font-black mb-3">Request a quote.</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Tell us what you need and we&apos;ll respond within 1 business day.
            </p>
          </div>
          <QuoteRequestForm defaultService={data.quoteService} source={`service_${data.quoteService.toLowerCase().replace(/\W+/g, '_')}`} heading="" />
          {data.related && data.related.length > 0 && (
            <div className="mt-10 text-center">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Related services</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {data.related.map((r) => (
                  <Link key={r.href} href={r.href} className="text-sm border border-white/10 hover:border-[#14B8A6]/40 text-white/55 hover:text-white px-4 py-2 rounded-full transition-colors">
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
