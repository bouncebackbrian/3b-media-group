import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_OPTS = { domain: '.bouncebackbrian.com', path: '/', sameSite: 'lax' as const, secure: true }

function makeSupabase(request: NextRequest, response: { current: ReturnType<typeof NextResponse.next> }) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response.current = NextResponse.next({ request })
          toSet.forEach(({ name, value, options }) =>
            response.current.cookies.set(name, value, { ...COOKIE_OPTS, ...options } as Parameters<typeof response.current.cookies.set>[2])
          )
        },
      },
    }
  )
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const res = { current: NextResponse.next({ request: req }) }

  // Admin routes
  if (path.startsWith('/admin')) {
    if (path === '/admin/login') return res.current
    const supabase = makeSupabase(req, res)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const returnTo = encodeURIComponent(`https://media.bouncebackbrian.com${path}`)
      return NextResponse.redirect(`https://3boost.bouncebackbrian.com/login?returnTo=${returnTo}`)
    }
    const { data: profile } = await supabase.from('media_profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return NextResponse.redirect(new URL('/', req.url))
    return res.current
  }

  // Portal routes
  if (path.startsWith('/portal')) {
    if (path === '/portal/login') return res.current
    const supabase = makeSupabase(req, res)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const returnTo = encodeURIComponent(`https://media.bouncebackbrian.com${path}`)
      return NextResponse.redirect(`https://3boost.bouncebackbrian.com/login?returnTo=${returnTo}`)
    }
    return res.current
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
}
