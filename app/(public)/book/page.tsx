import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Book a Free Call',
  description: 'Schedule a free 20-minute call with 3B Media Group. We will tell you exactly what your business needs.',
}

export default function BookPage() {
  return (
    <div className="bg-[#0A1A2F] text-white">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Free Consultation</p>
          <h1 className="text-4xl font-black mb-4">Book a free 20-minute call.</h1>
          <p className="text-white/50 leading-relaxed">
            We will tell you exactly what your business needs and what it does not. No pressure, no pitch — a straight conversation about your situation.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 border-b border-white/8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#11243D] border border-white/8 rounded-2xl p-8 text-center">
            <p className="text-white/40 text-sm mb-6">
              Booking is managed through Calendly. Click below to choose a time that works for you.
            </p>
            <a
              href="https://calendly.com/3becosystem"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors"
            >
              Choose a Time →
            </a>
            <p className="text-white/25 text-xs mt-4">Opens in Calendly. 20 minutes. Video or phone.</p>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { title: '20 minutes', body: 'Enough time to understand your situation and give a real recommendation.' },
              { title: 'No obligation', body: 'The call is free. You decide whether to move forward.' },
              { title: 'Straight answers', body: 'We tell you what you need — and what you do not need yet.' },
            ].map((item) => (
              <div key={item.title} className="bg-[#11243D] border border-white/8 rounded-2xl p-5 text-center">
                <p className="font-bold text-[#14B8A6] mb-2 text-sm">{item.title}</p>
                <p className="text-white/40 text-xs leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <p className="text-white/40 text-sm mb-4">Prefer to skip the call and just start?</p>
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
