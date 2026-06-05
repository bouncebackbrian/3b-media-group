import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PortalRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: client } = await supabase
    .from('media_clients')
    .select('id')
    .eq('email', user.email!)
    .single()

  if (!client) redirect('/portal/dashboard')

  const { data: requests } = await supabase
    .from('media_content_requests')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400',
    in_review: 'bg-blue-500/15 text-blue-400',
    approved: 'bg-green-500/15 text-green-400',
    rejected: 'bg-red-500/15 text-red-400',
    completed: 'bg-white/8 text-white/40',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Content Requests</h1>
          <p className="text-white/35 text-sm mt-1">{requests?.length ?? 0} total</p>
        </div>
        <Link
          href="/portal/requests/new"
          className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          + New Request
        </Link>
      </div>

      {!requests?.length ? (
        <div className="bg-[#11243D] border border-white/8 rounded-2xl px-6 py-16 text-center">
          <p className="text-white/25 text-sm mb-4">No requests yet.</p>
          <Link href="/portal/requests/new" className="text-sm text-[#14B8A6] hover:underline">
            Submit your first content request →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="bg-[#11243D] border border-white/8 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm">{r.service_type ?? 'Content Request'}</h3>
                  <p className="text-xs text-white/35 mt-0.5">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${statusColor[r.status] ?? 'bg-white/8 text-white/35'}`}>
                  {r.status?.replace(/_/g, ' ')}
                </span>
              </div>
              {r.description && (
                <p className="text-sm text-white/50 leading-relaxed mt-3 line-clamp-2">{r.description}</p>
              )}
              {r.deadline && (
                <p className="text-xs text-white/30 mt-2">
                  Deadline: {new Date(r.deadline).toLocaleDateString()}
                </p>
              )}
              {r.admin_notes && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Admin Note</p>
                  <p className="text-xs text-white/50">{r.admin_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
