// Business Growth Wizard — recommendation engine.
// Pure, deterministic, and server-authoritative: the API recomputes
// recommendations from raw answers rather than trusting the client.

export type EcosystemProduct =
  | 'media_group'
  | 'funding_machine'
  | 'credit_builder'
  | 'fleet_commander'
  | 'business_id'
  | 'marketplace'

export interface WizardAnswers {
  industry?: string | null
  hasWebsite?: boolean | null
  hasSocial?: boolean | null
  runsAds?: boolean | null
  collectsLeads?: boolean | null
  growthGoals: string[]
  challenges: string[]
}

export interface Recommendation {
  key: string
  product: string          // headline of the recommendation
  packageName: string      // specific package/offer
  reason: string           // why it was recommended (shown to user)
  ecosystemProduct: EcosystemProduct
  ctaHref: string
  priority: number         // lower = shown first
}

/**
 * Generate personalized recommendations from wizard answers.
 * Each rule may fire independently; results are de-duplicated by `key`
 * and sorted by priority. A baseline recommendation is always returned.
 */
export function generateRecommendations(a: WizardAnswers): Recommendation[] {
  const goals = new Set(a.growthGoals)
  const challenges = new Set(a.challenges)
  const recs: Recommendation[] = []

  const industry = (a.industry ?? '').toLowerCase()
  const isTrucking = /truck|logistic|freight|transport|dispatch|carrier/.test(industry)

  // --- Website ---
  if (a.hasWebsite === false || challenges.has('no_website')) {
    recs.push({
      key: 'website',
      product: 'Professional Website',
      packageName: 'Business Website Package',
      reason: "You don't have a website yet — that's the first thing customers, vendors, and lenders look for.",
      ecosystemProduct: 'media_group',
      ctaHref: '/services/websites',
      priority: 1,
    })
  }

  // --- Marketing ---
  if (
    challenges.has('poor_marketing') ||
    goals.has('brand_awareness') ||
    a.hasSocial === false
  ) {
    recs.push({
      key: 'marketing',
      product: 'Growth Marketing',
      packageName: 'Growth Marketing Package',
      reason: 'Consistent, professional marketing builds the brand awareness and pipeline you need to grow.',
      ecosystemProduct: 'media_group',
      ctaHref: '/services/marketing',
      priority: 2,
    })
  }

  // --- Lead generation ---
  if (
    goals.has('generate_leads') ||
    challenges.has('lack_customers') ||
    a.collectsLeads === false
  ) {
    recs.push({
      key: 'leads',
      product: 'Lead Generation',
      packageName: 'Lead Generation & Funnels',
      reason: 'You need more customers — we build the funnels and campaigns that capture leads on autopilot.',
      ecosystemProduct: 'media_group',
      ctaHref: '/services/marketing',
      priority: 3,
    })
  }

  // --- AI / automation ---
  if (
    goals.has('implement_ai') ||
    challenges.has('need_automation') ||
    goals.has('improve_operations') ||
    challenges.has('time_constraints')
  ) {
    recs.push({
      key: 'ai',
      product: 'AI Solutions',
      packageName: 'AI Solutions & Automation Package',
      reason: 'Automating repetitive work frees up your time and lets your business run without you in every task.',
      ecosystemProduct: 'media_group',
      ctaHref: '/services/ai-solutions',
      priority: 4,
    })
  }

  // --- Funding (ecosystem cross-sell) ---
  if (goals.has('obtain_funding') || challenges.has('difficulty_funding')) {
    recs.push({
      key: 'funding',
      product: '3B Funding Machine',
      packageName: 'Funding Readiness & Capital Access',
      reason: 'Capital fuels growth — the 3B Funding Machine helps you get funding-ready and access the right options.',
      ecosystemProduct: 'funding_machine',
      ctaHref: '/services/business-growth#funding',
      priority: 5,
    })
  }

  // --- Credit (ecosystem cross-sell) ---
  if (goals.has('improve_credit') || challenges.has('poor_credit')) {
    recs.push({
      key: 'credit',
      product: '3B Credit Builder',
      packageName: 'Business Credit Builder',
      reason: 'Strong business credit unlocks better funding and vendor terms — the Credit Builder gets you there.',
      ecosystemProduct: 'credit_builder',
      ctaHref: '/services/business-growth#credit',
      priority: 6,
    })
  }

  // --- Fleet Commander (industry-driven cross-sell) ---
  if (isTrucking) {
    recs.push({
      key: 'fleet',
      product: '3B Fleet Commander',
      packageName: 'Fleet Operations & Dispatch',
      reason: 'As a transportation business, Fleet Commander streamlines dispatch, recruiting, and fleet operations.',
      ecosystemProduct: 'fleet_commander',
      ctaHref: '/services/business-growth#fleet',
      priority: 7,
    })
  }

  // --- Recruiting ---
  if (goals.has('recruit_employees')) {
    recs.push({
      key: 'recruiting',
      product: 'Recruitment Marketing',
      packageName: isTrucking ? 'Driver Recruiting Campaign' : 'Hiring & Recruitment Campaign',
      reason: 'Targeted recruitment marketing puts your openings in front of the right candidates.',
      ecosystemProduct: isTrucking ? 'fleet_commander' : 'media_group',
      ctaHref: isTrucking ? '/services/business-growth#fleet' : '/services/marketing',
      priority: 8,
    })
  }

  // --- Baseline ecosystem entry point ---
  recs.push({
    key: 'business_id',
    product: '3B Business ID',
    packageName: 'Business Identity & Growth Hub',
    reason: 'Your central profile across the 3B Ecosystem — one identity for funding, credit, marketing, and more.',
    ecosystemProduct: 'business_id',
    ctaHref: '/services/business-growth',
    priority: 20,
  })

  // De-duplicate by key, keep the first (highest priority) occurrence.
  const seen = new Set<string>()
  return recs
    .filter((r) => (seen.has(r.key) ? false : seen.add(r.key)))
    .sort((x, y) => x.priority - y.priority)
}
