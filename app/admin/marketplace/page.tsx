export default function MarketplaceAdminPage() {
  const categories = [
    'Marketing', 'Websites', 'AI Services', 'Branding',
    'Business Services', 'Funding Services', 'Transportation Services',
  ]

  const upcomingFeatures = [
    { label: 'Vendor Approvals', status: 'Planned' },
    { label: 'Service Listings', status: 'Planned' },
    { label: 'Featured Providers', status: 'Planned' },
    { label: 'Reviews & Ratings', status: 'Planned' },
    { label: 'Order Management', status: 'Planned' },
    { label: 'Commission Tracking', status: 'Planned' },
    { label: 'Vendor Messaging', status: 'Planned' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Marketplace</h1>
        <p className="text-white/35 text-sm mt-1">Marketplace admin — coming soon</p>
      </div>

      <div className="bg-[#14B8A6]/8 border border-[#14B8A6]/20 rounded-2xl px-6 py-5 mb-6">
        <p className="text-[#14B8A6] font-bold text-sm mb-1">Marketplace Launch Incoming</p>
        <p className="text-white/50 text-sm leading-relaxed">
          The 3B Marketplace is in the database architecture phase. Vendor, listing, review, and order infrastructure is being built now so it requires no rebuild at launch.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-[#11243D] border border-white/8 rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4">Planned Categories</h2>
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]/40 shrink-0" />
                <span className="text-sm text-white/60">{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#11243D] border border-white/8 rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4">Upcoming Features</h2>
          <div className="space-y-2">
            {upcomingFeatures.map((f) => (
              <div key={f.label} className="flex items-center justify-between">
                <span className="text-sm text-white/60">{f.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/25 bg-white/5 px-2 py-0.5 rounded-full">
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
