import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Portal',
  description: 'Manage your active services, project status, files, and invoices in one place.',
}

const features = [
  { title: 'Active Services', desc: 'See every service and plan you have with us at a glance.' },
  { title: 'Project Status', desc: 'Track each project in real time — from kickoff to launch.' },
  { title: 'Files & Assets', desc: 'Upload your materials and download finished deliverables.' },
  { title: 'Service Requests', desc: 'Request content, revisions, and new work in a few clicks.' },
  { title: 'Invoices & Billing', desc: 'View your payment history, invoices, and active subscriptions.' },
  { title: 'Recommendations', desc: 'Your personalized growth plan, always up to date.' },
]

export default function PortalPage() {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      <section className="px-6 py-24 border-b border-white/8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#14B8A6] bg-[#14B8A6]/10 border border-[#14B8A6]/30 px-3 py-1 rounded-full mb-6">
            Launching Soon
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">Your Client Portal.</h1>
          <p className="text-lg text-white/55 leading-relaxed max-w-2xl mx-auto mb-8">
            One secure place to manage your services, track projects, upload files, request work, and view invoices. We&apos;ll email your login the moment it&apos;s ready.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/grow" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
              Start the Growth Wizard
            </Link>
            <Link href="/contact" className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-[#11243D] border border-white/8 rounded-2xl p-7">
              <div className="w-10 h-0.5 bg-[#14B8A6] mb-5" />
              <h3 className="font-bold text-[15px] mb-2">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
