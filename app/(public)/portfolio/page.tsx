import Link from 'next/link'
import type { Metadata } from 'next'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Real results for real businesses. Case studies, before-and-after examples, and client success stories.',
}

// Always render fresh so newly published case studies appear without a redeploy.
export const dynamic = 'force-dynamic'

interface Client {
  id: string
  slug: string
  name: string
  industry: string | null
  summary: string | null
}

interface Testimonial {
  id: string
  author_name: string
  author_title: string | null
  quote: string
  rating: number | null
}

const categories = ['Realtors', 'Trucking Companies', 'Small Businesses', 'Entrepreneurs']

export default async function PortfolioPage() {
  const supabase = createServiceRoleClient()

  const [{ data: clientsData }, { data: testimonialsData }] = await Promise.all([
    supabase
      .from('media_portfolio_clients')
      .select('id, slug, name, industry, summary')
      .eq('is_published', true)
      .order('sort_order'),
    supabase
      .from('media_testimonials')
      .select('id, author_name, author_title, quote, rating')
      .eq('is_published', true)
      .order('sort_order'),
  ])

  const clients = (clientsData as Client[] | null) ?? []
  const testimonials = (testimonialsData as Testimonial[] | null) ?? []

  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen">
      <section className="px-6 py-20 border-b border-white/8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Portfolio</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">Real results for real businesses.</h1>
          <p className="text-lg text-white/55 leading-relaxed max-w-2xl mx-auto">
            We build the professional foundation our clients grow on. Here&apos;s a look at the work.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 border-b border-white/8">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center">
          {categories.map((c) => (
            <span key={c} className="border border-white/10 text-white/45 text-sm px-4 py-2 rounded-full">{c}</span>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {clients.length === 0 ? (
            <p className="text-center text-white/30">Case studies coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {clients.map((c) => (
                <div key={c.id} className="bg-[#11243D] border border-white/8 rounded-2xl p-7">
                  {c.industry && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded-full">
                      {c.industry}
                    </span>
                  )}
                  <h3 className="font-black text-xl mt-4 mb-2">{c.name}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{c.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="px-6 py-20 border-t border-white/8 bg-[#081320]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black mb-10 text-center">What clients say</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-[#11243D] border border-white/8 rounded-2xl p-7">
                  <p className="text-white/70 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-sm font-bold">{t.author_name}</p>
                  {t.author_title && <p className="text-xs text-white/40">{t.author_title}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-20 border-t border-white/8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Want results like these?</h2>
          <p className="text-white/50 mb-8 leading-relaxed">Let&apos;s build the foundation your business grows on.</p>
          <Link href="/grow" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-7 py-3.5 rounded-xl text-[15px] transition-colors">
            Start the Growth Wizard →
          </Link>
        </div>
      </section>
    </div>
  )
}
