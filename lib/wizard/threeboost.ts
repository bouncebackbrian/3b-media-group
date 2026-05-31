// 3Boost Scoring Engine
// The intelligence layer of the 3B Ecosystem. Evaluates a business across six
// categories and produces a 0–100 growth score with strengths, weaknesses, and
// the data the recommendation engine and admin dashboards consume.
//
// Designed to be ecosystem-portable: it takes a normalized signal object (not
// wizard-specific shapes) so Funding Machine, Credit Builder, Fleet, etc. can
// feed it the same way. The wizard adapter lives at the bottom of this file.

import type { WizardAnswers } from './recommendations'

export type CategoryKey =
  | 'digital_presence'
  | 'marketing'
  | 'business_infrastructure'
  | 'funding_readiness'
  | 'credit_readiness'
  | 'ai_adoption'

export interface CategoryScore {
  key: CategoryKey
  label: string
  score: number
  max: number
  /** 'strong' | 'moderate' | 'weak' — bucketed for display */
  level: 'strong' | 'moderate' | 'weak'
}

export interface ThreeBoostScore {
  overall: number // 0–100
  categories: CategoryScore[]
  strengths: string[] // labels of strong categories
  weaknesses: string[] // labels of weak categories
}

export const CATEGORY_MAX: Record<CategoryKey, number> = {
  digital_presence: 20,
  marketing: 20,
  business_infrastructure: 15,
  funding_readiness: 15,
  credit_readiness: 15,
  ai_adoption: 15,
}

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  digital_presence: 'Digital Presence',
  marketing: 'Marketing',
  business_infrastructure: 'Business Infrastructure',
  funding_readiness: 'Funding Readiness',
  credit_readiness: 'Credit Readiness',
  ai_adoption: 'AI Adoption',
}

/** Normalized business signals — the ecosystem-wide input to 3Boost. */
export interface BusinessSignals {
  hasWebsite?: boolean | null
  hasSocial?: boolean | null
  runsAds?: boolean | null
  collectsLeads?: boolean | null
  yearsInBusiness?: string | null
  revenueRange?: string | null
  employeeCount?: string | null
  // Goal/challenge flags (true = the business flagged this as a need/gap)
  needsFunding?: boolean
  needsCredit?: boolean
  needsAi?: boolean
  needsAutomation?: boolean
  wantsLeads?: boolean
  wantsBrand?: boolean
}

function clamp(n: number, max: number): number {
  return Math.max(0, Math.min(max, Math.round(n)))
}

function level(score: number, max: number): CategoryScore['level'] {
  const pct = score / max
  if (pct >= 0.7) return 'strong'
  if (pct >= 0.4) return 'moderate'
  return 'weak'
}

// --- Ordinal helpers (map select-option strings to a 0..1 strength) ---
const YEARS_RANK: Record<string, number> = {
  'Not started yet': 0,
  'Less than 1 year': 0.25,
  '1–3 years': 0.55,
  '3–5 years': 0.8,
  '5+ years': 1,
}
const REVENUE_RANK: Record<string, number> = {
  'Pre-revenue': 0,
  'Under $50k': 0.3,
  '$50k–$250k': 0.55,
  '$250k–$1M': 0.8,
  '$1M+': 1,
}
const EMPLOYEE_RANK: Record<string, number> = {
  'Just me': 0.2,
  '2–5': 0.4,
  '6–20': 0.65,
  '21–50': 0.85,
  '50+': 1,
}

