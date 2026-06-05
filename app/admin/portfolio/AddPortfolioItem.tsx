'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddPortfolioItem({ type }: { type: 'case_study' | 'testimonial' }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [summary, setSummary] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorTitle, setAuthorTitle] = useState('')
  const [quote, setQuote] = useState('')
  const [rating, setRating] = useState('5')
  const [publish, setPublish] = useState(false)

  async function save() {
    setSaving(true)
    await fetch('/api/admin/portfolio/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        name, industry, summary,
        author_name: authorName, author_title: authorTitle, quote, rating: parseInt(rating),
        is_published: publish,
      }),
    })
    setSaving(false)
    setOpen(false)
    setName(''); setIndustry(''); setSummary('')
    setAuthorName(''); setAuthorTitle(''); setQuote(''); setRating('5')
    router.refresh()
  }

  const label = type === 'case_study' ? 'Add Case Study' : 'Add Testimonial'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
      >
        + {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#0A1A2F] border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-black text-lg mb-5">{label}</h3>

            <div className="space-y-4">
              {type === 'case_study' ? (
                <>
                  <Input label="Client Name *" value={name} onChange={setName} placeholder="Madalyn — Real Estate" />
                  <Input label="Industry" value={industry} onChange={setIndustry} placeholder="Real Estate" />
                  <Textarea label="Summary" value={summary} onChange={setSummary} placeholder="Short description of results…" />
                </>
              ) : (
                <>
                  <Input label="Author Name *" value={authorName} onChange={setAuthorName} placeholder="Madalyn" />
                  <Input label="Author Title" value={authorTitle} onChange={setAuthorTitle} placeholder="Real Estate Professional" />
                  <Textarea label="Quote *" value={quote} onChange={setQuote} placeholder="Their testimonial…" />
                  <div>
                    <label className="block text-xs text-white/45 uppercase tracking-wider mb-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-[#11243D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                    >
                      {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                    </select>
                  </div>
                </>
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                  className="w-4 h-4 accent-[#14B8A6]"
                />
                <span className="text-sm text-white/60">Publish immediately</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={save}
                disabled={saving || (type === 'case_study' ? !name : !authorName || !quote)}
                className="flex-1 bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="border border-white/15 hover:border-white/30 text-white/50 hover:text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/45 uppercase tracking-wider mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#11243D] border border-white/10 focus:border-[#14B8A6]/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors"
      />
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/45 uppercase tracking-wider mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-[#11243D] border border-white/10 focus:border-[#14B8A6]/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none"
      />
    </div>
  )
}
