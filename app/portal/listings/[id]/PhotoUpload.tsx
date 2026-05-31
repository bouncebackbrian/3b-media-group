'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { key: 'exterior', label: 'Exterior' },
  { key: 'kitchen', label: 'Kitchen' },
  { key: 'living_room', label: 'Living Room' },
  { key: 'bedroom', label: 'Bedroom' },
  { key: 'bathroom', label: 'Bathroom' },
  { key: 'backyard', label: 'Backyard' },
  { key: 'other', label: 'Other' },
] as const

interface Photo {
  id: string
  public_url: string
  category: string
}

export default function PhotoUpload({ listingId, existingPhotos }: { listingId: string; existingPhotos: Photo[] }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<string>('exterior')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    const supabase = createClient()

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) {
        setError('Max file size is 10MB per photo.')
        continue
      }

      const ext = file.name.split('.').pop()
      const path = `${listingId}/${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('listing-photos')
        .upload(path, file, { contentType: file.type, upsert: false })

      if (uploadErr) {
        setError(`Upload failed: ${uploadErr.message}`)
        continue
      }

      const { data: urlData } = supabase.storage.from('listing-photos').getPublicUrl(path)

      await fetch('/api/listings/photos/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          storage_path: path,
          public_url: urlData.publicUrl,
          category,
        }),
      })
    }

    setUploading(false)
    router.refresh()
  }

  const grouped = CATEGORIES.map((c) => ({
    ...c,
    photos: existingPhotos.filter((p) => p.category === c.key),
  })).filter((g) => g.photos.length > 0)

  return (
    <div>
      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              category === c.key
                ? 'border-[#14B8A6]/50 bg-[#14B8A6]/10 text-[#14B8A6]'
                : 'border-white/10 text-white/45 hover:border-white/25'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-white/10 hover:border-[#14B8A6]/30 rounded-xl p-6 text-center cursor-pointer transition-colors mb-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-[#14B8A6]/40 border-t-[#14B8A6] rounded-full animate-spin" />
            <p className="text-sm text-white/50">Uploading…</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-white/45">Click to upload <span className="text-[#14B8A6] font-semibold">{CATEGORIES.find((c) => c.key === category)?.label}</span> photos</p>
            <p className="text-xs text-white/25 mt-1">PNG, JPG up to 10MB each · Multiple files OK</p>
          </>
        )}
      </div>

      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

      {/* Photo grid */}
      {grouped.map((g) => (
        <div key={g.key} className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-2">{g.label} ({g.photos.length})</p>
          <div className="grid grid-cols-4 gap-2">
            {g.photos.map((p) => (
              <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.public_url} alt={g.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {existingPhotos.length === 0 && (
        <p className="text-xs text-white/25 text-center py-2">No photos uploaded yet.</p>
      )}
    </div>
  )
}
