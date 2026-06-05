import Link from 'next/link'
import { stripe } from '@/lib/stripe/client'
import { redirect } from 'next/navigation'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  if (!session_id) redirect('/')

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id)
  } catch {
    redirect('/')
  }

  if (session.payment_status !== 'paid') redirect('/packages')

  const packageName = session.metadata?.package_name ?? 'your package'
  const email = session.customer_details?.email ?? ''

  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-[#14B8A6]/15 border border-[#14B8A6]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-4">Payment Confirmed</p>
        <h1 className="text-3xl font-black mb-4">You are in. Let&apos;s build.</h1>
        <p className="text-white/50 mb-2 leading-relaxed">
          Your order for <strong className="text-white">{packageName}</strong> is confirmed.
        </p>
        {email && (
          <p className="text-white/40 text-sm mb-8">
            A confirmation has been sent to <strong className="text-white/60">{email}</strong>
          </p>
        )}

        <div className="bg-[#11243D] border border-white/8 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-bold mb-4">What happens next</h3>
          <ol className="space-y-3">
            <li className="flex gap-3 text-sm text-white/60">
              <span className="text-[#14B8A6] font-bold shrink-0">1.</span>
              You will receive an email with a link to complete your project intake form.
            </li>
            <li className="flex gap-3 text-sm text-white/60">
              <span className="text-[#14B8A6] font-bold shrink-0">2.</span>
              Complete the intake — it takes about 10 minutes and tells us everything we need.
            </li>
            <li className="flex gap-3 text-sm text-white/60">
              <span className="text-[#14B8A6] font-bold shrink-0">3.</span>
              We review your intake and begin work within 1 business day.
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/start-project"
            className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Complete Intake Now →
          </Link>
          <Link
            href="/"
            className="border border-white/15 text-white/60 hover:text-white px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
