import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen flex">
      <AdminNav />
      <main className="flex-1 min-w-0 p-8 overflow-auto">{children}</main>
    </div>
  )
}
