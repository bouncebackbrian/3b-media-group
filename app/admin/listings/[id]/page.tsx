import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { notFound } from 'next/navigation'
import AdminListingActions from './AdminListingActions'
import AdminAssetEditor from './AdminAssetEditor'

export default async function AdminListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceRoleClient()

  const [{ data: listing }, { data: assets }, { data: photos }, { data: revisions }] = await Promise.all([
    supabase
      .from('media_property_listings')
      .select('*, media_clients(full_name, email, company_name)')
      .eq('id', id)
      .single(),
    supabase
      .from('media_generated_marketing_assets')
      .select('*')
      .eq('listing_id', id)
      .eq('is_current', true)
      .single(),
    supabase
      .from('media_listing_photos')
      .select('*')
      .eq('listing_id', id)
      .order('category'),
    supabase
      .from('media_listing_revision_requests')
      .select('*')
      .eq('listing_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!listing) notFound()

  const client = listing.media_clients as { full_name?: string; email?: string; company_name?: string } | null

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/listings" className="text-white/30 hover:text-white text-sm transition-colors">← Listings</a>
        <span className="text-white/15">/</span>
        <span className="text-sm text-white/50 truncate">{listing.property_address}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <div className="md:col-span-2 bg-[#11243D] border border-white/8 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-3">Property</p>
          <h1 className="text-xl font-black mb-0.5">{listing.property_address}</h1>
          <p className="text-[#14B8A6] font-bold">{listing.listing_price}</p>
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            {listing.bedrooms && <Pill label="Beds" value={String(listing.bedrooms)} />}
            {listing.bathrooms && <Pill label="Baths" value={String(listing.bathrooms)} />}
            {listing.square_footage && <Pill label="Sq Ft" value={listing.square_footage.toLocaleString()} />}
          </div>
          {listing.open_house_date && (
            <p className="text-xs text-white/40 mt-3">
              Open House: {new Date(listing.open_house_date).toLocaleDateString()} {listing.open_house_time && `@ ${listing.open_house_time}`}
            </p>
          )}
        </div>

        <div className="bg-[#11243D] border border-white/8 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-3">Client</p>
          <p className="font-semibold">{client?.full_name ?? '—'}</p>
          <p className="text-white/45 text-sm">{client?.email}</p>
          {client?.company_name && <p className="text-white/30 text-xs mt-0.5">{client.company_name}</p>}
          <div className="mt-4">
            <p className="text-xs text-white/35 mb-1">Realtor</p>
            <p className="text-sm font-semibold">{listing.realtor_name}</p>
            {listing.realtor_phone && <p className="text-xs text-white/40">{listing.realtor_phone}</p>}
          </div>
        </div>
      </div>

      {/* URL Import provenance */}
      {listing.source_url && (
        <div className="bg-[#11243D] border border-white/8 rounded-2xl p-5 mb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-3">Import Provenance</p>
          <div className="space-y-2.5 text-sm">
            <Row label="Source">
              <a href={listing.source_url} target="_blank" rel="noopener noreferrer"
                className="text-[#14B8A6] hover:underline break-all text-xs">
                {listing.source_url}
              </a>
            </Row>
            {listing.imported_from && (
              <Row label="Platform">
                <span className="capitalize">{listing.imported_from}</span>
              </Row>
            )}
            <Row label="Permission">
              {listing.import_confirmed_permission ? (
                <span className="text-green-400 font-semibold">✓ Confirmed by client</span>
              ) : (
                <span className="text-amber-400">Not confirmed</span>
              )}
            </Row>
          </div>
          {listing.imported_raw_data && (
            <details className="mt-3">
              <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 select-none">
                Show raw extracted data
              </summary>
              <pre className="mt-2 text-[10px] text-white/40 bg-[#0A1A2F] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(listing.imported_raw_data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Admin actions */}
      <AdminListingActions listing={listing} />

      {/* Photos */}
      {photos && photos.length > 0 && (
        <div className="bg-[#11243D] border border-white/8 rounded-2xl mb-5">
          <div className="px-5 py-4 border-b border-white/8">
            <h2 className="font-bold text-sm">Photos ({photos.length})</h2>
          </div>
          <div className="p-5 grid grid-cols-4 md:grid-cols-6 gap-2">
            {photos.map((p) => (
              <a key={p.id} href={p.public_url} target="_blank" rel="noopener noreferrer"
                className="aspect-square rounded-lg overflow-hidden bg-white/5 block hover:opacity-80 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.public_url} alt={p.category} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Generated assets — editable */}
      {assets ? (
        <AdminAssetEditor assets={assets} listingId={id} />
      ) : (
        <div className="bg-[#11243D] border border-white/8 rounded-2xl px-6 py-8 text-center mb-5">
          <p className="text-white/25 text-sm">No assets generated yet.</p>
        </div>
      )}

      {/* Revision requests */}
      {revisions && revisions.length > 0 && (
        <div className="bg-[#11243D] border border-white/8 rounded-2xl">
          <div className="px-5 py-4 border-b border-white/8">
            <h2 className="font-bold text-sm">Revision Requests ({revisions.length})</h2>
          </div>
          <div className="divide-y divide-white/5">
            {revisions.map((r) => (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="text-sm font-semibold">{r.asset_type ?? 'All assets'}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    r.status === 'completed' ? 'bg-green-500/15 text-green-400'
                    : r.status === 'in_review' ? 'bg-blue-500/15 text-blue-400'
                    : 'bg-yellow-500/15 text-yellow-400'
                  }`}>{r.status}</span>
                </div>
                <p className="text-sm text-white/60">{r.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0A1A2F] rounded-xl py-2">
      <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
      <p className="font-bold text-sm">{value}</p>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 w-20 shrink-0 pt-0.5">{label}</span>
      <span className="flex-1 text-white/65 text-sm">{children}</span>
    </div>
  )
}
