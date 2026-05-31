import type { Metadata } from 'next'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with 3B Media Group. We respond within 1 business day.',
}

export default function ContactPage() {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Contact</p>
          <h1 className="text-4xl font-black mb-4">Let&apos;s talk.</h1>
          <p className="text-white/50 leading-relaxed">
            Send a message and we will respond within 1 business day. If you would rather talk, book a free call instead.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-xl mx-auto">
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
