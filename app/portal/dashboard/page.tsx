import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PortalDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: client } = await supabase
    .from('media_clients')
    .select('*')
    .eq('email', user.email!)
    .single()

  if (!client) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="w-16 h-16 bg-[#14B8A6]/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-[#14B8A6] text-2xl">◈</span>
        </div>
        <h1 className="text-2xl font-black mb-3">Portal access pending</h1>
        <p className="text-white/45 leading-relaxed mb-6">
          Your client account is being set up. You&apos;ll receive an email once your portal is ready.
        </p>
        <Link href="/" className="text-sm text-[#14B8A6] hover:underline">← Back to site</Link>
      </div>
    )
  }

  const [{ data: projects }, { data: requests }] = await Promise.all([
    supabase
      .from('media_projects')
      .select('id, title, project_type, status, created_at')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('media_content_requests')
      .select('id, service_type, status, created_at')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const projectStats = {
    active: projects?.filter((p) => p.status === 'in_progress').length ?? 0,
    review: projects?.filter((p) => p.status === 'review').length ?? 0,
    waiting: projects?.filter((p) => p.status === 'waiting_on_client').length ?? 0,
    completed: projects?.filter((p) => p.status === 'completed').length ?? 0,
  }

  const statusColor: Record<string, string> = {
    not_started: 'bg-white/8 text-white/35',
    in_progress: 'bg-[#14B8A6]/15 text-[#14B8A6]',
    waiting_on_client: 'bg-yellow-500/15 text-yellow-400',
    review: 'bg-purple-500/15 text-purple-400',
    completed: 'bg-green-500/15 text-green-400',
    pending: 'bg-white/8 text-white/35',
    in_review: 'bg-blue-500/15 text-blue-400',
  }

  const firstName = client.full_name?.split(' ')[0] ?? 'there'

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-1">Welcome back</p>
        <h1 className="text-2xl font-black">{firstName}&apos;s Dashboard</h1>
        {client.company_name && (
          <p className="text-white/35 text-sm mt-1">{client.company_name}</p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Stat label="Active Projects" value={projectStats.active} color="text-[#14B8A6]" />
        <Stat label="Needs Review" value={projectStats.review} color="text-purple-400" />
        <Stat label="Waiting on You" value={projectStats.waiting} color="text-yellow-400" />
        <Stat label="Completed" value={projectStats.completed} color="text-green-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Projects */}
        <div className="bg-[#11243D] border border-white/8 rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="font-bold text-sm">Recent Projects</h2>
            <Link href="/portal/projects" className="text-xs text-[#14B8A6] hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {!projects?.length ? (
              <p className="px-5 py-8 text-center text-white/25 text-sm">No projects yet.</p>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
                  <div>
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="text-xs text-white/35 capitalize">{p.project_type?.replace(/_/g, ' ')}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${statusColor[p.status] ?? 'bg-white/8 text-white/35'}`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Requests */}
        <div className="bg-[#11243D] border border-white/8 rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="font-bold text-sm">Content Requests</h2>
            <Link href="/portal/requests" className="text-xs text-[#14B8A6] hover:underline">New request →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {!requests?.length ? (
              <div className="px-5 py-8 text-center">
                <p className="text-white/25 text-sm mb-3">No requests yet.</p>
                <Link href="/portal/requests/new" className="text-sm text-[#14B8A6] hover:underline">
                  Submit your first request →
                </Link>
              </div>
            ) : (
              requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
                  <div>
                    <p className="text-sm font-semibold">{r.service_type ?? 'Content Request'}</p>
                    <p className="text-xs text-white/35">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${statusColor[r.status] ?? 'bg-white/8 text-white/35'}`}>
                    {r.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Account status */}
      <div className="mt-5 bg-[#11243D] border border-white/8 rounded-2xl px-5 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-white/35 uppercase tracking-wider mb-0.5">Account</p>
          <p className="text-sm font-semibold">{client.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-white/35 uppercase tracking-wider mb-0.5">Status</p>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              client.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-white/8 text-white/35'
            }`}>
              {client.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-white/35 uppercase tracking-wider mb-0.5">Billing</p>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              client.billing_status === 'current' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
            }`}>
              {client.billing_status}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#11243D] border border-white/8 rounded-2xl p-4">
      <p className="text-xs text-white/35 mb-1">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  )
}
