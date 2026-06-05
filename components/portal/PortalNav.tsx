'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const links = [
  { label: 'Dashboard', href: '/portal/dashboard', icon: '◈' },
  { label: 'Listings', href: '/portal/listings', icon: '⬡' },
  { label: 'My Projects', href: '/portal/projects', icon: '◆' },
  { label: 'Requests', href: '/portal/requests', icon: '▣' },
  { label: 'Files', href: '/portal/files', icon: '◧' },
  { label: 'Invoices', href: '/portal/invoices', icon: '◉' },
]

export default function PortalNav() {
  const path = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
  }

  return (
    <aside className="w-52 shrink-0 border-r border-white/8 flex flex-col min-h-screen">
      <div className="p-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#14B8A6] rounded-lg flex items-center justify-center font-black text-xs text-white">3B</div>
          <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">Client Portal</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {links.map((link) => {
          const active = path === link.href || (link.href !== '/portal/dashboard' && path.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#14B8A6]/15 text-[#14B8A6] font-semibold'
                  : 'text-white/45 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="font-mono text-xs w-4 shrink-0">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/8 space-y-1">
        <Link href="/" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/55 hover:text-white hover:bg-white/5 transition-colors font-medium">
          ← Back to site
        </Link>
        <button
          onClick={signOut}
          className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/8 transition-colors font-medium"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
