import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { redirect, notFound } from 'next/navigation'
import ListingAssets from './ListingAssets'
import PhotoUpload from './PhotoUpload'
import GenerateButton from './GenerateButton'

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const admin = createServiceRoleClient()

  const { data: listing } = await admin
    .from('media_property_listings')
    .select('*, media_clients!inner(email, full_name)')
    .eq('id', id)
    .single()

  if (!listing) notFound()

  const clientEmail = (listing.media_clients as { email: string }).email
  if (clientEmail !== user.email) notFound()

  const [{ data: assets }, { data: photos }, { data: revisions }] = await Promise.all([
    admin
      .from('media_generated_marketing_assets')
      .select('*')
      .eq('listing_id', id)
      .eq('is_current', true)
      .single(),
    admin
      .from('media_listing_photos')
      .select('*')
      .eq('listing_id', id)
      .order('sort_order'),
    admin
      .from('media_listing_revision_requests')
      .select('*')
      .eq('listing_id', id)
      .order('created_at', { ascending: false }),
  ])

  const statusColor: Record<string, string> = {
    submitted: 'bg-yellow-500/15 text-yellow-400',
    generating: 'bg-blue-500/15 text-blue-400',
    generated: 'bg-[#14B8A6]/15 text-[#14B8A6]',
    in_review: 'bg-purple-500/15 text-purple-400',
    approved: 'bg-green-500/15 text-green-400',
    revision_requested: 'bg-orange-500/15 text-orange-400',
    completed: 'bg-white/8 text-white/40',
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/portal/listings" className="text-white/30 hover:text-white text-sm transition-colors">← Listings</a>
        <span className="text-white/15">/</span>
        <span className="text-sm text-white/50 truncate">{listing.property_address}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black">{listing.property_address}</h1>
          <p className="text-[#14B8A6] font-bold mt-1">{listing.listing_price}</p>
          <p className="text-white/35 text-sm mt-0.5">
            {[listing.bedrooms && `${listing.bedrooms} bed`, listing.bathrooms && `${listing.bathrooms} bath`, listing.square_footage && `${listing.square_footage} sq ft`].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${statusColor[listing.status] ?? 'bg-white/8 text-white/35'}`}>
          {listing.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Photo upload */}
      <div className="bg-[#11243D] border border-white/8 rounded-2xl mb-5">
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="font-bold text-sm">Property Photos</h2>
          <p className="text-white/30 text-xs mt-0.5">{photos?.length ?? 0} uploaded</p>
        </div>
        <div className="p-5">
          <PhotoUpload listingId={id} existingPhotos={photos ?? []} />
        </div>
      </div>

      {/* Generate / Regenerate */}
      {!assets && listing.status !== 'generating' && (
        <div className="bg-[#14B8A6]/8 border border-[#14B8A6]/20 rounded-2xl p-5 mb-5">
          <p className="font-bold text-sm mb-1">Ready to generate marketing assets</p>
          <p className="text-white/45 text-sm mb-4">
            We&apos;ll create a Facebook post, Instagram caption, reel script, flyer copy, hashtags, SMS, and email copy — all tailored to this listing.
          </p>
          <GenerateButton listingId={id} />
        </div>
      )}

      {listing.status === 'generating' && (
        <div className="bg-blue-500/8 border border-blue-500/20 rounded-2xl p-5 mb-5 flex items-center gap-4">
          <div className="w-5 h-5 border-2 border-blue-400/40 border-t-blue-400 rounded-full animate-spin shrink-0" />
          <div>
            <p className="font-bold text-sm text-blue-400">Generating your marketing assets…</p>
            <p className="text-white/40 text-xs mt-0.5">This takes about 15–30 seconds. Refresh to check status.</p>
          </div>
        </div>
      )}

      {/* Assets */}
      {assets && <ListingAssets assets={assets} listingId={id} />}

      {/* Revision requests */}
      {revisions && revisions.length > 0 && (
        <div className="bg-[#11243D] border border-white/8 rounded-2xl mt-5">
          <div className="px-5 py-4 border-b border-white/8">
            <h2 className="font-bold text-sm">Revision Requests</h2>
          </div>
          <div className="divide-y divide-white/5">
            {revisions.map((r) => (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="text-sm font-semibold">{r.asset_type ?? 'All assets'}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    r.status === 'completed' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
                  }`}>{r.status}</span>
                </div>
                <p className="text-xs text-white/50">{r.notes}</p>
                {r.admin_response && (
                  <p className="text-xs text-[#14B8A6] mt-2">Admin: {r.admin_response}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
