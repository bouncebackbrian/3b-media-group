import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PortalProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: client } = await supabase
    .from('media_clients')
    .select('id')
    .eq('email', user.email!)
    .single()

  if (!client) redirect('/portal/dashboard')

  const { data: projects } = await supabase
    .from('media_projects')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    not_started: 'bg-white/8 text-white/35',
    in_progress: 'bg-[#14B8A6]/15 text-[#14B8A6]',
    waiting_on_client: 'bg-yellow-500/15 text-yellow-400',
    review: 'bg-purple-500/15 text-purple-400',
    completed: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-white/8 text-white/20',
  }

  const statusLabel: Record<string, string> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    waiting_on_client: 'Waiting on You',
    review: 'Under Review',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">My Projects</h1>
        <p className="text-white/35 text-sm mt-1">{projects?.length ?? 0} total</p>
      </div>

      {!projects?.length ? (
        <div className="bg-[#11243D] border border-white/8 rounded-2xl px-6 py-16 text-center">
          <p className="text-white/25 text-sm">No projects yet. Your projects will appear here once started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="bg-[#11243D] border border-white/8 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-white/35 text-xs capitalize mt-0.5">{p.project_type?.replace(/_/g, ' ')}</p>
                  {p.description && (
                    <p className="text-sm text-white/50 leading-relaxed mt-3">{p.description}</p>
                  )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${statusColor[p.status] ?? 'bg-white/8 text-white/35'}`}>
                  {statusLabel[p.status] ?? p.status}
                </span>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">Started</p>
                  <p className="text-xs text-white/55">{new Date(p.created_at).toLocaleDateString()}</p>
                </div>
                {p.deadline && (
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Deadline</p>
                    <p className="text-xs text-white/55">{new Date(p.deadline).toLocaleDateString()}</p>
                  </div>
                )}
                {p.notes && (
                  <div className="flex-1">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Notes</p>
                    <p className="text-xs text-white/55 line-clamp-1">{p.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
