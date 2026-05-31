'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TONES = ['Professional & Warm', 'Luxury & Sophisticated', 'Friendly & Approachable', 'Bold & Energetic', 'Concise & Direct']
const KEY_FEATURE_SUGGESTIONS = [
  'Updated kitchen', 'Open floor plan', 'Primary suite', 'Walk-in closets', 'Hardwood floors',
  'New roof', 'New HVAC', 'Pool', 'Fenced yard', 'Two-car garage', 'Corner lot', 'Cul-de-sac',
  'Natural light', 'Home office', 'Smart home features', 'New appliances',
]

interface ImportResult {
  extracted_address: string | null
  extracted_price: string | null
  extracted_beds: number | null
  extracted_baths: number | null
  extracted_sqft: number | null
  extracted_lot_size: string | null
  extracted_description: string | null
  extracted_features: string[]
  detected_images: string[]
  source_url: string
  imported_from: string
}

const SOURCE_LABELS: Record<string, string> = {
  zillow: 'Zillow', redfin: 'Redfin', realtor: 'Realtor.com',
  trulia: 'Trulia', homes: 'Homes.com', compass: 'Compass', mls: 'MLS', other: 'Listing site',
}

export default function NewListingPage() {
  const router = useRouter()
  // step 0 = URL import (optional), steps 1-3 = form
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Import state
  const [listingUrl, setListingUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [permissionConfirmed, setPermissionConfirmed] = useState(false)

  const [form, setForm] = useState({
    property_address: '', listing_price: '', bedrooms: '', bathrooms: '',
    square_footage: '', listing_description: '',
    realtor_name: '', realtor_phone: '', realtor_email: '',
    lot_size: '', mls_link: '', open_house_date: '', open_house_time: '',
    neighborhood_highlights: '', school_area_notes: '',
    key_features: [] as string[], custom_feature: '',
    preferred_tone: '', preferred_cta: '', special_instructions: '',
  })

  const set = (k: string, v: string | string[]) => setForm((f) => ({ ...f, [k]: v }))

  const toggleFeature = (f: string) =>
    setForm((prev) => ({
      ...prev,
      key_features: prev.key_features.includes(f)
        ? prev.key_features.filter((x) => x !== f)
        : [...prev.key_features, f],
    }))

  // ── Import ──────────────────────────────────────────────────
  async function importUrl() {
    if (!listingUrl.trim()) return
    setImporting(true)
    setImportError('')
    setImportResult(null)

    const res = await fetch('/api/listings/import-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_url: listingUrl.trim() }),
    })
    const data = await res.json()

    if (!data.success) {
      setImportError(data.error ?? 'Import failed. Fill in the form manually.')
      setImporting(false)
      return
    }

    setImportResult(data as ImportResult)
    setImporting(false)
  }

  function applyImport() {
    if (!importResult) return
    setForm((f) => ({
      ...f,
      property_address: importResult.extracted_address ?? f.property_address,
      listing_price: importResult.extracted_price ?? f.listing_price,
      bedrooms: importResult.extracted_beds != null ? String(importResult.extracted_beds) : f.bedrooms,
      bathrooms: importResult.extracted_baths != null ? String(importResult.extracted_baths) : f.bathrooms,
      square_footage: importResult.extracted_sqft != null ? String(importResult.extracted_sqft) : f.square_footage,
      lot_size: importResult.extracted_lot_size ?? f.lot_size,
      listing_description: importResult.extracted_description ?? f.listing_description,
      mls_link: listingUrl.trim(),
      key_features: importResult.extracted_features.length > 0
        ? importResult.extracted_features.slice(0, 8)
        : f.key_features,
    }))
    setStep(1)
  }

  // ── Submit ──────────────────────────────────────────────────
  async function submit() {
    if (importResult && !permissionConfirmed) {
      setError('Please confirm you have permission to use the imported listing information.')
      return
    }
    setLoading(true)
    setError('')
    const features = [
      ...form.key_features,
      ...(form.custom_feature ? form.custom_feature.split(',').map((s) => s.trim()).filter(Boolean) : []),
    ]
    const payload = {
      ...form,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseFloat(form.bathrooms) : null,
      square_footage: form.square_footage ? parseInt(form.square_footage) : null,
      key_features: features,
      // import provenance
      source_url: importResult?.source_url ?? undefined,
      imported_from: importResult?.imported_from ?? undefined,
      import_confirmed_permission: importResult ? permissionConfirmed : undefined,
      imported_raw_data: importResult
        ? {
            extracted_address: importResult.extracted_address,
            extracted_price: importResult.extracted_price,
            extracted_beds: importResult.extracted_beds,
            extracted_baths: importResult.extracted_baths,
            extracted_sqft: importResult.extracted_sqft,
            extracted_description: importResult.extracted_description,
            detected_images: importResult.detected_images,
          }
        : undefined,
    }

    const res = await fetch('/api/listings/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }
    router.push(`/portal/listings/${data.listing_id}`)
  }

  const step1Valid = form.property_address && form.listing_price && form.realtor_name
  const STEP_LABELS = ['Property Details', 'Realtor & Dates', 'Marketing Preferences']

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/portal/listings" className="text-white/30 hover:text-white text-sm transition-colors">← Listings</a>
        <span className="text-white/15">/</span>
        <span className="text-sm text-white/50">New Listing</span>
      </div>

      <h1 className="text-2xl font-black mb-2">Add New Listing</h1>
      <p className="text-white/40 text-sm mb-8">Fill in your property details and we&apos;ll generate all marketing assets automatically.</p>

      {/* ── Step 0: URL Import ─────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="bg-[#11243D] border border-white/8 rounded-2xl p-6">
            <p className="font-black text-sm mb-0.5">Import from a listing URL</p>
            <p className="text-white/35 text-xs mb-5">
              Paste a Zillow, Redfin, Realtor.com, or MLS link to prefill your property details. You&apos;ll review and confirm everything before saving.
            </p>

            <div className="flex gap-2">
              <input
                value={listingUrl}
                onChange={(e) => setListingUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && importUrl()}
                placeholder="https://www.zillow.com/homedetails/..."
                className="flex-1 bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors"
              />
              <button
                onClick={importUrl}
                disabled={importing || !listingUrl.trim()}
                className="bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-40 text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors whitespace-nowrap"
              >
                {importing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Importing…
                  </span>
                ) : 'Import →'}
              </button>
            </div>

            {importError && (
              <p className="mt-3 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">{importError}</p>
            )}

            {/* Import results */}
            {importResult && (
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  <p className="text-sm font-semibold text-green-400">
                    Data extracted from {SOURCE_LABELS[importResult.imported_from] ?? 'listing page'}
                  </p>
                </div>

                {/* Preview of extracted fields */}
                <div className="bg-[#0A1A2F] border border-white/8 rounded-xl p-4 space-y-2.5 text-sm">
                  {importResult.extracted_address && <ImportRow label="Address" value={importResult.extracted_address} />}
                  {importResult.extracted_price && <ImportRow label="Price" value={importResult.extracted_price} />}
                  <div className="flex gap-4">
                    {importResult.extracted_beds != null && <ImportRow label="Beds" value={String(importResult.extracted_beds)} />}
                    {importResult.extracted_baths != null && <ImportRow label="Baths" value={String(importResult.extracted_baths)} />}
                    {importResult.extracted_sqft != null && <ImportRow label="Sq Ft" value={importResult.extracted_sqft.toLocaleString()} />}
                  </div>
                  {importResult.extracted_lot_size && <ImportRow label="Lot Size" value={importResult.extracted_lot_size} />}
                  {importResult.extracted_description && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Description</p>
                      <p className="text-white/60 text-xs leading-relaxed line-clamp-3">{importResult.extracted_description}</p>
                    </div>
                  )}
                  {importResult.extracted_features.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5">Features</p>
                      <div className="flex flex-wrap gap-1.5">
                        {importResult.extracted_features.map((f) => (
                          <span key={f} className="text-[10px] bg-[#14B8A6]/10 text-[#14B8A6] px-2 py-0.5 rounded border border-[#14B8A6]/20">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Detected image references */}
                {importResult.detected_images.length > 0 && (
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-xs font-semibold text-amber-400 mb-1">
                      {importResult.detected_images.length} image{importResult.detected_images.length !== 1 ? 's' : ''} detected (reference only)
                    </p>
                    <p className="text-xs text-white/45 leading-relaxed">
                      Images from listing sites may be protected by copyright. They are shown here for reference only. Please <strong className="text-white/70">upload your own authorized photos</strong> on the next step.
                    </p>
                  </div>
                )}

                {/* Permission checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={permissionConfirmed}
                    onChange={(e) => setPermissionConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-[#14B8A6] shrink-0"
                  />
                  <span className="text-xs text-white/55 group-hover:text-white/75 transition-colors leading-relaxed">
                    I confirm I have permission to use the listing information, photos, and marketing materials submitted for this property. I understand imported descriptions are for reference — I will review and edit them before generating marketing assets.
                  </span>
                </label>

                <button
                  onClick={applyImport}
                  disabled={!permissionConfirmed}
                  className="w-full bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  Apply & Continue to Form →
                </button>
              </div>
            )}
          </div>

          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25 uppercase tracking-wider font-semibold">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full border border-white/10 hover:border-white/25 text-white/50 hover:text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Fill in manually →
          </button>
        </div>
      )}

      {/* ── Steps 1–3: Form ───────────────────────────────────── */}
      {step >= 1 && (
        <>
          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            {STEP_LABELS.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1 rounded-full mb-1.5 ${i + 1 <= step ? 'bg-[#14B8A6]' : 'bg-white/10'}`} />
                <p className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${i + 1 === step ? 'text-[#14B8A6]' : 'text-white/25'}`}>{s}</p>
              </div>
            ))}
          </div>

          {/* Import banner (if data was pre-filled) */}
          {importResult && (
            <div className="mb-5 bg-[#14B8A6]/8 border border-[#14B8A6]/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-[#14B8A6] text-sm mt-0.5">◈</span>
              <div>
                <p className="text-sm font-semibold text-[#14B8A6]">Fields pre-filled from {SOURCE_LABELS[importResult.imported_from] ?? 'import'}</p>
                <p className="text-xs text-white/45 mt-0.5">Review every field — imported data may be incomplete or inaccurate. Edit freely.</p>
              </div>
            </div>
          )}

          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 mb-5">{error}</div>}

          <div className="bg-[#11243D] border border-white/8 rounded-2xl p-6 space-y-5">
            {step === 1 && (
              <>
                <SectionHead title="Property Details" sub="Required fields marked with *" />
                <Field label="Property Address *" value={form.property_address} onChange={(v) => set('property_address', v)} placeholder="123 Oak Street, Austin, TX 78701" />
                <Field label="Listing Price *" value={form.listing_price} onChange={(v) => set('listing_price', v)} placeholder="$485,000" />
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Bedrooms" value={form.bedrooms} onChange={(v) => set('bedrooms', v)} placeholder="4" type="number" />
                  <Field label="Bathrooms" value={form.bathrooms} onChange={(v) => set('bathrooms', v)} placeholder="2.5" type="number" />
                  <Field label="Sq Ft" value={form.square_footage} onChange={(v) => set('square_footage', v)} placeholder="2,100" type="number" />
                </div>
                <Field label="Lot Size" value={form.lot_size} onChange={(v) => set('lot_size', v)} placeholder="0.25 acres" />
                <Textarea label="Listing Description" value={form.listing_description} onChange={(v) => set('listing_description', v)} placeholder="Describe the property — this feeds directly into generated copy…" rows={4} />
              </>
            )}

            {step === 2 && (
              <>
                <SectionHead title="Realtor & Dates" sub="Your contact info appears in all generated assets" />
                <Field label="Realtor Name *" value={form.realtor_name} onChange={(v) => set('realtor_name', v)} placeholder="Jane Smith" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Realtor Phone" value={form.realtor_phone} onChange={(v) => set('realtor_phone', v)} placeholder="(512) 555-0100" type="tel" />
                  <Field label="Realtor Email" value={form.realtor_email} onChange={(v) => set('realtor_email', v)} placeholder="jane@realty.com" type="email" />
                </div>
                <Field label="MLS / Listing URL" value={form.mls_link} onChange={(v) => set('mls_link', v)} placeholder="https://mls.example.com/listing/123" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Open House Date" value={form.open_house_date} onChange={(v) => set('open_house_date', v)} type="date" />
                  <Field label="Open House Time" value={form.open_house_time} onChange={(v) => set('open_house_time', v)} placeholder="1:00 PM – 4:00 PM" />
                </div>
                <Textarea label="Neighborhood Highlights" value={form.neighborhood_highlights} onChange={(v) => set('neighborhood_highlights', v)} placeholder="Close to Barton Springs Pool, South Congress dining, greenbelt trails…" rows={2} />
                <Textarea label="School / Area Notes" value={form.school_area_notes} onChange={(v) => set('school_area_notes', v)} placeholder="Eanes ISD, near Westlake High School…" rows={2} />
              </>
            )}

            {step === 3 && (
              <>
                <SectionHead title="Marketing Preferences" sub="Help us nail the tone and call to action" />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Key Features</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {KEY_FEATURE_SUGGESTIONS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFeature(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          form.key_features.includes(f)
                            ? 'border-[#14B8A6]/50 bg-[#14B8A6]/10 text-[#14B8A6]'
                            : 'border-white/10 text-white/45 hover:border-white/25'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <Field label="Other features (comma separated)" value={form.custom_feature} onChange={(v) => set('custom_feature', v)} placeholder="Solar panels, wine cellar, EV charger…" />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Preferred Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set('preferred_tone', form.preferred_tone === t ? '' : t)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          form.preferred_tone === t
                            ? 'border-[#14B8A6]/50 bg-[#14B8A6]/10 text-[#14B8A6]'
                            : 'border-white/10 text-white/45 hover:border-white/25'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="Preferred Call to Action" value={form.preferred_cta} onChange={(v) => set('preferred_cta', v)} placeholder="Contact me today for a private showing" />
                <Textarea label="Special Instructions" value={form.special_instructions} onChange={(v) => set('special_instructions', v)} placeholder="Any specific requirements, things to avoid, or extra context for the copywriter…" rows={3} />

                {/* Permission confirmation (shown on final step if import was used) */}
                {importResult && (
                  <div className="border-t border-white/8 pt-5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissionConfirmed}
                        onChange={(e) => setPermissionConfirmed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded accent-[#14B8A6] shrink-0"
                      />
                      <span className="text-xs text-white/55 leading-relaxed">
                        I confirm I have permission to use the listing information, photos, and marketing materials submitted for this property.
                      </span>
                    </label>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep((s) => s - 1)}
                className="border border-white/15 hover:border-white/30 text-white/55 hover:text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
              >
                Back
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 1 && !step1Valid}
                  className="flex-1 bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={loading || (importResult != null && !permissionConfirmed)}
                  className="flex-1 bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  {loading ? 'Saving listing…' : 'Submit Listing & Generate Assets →'}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ImportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 w-16 shrink-0">{label}</span>
      <span className="text-sm text-white/75">{value}</span>
    </div>
  )
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-1">
      <h2 className="font-black text-lg">{title}</h2>
      <p className="text-xs text-white/35 mt-0.5">{sub}</p>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors [color-scheme:dark]"
      />
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none"
      />
    </div>
  )
}
