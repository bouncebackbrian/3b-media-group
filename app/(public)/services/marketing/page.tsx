import type { Metadata } from 'next'
import ServicePageLayout, { type ServicePageData } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Marketing Services',
  description: 'Social media management, realtor marketing, and advertising that builds awareness and generates leads.',
}

const data: ServicePageData = {
  eyebrow: 'Marketing Division',
  title: 'Marketing that fills your pipeline.',
  intro:
    'We run the marketing so you can run the business — consistent content, targeted advertising, and lead generation built to grow revenue, not just impressions.',
  offerings: [
    { title: 'Social Media Management', desc: 'Done-for-you posting, captions, and a content calendar across Facebook, Instagram, and LinkedIn.' },
    { title: 'Realtor Marketing', desc: 'Listing promotions, open house blasts, and personal-brand content built for real estate professionals.' },
    { title: 'Advertising', desc: 'Paid campaigns on Meta and Google managed end to end — targeting, creative, and optimization.' },
    { title: 'Content Calendars', desc: 'A planned, on-brand calendar so your presence stays consistent month after month.' },
    { title: 'Lead Generation', desc: 'Funnels and campaigns engineered to capture and qualify leads automatically.' },
    { title: 'Reels & Short Video', desc: 'Scroll-stopping short-form video to grow reach and engagement.' },
  ],
  outcomes: [
    'A consistent, professional presence across your channels',
    'More qualified leads flowing into your CRM',
    'Campaigns measured against revenue, not vanity metrics',
    'A dedicated team handling the work end to end',
    'Monthly reporting you can actually understand',
    'Plans starting at $99/month',
  ],
  quoteService: 'Marketing',
  related: [
    { label: 'Websites', href: '/services/websites' },
    { label: 'Creative Services', href: '/services/creative' },
    { label: 'Pricing', href: '/pricing' },
  ],
}

export default function MarketingPage() {
  return <ServicePageLayout data={data} />
}
