import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  console.log('🏠 [HomePage] Starting...')
  
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  console.log('🏠 [HomePage] getUser result:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    error: userError?.message,
  })

  if (user) {
    // Check if user has profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, full_name')
      .eq('id', user.id)
      .single()

    console.log('🏠 [HomePage] Profile check:', {
      hasProfile: !!profile,
      username: profile?.username,
      fullName: profile?.full_name,
      profileError: profileError?.message,
      profileData: profile,
    })

    if (profile?.username) {
      console.log('🏠 [HomePage] ✅ Redirecting to /dashboard (has username)')
      redirect('/dashboard')
    } else {
      console.log('🏠 [HomePage] ⚠️ Redirecting to /setup-profile (no username)')
      redirect('/setup-profile')
    }
  } else {
    console.log('🏠 [HomePage] ❌ No user found, redirecting to /onboarding')
    redirect('/onboarding')
  }
}

