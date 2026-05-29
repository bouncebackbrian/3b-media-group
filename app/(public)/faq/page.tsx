'use client'

import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    q: 'How long does a project take?',
    a: 'Most projects are completed within 2–3 weeks of receiving your completed intake and all required content. Timelines depend on how quickly materials are submitted and feedback is provided. Done-For-You Launch packages typically run 3–4 weeks.',
  },
  {
    q: 'Do I need to have a logo before getting a website?',
    a: 'Not necessarily — but a logo helps. If you need both, the Credibility Builder or Done-For-You Launch package handles both together, which is more efficient than doing them separately.',
  },
  {
    q: 'Who owns the domain and the website after delivery?',
    a: 'You do. Domains are registered in your name. Website files and all deliverables are transferred to you on completion. Full rights transfer on logo files is included in every package.',
  },
  {
    q: 'Do you write the content for my website?',
    a: 'Copywriting is available as an add-on to the Website Launch package, and is included in the Funding-Readiness Web Package and Done-For-You Launch. The standard Website Launch package requires you to provide content.',
  },
  {
    q: 'How many revisions are included?',
    a: 'Most packages include 2 revision rounds. A revision round is one set of consolidated feedback and one revised deliverable. Additional rounds are available at the current rate, quoted before work begins.',
  },
  {
    q: 'Can you help me get funded or get a business loan?',
    a: '3B Media Group does not provide financial services and cannot guarantee or influence funding outcomes. We build professional business presence infrastructure. Funding decisions are made by lenders based on factors entirely outside our scope — creditworthiness, financials, business history, and more.',
  },
  {
    q: 'What happens after my project is delivered?',
    a: 'You get a 30-day post-launch support window for questions and minor issues. After that, ongoing updates and maintenance are available via a monthly care plan. Domain renewal reminders are a care plan benefit.',
  },
  {
    q: 'Do I need to be on a care plan?',
    a: 'No. Care plans are optional. They cover ongoing site updates, hosting management, and renewal reminders. If you are comfortable managing your site yourself, you do not need one.',
  },
  {
    q: 'What if I only need one service — like just a logo?',
    a: 'Each service is available individually. You do not need to buy a bundle. Start with what you need now and add more later.',
  },
  {
    q: 'How do I pay?',
    a: 'All payments are processed securely through Stripe. Fixed-price packages are paid in full at checkout. The Done-For-You Launch uses a 50% deposit at start, with the balance due at project completion.',
  },
  {
    q: 'What if I am not sure which package I need?',
    a: 'Book a free 20-minute call. We will tell you exactly what you need and what you do not — no pressure, no upsell for the sake of it.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex items-center justify-between gap-4"
      >
        <span className="font-semibold text-[15px]">{q}</span>
        <span className={`text-[#F97316] text-xl shrink-0 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <p className="text-white/50 text-sm leading-relaxed pb-5">{a}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-4">FAQ</p>
          <h1 className="text-4xl font-black mb-4">Straight answers.</h1>
          <p className="text-white/50">The questions we hear most. If yours is not here, book a call.</p>
        </div>
      </section>

      <section className="px-6 py-16 border-b border-white/8">
        <div className="max-w-2xl mx-auto">
          {faqs.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl font-black mb-4">Still have questions?</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/book" className="bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            Book a Free Call
          </Link>
          <Link href="/contact" className="border border-white/15 hover:border-white/30 text-white px-6 py-3 rounded-xl text-sm transition-colors">
            Send a Message
          </Link>
        </div>
      </section>
    </div>
  )
}
