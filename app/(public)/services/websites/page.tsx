import type { Metadata } from 'next'
import ServicePageLayout, { type ServicePageData } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Website Services',
  description: 'Business websites, realtor websites, landing pages, and e-commerce sites built to convert.',
}

const data: ServicePageData = {
  eyebrow: 'Website Division',
  title: 'Websites built to convert.',
  intro:
    'Not templates — real business websites that are fast, mobile-first, and engineered to turn visitors into customers. From a one-page launch to full e-commerce.',
  offerings: [
    { title: 'Business Websites', desc: 'Professional multi-page sites that establish credibility and capture leads.' },
    { title: 'Realtor Websites', desc: 'Listing-ready sites with lead capture, built for real estate professionals.' },
    { title: 'Landing Pages', desc: 'High-converting single-page funnels for campaigns and offers.' },
    { title: 'E-Commerce Sites', desc: 'Sell products online with secure checkout and inventory management.' },
    { title: 'Membership Platforms', desc: 'Gated content and recurring-revenue membership experiences.' },
    { title: 'Client Portals', desc: 'Branded portals where your customers log in and self-serve.' },
  ],
  outcomes: [
    'A mobile-first site that loads fast everywhere',
    'Built-in contact and lead-capture forms',
    'SEO foundations so customers can find you',
    'Domain and professional email setup available',
    'Revisions included before launch',
    'Packages from $299 to custom builds',
  ],
  quoteService: 'Website',
  related: [
    { label: 'Marketing', href: '/services/marketing' },
    { label: 'Creative Services', href: '/services/creative' },
    { label: 'Pricing', href: '/pricing' },
  ],
}

export default function WebsitesPage() {
  return <ServicePageLayout data={data} />
}
