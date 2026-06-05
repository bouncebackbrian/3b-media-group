import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const schema = z.object({
  listing_id: z.string().uuid(),
})

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const admin = createServiceRoleClient()

  const { data: listing } = await admin
    .from('media_property_listings')
    .select('*, media_clients!inner(email)')
    .eq('id', body.data.listing_id)
    .single()

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  // Verify ownership
  const clientEmail = (listing.media_clients as { email: string }).email
  if (clientEmail !== user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Mark as generating
  await admin
    .from('media_property_listings')
    .update({ status: 'generating' })
    .eq('id', listing.id)

  const hasOpenHouse = !!(listing.open_house_date && listing.open_house_time)
  const tone = listing.preferred_tone || 'professional and warm'
  const cta = listing.preferred_cta || 'contact me today for a private showing'

  const prompt = `You are a real estate marketing expert. Generate marketing copy for the following property listing. Return ONLY a valid JSON object with the exact keys shown below — no markdown, no extra text.

LISTING DETAILS:
Address: ${listing.property_address}
Price: ${listing.listing_price}
Bedrooms: ${listing.bedrooms ?? 'N/A'}
Bathrooms: ${listing.bathrooms ?? 'N/A'}
Square Footage: ${listing.square_footage ? `${listing.square_footage} sq ft` : 'N/A'}
Lot Size: ${listing.lot_size ?? 'N/A'}
Realtor: ${listing.realtor_name}${listing.realtor_phone ? ` | ${listing.realtor_phone}` : ''}${listing.realtor_email ? ` | ${listing.realtor_email}` : ''}
MLS: ${listing.mls_link ?? 'N/A'}
${hasOpenHouse ? `Open House: ${listing.open_house_date} at ${listing.open_house_time}` : ''}
Description: ${listing.listing_description ?? ''}
Key Features: ${listing.key_features?.join(', ') ?? 'N/A'}
Neighborhood Highlights: ${listing.neighborhood_highlights ?? 'N/A'}
School/Area Notes: ${listing.school_area_notes ?? 'N/A'}
Preferred Tone: ${tone}
Call to Action: ${cta}
Special Instructions: ${listing.special_instructions ?? 'None'}

Generate the following marketing assets. Each should be complete, compelling, and ready to publish.

Return this exact JSON structure:
{
  "facebook_listing": "A 150-200 word Facebook post announcing this listing. Include price, key features, and a call to action. Use line breaks for readability.",
  "facebook_open_house": "${hasOpenHouse ? 'A Facebook post specifically promoting the open house. Include date, time, address, and what to expect.' : 'N/A — no open house date provided'}",
  "instagram_caption": "A punchy 100-150 word Instagram caption with emojis. Hook, key selling points, and call to action. End with 'Link in bio for details.'",
  "reel_script": "A 30-45 second video script. Include: hook line (first 3 seconds), 5-6 property highlights to show on camera, and a closing CTA. Format with [SCENE] markers.",
  "flyer_copy": "Print flyer copy with: headline, subheadline, 6 bullet point features, description paragraph, and agent contact block.",
  "hashtags": "30 relevant hashtags as a single space-separated string. Mix: location-based, real estate general, lifestyle, and property-specific.",
  "sms_copy": "A 160-character or less text message blast. Property address, price, key stat, and a link placeholder [LINK].",
  "email_copy": "A complete email with Subject line, preview text, greeting, 2-3 paragraph body, property highlights list, and CTA button text."
}`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    let assets: Record<string, string>

    try {
      // Strip any markdown code fences if present
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()
      assets = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Asset generation failed — invalid response format' }, { status: 500 })
    }

    // Mark previous versions as not current
    await admin
      .from('media_generated_marketing_assets')
      .update({ is_current: false })
      .eq('listing_id', listing.id)

    // Save assets
    const { data: saved, error: saveErr } = await admin
      .from('media_generated_marketing_assets')
      .insert({
        listing_id: listing.id,
        facebook_listing: assets.facebook_listing,
        facebook_open_house: assets.facebook_open_house,
        instagram_caption: assets.instagram_caption,
        reel_script: assets.reel_script,
        flyer_copy: assets.flyer_copy,
        hashtags: assets.hashtags,
        sms_copy: assets.sms_copy,
        email_copy: assets.email_copy,
        model_used: 'claude-sonnet-4-6',
        is_current: true,
      })
      .select('id')
      .single()

    if (saveErr) {
      console.error('Asset save error:', saveErr)
      return NextResponse.json({ error: 'Failed to save assets' }, { status: 500 })
    }

    // Update listing status
    await admin
      .from('media_property_listings')
      .update({ status: 'generated', updated_at: new Date().toISOString() })
      .eq('id', listing.id)

    // Create admin content request for review
    await admin.from('media_content_requests').insert({
      client_id: listing.client_id,
      service_type: 'Listing Marketing Assets',
      description: `Generated marketing assets for ${listing.property_address} — ready for review.`,
      status: 'in_review',
    })

    return NextResponse.json({ success: true, asset_id: saved.id })
  } catch (err) {
    console.error('Generation error:', err)
    await admin
      .from('media_property_listings')
      .update({ status: 'submitted' })
      .eq('id', listing.id)
    return NextResponse.json({ error: 'Asset generation failed' }, { status: 500 })
  }
}
