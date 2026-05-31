import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const ELIGIBLE_SLUGS = ['open-house-blast','listing-marketing','realtor-marketing','growth','business-pro']

const statusColor: Record<string, string> = {
  submitted: 'bg-yellow-500/15 text-yellow-400',
  generating: 'bg-blue-500/15 text-blue-400',
  generated: 'bg-[#14B8A6]/15 text-[#14B8A6]',
  in_review: 'bg-purple-500/15 text-purple-400',
  approved: 'bg-green-500/15 text-green-400',
  revision_requested: 'bg-orange-500/15 text-orange-400',
  completed: 'bg-white/8 text-white/40',
}

export default async function PortalListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const admin = createServiceRoleClient()
  const { data: client } = await admin
    .from('media_clients')
    .select('id, has_listing_access')
    .eq('email', user.email!)
    .single()

  if (!client) redirect('/portal/dashboard')

  // Check eligibility via customer record (orders link to media_customers by email)
  let isEligible = client.has_listing_access
  if (!isEligible) {
    const { data: customer } = await admin
      .from('media_customers')
      .select('id')
      .eq('email', user.email!)
      .single()

    if (customer) {
      const { data: order } = await admin
        .from('media_orders')
        .select('id, media_service_packages!inner(slug)')
        .eq('customer_id', customer.id)
        .eq('payment_status', 'paid')
        .in('media_service_packages.slug', ELIGIBLE_SLUGS)
        .limit(1)
        .single()
      isEligible = !!order
    }
  }

  const { data: listings } = await admin
    .from('media_property_listings')
    .select('id, property_address, listing_price, status, created_at')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  if (!isEligible) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-black">Real Estate Listings</h1>
        </div>
        <div className="bg-[#11243D] border border-white/8 rounded-2xl p-8 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 bg-[#14B8A6]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-[#14B8A6] text-2xl">⬡</span>
          </div>
          <h2 className="font-black text-xl mb-3">Unlock Listing Marketing</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Listing marketing is available with the Open House Blast, Listing Marketing Package, or any monthly marketing plan.
          </p>
          <Link href="/pricing" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            View Plans →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Real Estate Listings</h1>
          <p className="text-white/35 text-sm mt-1">{listings?.length ?? 0} listings</p>
        </div>
        <Link
          href="/portal/listings/new"
          className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          + Add Listing
        </Link>
      </div>

      {!listings?.length ? (
        <div className="bg-[#11243D] border border-white/8 rounded-2xl px-6 py-16 text-center">
          <p className="text-white/25 text-sm mb-4">No listings yet.</p>
          <Link href="/portal/listings/new" className="text-sm text-[#14B8A6] hover:underline">
            Add your first listing →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/portal/listings/${l.id}`}
              className="bg-[#11243D] border border-white/8 hover:border-white/15 rounded-2xl p-5 flex items-center justify-between gap-4 transition-colors block"
            >
              <div>
                <p className="font-bold">{l.property_address}</p>
                <p className="text-white/40 text-sm mt-0.5">{l.listing_price}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColor[l.status] ?? 'bg-white/8 text-white/35'}`}>
                  {l.status.replace(/_/g, ' ')}
                </span>
                <p className="text-white/25 text-xs hidden sm:block">
                  {new Date(l.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
