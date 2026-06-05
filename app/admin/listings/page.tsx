import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Link from 'next/link'

export default async function AdminListingsPage() {
  const supabase = createServiceRoleClient()
  const { data: listings } = await supabase
    .from('media_property_listings')
    .select('*, media_clients(full_name, email)')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    submitted: 'bg-yellow-500/15 text-yellow-400',
    generating: 'bg-blue-500/15 text-blue-400',
    generated: 'bg-[#14B8A6]/15 text-[#14B8A6]',
    in_review: 'bg-purple-500/15 text-purple-400',
    approved: 'bg-green-500/15 text-green-400',
    revision_requested: 'bg-orange-500/15 text-orange-400',
    completed: 'bg-white/8 text-white/40',
  }

  const counts = {
    total: listings?.length ?? 0,
    pending_review: listings?.filter((l) => ['submitted','generated','in_review','revision_requested'].includes(l.status)).length ?? 0,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Listings</h1>
          <p className="text-white/35 text-sm mt-1">{counts.total} total · {counts.pending_review} need attention</p>
        </div>
      </div>

      <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
        {!listings?.length ? (
          <p className="px-6 py-12 text-center text-white/25 text-sm">No listings submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Property</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden md:table-cell">Client</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Submitted</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {listings.map((l) => {
                  const client = l.media_clients as { full_name?: string; email?: string } | null
                  return (
                    <tr key={l.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{l.property_address}</p>
                        <p className="text-white/40 text-xs">{l.listing_price}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-white/65">{client?.full_name ?? '—'}</p>
                        <p className="text-white/30 text-xs">{client?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor[l.status] ?? 'bg-white/8 text-white/40'}`}>
                          {l.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/25 text-xs hidden lg:table-cell">
                        {new Date(l.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href={`/admin/listings/${l.id}`} className="text-xs text-[#14B8A6] hover:underline">
                          Review →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
