import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: { default: '3B Media Group', template: '%s | 3B Media Group' },
  description: 'Professional business presence services — domain setup, logo design, website builds, and credibility packages for entrepreneurs.',
  metadataBase: new URL('https://media.bouncebackbrian.com'),
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
