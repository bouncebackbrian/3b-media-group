import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logo Design',
  description: 'Professional logo design with full file delivery and rights transfer. Built for long-term business use.',
}

export default function LogoDesignPage() {
  return (
    <div className="bg-[#0A1A2F] text-white">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Logo Design</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">A logo that holds up in every context.</h1>
          <p className="text-white/55 leading-relaxed text-lg mb-8">
            Your logo appears on your website, business cards, invoices, proposals, and anywhere you present your business. It needs to work at 16px and 16 inches — and communicate your industry without explanation.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/checkout/brand-starter" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Get Started — $499
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
            <h2 className="text-2xl font-black mb-6">What you get</h2>
            <ul className="space-y-4">
              {[
                ['2–3 initial concepts', 'We present multiple directions based on your intake — not one guess.'],
                ['2 revision rounds', 'Structured feedback rounds to get to a final you approve.'],
                ['Full file package', 'SVG, PNG (transparent), PDF — light and dark versions of each.'],
                ['Brand color palette', 'Primary and secondary hex codes, ready to use everywhere.'],
                ['Font recommendations', 'What pairs with your logo for headers, body, and print.'],
                ['Full rights transfer', 'The final logo is yours completely. No licensing, no restrictions.'],
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
              <h3 className="font-bold mb-3">The process</h3>
              <ol className="space-y-3">
                {[
                  'Complete the brand intake form — industry, tone, references, colors.',
                  'We present 2–3 initial concepts within the agreed timeline.',
                  'You provide consolidated feedback. We revise.',
                  'Final approval in writing. Files delivered.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/50">
                    <span className="text-[#14B8A6] font-bold shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-[#11243D] border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-3">Pricing</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-[#14B8A6]">$499</span>
              </div>
              <p className="text-white/35 text-xs">Additional revision rounds: available at current rate, quoted before work begins.</p>
              <p className="text-white/35 text-xs mt-1">Brand guidelines document add-on: $150–$250.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center border-b border-white/8">
        <h2 className="text-2xl font-black mb-4">Need logo + website together?</h2>
        <p className="text-white/45 text-sm mb-6">The Credibility Builder includes logo design as part of the full stack.</p>
        <Link href="/packages" className="text-[#14B8A6] hover:underline text-sm font-semibold">See bundle packages →</Link>
      </section>
    </div>
  )
}
