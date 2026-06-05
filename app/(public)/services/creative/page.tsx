import type { Metadata } from 'next'
import ServicePageLayout, { type ServicePageData } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Creative Services',
  description: 'Logo design, brand kits, reels, and video content that make your business look the part.',
}

const data: ServicePageData = {
  eyebrow: 'Creative Division',
  title: 'Look like the business you are building.',
  intro:
    'Logos, branding, and content that make a strong first impression everywhere your business shows up — digital, print, pitch, and social.',
  offerings: [
    { title: 'Logo Design', desc: 'A distinctive mark with full file delivery and a brand color palette.' },
    { title: 'Brand Kits', desc: 'Colors, fonts, and guidelines so everything you create stays consistent.' },
    { title: 'Flyers & Print', desc: 'Promotional flyers and print materials designed to convert.' },
    { title: 'Reels & Short Video', desc: 'Engaging short-form video to grow reach across social.' },
    { title: 'Video Content', desc: 'Longer-form video for your brand, products, and services.' },
    { title: 'AI Graphics & Promo', desc: 'On-demand AI-assisted graphics and promotional content.' },
  ],
  outcomes: [
    'A professional, cohesive brand identity',
    'Full logo file package with full rights',
    'Content ready to publish across channels',
    'Faster turnaround with AI-assisted production',
    'Revisions included',
    'Reels from $25, branding packages available',
  ],
  quoteService: 'Creative / Branding',
  related: [
    { label: 'Marketing', href: '/services/marketing' },
    { label: 'Websites', href: '/services/websites' },
    { label: 'Pricing', href: '/pricing' },
  ],
}

export default function CreativePage() {
  return <ServicePageLayout data={data} />
}
