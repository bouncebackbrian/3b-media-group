export default function SettingsPage() {
  const envVars = [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', status: 'required', desc: 'Supabase project URL' },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', status: 'required', desc: 'Supabase anon/public key' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', status: 'required', desc: 'Supabase service role key (server-only)' },
    { key: 'NEXT_PUBLIC_SITE_URL', status: 'required', desc: 'Production URL: https://media.bouncebackbrian.com' },
    { key: 'STRIPE_SECRET_KEY', status: 'optional', desc: 'Stripe secret key for checkout' },
    { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', status: 'optional', desc: 'Stripe publishable key' },
    { key: 'STRIPE_WEBHOOK_SECRET', status: 'optional', desc: 'Stripe webhook signing secret' },
  ]

  const roles = [
    { role: 'owner', desc: 'Full access to all admin features' },
    { role: 'admin', desc: 'Access to all admin features except settings' },
    { role: 'client', desc: 'Client portal only — /portal routes' },
    { role: 'vendor', desc: 'Marketplace vendor portal — /vendor routes' },
  ]

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black">Settings</h1>
        <p className="text-white/35 text-sm mt-1">Configuration reference</p>
      </div>

      <div className="space-y-6">
        {/* Env vars */}
        <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8">
            <h2 className="font-bold text-sm">Environment Variables</h2>
            <p className="text-white/30 text-xs mt-0.5">Set in Vercel dashboard → Project → Settings → Environment Variables</p>
          </div>
          <div className="divide-y divide-white/5">
            {envVars.map((e) => (
              <div key={e.key} className="px-5 py-3.5 flex items-start justify-between gap-4">
                <div>
                  <code className="text-xs text-[#14B8A6] font-mono">{e.key}</code>
                  <p className="text-xs text-white/35 mt-0.5">{e.desc}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${e.status === 'required' ? 'bg-red-500/15 text-red-400' : 'bg-white/8 text-white/30'}`}>
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="bg-[#11243D] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8">
            <h2 className="font-bold text-sm">User Roles</h2>
            <p className="text-white/30 text-xs mt-0.5">Defined in media_profiles.role — managed in Supabase</p>
          </div>
          <div className="divide-y divide-white/5">
            {roles.map((r) => (
              <div key={r.role} className="px-5 py-3.5 flex items-center gap-4">
                <code className="text-xs font-mono text-[#14B8A6] w-16 shrink-0">{r.role}</code>
                <p className="text-xs text-white/50">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment */}
        <div className="bg-[#11243D] border border-white/8 rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-3">Vercel Deployment</h2>
          <div className="space-y-2 text-xs text-white/50 font-mono bg-black/20 rounded-xl p-4">
            <p className="text-white/30"># Deploy to Vercel</p>
            <p>vercel --prod</p>
            <p className="text-white/30 mt-2"># Or connect GitHub repo and auto-deploy on push</p>
          </div>
        </div>
      </div>
    </div>
  )
}
