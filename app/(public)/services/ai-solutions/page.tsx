import type { Metadata } from 'next'
import ServicePageLayout, { type ServicePageData } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'AI Solutions',
  description: 'Custom GPTs, business automation, and AI assistants that save time and scale your business.',
}

const data: ServicePageData = {
  eyebrow: 'AI Solutions Division',
  title: 'Put AI to work in your business.',
  intro:
    'Custom GPTs, automations, and AI assistants designed around how your business actually operates — so repetitive work runs itself and your team focuses on growth.',
  offerings: [
    { title: 'Custom GPT Development', desc: 'Purpose-built AI assistants trained on your business, your voice, and your offers.' },
    { title: 'Business Automation', desc: 'Automate lead follow-up, scheduling, data entry, and repetitive workflows.' },
    { title: 'AI Assistants', desc: '24/7 chat assistants that answer questions, qualify leads, and book appointments.' },
    { title: 'Workflow Automation', desc: 'Connect your tools so information flows automatically between them.' },
    { title: 'AI Training', desc: 'Hands-on training so your team can use AI confidently and effectively.' },
    { title: 'AI Implementation', desc: 'End-to-end rollout — strategy, build, integration, and support.' },
  ],
  outcomes: [
    'Hours of manual work eliminated every week',
    'Faster lead response and follow-up',
    'AI tools tailored to your workflows',
    'A clear implementation roadmap',
    'Integration with the broader 3B Ecosystem',
    'Future-ready: Funding, Fleet, and Credit AI on the roadmap',
  ],
  quoteService: 'AI Solutions',
  related: [
    { label: 'Business Growth', href: '/services/business-growth' },
    { label: 'Marketing', href: '/services/marketing' },
    { label: 'Growth Wizard', href: '/grow' },
  ],
}

export default function AiSolutionsPage() {
  return <ServicePageLayout data={data} />
}
