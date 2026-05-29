'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Invalid credentials.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center font-black text-sm text-white">3B</div>
          <span className="font-bold">Admin</span>
        </div>

        <form onSubmit={login} className="bg-[#111] border border-white/8 rounded-2xl p-8 space-y-5">
          <h1 className="font-black text-xl text-center mb-2">Sign in</h1>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#F97316]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#F97316]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F97316] hover:bg-[#ea6c0a] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
