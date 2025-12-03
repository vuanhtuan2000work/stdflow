import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  // Create response to set cookies
  let response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin))

  // Create Supabase client with cookie handling for Route Handler
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
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Exchange code for session - this sets cookies
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Error exchanging code for session:', exchangeError)
    return NextResponse.redirect(new URL('/login?error=oauth_error', requestUrl.origin))
  }

  // Get user after session is set
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Error getting user:', userError)
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  // Check if user has profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  // If profile doesn't exist, create it from OAuth metadata
  if (!profile) {
    const metadata = user.user_metadata || {}
    const username = metadata.username || 
                     metadata.preferred_username || 
                     (metadata.name ? metadata.name.toLowerCase().replace(/\s+/g, '') : null) ||
                     user.email?.split('@')[0] ||
                     `user_${user.id.slice(0, 8)}`
    
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: username,
        full_name: metadata.full_name || metadata.name || null,
        avatar_url: metadata.avatar_url || metadata.picture || null,
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating profile:', createError)
      // Still redirect to setup-profile if creation fails
      // Create new redirect but preserve cookies
      const redirectResponse = NextResponse.redirect(new URL('/setup-profile', requestUrl.origin))
      // Copy all cookies from original response
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

    profile = newProfile
  }

  // Determine redirect URL
  const redirectUrl = profile?.username 
    ? new URL('/dashboard', requestUrl.origin)
    : new URL('/setup-profile', requestUrl.origin)

  // Create redirect response and preserve all cookies
  const redirectResponse = NextResponse.redirect(redirectUrl)
  
  // Copy all cookies from original response (which has session cookies)
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

