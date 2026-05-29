import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Link from 'next/link'

async function getStats() {
  const supabase = createServiceRoleClient()
  const [leads, orders, projects, domains] = await Promise.all([
    supabase.from('media_leads').select('id, status', { count: 'exact' }),
    supabase.from('media_orders').select('id, payment_status, fulfillment_status, amount', { count: 'exact' }),
    supabase.from('media_website_projects').select('id, status', { count: 'exact' }),
    supabase.from('media_domain_requests').select('id, status', { count: 'exact' }),
  ])
  return {
    newLeads: leads.data?.filter((l) => l.status === 'new').length ?? 0,
    totalLeads: leads.count ?? 0,
    paidOrders: orders.data?.filter((o) => o.payment_status === 'paid').length ?? 0,
    revenue: orders.data?.filter((o) => o.payment_status === 'paid').reduce((s, o) => s + (o.amount ?? 0), 0) ?? 0,
    activeProjects: projects.data?.filter((p) => !['closed', 'cancelled'].includes(p.status)).length ?? 0,
    pendingDomains: domains.data?.filter((d) => d.status !== 'complete').length ?? 0,
    recentOrders: orders.data?.slice(-5).reverse() ?? [],
  }
}

async function getRecentLeads() {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('media_leads')
    .select('id, name, email, service_interest, status, created_at')
    .order('created_at', { ascending: false })
    .limit(8)
  return data ?? []
}

function StatCard({ label, value, sub, href }: { label: string; value: string | number; sub?: string; href: string }) {
  return (
    <Link href={href} className="bg-[#111] border border-white/8 hover:border-white/15 rounded-2xl p-5 transition-colors block">
      <p className="text-xs text-white/35 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-black">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'bg-blue-500/15 text-blue-400',
    contacted: 'bg-yellow-500/15 text-yellow-400',
    qualified: 'bg-purple-500/15 text-purple-400',
    converted: 'bg-green-500/15 text-green-400',
    paid: 'bg-green-500/15 text-green-400',
    pending: 'bg-white/8 text-white/40',
    in_progress: 'bg-[#F97316]/15 text-[#F97316]',
  }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${map[status] ?? 'bg-white/8 text-white/40'}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export default async function AdminDashboardPage() {
  const [stats, leads] = await Promise.all([getStats(), getRecentLeads()])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-white/35 text-sm mt-1">Overview of all activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="New Leads" value={stats.newLeads} sub={`${stats.totalLeads} total`} href="/admin/leads" />
        <StatCard label="Paid Orders" value={stats.paidOrders} sub={`$${(stats.revenue / 100).toLocaleString()} revenue`} href="/admin/orders" />
        <StatCard label="Active Projects" value={stats.activeProjects} href="/admin/projects" />
        <StatCard label="Pending Domains" value={stats.pendingDomains} href="/admin/domains" />
      </div>

      <div className="bg-[#111] border border-white/8 rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-sm">Recent Leads</h2>
          <Link href="/admin/leads" className="text-xs text-[#F97316] hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-white/5">
          {leads.length === 0 && (
            <p className="px-6 py-8 text-white/25 text-sm text-center">No leads yet.</p>
          )}
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/admin/leads/${lead.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm">{lead.name}</p>
                <p className="text-white/35 text-xs">{lead.email} · {lead.service_interest ?? 'No service selected'}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={lead.status} />
                <p className="text-white/25 text-xs hidden md:block">
                  {new Date(lead.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
