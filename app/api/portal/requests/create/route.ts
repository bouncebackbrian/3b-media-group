import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const schema = z.object({
  service_type: z.string().min(1),
  description: z.string().optional(),
  deadline: z.string().nullable().optional(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const admin = createServiceRoleClient()
  const { data: client } = await admin
    .from('media_clients')
    .select('id')
    .eq('email', user.email!)
    .single()

  if (!client) return NextResponse.json({ error: 'Client record not found' }, { status: 404 })

  const { error } = await admin.from('media_content_requests').insert({
    client_id: client.id,
    ...body.data,
    status: 'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
