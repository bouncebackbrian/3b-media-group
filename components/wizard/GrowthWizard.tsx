'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  INDUSTRIES,
  YEARS_IN_BUSINESS,
  EMPLOYEE_COUNT,
  REVENUE_RANGE,
  GROWTH_GOALS,
  CHALLENGES,
} from '@/lib/wizard/config'
import type { Recommendation } from '@/lib/wizard/recommendations'
import type { ThreeBoostScore } from '@/lib/wizard/threeboost'

const TOTAL_STEPS = 5 // business info, presence, goals, challenges, contact

type Bool = boolean | null

interface FormState {
  business_name: string
  industry: string
  years_in_business: string
  employee_count: string
  annual_revenue_range: string
  has_website: Bool
  has_social: Bool
  runs_ads: Bool
  collects_leads: Bool
  growth_goals: string[]
  challenges: string[]
  name: string
  email: string
  phone: string
}

const initial: FormState = {
  business_name: '',
  industry: '',
  years_in_business: '',
  employee_count: '',
  annual_revenue_range: '',
  has_website: null,
  has_social: null,
  runs_ads: null,
  collects_leads: null,
  growth_goals: [],
  challenges: [],
  name: '',
  email: '',
  phone: '',
}

export default function GrowthWizard() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<Recommendation[] | null>(null)
  const [score, setScore] = useState<ThreeBoostScore | null>(null)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const toggleArray = (k: 'growth_goals' | 'challenges', value: string) =>
    setForm((f) => ({
      ...f,
      [k]: f[k].includes(value) ? f[k].filter((x) => x !== value) : [...f[k], value],
    }))

  async function submit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/growth-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResults(data.recommendations as Recommendation[])
      if (data.score) setScore(data.score as ThreeBoostScore)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (results) return <Results recs={results} score={score} name={form.name} />

  const canContinue =
    (step === 1 && !!form.industry) ||
    step === 2 ||
    (step === 3 && form.growth_goals.length > 0) ||
    (step === 4 && form.challenges.length > 0) ||
    (step === 5 && !!form.name && /\S+@\S+\.\S+/.test(form.email))

  return (
    <div className="bg-[#11243D] border border-white/8 rounded-2xl p-8 md:p-10">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
          Step {step} of {TOTAL_STEPS}
        </p>
        <p className="text-xs text-white/30">{Math.round((step / TOTAL_STEPS) * 100)}%</p>
      </div>
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-[#14B8A6]' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <StepHeading title="Tell us about your business" sub="So we can tailor every recommendation to where you are right now." />
          <Field label="Business name" value={form.business_name} onChange={(v) => set('business_name', v)} placeholder="Your Business LLC" />
          <Select label="Industry *" value={form.industry} onChange={(v) => set('industry', v)} options={[...INDUSTRIES]} />
          <Select label="Years in business" value={form.years_in_business} onChange={(v) => set('years_in_business', v)} options={[...YEARS_IN_BUSINESS]} />
          <Select label="Number of employees" value={form.employee_count} onChange={(v) => set('employee_count', v)} options={[...EMPLOYEE_COUNT]} />
          <Select label="Annual revenue" value={form.annual_revenue_range} onChange={(v) => set('annual_revenue_range', v)} options={[...REVENUE_RANGE]} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <StepHeading title="Your online presence" sub="A quick snapshot of what you have in place today." />
          <YesNo label="Do you currently have a website?" value={form.has_website} onChange={(v) => set('has_website', v)} />
          <YesNo label="Do you have social media accounts?" value={form.has_social} onChange={(v) => set('has_social', v)} />
          <YesNo label="Do you run advertisements?" value={form.runs_ads} onChange={(v) => set('runs_ads', v)} />
          <YesNo label="Do you collect leads online?" value={form.collects_leads} onChange={(v) => set('collects_leads', v)} />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <StepHeading title="What are your growth goals?" sub="Select everything that matters to you — pick as many as apply." />
          <ChipGroup
            options={GROWTH_GOALS}
            selected={form.growth_goals}
            onToggle={(v) => toggleArray('growth_goals', v)}
          />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <StepHeading title="What's holding you back?" sub="Tell us your biggest challenges so we can solve the right ones." />
          <ChipGroup
            options={CHALLENGES}
            selected={form.challenges}
            onToggle={(v) => toggleArray('challenges', v)}
          />
        </div>
      )}

      {step === 5 && (
        <div className="space-y-5">
          <StepHeading title="Where should we send your growth plan?" sub="Your personalized recommendations are ready. Tell us where to send them." />
          <Field label="Full name *" value={form.name} onChange={(v) => set('name', v)} placeholder="Brian Martin" />
          <Field label="Email address *" type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="you@yourbusiness.com" />
          <Field label="Phone number" type="tel" value={form.phone} onChange={(v) => set('phone', v)} placeholder="(555) 000-0000" />
          <p className="text-xs text-white/30 leading-relaxed">
            By continuing you agree to be contacted about your results. We never sell your information.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-400 mt-5">{error}</p>}

      {/* Nav */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="border border-white/15 text-white/55 hover:text-white font-semibold py-3 px-5 rounded-xl text-sm transition-colors"
          >
            Back
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canContinue}
            className="flex-1 bg-[#14B8A6] disabled:opacity-40 hover:bg-[#0D9488] text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!canContinue || loading}
            className="flex-1 bg-[#14B8A6] disabled:opacity-50 hover:bg-[#0D9488] text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Building your plan…' : 'See My Recommendations →'}
          </button>
        )}
      </div>
    </div>
  )
}

