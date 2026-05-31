import { createServiceRoleClient } from '@/lib/supabase/service-role'
import Link from 'next/link'
import AddPortfolioItem from './AddPortfolioItem'

export default async function PortfolioManagerPage() {
  const supabase = createServiceRoleClient()

  const [{ data: clients }, { data: testimonials }] = await Promise.all([
    supabase
      .from('media_portfolio_clients')
      .select('id, name, industry, summary, is_published, sort_order')
      .order('sort_order'),
    supabase
      .from('media_testimonials')
      .select('id, author_name, author_title, quote, rating, is_published')
      .order('sort_order'),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Portfolio Manager</h1>
        <p className="text-white/35 text-sm mt-1">Manage case studies and testimonials</p>
      </div>

      <div className="space-y-8">
        {/* Case Studies */}
        <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div>
              <h2 className="font-bold text-sm">Case Studies</h2>
              <p className="text-white/30 text-xs mt-0.5">{clients?.length ?? 0} total</p>
            </div>
            <AddPortfolioItem type="case_study" />
          </div>

          {!clients?.length ? (
            <p className="px-6 py-10 text-center text-white/25 text-sm">No case studies yet. Add the first one above.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {clients.map((c) => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-white/35 text-xs truncate">{c.summary ?? '—'}</p>
                  </div>
                  {c.industry && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded-full shrink-0 hidden sm:block">
                      {c.industry}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${c.is_published ? 'bg-green-500/15 text-green-400' : 'bg-white/8 text-white/30'}`}>
                    {c.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Testimonials */}
        <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div>
              <h2 className="font-bold text-sm">Testimonials</h2>
              <p className="text-white/30 text-xs mt-0.5">{testimonials?.length ?? 0} total</p>
            </div>
            <AddPortfolioItem type="testimonial" />
          </div>

          {!testimonials?.length ? (
            <p className="px-6 py-10 text-center text-white/25 text-sm">No testimonials yet.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {testimonials.map((t) => (
                <div key={t.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{t.author_name}</p>
                    {t.author_title && <p className="text-white/35 text-xs">{t.author_title}</p>}
                    <p className="text-white/50 text-xs mt-1.5 line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {t.rating && (
                      <span className="text-yellow-400 text-xs font-bold">{'★'.repeat(t.rating)}</span>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.is_published ? 'bg-green-500/15 text-green-400' : 'bg-white/8 text-white/30'}`}>
                      {t.is_published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
