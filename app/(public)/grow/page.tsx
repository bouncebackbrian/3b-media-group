import type { Metadata } from 'next'
import GrowthWizard from '@/components/wizard/GrowthWizard'

export const metadata: Metadata = {
  title: 'Business Growth Wizard',
  description: 'Answer a few quick questions and get a personalized growth plan — the right websites, marketing, AI, funding, and tools for your stage of business.',
}

const benefits = [
  { icon: '◎', title: 'Personalized', body: 'Recommendations built from your industry, goals, and challenges.' },
  { icon: '◈', title: 'Whole ecosystem', body: 'Websites, marketing, AI, funding, credit, and fleet — all in one plan.' },
  { icon: '◆', title: 'Free & instant', body: 'No cost, no obligation. Your plan is ready in under two minutes.' },
]

export default function GrowPage() {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Business Growth Wizard</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">
            Your 24/7 business consultant.
          </h1>
          <p className="text-lg text-white/55 leading-relaxed max-w-2xl mx-auto">
            Answer a few questions about your business and get a personalized growth plan — the exact websites, marketing, AI, funding, and tools that fit where you are right now.
          </p>
        </div>
      </section>

      <section className="px-6 py-6 border-b border-white/8 bg-[#081320]">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <span className="text-[#14B8A6] text-xl font-mono">{b.icon}</span>
              <div>
                <p className="font-bold text-sm">{b.title}</p>
                <p className="text-xs text-white/40 leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <GrowthWizard />
        </div>
      </section>
    </div>
  )
}
