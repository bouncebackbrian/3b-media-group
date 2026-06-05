import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const schema = z.object({
  asset_id: z.string().uuid(),
  field: z.enum([
    'facebook_listing',
    'facebook_open_house',
    'instagram_caption',
    'reel_script',
    'flyer_copy',
    'hashtags',
    'sms_copy',
    'email_copy',
  ]),
  value: z.string(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listingId } = await params
  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('media_generated_marketing_assets')
    .update({ [body.data.field]: body.data.value })
    .eq('id', body.data.asset_id)
    .eq('listing_id', listingId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
