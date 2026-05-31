'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['submitted','generating','generated','in_review','approved','revision_requested','completed'] as const

export default function AdminListingActions({ listing }: { listing: { id: string; status: string; admin_notes?: string | null } }) {
  const router = useRouter()
  const [status, setStatus] = useState(listing.status)
  const [notes, setNotes] = useState(listing.admin_notes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const statusColor: Record<string, string> = {
    submitted: 'border-yellow-500/40 text-yellow-400',
    generating: 'border-blue-500/40 text-blue-400',
    generated: 'border-[#14B8A6]/40 text-[#14B8A6]',
    in_review: 'border-purple-500/40 text-purple-400',
    approved: 'border-green-500/40 text-green-400',
    revision_requested: 'border-orange-500/40 text-orange-400',
    completed: 'border-white/15 text-white/30',
  }

  async function save() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/listings/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: listing.id, status, admin_notes: notes }),
    })
    setSaving(false)
    setSaved(true)
    router.refresh()
  }

  return (
    <div className="bg-[#11243D] border border-white/8 rounded-2xl p-5 mb-5 space-y-4">
      <p className="text-xs font-bold uppercase tracking-wider text-white/35">Admin Actions</p>

      <div>
        <label className="block text-xs text-white/45 mb-2">Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                status === s ? statusColor[s] : 'border-white/10 text-white/35 hover:border-white/25'
              }`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/45 mb-2">Admin Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Internal notes about this listing…"
          className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
      </button>
    </div>
  )
}
