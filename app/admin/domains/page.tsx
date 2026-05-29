import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Link from 'next/link'

export default async function DomainsPage() {
  const supabase = createServiceRoleClient()
  const { data: domains } = await supabase
    .from('media_domain_requests')
    .select('*, media_customers(full_name, email)')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    submitted: 'bg-blue-500/15 text-blue-400',
    availability_checked: 'bg-yellow-500/15 text-yellow-400',
    acquired: 'bg-purple-500/15 text-purple-400',
    dns_configured: 'bg-[#F97316]/15 text-[#F97316]',
    email_setup: 'bg-[#F97316]/15 text-[#F97316]',
    transferred: 'bg-green-500/15 text-green-400',
    complete: 'bg-green-500/15 text-green-400',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Domain Requests</h1>
        <p className="text-white/35 text-sm mt-1">{domains?.length ?? 0} total · Manual fulfillment (Phase A)</p>
      </div>

      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Domains Requested</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Selected</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!domains?.length && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-white/25">No domain requests yet.</td></tr>
              )}
              {domains?.map((d) => {
                const c = d.media_customers as { full_name?: string; email?: string } | null
                return (
                  <tr key={d.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/domains/${d.id}`} className="font-semibold hover:text-[#F97316] transition-colors">{c?.full_name ?? '—'}</Link>
                      <p className="text-white/30 text-xs">{c?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-white/50 text-xs">{d.preferred_domains?.join(', ') ?? '—'}</td>
                    <td className="px-5 py-4 text-white/70 text-xs font-mono">{d.selected_domain ?? '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor[d.status] ?? 'bg-white/8 text-white/40'}`}>
                        {d.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/25 text-xs hidden lg:table-cell">
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
