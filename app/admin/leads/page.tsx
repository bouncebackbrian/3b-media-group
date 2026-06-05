import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Link from 'next/link'

export default async function LeadsPage() {
  const supabase = createServiceRoleClient()
  const { data: leads } = await supabase
    .from('media_leads')
    .select('*')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    new: 'bg-blue-500/15 text-blue-400',
    contacted: 'bg-yellow-500/15 text-yellow-400',
    qualified: 'bg-purple-500/15 text-purple-400',
    converted: 'bg-green-500/15 text-green-400',
    lost: 'bg-white/8 text-white/30',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Leads</h1>
          <p className="text-white/35 text-sm mt-1">{leads?.length ?? 0} total</p>
        </div>
      </div>

      <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden md:table-cell">Service</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!leads?.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-white/25">No leads yet.</td>
                </tr>
              )}
              {leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="font-semibold hover:text-[#14B8A6] transition-colors">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-white/50">{lead.email}</td>
                  <td className="px-5 py-4 text-white/40 hidden md:table-cell">{lead.service_interest ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor[lead.status] ?? 'bg-white/8 text-white/40'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/25 hidden lg:table-cell text-xs">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
