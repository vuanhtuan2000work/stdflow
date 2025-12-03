import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './dashboard-client'
import type { Profile, Subject, Flashcard } from '@/lib/types/database.types'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.username) {
    redirect('/setup-profile')
  }

  // Fetch subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch flashcard counts for each subject
  const subjectsWithCounts = await Promise.all(
    (subjects || []).map(async (subject) => {
      const { count } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('subject_id', subject.id)

      return {
        ...subject,
        cardCount: count || 0,
      }
    })
  )

  // Fetch due flashcards count
  const today = new Date().toISOString().split('T')[0]
  const { count: dueCount } = await supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review_date', today)

  // Fetch total flashcards count
  const { count: totalCount } = await supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Fetch study sessions for heatmap (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('studied_at')
    .eq('user_id', user.id)
    .gte('studied_at', sevenDaysAgo.toISOString())

  // Process heatmap data
  const heatmapData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const daySessions = sessions?.filter(
      (s) => s.studied_at.split('T')[0] === dateStr
    ) || []
    // Estimate minutes (assuming 1 minute per flashcard reviewed)
    return {
      date: dateStr,
      minutes: daySessions.length,
    }
  })

  return (
    <DashboardClient
      user={profile}
      subjects={subjectsWithCounts}
      dueCount={dueCount || 0}
      totalCount={totalCount || 0}
      heatmapData={heatmapData}
    />
  )
}
