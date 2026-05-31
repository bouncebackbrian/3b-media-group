import Link from 'next/link'
import type { Metadata } from 'next'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export const metadata: Metadata = {
  title: 'Marketplace — Coming Soon',
  description: 'The 3B Marketplace will connect businesses with vetted providers across marketing, websites, AI, design, business services, and transportation.',
}

export const dynamic = 'force-dynamic'

interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
}

// Fallback used if the DB is unreachable at build/runtime.
const FALLBACK: Category[] = [
  { id: '1', slug: 'marketing', name: 'Marketing', description: 'Social media, advertising, content creation.', icon: '◎' },
  { id: '2', slug: 'websites', name: 'Websites', description: 'Business, realtor, and e-commerce websites.', icon: '▣' },
  { id: '3', slug: 'ai-services', name: 'AI Services', description: 'Custom GPTs, automation, and training.', icon: '◈' },
  { id: '4', slug: 'design', name: 'Branding', description: 'Logos, branding, and graphic design.', icon: '◆' },
  { id: '5', slug: 'business-growth', name: 'Business Services', description: 'Funding, credit, and consulting.', icon: '◉' },
  { id: '6', slug: 'transportation', name: 'Transportation', description: 'Fleet, recruiting, and dispatch support.', icon: '⬡' },
]

export default async function MarketplacePage() {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('media_marketplace_categories')
    .select('id, slug, name, description, icon')
    .eq('is_active', true)
    .order('sort_order')

  const categories = (data as Category[] | null)?.length ? (data as Category[]) : FALLBACK

  return (
    <div className="bg-[#0A1A2F] text-white">
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-b border-white/8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#14B8A6] bg-[#14B8A6]/10 border border-[#14B8A6]/30 px-3 py-1 rounded-full mb-6">
            Coming Soon
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 tracking-tight">The 3B Marketplace.</h1>
          <p className="text-base sm:text-lg text-white/55 leading-relaxed max-w-2xl mx-auto mb-8">
            A curated marketplace connecting businesses with vetted providers across every category they need to grow — with booking, secure payments, reviews, and order tracking built in.
          </p>
          <Link href="/grow" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm sm:text-[15px] transition-colors inline-block">
            Get a Growth Plan in the Meantime →
          </Link>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black mb-2 text-center">Marketplace categories</h2>
          <p className="text-white/45 text-sm mb-10 text-center">Providers across these categories will be available at launch.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-[#11243D] border border-white/8 rounded-2xl p-6">
                <div className="text-[#14B8A6] text-2xl mb-3 font-mono">{c.icon ?? '◆'}</div>
                <h3 className="font-bold text-[15px] mb-1.5">{c.name}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-16 border-t border-white/8 bg-[#081320]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-black mb-3">Want to become a provider?</h2>
          <p className="text-white/50 mb-7 leading-relaxed text-sm sm:text-base">
            We&apos;re onboarding founding vendors ahead of launch. Tell us about your services and we&apos;ll be in touch.
          </p>
          <Link href="/contact" className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-6 py-3 rounded-xl text-sm sm:text-[15px] transition-colors inline-block">
            Join the Waitlist
          </Link>
        </div>
      </section>
    </div>
  )
}
