'use client'

import { useState } from 'react'

const services = [
  'Domain Setup',
  'Logo Design',
  'Website Build',
  'Credibility Builder',
  'Funding-Readiness Package',
  'Done-For-You Launch',
  'Not sure — need a recommendation',
]

export default function StartProjectForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    service_interest: '',
    message: '',
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function submit() {
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'start_project' }),
      })
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-[#111] border border-white/8 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 bg-[#F97316]/15 border border-[#F97316]/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-black text-xl mb-3">We have your information.</h3>
        <p className="text-white/50 text-sm leading-relaxed">
          Expect a response within 1 business day with a clear recommendation and next steps.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-8">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-[#F97316]' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <h3 className="font-bold text-lg">Your contact info</h3>
          <Field label="Full name *" value={form.name} onChange={(v) => set('name', v)} placeholder="Brian Martin" />
          <Field label="Email address *" type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="brian@yourbusiness.com" />
          <Field label="Phone number" type="tel" value={form.phone} onChange={(v) => set('phone', v)} placeholder="(555) 000-0000" />
          <Field label="Business name" value={form.company_name} onChange={(v) => set('company_name', v)} placeholder="Your Business LLC" />
          <button
            onClick={() => setStep(2)}
            disabled={!form.name || !form.email}
            className="w-full bg-[#F97316] disabled:opacity-40 hover:bg-[#ea6c0a] text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-bold text-lg">What do you need?</h3>
          <div className="space-y-2">
            {services.map((s) => (
              <button
                key={s}
                onClick={() => set('service_interest', s)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                  form.service_interest === s
                    ? 'border-[#F97316] bg-[#F97316]/10 text-white'
                    : 'border-white/10 text-white/55 hover:border-white/25 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="border border-white/15 text-white/50 font-semibold py-3 px-5 rounded-xl text-sm">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.service_interest}
              className="flex-1 bg-[#F97316] disabled:opacity-40 hover:bg-[#ea6c0a] text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h3 className="font-bold text-lg">Tell us more</h3>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              What does your business do, and what is your main goal right now?
            </label>
            <textarea
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              placeholder="We are a trucking company looking to get vendor accounts and need to look more professional online..."
              rows={5}
              className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#F97316]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="border border-white/15 text-white/50 font-semibold py-3 px-5 rounded-xl text-sm">
              Back
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 bg-[#F97316] disabled:opacity-50 hover:bg-[#ea6c0a] text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#F97316]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
      />
    </div>
  )
}
