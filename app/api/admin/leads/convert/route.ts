import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const schema = z.object({ id: z.string().uuid() })

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const supabase = createServiceRoleClient()

  const { data: lead, error: leadErr } = await supabase
    .from('media_leads')
    .select('*')
    .eq('id', body.data.id)
    .single()

  if (leadErr || !lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  // Check if a client with this email already exists
  const { data: existing } = await supabase
    .from('media_clients')
    .select('id')
    .eq('email', lead.email)
    .single()

  if (existing) {
    // Update lead status to won and return existing client
    await supabase
      .from('media_leads')
      .update({ status: 'won', converted_at: new Date().toISOString() })
      .eq('id', lead.id)
    return NextResponse.json({ clientId: existing.id })
  }

  // Create new client
  const { data: client, error: clientErr } = await supabase
    .from('media_clients')
    .insert({
      full_name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company_name: lead.company_name,
      lead_id: lead.id,
      status: 'active',
      billing_status: 'pending',
    })
    .select('id')
    .single()

  if (clientErr) return NextResponse.json({ error: clientErr.message }, { status: 500 })

  // Mark lead as won
  await supabase
    .from('media_leads')
    .update({ status: 'won', converted_at: new Date().toISOString() })
    .eq('id', lead.id)

  return NextResponse.json({ clientId: client.id })
}
