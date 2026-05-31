import { createServiceRoleClient } from '@/lib/supabase/service-role'

const STATIC_PACKAGES = [
  { name: 'Starter', price: '$99/mo', type: 'Monthly Marketing', public: true },
  { name: 'Growth', price: '$199/mo', type: 'Monthly Marketing', public: true },
  { name: 'Business Pro', price: '$349/mo', type: 'Monthly Marketing', public: true },
  { name: 'Starter Website', price: '$299', type: 'Website', public: true },
  { name: 'Business Website', price: '$599', type: 'Website', public: true },
  { name: 'Professional Website', price: '$999+', type: 'Website', public: true },
  { name: 'Open House Blast', price: '$29', type: 'One-Time', public: true },
  { name: 'Listing Marketing Package', price: '$49', type: 'One-Time', public: true },
  { name: 'Reel Creation', price: '$25', type: 'One-Time', public: true },
]

export default async function PricingManagerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Pricing Manager</h1>
        <p className="text-white/35 text-sm mt-1">Manage public packages and service pricing</p>
      </div>

      <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-2xl px-5 py-4 mb-6 text-sm text-[#14B8A6]">
        Dynamic pricing management coming soon. Currently using static pricing defined in code. To update prices, edit <code className="bg-black/20 px-1 rounded text-xs">app/(public)/pricing/page.tsx</code>.
      </div>

      <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="font-bold text-sm">Current Public Packages</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35">Package</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35">Type</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35">Price</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/35">Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {STATIC_PACKAGES.map((p) => (
                <tr key={p.name} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">{p.name}</td>
                  <td className="px-5 py-3.5 text-white/45">{p.type}</td>
                  <td className="px-5 py-3.5 font-bold text-[#14B8A6]">{p.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${p.public ? 'bg-green-500/15 text-green-400' : 'bg-white/8 text-white/30'}`}>
                      {p.public ? 'Public' : 'Private'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
