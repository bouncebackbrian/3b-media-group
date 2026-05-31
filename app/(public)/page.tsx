import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3B Media Group — Digital Growth Agency for Entrepreneurs',
  description: 'Marketing, websites, AI solutions, branding, and business growth for entrepreneurs, realtors, and trucking companies. Launch, grow, automate, and scale.',
}

const services = [
  { title: 'Marketing', desc: 'Social media, advertising, and lead generation that fills your pipeline.', href: '/services/marketing', icon: '◎' },
  { title: 'Websites', desc: 'Business, realtor, and e-commerce sites built to convert — not templates.', href: '/services/websites', icon: '▣' },
  { title: 'AI Solutions', desc: 'Custom GPTs, automation, and assistants that save time and scale you.', href: '/services/ai-solutions', icon: '◈' },
  { title: 'Creative Services', desc: 'Logos, branding, reels, and video that make you look the part.', href: '/services/creative', icon: '◆' },
  { title: 'Business Growth', desc: 'Strategy, consulting, and ecosystem access — funding, credit, fleet.', href: '/services/business-growth', icon: '◉' },
]

const pricing = [
  { name: 'Starter', price: '$99', period: '/mo', desc: '4 posts, AI graphics, captions.', featured: false },
  { name: 'Growth', price: '$199', period: '/mo', desc: '8 posts, 2 reels, content calendar.', featured: true },
  { name: 'Business Pro', price: '$349', period: '/mo', desc: '12 posts, 4 reels, marketing support.', featured: false },
]

const testimonials = [
  { quote: '3B Media Group built my entire online presence and kept my listings in front of buyers every week. It changed how my business looks.', name: 'Madalyn', title: 'Real Estate Professional' },
  { quote: 'They handle the marketing so I can focus on the road. Consistent, professional, and they actually pick up the phone.', name: 'Owner-Operator', title: 'Trucking & Logistics' },
]

const faqs = [
  { q: 'What does 3B Media Group do?', a: 'We are a digital growth agency. We help businesses launch, grow, automate, and scale through marketing, websites, AI, branding, and business growth services — all in one place.' },
  { q: 'How much does it cost?', a: 'Marketing plans start at $99/month, websites start at $299, and one-time services start at $25. Use the Business Growth Wizard for a personalized recommendation.' },
  { q: 'How do I get started?', a: 'Take the free Business Growth Wizard for a personalized plan and 3Boost score, request a quote, or book a call. We respond within one business day.' },
  { q: 'What industries do you work with?', a: 'Entrepreneurs, realtors, trucking companies, service businesses, and small businesses across many industries.' },
  { q: 'Is this part of a larger ecosystem?', a: 'Yes. 3B Media Group is the digital growth division of the 3B Ecosystem, which also includes funding, credit, fleet, and business identity products.' },
]

export default function HomePage() {
  return (
    <div className="bg-[#0A1A2F] text-white">

      {/* HERO */}
      <section className="px-6 py-28 md:py-36 border-b border-white/8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-5">3B Media Group</p>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.08] mb-6 tracking-tight">
            Launch. Grow. Automate.<br />
            <span className="text-[#14B8A6]">Scale.</span>
          </h1>
          <p className="text-lg text-white/55 max-w-2xl mx-auto leading-relaxed mb-10">
            The digital growth agency for entrepreneurs, realtors, and trucking companies. Marketing, websites, AI, branding, and business growth — everything you need to grow, in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/grow" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
              Get Started →
            </Link>
            <Link href="/contact" className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-black">Five divisions. One growth partner.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="bg-[#11243D] border border-white/8 hover:border-[#14B8A6]/40 rounded-2xl p-7 group transition-colors">
                <div className="text-[#14B8A6] text-2xl mb-4 font-mono">{s.icon}</div>
                <h3 className="font-bold text-[15px] mb-2 group-hover:text-[#14B8A6] transition-colors">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
            <Link href="/services" className="bg-transparent border border-white/8 hover:border-white/20 rounded-2xl p-7 flex items-center justify-center group transition-colors">
              <span className="text-sm text-white/40 group-hover:text-white transition-colors">See all services →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* GROWTH WIZARD + 3BOOST BAND */}
      <section className="px-6 py-20 border-b border-white/8 bg-[#081320]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Free Tool</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Get your 3Boost Growth Score.</h2>
          <p className="text-white/55 leading-relaxed max-w-2xl mx-auto mb-8">
            The Business Growth Wizard is your 24/7 consultant. Answer a few questions, get a 0–100 growth score across six categories, and a personalized plan — the exact services and tools that fit your business right now.
          </p>
          <Link href="/grow" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
            Get My 3Boost Score →
          </Link>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-black">Plans that scale with you.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {pricing.map((p) => (
              <div key={p.name} className={`rounded-2xl p-7 flex flex-col ${p.featured ? 'bg-[#14B8A6]/10 border border-[#14B8A6]/40' : 'bg-[#11243D] border border-white/8'}`}>
                {p.featured && <span className="text-[10px] font-bold tracking-widest uppercase text-[#14B8A6] mb-4">Most Popular</span>}
                <h3 className="font-black text-lg mb-1">{p.name}</h3>
                <p className="mb-3"><span className="text-3xl font-black text-[#14B8A6]">{p.price}</span><span className="text-white/40 text-sm">{p.period}</span></p>
                <p className="text-sm text-white/50 mb-6 leading-relaxed flex-1">{p.desc}</p>
                <Link href="/pricing" className={`text-center py-3 rounded-xl text-sm font-bold transition-colors ${p.featured ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white' : 'border border-white/15 hover:border-white/30 text-white'}`}>
                  View Plans
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-white/40 hover:text-white transition-colors">See full pricing including websites and one-time services →</Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO HIGHLIGHT */}
      <section className="px-6 py-24 border-b border-white/8 bg-[#081320]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-5">Portfolio</p>
          <h2 className="text-3xl md:text-4xl font-black mb-6">Real results for real businesses.</h2>
          <p className="text-white/55 leading-relaxed mb-8 max-w-2xl">
            From realtors to trucking companies, we build the professional foundation our clients grow on — and keep them visible with consistent marketing.
          </p>
          <Link href="/portfolio" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            See the Portfolio →
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-black">Trusted by founders who mean business.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#11243D] border border-white/8 rounded-2xl p-8">
                <p className="text-white/70 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-white/40">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black">Questions, answered.</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="bg-[#11243D] border border-white/8 rounded-2xl p-6 group">
                <summary className="font-bold text-[15px] cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-[#14B8A6] group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-sm text-white/50 leading-relaxed mt-4">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-28">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-5">Ready to grow your business?</h2>
          <p className="text-white/50 mb-8 leading-relaxed">Get a personalized plan in two minutes, or request a quote. Either way, we move fast.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/grow" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
              Get Started →
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