/** Core engine: signals → score. Pure and deterministic. */
export function scoreBusiness(s: BusinessSignals): ThreeBoostScore {
  // Digital Presence (max 20): website is the anchor, plus visibility signals.
  let digital = 0
  if (s.hasWebsite) digital += 12
  if (s.hasSocial) digital += 5
  if (s.collectsLeads) digital += 3
  digital = clamp(digital, CATEGORY_MAX.digital_presence)

  // Marketing (max 20): social + ads + lead capture + intent.
  let marketing = 0
  if (s.hasSocial) marketing += 7
  if (s.runsAds) marketing += 7
  if (s.collectsLeads) marketing += 6
  // If they explicitly want leads/brand, they likely lack it today.
  if (s.wantsLeads || s.wantsBrand) marketing -= 4
  marketing = clamp(marketing, CATEGORY_MAX.marketing)

  // Business Infrastructure (max 15): scale + lead systems, minus automation gaps.
  let infra = 6 // baseline for being operational
  infra += (EMPLOYEE_RANK[s.employeeCount ?? ''] ?? 0.2) * 5
  if (s.collectsLeads) infra += 4
  if (s.needsAutomation) infra -= 4
  infra = clamp(infra, CATEGORY_MAX.business_infrastructure)

  // Funding Readiness (max 15): time in business + revenue + structure proxy.
  let funding = 0
  funding += (YEARS_RANK[s.yearsInBusiness ?? ''] ?? 0) * 7
  funding += (REVENUE_RANK[s.revenueRange ?? ''] ?? 0) * 8
  if (s.needsFunding) funding -= 3 // flagged a gap
  funding = clamp(funding, CATEGORY_MAX.funding_readiness)

  // Credit Readiness (max 15): proxy from tenure; flagged credit needs lower it.
  let credit = 7 // neutral baseline (self-reported credit not collected yet)
  credit += (YEARS_RANK[s.yearsInBusiness ?? ''] ?? 0) * 6
  if (s.needsCredit) credit -= 7
  credit = clamp(credit, CATEGORY_MAX.credit_readiness)

  // AI Adoption (max 15): low by default; needing AI/automation signals a gap.
  let ai = 4 // most SMBs are early on AI
  if (!s.needsAi && !s.needsAutomation) ai += 6 // not flagged as a gap → assume some adoption
  if (s.needsAi) ai -= 2
  if (s.needsAutomation) ai -= 2
  ai = clamp(ai, CATEGORY_MAX.ai_adoption)

  const raw: Record<CategoryKey, number> = {
    digital_presence: digital,
    marketing,
    business_infrastructure: infra,
    funding_readiness: funding,
    credit_readiness: credit,
    ai_adoption: ai,
  }

  const categories: CategoryScore[] = (Object.keys(raw) as CategoryKey[]).map((key) => ({
    key,
    label: CATEGORY_LABEL[key],
    score: raw[key],
    max: CATEGORY_MAX[key],
    level: level(raw[key], CATEGORY_MAX[key]),
  }))

  const overall = clamp(
    categories.reduce((sum, c) => sum + c.score, 0),
    100,
  )

  return {
    overall,
    categories,
    strengths: categories.filter((c) => c.level === 'strong').map((c) => c.label),
    weaknesses: categories.filter((c) => c.level === 'weak').map((c) => c.label),
  }
}

/** Adapter: derive 3Boost signals from Business Growth Wizard answers. */
export function scoreFromWizard(
  a: WizardAnswers & {
    yearsInBusiness?: string | null
    revenueRange?: string | null
    employeeCount?: string | null
  },
): ThreeBoostScore {
  const goals = new Set(a.growthGoals)
  const challenges = new Set(a.challenges)
  return scoreBusiness({
    hasWebsite: a.hasWebsite,
    hasSocial: a.hasSocial,
    runsAds: a.runsAds,
    collectsLeads: a.collectsLeads,
    yearsInBusiness: a.yearsInBusiness ?? null,
    revenueRange: a.revenueRange ?? null,
    employeeCount: a.employeeCount ?? null,
    needsFunding: goals.has('obtain_funding') || challenges.has('difficulty_funding'),
    needsCredit: goals.has('improve_credit') || challenges.has('poor_credit'),
    needsAi: goals.has('implement_ai'),
    needsAutomation: challenges.has('need_automation') || goals.has('improve_operations'),
    wantsLeads: goals.has('generate_leads') || challenges.has('lack_customers'),
    wantsBrand: goals.has('brand_awareness') || challenges.has('poor_marketing'),
  })
}
