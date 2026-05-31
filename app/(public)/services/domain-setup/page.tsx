import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Domain Setup',
  description: 'Professional domain acquisition, DNS configuration, and email setup for your business.',
}

export default function DomainSetupPage() {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Domain Setup</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">The right domain is your first signal.</h1>
          <p className="text-white/55 leading-relaxed text-lg mb-8">
            Your domain appears on every proposal, invoice, and email you send. A professional domain tells people your business is real before they read a single word.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/checkout/domain-starter" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Get Started — $199
            </Link>
            <Link href="/book" className="border border-white/15 hover:border-white/30 text-white px-6 py-3 rounded-xl text-sm transition-colors">
              Book a Call First
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-black mb-6">What we handle</h2>
            <ul className="space-y-4">
              {[
                ['Domain availability search', 'We check your preferred names and present available options.'],
                ['Domain acquisition', 'We handle the purchase — domain cost passed through at actual price.'],
                ['DNS configuration', 'All records configured correctly from day one.'],
                ['Professional email setup', 'Google Workspace or equivalent — your name@yourbusiness.com.'],
                ['Forwarding and redirects', 'www → non-www, old domains, and any redirect logic you need.'],
              ].map(([title, desc]) => (
                <li key={title as string} className="flex gap-4">
                  <span className="text-[#14B8A6] mt-1 shrink-0">✓</span>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-black mb-6">What this is not</h2>
            <div className="bg-[#11243D] border border-white/8 rounded-2xl p-6 space-y-3">
              <p className="text-white/50 text-sm leading-relaxed">
                We do not register domains on your behalf without your approval. Every domain purchased is in your name and under your control. We provide setup support — ownership is always yours.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                Domain renewal after handoff is your responsibility. Clients on a care plan receive renewal reminders as a plan benefit.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                This package does not include logo design, website build, or hosting.
              </p>
            </div>

            <div className="mt-8 bg-[#11243D] border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-3">Pricing</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-black text-[#14B8A6]">$199</span>
                <span className="text-white/35 text-sm">service fee</span>
              </div>
              <p className="text-white/35 text-xs">+ domain registration cost (passed through at actual price)</p>
              <p className="text-white/35 text-xs mt-1">+ Google Workspace if included (~$72/yr)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center border-b border-white/8">
        <h2 className="text-2xl font-black mb-4">Need the full stack?</h2>
        <p className="text-white/45 text-sm mb-6">Domain setup is included in the Credibility Builder and all bundle packages.</p>
        <Link href="/packages" className="text-[#14B8A6] hover:underline text-sm font-semibold">See all packages →</Link>
      </section>
    </div>
  )
}
