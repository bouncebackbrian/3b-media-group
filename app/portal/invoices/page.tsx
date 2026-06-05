import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PortalInvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: client } = await supabase
    .from('media_clients')
    .select('id')
    .eq('email', user.email!)
    .single()

  const { data: orders } = client
    ? await supabase
        .from('media_orders')
        .select('*, media_service_packages(name)')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const paymentColor: Record<string, string> = {
    paid: 'bg-green-500/15 text-green-400',
    pending: 'bg-yellow-500/15 text-yellow-400',
    failed: 'bg-red-500/15 text-red-400',
    refunded: 'bg-white/8 text-white/30',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Invoices & Billing</h1>
        <p className="text-white/35 text-sm mt-1">{orders?.length ?? 0} orders</p>
      </div>

      <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
        {!orders?.length ? (
          <p className="px-6 py-12 text-center text-white/25 text-sm">No orders yet.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {orders.map((o) => {
              const pkg = o.media_service_packages as { name?: string } | null
              return (
                <div key={o.id} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div>
                    <p className="font-semibold text-sm">{pkg?.name ?? 'Order'}</p>
                    <p className="text-xs text-white/35">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-black text-[#14B8A6]">${((o.amount ?? 0) / 100).toLocaleString()}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${paymentColor[o.payment_status] ?? 'bg-white/8 text-white/35'}`}>
                      {o.payment_status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
