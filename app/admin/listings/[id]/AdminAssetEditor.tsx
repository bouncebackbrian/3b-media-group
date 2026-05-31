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
  model_used: string | null
}

const ASSET_KEYS = [
  { key: 'facebook_listing',    label: 'Facebook Listing Post' },
  { key: 'facebook_open_house', label: 'Facebook Open House Post' },
  { key: 'instagram_caption',   label: 'Instagram Caption' },
  { key: 'reel_script',         label: 'Reel Script' },
  { key: 'flyer_copy',          label: 'Flyer Copy' },
  { key: 'hashtags',            label: 'Hashtag Set' },
  { key: 'sms_copy',            label: 'SMS Copy' },
  { key: 'email_copy',          label: 'Email Copy' },
] as const

type AssetKey = typeof ASSET_KEYS[number]['key']

export default function AdminAssetEditor({ assets, listingId }: { assets: Assets; listingId: string }) {
  const router = useRouter()
  const [active, setActive] = useState<AssetKey>('facebook_listing')
  const [drafts, setDrafts] = useState<Partial<Record<AssetKey, string>>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<AssetKey | null>(null)

  const currentValue = (key: AssetKey): string =>
    drafts[key] ?? (assets[key] as string | null) ?? ''

  const isDirty = (key: AssetKey) =>
    drafts[key] !== undefined && drafts[key] !== (assets[key] ?? '')

  async function saveAsset(key: AssetKey) {
    if (!isDirty(key)) return
    setSaving(true)
    await fetch(`/api/admin/listings/${listingId}/assets`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset_id: assets.id, field: key, value: drafts[key] }),
    })
    setSaving(false)
    setSaved(key)
    setTimeout(() => setSaved(null), 2500)
    router.refresh()
  }

  const available = ASSET_KEYS.filter(({ key }) => {
    const v = assets[key] as string | null
    return v && v !== 'N/A — no open house date provided'
  })

  return (
    <div className="bg-[#11243D] border border-white/8 rounded-2xl mb-5">
      <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm">Generated Assets</h2>
          <p className="text-white/30 text-xs mt-0.5">Generated with {assets.model_used} · click any field to edit</p>
        </div>
      </div>

      <div className="flex gap-0 min-h-96">
        {/* Sidebar */}
        <div className="w-52 shrink-0 border-r border-white/8 p-2 space-y-0.5">
          {available.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-colors ${
                active === key
                  ? 'bg-[#14B8A6]/15 text-[#14B8A6] font-semibold'
                  : 'text-white/45 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex-1 truncate">{label}</span>
              {isDirty(key) && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">
              {ASSET_KEYS.find((a) => a.key === active)?.label}
            </h3>
            <button
              onClick={() => saveAsset(active)}
              disabled={saving || !isDirty(active)}
              className="bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-40 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors"
            >
              {saving ? 'Saving…' : saved === active ? 'Saved ✓' : 'Save'}
            </button>
          </div>
          <textarea
            value={currentValue(active)}
            onChange={(e) => setDrafts((d) => ({ ...d, [active]: e.target.value }))}
            rows={16}
            className="flex-1 w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/40 rounded-xl px-4 py-3 text-sm text-white/80 outline-none transition-colors resize-none font-sans leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
