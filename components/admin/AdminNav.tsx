'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '◈' },
  { label: 'Leads', href: '/admin/leads', icon: '◎' },
  { label: 'Orders', href: '/admin/orders', icon: '▣' },
  { label: 'Projects', href: '/admin/projects', icon: '◆' },
  { label: 'Domains', href: '/admin/domains', icon: '⬡' },
  { label: 'Customers', href: '/admin/customers', icon: '◉' },
]

export default function AdminNav() {
  const path = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-white/8 flex flex-col min-h-screen">
      <div className="p-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <Image src="/3b-media-logo.png" alt="3B Media Group" width={36} height={36} className="w-9 h-9 object-contain" />
          <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">Admin</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {links.map((link) => {
          const active = path.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#F97316]/15 text-[#F97316] font-semibold'
                  : 'text-white/45 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="font-mono text-xs">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/8">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/25 hover:text-white/50 transition-colors"
        >
          ← View site
        </Link>
      </div>
    </aside>
  )
}
