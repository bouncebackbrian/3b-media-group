'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GenerateButton({ listingId }: { listingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/listings/generate-assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId }),
    })
    const data = await res.json()
    if (res.ok) {
      router.refresh()
    } else {
      setError(data.error ?? 'Generation failed.')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button
        onClick={generate}
        disabled={loading}
        className="bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating…
          </>
        ) : (
          'Generate Marketing Assets →'
        )}
      </button>
    </div>
  )
}
