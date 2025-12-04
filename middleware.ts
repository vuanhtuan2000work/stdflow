import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Debug logs (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔐 [Middleware] Path: ${request.nextUrl.pathname}`)
    console.log(`🔐 [Middleware] User:`, {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: userError?.message,
    })
  }

  // Protect routes that require authentication
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/onboarding') ||
                      request.nextUrl.pathname.startsWith('/setup-profile')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                           request.nextUrl.pathname.startsWith('/flashcards') ||
                           request.nextUrl.pathname.startsWith('/calendar') ||
                           request.nextUrl.pathname.startsWith('/profile') ||
                           request.nextUrl.pathname.startsWith('/notes') ||
                           request.nextUrl.pathname.startsWith('/statistics') ||
                           request.nextUrl.pathname.startsWith('/achievements') ||
                           request.nextUrl.pathname.startsWith('/classes') ||
                           request.nextUrl.pathname.startsWith('/join-class') ||
                           request.nextUrl.pathname.startsWith('/settings') ||
                           request.nextUrl.pathname.startsWith('/review') ||
                           request.nextUrl.pathname.startsWith('/subjects')

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !user) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 [Middleware] ❌ No user, redirecting to /login`)
    }
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    // Copy cookies from response to redirect response
    const redirectResponse = NextResponse.redirect(redirectUrl)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        expires: cookie.expires,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite as any,
      })
    })
    return redirectResponse
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && user) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 [Middleware] ✅ User authenticated, checking profile...`)
    }
    // Check if user has completed profile setup
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 [Middleware] Profile check:`, {
        hasProfile: !!profile,
        hasUsername: !!profile?.username,
        profileError: profileError?.message,
      })
    }

    if (profile?.username) {
      const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
      // Copy cookies from response to redirect response
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, {
          path: cookie.path,
          domain: cookie.domain,
          maxAge: cookie.maxAge,
          expires: cookie.expires,
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          sameSite: cookie.sameSite as any,
        })
      })
      return redirectResponse
    } else {
      const redirectResponse = NextResponse.redirect(new URL('/setup-profile', request.url))
      // Copy cookies from response to redirect response
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, {
          path: cookie.path,
          domain: cookie.domain,
          maxAge: cookie.maxAge,
          expires: cookie.expires,
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          sameSite: cookie.sameSite as any,
        })
      })
      return redirectResponse
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

