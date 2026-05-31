'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'] as const
const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const

type Lead = {
  id: string
  status: string
  priority: string | null
  admin_notes: string | null
}

export default function LeadActions({ lead }: { lead: Lead }) {
  const router = useRouter()
  const [status, setStatus] = useState(lead.status)
  const [priority, setPriority] = useState(lead.priority ?? '')
  const [notes, setNotes] = useState(lead.admin_notes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [converting, setConverting] = useState(false)

  async function save() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/leads/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, status, priority: priority || null, admin_notes: notes }),
    })
    setSaving(false)
    setSaved(true)
    router.refresh()
  }

  async function convertToClient() {
    if (!confirm('Convert this lead to a client? This will create a new client record.')) return
    setConverting(true)
    const res = await fetch('/api/admin/leads/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id }),
    })
    setConverting(false)
    if (res.ok) {
      const data = await res.json()
      router.push(`/admin/clients/${data.clientId}`)
    }
  }

  const statusColor: Record<string, string> = {
    new: 'border-blue-500/40 text-blue-400',
    contacted: 'border-yellow-500/40 text-yellow-400',
    qualified: 'border-purple-500/40 text-purple-400',
    proposal_sent: 'border-orange-500/40 text-orange-400',
    won: 'border-green-500/40 text-green-400',
    lost: 'border-white/15 text-white/30',
  }

  return (
    <div className="bg-[#11243D] border border-white/8 rounded-2xl p-6 space-y-5">
      <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-1">Actions</p>

      {/* Status */}
      <div>
        <label className="block text-xs text-white/45 mb-2">Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                status === s
                  ? statusColor[s] ?? 'border-[#14B8A6]/40 text-[#14B8A6]'
                  : 'border-white/10 text-white/35 hover:border-white/25'
              }`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-xs text-white/45 mb-2">Follow-up Priority</label>
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => setPriority(priority === p ? '' : p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                priority === p
                  ? 'border-[#14B8A6]/40 bg-[#14B8A6]/10 text-[#14B8A6]'
                  : 'border-white/10 text-white/35 hover:border-white/25'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs text-white/45 mb-2">Admin Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add notes about this lead…"
          className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 pt-1">
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
        <button
          onClick={convertToClient}
          disabled={converting}
          className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {converting ? 'Converting…' : 'Convert to Client →'}
        </button>
      </div>
    </div>
  )
}
