import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <p className="text-white/30 text-sm mb-4">Checkout cancelled</p>
        <h1 className="text-3xl font-black mb-4">No problem.</h1>
        <p className="text-white/50 mb-8 leading-relaxed">
          Your checkout was cancelled — nothing was charged. Come back when you are ready, or book a call if you want to talk through your options first.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/packages" className="bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            Back to Packages
          </Link>
          <Link href="/book" className="border border-white/15 text-white/60 hover:text-white px-6 py-3 rounded-xl text-sm transition-colors">
            Book a Free Call
          </Link>
        </div>
      </div>
    </div>
  )
}
