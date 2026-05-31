import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { notFound } from 'next/navigation'
import LeadActions from './LeadActions'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceRoleClient()

  const { data: lead } = await supabase
    .from('media_leads')
    .select('*')
    .eq('id', id)
    .single()

  if (!lead) notFound()

  const statusColor: Record<string, string> = {
    new: 'bg-blue-500/15 text-blue-400',
    contacted: 'bg-yellow-500/15 text-yellow-400',
    qualified: 'bg-purple-500/15 text-purple-400',
    proposal_sent: 'bg-orange-500/15 text-orange-400',
    won: 'bg-green-500/15 text-green-400',
    lost: 'bg-white/8 text-white/30',
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/leads" className="text-white/30 hover:text-white text-sm transition-colors">← Leads</a>
        <span className="text-white/15">/</span>
        <span className="text-sm text-white/50">{lead.name}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black">{lead.name}</h1>
          <p className="text-white/40 text-sm mt-1">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}</p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${statusColor[lead.status] ?? 'bg-white/8 text-white/40'}`}>
          {lead.status?.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#11243D] border border-white/8 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-3">Lead Info</p>
          <dl className="space-y-2.5">
            {lead.company_name && <Row label="Company" value={lead.company_name} />}
            <Row label="Service Interest" value={lead.service_interest ?? '—'} />
            <Row label="Source" value={lead.source ?? '—'} />
            <Row label="Lead Type" value={lead.lead_type ?? '—'} />
            <Row label="Priority" value={lead.priority ?? '—'} />
            <Row label="Created" value={new Date(lead.created_at).toLocaleDateString()} />
          </dl>
        </div>

        {lead.message && (
          <div className="bg-[#11243D] border border-white/8 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-3">Message</p>
            <p className="text-sm text-white/65 leading-relaxed">{lead.message}</p>
          </div>
        )}
      </div>

      <LeadActions lead={lead} />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-xs text-white/35">{label}</dt>
      <dd className="text-xs text-white/70 text-right capitalize">{value}</dd>
    </div>
  )
}
