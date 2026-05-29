import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Link from 'next/link'

export default async function ProjectsPage() {
  const supabase = createServiceRoleClient()
  const [{ data: websites }, { data: logos }] = await Promise.all([
    supabase
      .from('media_website_projects')
      .select('*, media_customers(full_name, email)')
      .order('created_at', { ascending: false }),
    supabase
      .from('media_logo_projects')
      .select('*, media_customers(full_name, email)')
      .order('created_at', { ascending: false }),
  ])

  const statusColor: Record<string, string> = {
    new: 'bg-white/8 text-white/40',
    intake_pending: 'bg-blue-500/15 text-blue-400',
    in_progress: 'bg-[#F97316]/15 text-[#F97316]',
    design_review: 'bg-purple-500/15 text-purple-400',
    revision_1: 'bg-yellow-500/15 text-yellow-400',
    revision_2: 'bg-yellow-500/15 text-yellow-400',
    launch_ready: 'bg-green-500/15 text-green-400',
    live: 'bg-green-500/15 text-green-400',
    delivered: 'bg-green-500/15 text-green-400',
    closed: 'bg-white/8 text-white/25',
    concept_review: 'bg-purple-500/15 text-purple-400',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Projects</h1>
        <p className="text-white/35 text-sm mt-1">{(websites?.length ?? 0) + (logos?.length ?? 0)} total</p>
      </div>

      <div className="space-y-8">
        {/* Website Projects */}
        <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
            <h2 className="font-bold text-sm">Website Projects</h2>
            <span className="text-white/30 text-xs">{websites?.length ?? 0}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35 hidden md:table-cell">Live URL</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {!websites?.length && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-white/25 text-xs">No website projects yet.</td></tr>
                )}
                {websites?.map((p) => {
                  const c = p.media_customers as { full_name?: string; email?: string } | null
                  return (
                    <tr key={p.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/projects/${p.id}`} className="font-semibold text-sm hover:text-[#F97316] transition-colors">{c?.full_name ?? '—'}</Link>
                        <p className="text-white/30 text-xs">{c?.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor[p.status] ?? 'bg-white/8 text-white/40'}`}>
                          {p.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/35 text-xs hidden md:table-cell">
                        {p.live_url ? <a href={p.live_url} target="_blank" className="text-[#F97316] hover:underline">{p.live_url}</a> : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-white/25 text-xs hidden lg:table-cell">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Logo Projects */}
        <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
            <h2 className="font-bold text-sm">Logo Projects</h2>
            <span className="text-white/30 text-xs">{logos?.length ?? 0}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35 hidden md:table-cell">Revisions</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35 hidden lg:table-cell">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {!logos?.length && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-white/25 text-xs">No logo projects yet.</td></tr>
                )}
                {logos?.map((p) => {
                  const c = p.media_customers as { full_name?: string; email?: string } | null
                  return (
                    <tr key={p.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-sm">{c?.full_name ?? '—'}</p>
                        <p className="text-white/30 text-xs">{c?.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor[p.status] ?? 'bg-white/8 text-white/40'}`}>
                          {p.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/40 text-xs hidden md:table-cell">{p.revisions_used} / {p.revisions_included}</td>
                      <td className="px-5 py-3.5 text-white/25 text-xs hidden lg:table-cell">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
