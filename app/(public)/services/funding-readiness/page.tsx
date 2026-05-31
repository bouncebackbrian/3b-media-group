import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funding-Readiness Web Package',
  description: 'Professional business presence built to support funding conversations, vendor account applications, and lender evaluations.',
}

export default function FundingReadinessPage() {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Funding-Readiness Web Package</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">Your online presence is part of how you are evaluated.</h1>
          <p className="text-white/55 leading-relaxed text-lg mb-6">
            Before a lender, investor, or vendor partner meets you, they search for you. What they find — or do not find — is part of the picture they form about your business.
          </p>
          <p className="text-white/40 leading-relaxed text-sm mb-8 border-l-2 border-[#14B8A6]/40 pl-4">
            We position your digital presence to support that evaluation. What we build is designed to remove amateur presentation as a variable working against you.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/checkout/funding-readiness-web" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Get Started — $3,500
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
            <h2 className="text-2xl font-black mb-6">Everything included</h2>
            <ul className="space-y-4">
              {[
                ['Domain, email, and DNS setup', 'Professional domain and email configured correctly.'],
                ['Logo design', 'Full brand identity with file package and rights transfer.'],
                ['5-page professional website', 'Mobile-first, fast, SEO-ready, with contact forms.'],
                ['Professional copywriting', 'All website pages written by us — clear, credible, industry-appropriate.'],
                ['Google Business Profile', 'Set up and optimized with accurate business information.'],
                ['LinkedIn company page', 'Professional company presence on LinkedIn.'],
                ['Business summary document', '1-page digital overview of your business — formatted and professional.'],
                ['Pre-launch review checklist', 'We review everything before it goes live.'],
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

          <div className="space-y-5">
            <div className="bg-[#11243D] border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-3">Pricing</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-[#14B8A6]">$3,500</span>
              </div>
              <p className="text-white/35 text-xs">Fixed price. Defined scope.</p>
            </div>

            <div className="bg-[#14B8A6]/8 border border-[#14B8A6]/20 rounded-2xl p-6">
              <h3 className="font-bold text-[#14B8A6] mb-3 text-sm uppercase tracking-wider">Important Disclaimer</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                3B Media Group does not provide financial services, guarantee funding approvals, or influence lender decisions. This package provides professional business presence infrastructure only.
              </p>
              <p className="text-white/40 text-sm leading-relaxed mt-3">
                Funding eligibility is determined entirely by lenders based on creditworthiness, business financials, and other factors outside our scope.
              </p>
              <Link href="/disclaimer" className="text-[#14B8A6] text-xs hover:underline mt-3 block">Read full disclaimer →</Link>
            </div>

            <div className="bg-[#11243D] border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-2">Excludes</h3>
              <p className="text-white/35 text-sm leading-relaxed">Financial consultation, loan preparation, lender matching, credit advisory, business plan writing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <h2 className="text-2xl font-black mb-4">Ready to build the infrastructure side?</h2>
        <p className="text-white/45 text-sm mb-6">Start your project or talk to us first.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/checkout/funding-readiness-web" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            Get Started — $3,500
          </Link>
          <Link href="/book" className="border border-white/15 hover:border-white/30 text-white px-6 py-3 rounded-xl text-sm transition-colors">
            Book a Free Call
          </Link>
        </div>
      </section>
    </div>
  )
}
