import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname

  // Build a Supabase client that can read the session from cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ── Admin routes ──────────────────────────────────────────
  if (path.startsWith('/admin')) {
    if (path === '/admin/login') return res

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    const { data: profile } = await supabase
      .from('media_profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return res
  }

  // ── Client portal routes ───────────────────────────────────
  if (path.startsWith('/portal')) {
    if (path === '/portal/login') return res

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/portal/login', req.url))
    }

    return res
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
}
