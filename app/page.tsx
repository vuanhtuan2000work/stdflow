import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (user) {
    // Check if user has profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name')
      .eq('id', user.id)
      .single()

    if (profile?.username) {
      redirect('/dashboard')
    } else {
      redirect('/setup-profile')
    }
  } else {
    redirect('/onboarding')
  }
}

