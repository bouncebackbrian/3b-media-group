import PortalNav from '@/components/portal/PortalNav'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen flex">
      <PortalNav />
      <main className="flex-1 min-w-0 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  )
}
