import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Link from 'next/link'

export default async function OrdersPage() {
  const supabase = createServiceRoleClient()
  const { data: orders } = await supabase
    .from('media_orders')
    .select('*, media_customers(full_name, email), media_service_packages(name)')
    .order('created_at', { ascending: false })

  const paymentColor: Record<string, string> = {
    paid: 'bg-green-500/15 text-green-400',
    pending: 'bg-white/8 text-white/40',
    failed: 'bg-red-500/15 text-red-400',
    refunded: 'bg-yellow-500/15 text-yellow-400',
  }

  const fulfillmentColor: Record<string, string> = {
    pending: 'bg-white/8 text-white/40',
    intake_sent: 'bg-blue-500/15 text-blue-400',
    intake_received: 'bg-purple-500/15 text-purple-400',
    in_progress: 'bg-[#F97316]/15 text-[#F97316]',
    delivered: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-white/8 text-white/30',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Orders</h1>
        <p className="text-white/35 text-sm mt-1">{orders?.length ?? 0} total</p>
      </div>

      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden md:table-cell">Package</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35">Payment</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Fulfillment</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!orders?.length && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-white/25">No orders yet.</td></tr>
              )}
              {orders?.map((order) => {
                const customer = order.media_customers as { full_name?: string; email?: string } | null
                const pkg = order.media_service_packages as { name?: string } | null
                return (
                  <tr key={order.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-semibold hover:text-[#F97316] transition-colors block">
                        {customer?.full_name ?? '—'}
                      </Link>
                      <span className="text-white/35 text-xs">{customer?.email}</span>
                    </td>
                    <td className="px-5 py-4 text-white/50 hidden md:table-cell">{pkg?.name ?? '—'}</td>
                    <td className="px-5 py-4 font-bold text-[#F97316]">${((order.amount ?? 0) / 100).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${paymentColor[order.payment_status] ?? 'bg-white/8 text-white/40'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${fulfillmentColor[order.fulfillment_status] ?? 'bg-white/8 text-white/40'}`}>
                        {order.fulfillment_status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/25 text-xs hidden lg:table-cell">
                      {new Date(order.created_at).toLocaleDateString()}
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
