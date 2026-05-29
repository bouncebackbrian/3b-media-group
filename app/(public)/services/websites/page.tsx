import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Website Build',
  description: 'Professional website design and development for businesses. Mobile-first, fast, and built to convert.',
}

export default function WebsitesPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-4">Website Build</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">A website that works for your business, not just looks nice.</h1>
          <p className="text-white/55 leading-relaxed text-lg mb-8">
            We build websites designed to communicate credibility and convert visitors. Not template installations. Not drag-and-drop builders. Sites built correctly, with the content and structure your business actually needs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/checkout/website-launch" className="bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Get Started — $1,800
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
            <h2 className="text-2xl font-black mb-6">Every site includes</h2>
            <ul className="space-y-4">
              {[
                ['Up to 5 pages', 'Home, About, Services, Contact, and one additional page of your choice.'],
                ['Mobile-first design', 'Built for phones first — where most of your visitors actually are.'],
                ['Contact and lead forms', 'Submissions delivered to your email. No leads fall through.'],
                ['SEO foundation', 'Page titles, meta descriptions, structured headings, and clean URLs.'],
                ['Analytics integration', 'Google Analytics or equivalent installed and confirmed working.'],
                ['Hosting configuration', 'Set up on your platform of choice — we handle the technical setup.'],
                ['2 revision rounds', 'Structured feedback rounds after the initial design is presented.'],
                ['30-day post-launch support', 'We are available for issues and minor changes after you go live.'],
              ].map(([title, desc]) => (
                <li key={title as string} className="flex gap-4">
                  <span className="text-[#F97316] mt-1 shrink-0">✓</span>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-3">What to expect</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-3">
                Client provides content (copy and any photos) or adds our copywriting add-on. We handle design, development, and launch.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                Timeline depends on how quickly intake and content are submitted. Most sites are completed within 2–3 weeks of receiving all materials.
              </p>
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-2">Excludes</h3>
              <p className="text-white/35 text-sm leading-relaxed">Copywriting (available as add-on), photography, e-commerce, ongoing maintenance (available via care plan).</p>
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-3">Pricing</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-[#F97316]">$1,800</span>
              </div>
              <p className="text-white/35 text-xs">Additional pages: $150–$350 each. Copywriting: $75–$150/page.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center border-b border-white/8">
        <h2 className="text-2xl font-black mb-4">Want the full package?</h2>
        <p className="text-white/45 text-sm mb-6">Website Launch is included in the Credibility Builder — with domain and logo design added.</p>
        <Link href="/packages" className="text-[#F97316] hover:underline text-sm font-semibold">See bundle packages →</Link>
      </section>
    </div>
  )
}
