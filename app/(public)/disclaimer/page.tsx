import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funding-Readiness Disclaimer',
  description: 'Important disclaimer regarding 3B Media Group funding-readiness services.',
}

export default function DisclaimerPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316] mb-4">Disclaimer</p>
          <h1 className="text-3xl font-black mb-8">Funding-Readiness Disclaimer</h1>
          <div className="space-y-5 text-white/55 text-sm leading-relaxed">
            <p>3B Media Group provides professional business presence services including domain setup, logo design, website development, and related digital infrastructure. These services are designed to support a professional business image.</p>
            <p>3B Media Group does not provide financial services, credit counseling, loan brokering, or investment advice. We make no guarantees regarding funding approvals, business loan outcomes, credit decisions, or lender responses of any kind.</p>
            <p>Funding eligibility is determined entirely by lenders, financial institutions, or investors based on factors including but not limited to creditworthiness, business financials, business history, collateral, and applicable laws and regulations. These factors are entirely outside the scope and control of 3B Media Group.</p>
            <p>Our Funding-Readiness Web Package and related services are designed to help your business present itself professionally. A professional online presence may be one of many factors considered in a business evaluation. We make no representation that our services will result in any specific funding outcome, lender approval, credit extension, or business result.</p>
            <p>Any statements on this site referring to &quot;funding readiness&quot; or &quot;supporting funding conversations&quot; refer exclusively to the professional presentation of your business online. These statements are not guarantees, endorsements, or representations of any financial outcome.</p>
            <p className="text-white/30 text-xs">Last updated: {new Date().getFullYear()}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
