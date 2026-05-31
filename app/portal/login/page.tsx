'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PortalLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'magic'>('login')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
    } else {
      router.push('/portal/dashboard')
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/portal/dashboard` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0A1A2F] text-white min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 bg-[#14B8A6] rounded-lg flex items-center justify-center font-black text-sm text-white">3B</div>
          <span className="font-bold">Client Portal</span>
        </div>

        {sent ? (
          <div className="bg-[#11243D] border border-white/8 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-[#14B8A6]/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#14B8A6] text-xl">✓</span>
            </div>
            <h2 className="font-black text-lg mb-2">Check your email</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              We sent a login link to <strong className="text-white/80">{email}</strong>. Click it to access your portal.
            </p>
          </div>
        ) : (
          <div className="bg-[#11243D] border border-white/8 rounded-2xl p-8">
            <h1 className="font-black text-xl text-center mb-6">Sign in to your portal</h1>

            <div className="flex gap-1 bg-[#0A1A2F] p-1 rounded-xl mb-6">
              {(['login', 'magic'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${mode === m ? 'bg-[#14B8A6] text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {m === 'login' ? 'Password' : 'Magic Link'}
                </button>
              ))}
            </div>

            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

            <form onSubmit={mode === 'login' ? login : sendMagicLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                />
              </div>

              {mode === 'login' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0A1A2F] border border-white/10 focus:border-[#14B8A6]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                {loading ? 'Loading…' : mode === 'login' ? 'Sign In' : 'Send Magic Link'}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-xs text-white/25 mt-6">
          Not a client yet?{' '}
          <Link href="/grow" className="text-[#14B8A6] hover:underline">Start with the Growth Wizard</Link>
        </p>
      </div>
    </div>
  )
}
