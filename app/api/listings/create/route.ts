import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const ELIGIBLE_SLUGS = [
  'open-house-blast',
  'listing-marketing',
  'realtor-marketing',
  'growth',
  'business-pro',
]

const schema = z.object({
  property_address: z.string().min(1),
  listing_price: z.string().min(1),
  bedrooms: z.number().int().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  square_footage: z.number().int().nullable().optional(),
  listing_description: z.string().optional(),
  realtor_name: z.string().min(1),
  realtor_phone: z.string().optional(),
  realtor_email: z.string().email().optional().or(z.literal('')),
  lot_size: z.string().optional(),
  mls_link: z.string().optional(),
  open_house_date: z.string().optional(),
  open_house_time: z.string().optional(),
  neighborhood_highlights: z.string().optional(),
  school_area_notes: z.string().optional(),
  key_features: z.array(z.string()).optional(),
  preferred_tone: z.string().optional(),
  preferred_cta: z.string().optional(),
  special_instructions: z.string().optional(),
  // URL import fields
  source_url: z.string().url().optional().or(z.literal('')),
  imported_from: z.string().optional(),
  import_confirmed_permission: z.boolean().optional(),
  imported_raw_data: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid data', details: body.error.flatten() }, { status: 400 })
  }

  const admin = createServiceRoleClient()

  // Get client record
  const { data: client } = await admin
    .from('media_clients')
    .select('id, has_listing_access')
    .eq('email', user.email!)
    .single()

  if (!client) return NextResponse.json({ error: 'Client record not found' }, { status: 404 })

  // Check eligibility: has_listing_access OR has a paid order with eligible package.
  // Orders link to media_customers (by email), not media_clients directly.
  if (!client.has_listing_access) {
    const { data: customer } = await admin
      .from('media_customers')
      .select('id')
      .eq('email', user.email!)
      .single()

    const hasEligibleOrder = customer
      ? !!(await admin
          .from('media_orders')
          .select('id, media_service_packages!inner(slug)')
          .eq('customer_id', customer.id)
          .eq('payment_status', 'paid')
          .in('media_service_packages.slug', ELIGIBLE_SLUGS)
          .limit(1)
          .single()
        ).data
      : false

    if (!hasEligibleOrder) {
      return NextResponse.json(
        { error: 'Listing access requires a qualifying service purchase.' },
        { status: 403 }
      )
    }
  }

  const { data: listing, error } = await admin
    .from('media_property_listings')
    .insert({
      client_id: client.id,
      ...body.data,
      status: 'submitted',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, listing_id: listing.id })
}
