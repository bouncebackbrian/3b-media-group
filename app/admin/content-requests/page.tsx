import { createServiceRoleClient } from '@/lib/supabase/service-role'

export default async function ContentRequestsPage() {
  const supabase = createServiceRoleClient()
  const { data: requests } = await supabase
    .from('media_content_requests')
    .select('*, media_clients(full_name, email)')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400',
    in_review: 'bg-blue-500/15 text-blue-400',
    approved: 'bg-green-500/15 text-green-400',
    rejected: 'bg-red-500/15 text-red-400',
    completed: 'bg-white/8 text-white/40',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Content Requests</h1>
        <p className="text-white/35 text-sm mt-1">{requests?.length ?? 0} total</p>
      </div>

      <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
        {!requests?.length ? (
          <p className="px-6 py-12 text-center text-white/25 text-sm">No content requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Client</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Service</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden md:table-cell">Deadline</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((r) => {
                  const client = r.media_clients as { full_name?: string; email?: string } | null
                  return (
                    <tr key={r.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{client?.full_name ?? '—'}</p>
                        <p className="text-white/35 text-xs">{client?.email}</p>
                      </td>
                      <td className="px-5 py-4 text-white/65">{r.service_type ?? '—'}</td>
                      <td className="px-5 py-4 text-white/40 text-xs hidden md:table-cell">
                        {r.deadline ? new Date(r.deadline).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor[r.status] ?? 'bg-white/8 text-white/40'}`}>
                          {r.status?.replace(/_/g, ' ') ?? 'pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/25 text-xs hidden lg:table-cell">
                        {new Date(r.created_at).toLocaleDateString()}
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
