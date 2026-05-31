'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SERVICE_TYPES = [
  'Social Media Post',
  'Reel / Short Video',
  'Open House Marketing',
  'Listing Promotion',
  'Blog / Content',
  'Email Campaign',
  'Logo / Branding Update',
  'Website Update',
  'Ad Creative',
  'Other',
]

export default function NewRequestPage() {
  const router = useRouter()
  const [serviceType, setServiceType] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!serviceType) { setError('Please select a service type.'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/portal/requests/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_type: serviceType, description, deadline: deadline || null, notes }),
    })

    if (res.ok) {
      router.push('/portal/requests')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/portal/requests" className="text-white/30 hover:text-white text-sm transition-colors">← Requests</a>
        <span className="text-white/15">/</span>
        <span className="text-sm text-white/50">New Request</span>
      </div>

      <h1 className="text-2xl font-black mb-6">New Content Request</h1>

      <form onSubmit={submit} className="bg-[#11243D] border border-white/8 rounded-2xl p-6 space-y-5">
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Service Type *</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors appearance-none"
          >
            <option value="" disabled>Select a service…</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s} className="bg-[#0A1A2F]">{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe what you need — be as specific as possible…"
            className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any other details, links, or references…"
            className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
          <a
            href="/portal/requests"
            className="border border-white/15 hover:border-white/30 text-white/50 hover:text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
