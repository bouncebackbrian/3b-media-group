// Business Growth Wizard — shared question configuration.
// Imported by both the client form and the server-side recommendation engine
// so the option keys never drift apart.

export const INDUSTRIES = [
  'Trucking & Logistics',
  'Real Estate',
  'Consulting',
  'Service Contractor',
  'E-Commerce / Online Seller',
  'Healthcare & Wellness',
  'Startup / Tech',
  'Creator / Coach',
  'Other',
] as const

export const YEARS_IN_BUSINESS = [
  'Not started yet',
  'Less than 1 year',
  '1–3 years',
  '3–5 years',
  '5+ years',
] as const

export const EMPLOYEE_COUNT = [
  'Just me',
  '2–5',
  '6–20',
  '21–50',
  '50+',
] as const

export const REVENUE_RANGE = [
  'Pre-revenue',
  'Under $50k',
  '$50k–$250k',
  '$250k–$1M',
  '$1M+',
] as const

// Step 3 — Growth goals (keys are stable; labels are shown to the user)
export const GROWTH_GOALS = [
  { key: 'generate_leads', label: 'Generate More Leads' },
  { key: 'increase_revenue', label: 'Increase Revenue' },
  { key: 'brand_awareness', label: 'Build Brand Awareness' },
  { key: 'recruit_employees', label: 'Recruit Employees' },
  { key: 'improve_operations', label: 'Improve Operations' },
  { key: 'improve_credit', label: 'Improve Credit' },
  { key: 'obtain_funding', label: 'Obtain Funding' },
  { key: 'implement_ai', label: 'Implement AI' },
] as const

// Step 4 — Business challenges
export const CHALLENGES = [
  { key: 'lack_customers', label: 'Lack of Customers' },
  { key: 'poor_marketing', label: 'Poor Marketing' },
  { key: 'no_website', label: 'No Website' },
  { key: 'limited_budget', label: 'Limited Budget' },
  { key: 'time_constraints', label: 'Time Constraints' },
  { key: 'need_automation', label: 'Need Automation' },
  { key: 'poor_credit', label: 'Poor Business Credit' },
  { key: 'difficulty_funding', label: 'Difficulty Obtaining Funding' },
] as const

export type GrowthGoalKey = (typeof GROWTH_GOALS)[number]['key']
export type ChallengeKey = (typeof CHALLENGES)[number]['key']

export const GROWTH_GOAL_KEYS = GROWTH_GOALS.map((g) => g.key)
export const CHALLENGE_KEYS = CHALLENGES.map((c) => c.key)