function Results({ recs, score, name }: { recs: Recommendation[]; score: ThreeBoostScore | null; name: string }) {
  const firstName = name.trim().split(' ')[0] || 'there'

  const levelColor = (lvl: string) =>
    lvl === 'strong' ? 'bg-[#14B8A6]' : lvl === 'moderate' ? 'bg-yellow-400' : 'bg-white/20'

  const scoreColor = (n: number) =>
    n >= 70 ? 'text-[#14B8A6]' : n >= 45 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="space-y-5">
      {/* 3Boost Score Card */}
      {score && (
        <div className="bg-[#11243D] border border-white/8 rounded-2xl p-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Your 3Boost Score</p>
          <div className="flex items-end gap-4 mb-6">
            <span className={`text-7xl font-black leading-none ${scoreColor(score.overall)}`}>{score.overall}</span>
            <div className="mb-2">
              <p className="text-white/40 text-sm">/100</p>
              <p className="text-white/55 text-sm">
                {score.overall >= 70 ? 'Strong foundation' : score.overall >= 45 ? 'Growing business' : 'Early stage'}
              </p>
            </div>
          </div>

          {/* Category bars */}
          <div className="space-y-3">
            {score.categories.map((c) => (
              <div key={c.key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-white/55">{c.label}</span>
                  <span className="text-xs font-bold text-white/40">{c.score}/{c.max}</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${levelColor(c.level)}`}
                    style={{ width: `${(c.score / c.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {score.weaknesses.length > 0 && (
            <p className="text-xs text-white/35 mt-4 leading-relaxed">
              Biggest growth opportunities: {score.weaknesses.join(', ')}.
            </p>
          )}
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-[#11243D] border border-white/8 rounded-2xl p-8">
        <h3 className="font-black text-2xl mb-2">Your growth plan, {firstName}.</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          {recs.length} personalized recommendations — ordered by impact. A copy is on its way to your inbox.
        </p>

        <div className="space-y-3">
          {recs.map((r, i) => (
            <div key={r.key} className="bg-[#0A1A2F] border border-white/8 rounded-xl p-5 flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-[#14B8A6]/15 text-[#14B8A6] font-black text-sm flex items-center justify-center">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-[15px]">{r.product}</h4>
                  {r.ecosystemProduct !== 'media_group' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded-full">
                      3B Ecosystem
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/35 mb-1.5">{r.packageName}</p>
                <p className="text-sm text-white/55 leading-relaxed mb-3">{r.reason}</p>
                <Link href={r.ctaHref} className="text-sm font-semibold text-[#14B8A6] hover:text-[#5eead4] transition-colors">
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/8 flex flex-wrap gap-3">
          <Link href="/book" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            Book a Free Strategy Call
          </Link>
          <Link href="/pricing" className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ---------- Field primitives ---------- */

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-2">
      <h3 className="font-black text-xl mb-1.5">{title}</h3>
      <p className="text-sm text-white/45 leading-relaxed">{sub}</p>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
      />
    </div>
  )
}

function Select({
  label, value, onChange, options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors appearance-none"
      >
        <option value="" disabled className="text-white/25">Select…</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0A1A2F]">{o}</option>
        ))}
      </select>
    </div>
  )
}

function YesNo({ label, value, onChange }: { label: string; value: Bool; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-[#0A1A2F] border border-white/8 rounded-xl px-4 py-3.5">
      <span className="text-sm text-white/75">{label}</span>
      <div className="flex gap-2 shrink-0">
        {[{ l: 'Yes', v: true }, { l: 'No', v: false }].map(({ l, v }) => (
          <button
            key={l}
            onClick={() => onChange(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
              value === v
                ? 'border-[#14B8A6] bg-[#14B8A6]/15 text-[#14B8A6]'
                : 'border-white/10 text-white/45 hover:border-white/25'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

function ChipGroup({
  options, selected, onToggle,
}: {
  options: readonly { key: string; label: string }[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((o) => {
        const active = selected.includes(o.key)
        return (
          <button
            key={o.key}
            onClick={() => onToggle(o.key)}
            className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border text-sm transition-colors ${
              active
                ? 'border-[#14B8A6] bg-[#14B8A6]/10 text-white'
                : 'border-white/10 text-white/55 hover:border-white/25 hover:text-white'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                active ? 'border-[#14B8A6] bg-[#14B8A6]' : 'border-white/25'
              }`}
            >
              {active && (
                <svg className="w-3 h-3 text-[#0A1A2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
