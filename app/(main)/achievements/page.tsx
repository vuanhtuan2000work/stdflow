import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AchievementsClient } from './achievements-client'

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get user stats
  const { data: profile } = await supabase
    .from('profiles')
    .select('study_streak, total_study_time_minutes')
    .eq('id', user.id)
    .single()

  // Get total sessions
  const { count: totalSessions } = await supabase
    .from('study_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get easy ratings count
  const { count: easyCount } = await supabase
    .from('study_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('rating', 'easy')

  // Get classes created count
  const { count: classesCount } = await supabase
    .from('classes')
    .select('*', { count: 'exact', head: true })
    .eq('teacher_id', user.id)

  // Get shared flashcards count
  const { count: sharedCount } = await supabase
    .from('shared_flashcards')
    .select('*', { count: 'exact', head: true })
    .eq('shared_by', user.id)

  const stats = {
    streak: profile?.study_streak || 0,
    totalSessions: totalSessions || 0,
    totalTime: profile?.total_study_time_minutes || 0,
    easyCount: easyCount || 0,
    classesCreated: classesCount || 0,
    flashcardsShared: sharedCount || 0,
  }

  return <AchievementsClient stats={stats} />
}

