import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const schema = z.object({
  listing_id: z.string().uuid(),
  asset_type: z.string().optional(),
  notes: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const admin = createServiceRoleClient()

  const { data: listing } = await admin
    .from('media_property_listings')
    .select('id, client_id, media_clients!inner(email)')
    .eq('id', body.data.listing_id)
    .single()

  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if ((listing.media_clients as unknown as { email: string }).email !== user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await admin.from('media_listing_revision_requests').insert({
    listing_id: body.data.listing_id,
    asset_type: body.data.asset_type,
    notes: body.data.notes,
    status: 'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update listing status
  await admin
    .from('media_property_listings')
    .update({ status: 'revision_requested' })
    .eq('id', body.data.listing_id)

  return NextResponse.json({ success: true })
}
