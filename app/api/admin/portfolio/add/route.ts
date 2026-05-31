import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const schema = z.object({
  type: z.enum(['case_study', 'testimonial']),
  name: z.string().optional(),
  industry: z.string().optional(),
  summary: z.string().optional(),
  author_name: z.string().optional(),
  author_title: z.string().optional(),
  quote: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  is_published: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const supabase = createServiceRoleClient()
  const { type, is_published, name, industry, summary, author_name, author_title, quote, rating } = body.data

  if (type === 'case_study') {
    const slug = (name ?? 'client').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const { error } = await supabase.from('media_portfolio_clients').insert({
      name, industry, summary, slug, is_published,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await supabase.from('media_testimonials').insert({
      author_name, author_title, quote, rating, is_published,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
