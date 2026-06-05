import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const schema = z.object({
  listing_id: z.string().uuid(),
  storage_path: z.string(),
  public_url: z.string().url(),
  category: z.enum(['exterior','kitchen','living_room','bedroom','bathroom','backyard','other']),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const admin = createServiceRoleClient()

  // Verify listing ownership
  const { data: listing } = await admin
    .from('media_property_listings')
    .select('id, media_clients!inner(email)')
    .eq('id', body.data.listing_id)
    .single()

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  if ((listing.media_clients as unknown as { email: string }).email !== user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await admin.from('media_listing_photos').insert({
    listing_id: body.data.listing_id,
    storage_path: body.data.storage_path,
    public_url: body.data.public_url,
    category: body.data.category,
    uploaded_by: user.id,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
