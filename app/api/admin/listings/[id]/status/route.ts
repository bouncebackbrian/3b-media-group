import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['submitted','generating','generated','in_review','approved','revision_requested','completed']),
  admin_note: z.string().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('media_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { id } = await params
  const admin = createServiceRoleClient()

  const { error } = await admin
    .from('media_property_listings')
    .update({ status: body.data.status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If marking revision_requested, record admin note as revision request
  if (body.data.admin_note && body.data.status === 'revision_requested') {
    await admin.from('media_listing_revision_requests').insert({
      listing_id: id,
      notes: body.data.admin_note,
      status: 'in_review',
    })
  }

  return NextResponse.json({ success: true })
}
