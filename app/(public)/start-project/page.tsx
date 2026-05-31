import type { Metadata } from 'next'
import StartProjectForm from '@/components/forms/StartProjectForm'

export const metadata: Metadata = {
  title: 'Start Your Project',
  description: 'Tell us about your business and what you need. We review every submission and respond within 1 business day.',
}

export default function StartProjectPage() {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Get Started</p>
          <h1 className="text-4xl font-black mb-4">Tell us about your business.</h1>
          <p className="text-white/50 leading-relaxed">
            Fill out the form below. We review every submission and respond within 1 business day with a clear recommendation and next steps.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-xl mx-auto">
          <StartProjectForm />
        </div>
      </section>
    </div>
  )
}
