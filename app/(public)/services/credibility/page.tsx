import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Credibility Builder',
  description: 'The complete professional business presence stack — domain, logo, website, Google Business, and LinkedIn.',
}

export default function CredibilityPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-4">Credibility Builder</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">Every piece of your business presence — built together.</h1>
          <p className="text-white/55 leading-relaxed text-lg mb-8">
            Lenders, vendors, and customers all look you up before they say yes. When they do, every piece of your presence needs to match — domain, logo, website, and business profiles all consistent and professional.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/checkout/credibility-builder" className="bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Get Started — $2,500
            </Link>
            <Link href="/book" className="border border-white/15 hover:border-white/30 text-white px-6 py-3 rounded-xl text-sm transition-colors">
              Book a Call First
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black mb-8">Everything included</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { cat: 'Domain', items: ['Domain search and acquisition', 'DNS configuration', 'Professional email setup'] },
              { cat: 'Brand Identity', items: ['Logo design (2–3 concepts)', '2 revision rounds', 'SVG, PNG, PDF files + full rights transfer', 'Brand color palette'] },
              { cat: 'Website', items: ['Up to 5 pages, mobile-first', 'Contact forms + SEO foundation', 'Analytics setup', '2 revision rounds + 30-day support'] },
              { cat: 'Business Profiles', items: ['Google Business Profile setup', 'LinkedIn company page setup', 'Business description copy written by us'] },
            ].map((section) => (
              <div key={section.cat} className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-4">{section.cat}</p>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-white/60">
                      <span className="text-[#F97316] shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#111] border border-white/8 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold mb-1">Credibility Builder</h3>
                <p className="text-white/40 text-sm">Fixed price. Defined scope. No surprises.</p>
                <p className="text-white/30 text-xs mt-1">Excludes: financial services, lender introductions, credit advisory</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-black text-[#F97316]">$2,500</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center border-b border-white/8">
        <h2 className="text-2xl font-black mb-4">Need copywriting too?</h2>
        <p className="text-white/45 text-sm mb-6">Step up to the Funding-Readiness Web Package — adds professional copywriting and a business summary document.</p>
        <Link href="/services/funding-readiness" className="text-[#F97316] hover:underline text-sm font-semibold">See Funding-Readiness Package →</Link>
      </section>
    </div>
  )
}
