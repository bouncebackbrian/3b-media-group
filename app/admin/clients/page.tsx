import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Link from 'next/link'

export default async function ClientsPage() {
  const supabase = createServiceRoleClient()
  const { data: clients } = await supabase
    .from('media_clients')
    .select('*, media_orders(id, amount, payment_status)')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    active: 'bg-green-500/15 text-green-400',
    inactive: 'bg-white/8 text-white/30',
    pending: 'bg-yellow-500/15 text-yellow-400',
    churned: 'bg-red-500/15 text-red-400',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Clients</h1>
          <p className="text-white/35 text-sm mt-1">{clients?.length ?? 0} total</p>
        </div>
      </div>

      <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden md:table-cell">Company</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">LTV</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!clients?.length && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-white/25">No clients yet. Convert a lead to get started.</td></tr>
              )}
              {clients?.map((c) => {
                const orders = c.media_orders as { id: string; amount: number; payment_status: string }[] | null ?? []
                const ltv = orders.filter((o) => o.payment_status === 'paid').reduce((s, o) => s + (o.amount ?? 0), 0)
                return (
                  <tr key={c.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/clients/${c.id}`} className="font-semibold hover:text-[#14B8A6] transition-colors">
                        {c.full_name ?? '—'}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-white/50">{c.email}</td>
                    <td className="px-5 py-4 text-white/40 hidden md:table-cell">{c.company_name ?? '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor[c.status] ?? 'bg-white/8 text-white/40'}`}>
                        {c.status ?? 'unknown'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#14B8A6] hidden lg:table-cell">
                      {ltv > 0 ? `$${(ltv / 100).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-white/25 text-xs hidden lg:table-cell">
                      {new Date(c.created_at).toLocaleDateString()}
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
