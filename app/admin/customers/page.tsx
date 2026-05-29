import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Link from 'next/link'

export default async function CustomersPage() {
  const supabase = createServiceRoleClient()
  const { data: customers } = await supabase
    .from('media_customers')
    .select('*, media_orders(id, amount, payment_status)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Customers</h1>
        <p className="text-white/35 text-sm mt-1">{customers?.length ?? 0} total</p>
      </div>

      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden md:table-cell">Company</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Orders</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">LTV</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!customers?.length && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-white/25">No customers yet.</td></tr>
              )}
              {customers?.map((c) => {
                const orders = c.media_orders as { id: string; amount: number; payment_status: string }[] | null ?? []
                const paidOrders = orders.filter((o) => o.payment_status === 'paid')
                const ltv = paidOrders.reduce((s, o) => s + (o.amount ?? 0), 0)
                return (
                  <tr key={c.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/customers/${c.id}`} className="font-semibold hover:text-[#F97316] transition-colors">
                        {c.full_name ?? '—'}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-white/50">{c.email}</td>
                    <td className="px-5 py-4 text-white/40 hidden md:table-cell">{c.company_name ?? '—'}</td>
                    <td className="px-5 py-4 text-white/60">{orders.length}</td>
                    <td className="px-5 py-4 font-bold text-[#F97316] hidden lg:table-cell">
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
