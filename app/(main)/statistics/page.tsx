import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatisticsClient } from './statistics-client'
import { subDays } from 'date-fns'

export default async function StatisticsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // Get subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name, color')
    .eq('user_id', user.id)

  // Get total flashcards count
  const { count: totalCards } = await supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get study sessions for last 90 days (to support all time ranges)
  const ninetyDaysAgo = subDays(new Date(), 90)

  const { data: recentSessions } = await supabase
    .from('study_sessions')
    .select(`
      id,
      rating,
      studied_at,
      flashcards (
        subject_id
      )
    `)
    .eq('user_id', user.id)
    .gte('studied_at', ninetyDaysAgo.toISOString())
    .order('studied_at', { ascending: true })

  // Get all sessions for total count
  const { count: totalSessions } = await supabase
    .from('study_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get review count by rating (last 90 days)
  const { data: ratingStats } = await supabase
    .from('study_sessions')
    .select('rating')
    .eq('user_id', user.id)
    .gte('studied_at', ninetyDaysAgo.toISOString())

  // Get subject performance
  const { data: subjectSessions } = await supabase
    .from('study_sessions')
    .select(`
      rating,
      flashcards (
        subject_id,
        subjects (
          id,
          name,
          color
        )
      )
    `)
    .eq('user_id', user.id)
    .gte('studied_at', ninetyDaysAgo.toISOString())

  return (
    <StatisticsClient
      profile={profile}
      subjects={subjects || []}
      totalCards={totalCards || 0}
      totalSessions={totalSessions || 0}
      recentSessions={recentSessions || []}
      ratingStats={ratingStats || []}
      subjectSessions={subjectSessions || []}
    />
  )
}

