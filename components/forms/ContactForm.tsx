'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
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
        body: JSON.stringify({ ...form, source: 'contact_form' }),
      })
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-[#111] border border-white/8 rounded-2xl p-10 text-center">
        <div className="w-12 h-12 bg-[#F97316]/15 border border-[#F97316]/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-black text-lg mb-2">Message received.</h3>
        <p className="text-white/45 text-sm">We will respond within 1 business day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-[#111] border border-white/8 rounded-2xl p-8 space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Full name *</label>
        <input
          required
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Brian Martin"
          className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#F97316]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Email address *</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="brian@yourbusiness.com"
          className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#F97316]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Message *</label>
        <textarea
          required
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="Tell us what you need..."
          rows={5}
          className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#F97316]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#F97316] hover:bg-[#ea6c0a] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
      >
        {loading ? 'Sending...' : 'Send Message →'}
      </button>
    </form>
  )
}
