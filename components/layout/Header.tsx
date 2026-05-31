'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-white/8 bg-[#0A1A2F] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/3b-media-logo.png"
            alt="3B Media Group"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/portal"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Client Portal
          </Link>
          <Link
            href="/grow"
            className="bg-[#14B8A6] hover:bg-[#0D9488] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Grow My Business
          </Link>
        </div>

        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M3 8h18M3 14h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/8 bg-[#0A1A2F] px-6 py-4 flex flex-col gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/60 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/portal"
            className="text-sm text-white/60 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            Client Portal
          </Link>
          <Link
            href="/grow"
            className="bg-[#14B8A6] text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center"
            onClick={() => setOpen(false)}
          >
            Grow My Business
          </Link>
        </div>
      )}
    </header>
  )
}
