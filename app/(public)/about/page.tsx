import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About 3B Media Group — professional business presence services for entrepreneurs.',
}

export default function AboutPage() {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">About</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6">We build the infrastructure entrepreneurs run on.</h1>
          <p className="text-white/55 leading-relaxed text-lg">
            3B Media Group is a done-for-you business presence service built for founders who are serious about growth. We handle domain setup, logo design, website builds, and credibility-focused launch assets — so you can show up ready.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-black mb-5">What we do — and what we do not</h2>
            <p className="text-white/55 text-sm leading-relaxed mb-4">
              We are not a design agency, a SaaS platform, or a marketing firm. We are an execution service. You bring the business idea, the industry knowledge, and the drive to grow. We build the digital foundation that makes your business look like it has been operating for years, not weeks.
            </p>
            <p className="text-white/55 text-sm leading-relaxed mb-4">
              Every service we offer has a defined scope, a fixed price (or clear deposit structure), and a real delivery. We do not take on unlimited revision cycles, open-ended retainers without defined scope, or projects that do not have a clear finish line.
            </p>
            <p className="text-white/55 text-sm leading-relaxed">
              We do not promise funding outcomes, loan approvals, or business results. We build professional infrastructure. What you do with it is up to you.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Part of the 3B Ecosystem', body: '3B Media Group is one arm of the 3B Ecosystem — a suite of tools and services built for entrepreneurs by Brian A Martin. The ecosystem includes Fleet Commander, Credit Builder, and other platforms for business operators.' },
              { title: 'Built for speed', body: 'We know founders do not have six months to wait for a website. Our packages are scoped for fast execution. Most projects are in production within 2–3 weeks of intake completion.' },
              { title: 'No fabricated proof', body: 'We will not show you made-up testimonials, fake client counts, or invented statistics. As our portfolio grows, we document real work. Until then, the work speaks for itself.' },
            ].map((item) => (
              <div key={item.title} className="bg-[#11243D] border border-white/8 rounded-2xl p-6">
                <div className="w-8 h-0.5 bg-[#14B8A6] mb-3" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-4">Who we work with</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Our clients are entrepreneurs with a real business — or a serious plan for one. They are launching, growing, or repositioning. They need professional infrastructure fast and do not want to spend months on it.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Trucking & Logistics', 'Real Estate', 'Consulting', 'Service Contractors', 'Online Sellers', 'Healthcare & Wellness', 'Startups', 'Creators & Coaches'].map((ind) => (
              <span key={ind} className="border border-white/10 text-white/45 text-xs px-3 py-1.5 rounded-full">{ind}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl font-black mb-4">Ready to build?</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/start-project" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            Start Your Project
          </Link>
          <Link href="/packages" className="border border-white/15 hover:border-white/30 text-white px-6 py-3 rounded-xl text-sm transition-colors">
            See Packages
          </Link>
        </div>
      </section>
    </div>
  )
}
