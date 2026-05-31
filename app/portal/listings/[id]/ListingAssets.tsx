'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Assets {
  id: string
  facebook_listing: string | null
  facebook_open_house: string | null
  instagram_caption: string | null
  reel_script: string | null
  flyer_copy: string | null
  hashtags: string | null
  sms_copy: string | null
  email_copy: string | null
}

const ASSET_LABELS: { key: keyof Assets; label: string; icon: string }[] = [
  { key: 'facebook_listing', label: 'Facebook Listing Post', icon: 'f' },
  { key: 'facebook_open_house', label: 'Facebook Open House Post', icon: 'f' },
  { key: 'instagram_caption', label: 'Instagram Caption', icon: '◉' },
  { key: 'reel_script', label: 'Reel Script', icon: '▶' },
  { key: 'flyer_copy', label: 'Flyer Copy', icon: '◧' },
  { key: 'hashtags', label: 'Hashtag Set', icon: '#' },
  { key: 'sms_copy', label: 'SMS Copy', icon: '✉' },
  { key: 'email_copy', label: 'Email Copy', icon: '✉' },
]

export default function ListingAssets({ assets, listingId }: { assets: Assets; listingId: string }) {
  const router = useRouter()
  const [active, setActive] = useState<keyof Assets>('facebook_listing')
  const [copied, setCopied] = useState(false)
  const [revisionOpen, setRevisionOpen] = useState(false)
  const [revisionNotes, setRevisionNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const current = assets[active] as string | null

  function copy() {
    if (!current) return
    navigator.clipboard.writeText(current)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function submitRevision() {
    if (!revisionNotes.trim()) return
    setSubmitting(true)
    await fetch('/api/listings/revision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listingId,
        asset_type: ASSET_LABELS.find((a) => a.key === active)?.label,
        notes: revisionNotes,
      }),
    })
    setSubmitting(false)
    setRevisionOpen(false)
    setRevisionNotes('')
    router.refresh()
  }

  const available = ASSET_LABELS.filter((a) => {
    const val = assets[a.key] as string | null
    return val && val !== 'N/A — no open house date provided'
  })

  return (
    <div className="bg-[#11243D] border border-white/8 rounded-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <h2 className="font-bold text-sm">Generated Marketing Assets</h2>
        <span className="text-xs text-white/30">{available.length} assets</span>
      </div>

      <div className="flex gap-0 min-h-96">
        {/* Sidebar */}
        <div className="w-48 shrink-0 border-r border-white/8 p-2 space-y-0.5">
          {available.map((a) => (
            <button
              key={a.key}
              onClick={() => setActive(a.key)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-colors ${
                active === a.key
                  ? 'bg-[#14B8A6]/15 text-[#14B8A6] font-semibold'
                  : 'text-white/45 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="font-mono text-[10px] w-3 shrink-0">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-bold text-sm">
              {ASSET_LABELS.find((a) => a.key === active)?.label}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setRevisionOpen(true)}
                className="border border-white/15 hover:border-white/30 text-white/50 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Request Revision
              </button>
              <button
                onClick={copy}
                className="bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="flex-1 bg-[#0A1A2F] border border-white/8 rounded-xl p-4 overflow-y-auto">
            <pre className="text-sm text-white/75 whitespace-pre-wrap font-sans leading-relaxed">
              {current ?? '—'}
            </pre>
          </div>
        </div>
      </div>

      {/* Revision modal */}
      {revisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRevisionOpen(false)} />
          <div className="relative bg-[#0A1A2F] border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-black text-lg mb-1">Request Revision</h3>
            <p className="text-white/40 text-sm mb-4">
              {ASSET_LABELS.find((a) => a.key === active)?.label}
            </p>
            <textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              rows={4}
              placeholder="Describe what you&apos;d like changed or improved…"
              className="w-full bg-[#11243D] border border-white/10 focus:border-[#14B8A6]/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={submitRevision}
                disabled={submitting || !revisionNotes.trim()}
                className="flex-1 bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
              <button
                onClick={() => setRevisionOpen(false)}
                className="border border-white/15 text-white/50 font-semibold px-5 py-3 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
