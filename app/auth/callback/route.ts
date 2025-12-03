import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🔐 [OAuth Callback] Starting...')
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('🔐 [OAuth Callback] Code received:', !!code)

  if (!code) {
    console.log('🔐 [OAuth Callback] ❌ No code, redirecting to /login')
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
  console.log('🔐 [OAuth Callback] Exchanging code for session...')
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('🔐 [OAuth Callback] ❌ Error exchanging code:', exchangeError)
    return NextResponse.redirect(new URL('/login?error=oauth_error', requestUrl.origin))
  }

  console.log('🔐 [OAuth Callback] ✅ Code exchanged successfully, cookies set')

  // Get user after session is set
  console.log('🔐 [OAuth Callback] Getting user...')
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('🔐 [OAuth Callback] ❌ Error getting user:', userError)
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  console.log('🔐 [OAuth Callback] ✅ User found:', {
    id: user.id,
    email: user.email,
    hasMetadata: !!user.user_metadata,
  })

  // Check if user has profile
  console.log('🔐 [OAuth Callback] Checking profile...')
  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  console.log('🔐 [OAuth Callback] Profile check result:', {
    hasProfile: !!profile,
    username: profile?.username,
    fullName: profile?.full_name,
    error: profileError?.message,
  })

  // If profile doesn't exist, create it from OAuth metadata
  if (!profile) {
    console.log('🔐 [OAuth Callback] ⚠️ Profile not found, creating from OAuth metadata...')
    const metadata = user.user_metadata || {}
    const username = metadata.username || 
                     metadata.preferred_username || 
                     (metadata.name ? metadata.name.toLowerCase().replace(/\s+/g, '') : null) ||
                     user.email?.split('@')[0] ||
                     `user_${user.id.slice(0, 8)}`
    
    console.log('🔐 [OAuth Callback] Creating profile with:', {
      id: user.id,
      username: username,
      full_name: metadata.full_name || metadata.name || null,
      avatar_url: metadata.avatar_url || metadata.picture || null,
    })
    
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
      console.error('🔐 [OAuth Callback] ❌ Error creating profile:', createError)
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

    console.log('🔐 [OAuth Callback] ✅ Profile created:', {
      username: newProfile?.username,
      fullName: newProfile?.full_name,
    })
    profile = newProfile
  }

  // Determine redirect URL
  const redirectUrl = profile?.username 
    ? new URL('/dashboard', requestUrl.origin)
    : new URL('/setup-profile', requestUrl.origin)

  console.log('🔐 [OAuth Callback] Redirect decision:', {
    hasUsername: !!profile?.username,
    redirectTo: redirectUrl.pathname,
    cookieCount: response.cookies.getAll().length,
  })

  // Create redirect response and preserve all cookies
  const redirectResponse = NextResponse.redirect(redirectUrl)
  
  // Copy all cookies from original response (which has session cookies)
  const cookieCount = response.cookies.getAll().length
  console.log('🔐 [OAuth Callback] Copying cookies:', cookieCount, 'cookies')
  
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

  console.log('🔐 [OAuth Callback] ✅ Redirecting to:', redirectUrl.pathname)
  return redirectResponse
}

