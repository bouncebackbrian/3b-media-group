'use client'

import { useState } from 'react'

const SERVICES = [
  'Marketing',
  'Website',
  'AI Solutions',
  'Creative / Branding',
  'Business Growth',
  'Not sure — need a recommendation',
]

export default function QuoteRequestForm({
  defaultService = '',
  source = 'quote_request',
  heading = 'Request a Quote',
  cta = 'Request Quote →',
}: {
  defaultService?: string
  source?: string
  heading?: string
  cta?: string
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    service_interest: defaultService,
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      })
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-[#11243D] border border-white/8 rounded-2xl p-10 text-center">
        <div className="w-12 h-12 bg-[#14B8A6]/15 border border-[#14B8A6]/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-black text-lg mb-2">Request received.</h3>
        <p className="text-white/45 text-sm">We&apos;ll get back to you within 1 business day with a quote and next steps.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-[#11243D] border border-white/8 rounded-2xl p-8 space-y-4">
      {heading && <h3 className="font-black text-lg mb-1">{heading}</h3>}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Full name *" required value={form.name} onChange={(v) => set('name', v)} placeholder="Brian Martin" />
        <Input label="Email *" required type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="you@business.com" />
        <Input label="Phone" type="tel" value={form.phone} onChange={(v) => set('phone', v)} placeholder="(555) 000-0000" />
        <Input label="Company" value={form.company_name} onChange={(v) => set('company_name', v)} placeholder="Your Business LLC" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Service interest</label>
        <select
          value={form.service_interest}
          onChange={(e) => set('service_interest', e.target.value)}
          className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors appearance-none"
        >
          <option value="" className="bg-[#0A1A2F]">Select a service…</option>
          {SERVICES.map((s) => (
            <option key={s} value={s} className="bg-[#0A1A2F]">{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Project details</label>
        <textarea
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="Tell us about your business and what you're looking for…"
          rows={4}
          className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !form.name || !form.email}
        className="w-full bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
      >
        {loading ? 'Sending…' : cta}
      </button>
    </form>
  )
}

function Input({
  label, value, onChange, placeholder, type = 'text', required = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">{label}</label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors"
      />
    </div>
  )
}
