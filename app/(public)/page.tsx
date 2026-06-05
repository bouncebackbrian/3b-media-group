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
  { q: 'How do I get started?', a: 'Take the free Business Growth Wizard for a personalized plan, request a quote, or book a call. We respond within one business day.' },
  { q: 'What industries do you work with?', a: 'Entrepreneurs, realtors, trucking companies, service businesses, and small businesses across many industries.' },
  { q: 'Is this part of a larger ecosystem?', a: 'Yes. 3B Media Group is the digital growth division of the 3B Ecosystem, which also includes funding, credit, fleet, and business identity products.' },
]

export default function HomePage() {
  return (
    <div className="bg-[#060F1E] text-white">

      {/* HERO */}
      <section className="relative px-4 sm:px-6 py-24 sm:py-32 md:py-40 border-b border-white/8 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#14B8A6]/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-[#0EA5E9]/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-[#14B8A6] mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full animate-pulse" />
            3B Media Group
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
            Launch. Grow. Automate.<br />
            <span className="bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] bg-clip-text text-transparent">Scale.</span>
          </h1>
          <p className="text-base sm:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed mb-10">
            The digital growth agency for entrepreneurs, realtors, and trucking companies. Marketing, websites, AI, branding, and business growth — everything you need to grow, in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/grow" className="bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:from-[#0D9488] hover:to-[#0284C7] text-white font-bold px-8 py-4 rounded-xl text-[15px] transition-all shadow-xl shadow-[#14B8A6]/25 text-center">
              Get Started →
            </Link>
            <Link href="/contact" className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-xl text-[15px] transition-all backdrop-blur-sm text-center">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-b border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">What We Do</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Five divisions. One growth partner.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <Link key={s.href} href={s.href}
                className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-[#14B8A6]/30 rounded-2xl p-6 sm:p-7 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-[#14B8A6]/5">
                <div className="w-10 h-10 bg-gradient-to-br from-[#14B8A6]/20 to-[#0EA5E9]/10 rounded-xl flex items-center justify-center mb-5 group-hover:from-[#14B8A6]/30 transition-all">
                  <span className="text-[#14B8A6] text-lg font-mono">{s.icon}</span>
                </div>
                <h3 className="font-bold text-[15px] mb-2 group-hover:text-[#14B8A6] transition-colors">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
            <Link href="/services"
              className="bg-transparent border border-white/8 hover:border-white/15 rounded-2xl p-6 sm:p-7 flex items-center justify-center group transition-all">
              <span className="text-sm text-white/35 group-hover:text-white/70 transition-colors">See all services →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* GROWTH WIZARD BAND */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#14B8A6]/8 via-transparent to-[#0EA5E9]/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Free Tool</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">Get your 3Boost Growth Score.</h2>
          <p className="text-white/55 leading-relaxed max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            Answer a few questions, get a 0–100 growth score across six categories, and a personalized plan with the exact services that fit your business right now.
          </p>
          <Link href="/grow" className="bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:from-[#0D9488] hover:to-[#0284C7] text-white font-bold px-8 py-3.5 rounded-xl text-[15px] transition-all shadow-lg shadow-[#14B8A6]/20 inline-block">
            Get My 3Boost Score →
          </Link>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-b border-white/8 bg-[#040C18]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">Pricing</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Plans that scale with you.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {pricing.map((p) => (
              <div key={p.name} className={`rounded-2xl p-6 sm:p-7 flex flex-col transition-all ${
                p.featured
                  ? 'bg-gradient-to-b from-[#14B8A6]/15 to-[#0EA5E9]/8 border border-[#14B8A6]/40 shadow-xl shadow-[#14B8A6]/10'
                  : 'bg-white/[0.03] border border-white/8 hover:border-white/15 hover:bg-white/[0.05]'
              }`}>
                {p.featured && <span className="text-[10px] font-bold tracking-widest uppercase text-[#14B8A6] mb-4">Most Popular</span>}
                <h3 className="font-black text-lg mb-1">{p.name}</h3>
                <p className="mb-3">
                  <span className={`text-3xl font-black ${p.featured ? 'bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] bg-clip-text text-transparent' : 'text-[#14B8A6]'}`}>{p.price}</span>
                  <span className="text-white/40 text-sm">{p.period}</span>
                </p>
                <p className="text-sm text-white/50 mb-6 leading-relaxed flex-1">{p.desc}</p>
                <Link href="/pricing" className={`text-center py-3 rounded-xl text-sm font-bold transition-all ${
                  p.featured
                    ? 'bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] text-white shadow-lg shadow-[#14B8A6]/20 hover:shadow-[#14B8A6]/30'
                    : 'border border-white/10 hover:border-white/25 text-white hover:bg-white/5'
                }`}>
                  View Plans
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-white/35 hover:text-[#14B8A6] transition-colors">See full pricing including websites and one-time services →</Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 border-b border-white/8 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#14B8A6]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-5">Portfolio</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5">Real results for real businesses.</h2>
          <p className="text-white/55 leading-relaxed mb-8 max-w-2xl text-base sm:text-lg">
            From realtors to trucking companies, we build the professional foundation our clients grow on — and keep them visible with consistent marketing.
          </p>
          <Link href="/portfolio" className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all backdrop-blur-sm inline-block">
            See the Portfolio →
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-b border-white/8 bg-[#040C18]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 sm:mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">Testimonials</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Trusted by founders who mean business.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:border-white/15 transition-all">
                <div className="text-[#14B8A6] text-2xl mb-4 opacity-60">&ldquo;</div>
                <p className="text-white/70 leading-relaxed mb-6 text-sm sm:text-base">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#14B8A6]/30 to-[#0EA5E9]/20 rounded-full flex items-center justify-center text-xs font-bold text-[#14B8A6]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-white/40">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-b border-white/8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 sm:mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-3">FAQ</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Questions, answered.</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/8 hover:border-white/12 rounded-2xl p-5 sm:p-6 group transition-all">
                <summary className="font-bold text-sm sm:text-[15px] cursor-pointer list-none flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-[#14B8A6] group-open:rotate-45 transition-transform text-xl leading-none shrink-0">+</span>
                </summary>
                <p className="text-sm text-white/50 leading-relaxed mt-4">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#14B8A6]/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5">Ready to grow your business?</h2>
          <p className="text-white/50 mb-10 leading-relaxed text-base sm:text-lg">Get a personalized plan in two minutes, or request a quote. Either way, we move fast.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/grow" className="bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:from-[#0D9488] hover:to-[#0284C7] text-white font-bold px-8 py-4 rounded-xl text-[15px] transition-all shadow-xl shadow-[#14B8A6]/25 text-center">
              Get Started →
            </Link>
            <Link href="/contact" className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-xl text-[15px] transition-all text-center">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
