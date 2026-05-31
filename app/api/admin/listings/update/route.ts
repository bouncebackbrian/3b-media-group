import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const schema = z.object({
  id: z.string().uuid(),
  status: z.string().optional(),
  admin_notes: z.string().nullable().optional(),
})

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { id, ...updates } = body.data
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('media_property_listings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
