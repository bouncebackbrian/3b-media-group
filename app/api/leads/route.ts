import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  service_interest: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(req: NextRequest) {
  let body
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  const { error } = await supabase.from('media_leads').insert({
    ...body,
    source: body.source ?? 'website',
    status: 'new',
  })

  if (error) {
    console.error('Lead insert error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
