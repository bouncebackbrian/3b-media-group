export default function PortalFilesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Files & Assets</h1>
        <p className="text-white/35 text-sm mt-1">Your uploaded files and delivered assets</p>
      </div>
      <div className="bg-[#11243D] border border-white/8 rounded-2xl px-6 py-16 text-center">
        <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-[#14B8A6] font-mono">◧</span>
        </div>
        <p className="text-white/35 text-sm">File uploads and deliverables coming soon.</p>
        <p className="text-white/20 text-xs mt-1">Files will appear here once your team starts delivering work.</p>
      </div>
    </div>
  )
}
