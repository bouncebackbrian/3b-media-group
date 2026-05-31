import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { generateRecommendations } from '@/lib/wizard/recommendations'
import { scoreFromWizard } from '@/lib/wizard/threeboost'
import { GROWTH_GOAL_KEYS, CHALLENGE_KEYS } from '@/lib/wizard/config'
import { z } from 'zod'

const schema = z.object({
  // Lead capture
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  // Step 1
  business_name: z.string().optional(),
  industry: z.string().optional(),
  years_in_business: z.string().optional(),
  employee_count: z.string().optional(),
  annual_revenue_range: z.string().optional(),
  // Step 2
  has_website: z.boolean().nullable().optional(),
  has_social: z.boolean().nullable().optional(),
  runs_ads: z.boolean().nullable().optional(),
  collects_leads: z.boolean().nullable().optional(),
  // Step 3 & 4 — accept only known keys, ignore the rest
  growth_goals: z.array(z.enum(GROWTH_GOAL_KEYS as [string, ...string[]])).default([]),
  challenges: z.array(z.enum(CHALLENGE_KEYS as [string, ...string[]])).default([]),
})

export async function POST(req: NextRequest) {
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  // Recommendations are computed server-side — never trust the client.
  const recommendations = generateRecommendations({
    industry: body.industry,
    hasWebsite: body.has_website,
    hasSocial: body.has_social,
    runsAds: body.runs_ads,
    collectsLeads: body.collects_leads,
    growthGoals: body.growth_goals,
    challenges: body.challenges,
  })

  const supabase = createServiceRoleClient()

  // 1) CRM lead — flows through the existing /admin/leads pipeline.
  const serviceInterest = recommendations
    .slice(0, 3)
    .map((r) => r.product)
    .join(', ')

  const { data: lead, error: leadError } = await supabase
    .from('media_leads')
    .insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company_name: body.business_name,
      service_interest: serviceInterest || 'Business Growth Wizard',
      message: `Goals: ${body.growth_goals.join(', ') || '—'}. Challenges: ${body.challenges.join(', ') || '—'}.`,
      source: 'growth_wizard',
      lead_type: 'growth_wizard',
      status: 'new',
    })
    .select('id')
    .single()

  if (leadError) {
    console.error('Wizard lead insert error:', leadError)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  const leadId = lead.id as string

  // 2) Wizard submission with full responses + recommendations.
  const { data: submission, error: subError } = await supabase
    .from('media_growth_wizard_submissions')
    .insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      business_name: body.business_name,
      industry: body.industry,
      years_in_business: body.years_in_business,
      employee_count: body.employee_count,
      annual_revenue_range: body.annual_revenue_range,
      has_website: body.has_website ?? null,
      has_social: body.has_social ?? null,
      runs_ads: body.runs_ads ?? null,
      collects_leads: body.collects_leads ?? null,
      growth_goals: body.growth_goals,
      challenges: body.challenges,
      recommendations,
      lead_id: leadId,
      source: 'growth_wizard',
      status: 'new',
      raw_responses: body,
    })
    .select('id')
    .single()

  if (subError) {
    // Lead is already saved; log and continue so the user still gets results.
    console.error('Wizard submission insert error:', subError)
  }

  const submissionId = submission?.id ?? null

  // 3) Ecosystem cross-sell tracking — one row per non-media recommendation.
  const referrals = recommendations
    .filter((r) => r.ecosystemProduct !== 'media_group')
    .map((r) => ({
      ecosystem_product: r.ecosystemProduct,
      source_feature: 'growth_wizard',
      lead_id: leadId,
      wizard_submission_id: submissionId,
      reason: r.reason,
      status: 'recommended',
    }))
  if (referrals.length) {
    const { error } = await supabase.from('media_ecosystem_referrals').insert(referrals)
    if (error) console.error('Ecosystem referral insert error:', error)
  }

  // 4) Analytics funnel event.
  await supabase.from('media_analytics_events').insert({
    event_name: 'wizard_completed',
    lead_id: leadId,
    properties: {
      industry: body.industry,
      recommendation_count: recommendations.length,
      recommendation_keys: recommendations.map((r) => r.key),
    },
  })

  // 5) Email follow-up (queued). Resend is not wired up yet, so we record the
  //    intent in media_email_events; a future sender drains the queue.
  await supabase.from('media_email_events').insert({
    lead_id: leadId,
    to_email: body.email,
    template: 'growth_wizard_followup',
    status: 'queued',
    entity_type: 'growth_wizard_submission',
    entity_id: submissionId,
  })

  const score = scoreFromWizard({
    industry: body.industry,
    hasWebsite: body.has_website,
    hasSocial: body.has_social,
    runsAds: body.runs_ads,
    collectsLeads: body.collects_leads,
    growthGoals: body.growth_goals,
    challenges: body.challenges,
    yearsInBusiness: body.years_in_business,
    revenueRange: body.annual_revenue_range,
    employeeCount: body.employee_count,
  })

  return NextResponse.json({ success: true, recommendations, score })
}
