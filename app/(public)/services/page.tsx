import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Marketing, websites, AI solutions, creative services, and business growth — the full digital growth stack for entrepreneurs.',
}

const divisions = [
  {
    icon: '◎',
    title: 'Marketing',
    href: '/services/marketing',
    desc: 'Social media management, realtor marketing, advertising, and lead generation.',
    items: ['Social Media Management', 'Realtor Marketing', 'Advertising', 'Lead Generation'],
  },
  {
    icon: '▣',
    title: 'Websites',
    href: '/services/websites',
    desc: 'Business websites, realtor sites, landing pages, and e-commerce — built to convert.',
    items: ['Business Websites', 'Realtor Websites', 'Landing Pages', 'E-Commerce'],
  },
  {
    icon: '◈',
    title: 'AI Solutions',
    href: '/services/ai-solutions',
    desc: 'Custom GPTs, business automation, and AI assistants tailored to your workflows.',
    items: ['Custom GPTs', 'Business Automation', 'AI Assistants', 'AI Training'],
  },
  {
    icon: '◆',
    title: 'Creative Services',
    href: '/services/creative',
    desc: 'Logos, branding, reels, and video content that make you look the part.',
    items: ['Logo Design', 'Brand Kits', 'Reels', 'Video Content'],
  },
  {
    icon: '◉',
    title: 'Business Growth',
    href: '/services/business-growth',
    desc: 'Strategy, consulting, and ecosystem access — funding, credit, and fleet.',
    items: ['Growth Strategy', 'Lead Generation', 'Consulting', '3B Ecosystem'],
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">What We Do</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">
            Everything your business needs to grow.
          </h1>
          <p className="text-lg text-white/55 leading-relaxed max-w-2xl mx-auto">
            Five divisions, one partner. From your first website to AI automation and capital access — we build the digital growth stack for entrepreneurs, realtors, and trucking companies.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {divisions.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="bg-[#11243D] border border-white/8 hover:border-[#14B8A6]/40 rounded-2xl p-7 group transition-colors flex flex-col"
            >
              <div className="text-[#14B8A6] text-2xl mb-4 font-mono">{d.icon}</div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-[#14B8A6] transition-colors">{d.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed mb-5">{d.desc}</p>
              <ul className="space-y-1.5 mt-auto">
                {d.items.map((i) => (
                  <li key={i} className="flex gap-2 text-xs text-white/55">
                    <span className="text-[#14B8A6] shrink-0">→</span>
                    {i}
                  </li>
                ))}
              </ul>
            </Link>
          ))}

          <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-2xl p-7 flex flex-col justify-center">
            <h3 className="font-black text-lg mb-2">Not sure where to start?</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-5">
              Take the Business Growth Wizard and get a personalized plan in under two minutes.
            </p>
            <Link
              href="/grow"
              className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-5 py-3 rounded-xl text-sm text-center transition-colors"
            >
              Start the Growth Wizard →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
