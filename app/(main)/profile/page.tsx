import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileClient } from './profile-client'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/setup-profile')
  }

  // Fetch stats
  const { count: totalFlashcards } = await supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: totalSubjects } = await supabase
    .from('subjects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: totalSessions } = await supabase
    .from('study_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <ProfileClient
      profile={profile}
      stats={{
        totalFlashcards: totalFlashcards || 0,
        totalSubjects: totalSubjects || 0,
        totalSessions: totalSessions || 0,
      }}
    />
  )
}

