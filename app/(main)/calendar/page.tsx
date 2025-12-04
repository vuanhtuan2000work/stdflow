import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CalendarClient } from './calendar-client'

export default async function CalendarPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch flashcards with due dates for calendar
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('id, next_review_date')
    .eq('user_id', user.id)

  // Fetch study sessions for heatmap
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('studied_at')
    .eq('user_id', user.id)
    .gte('studied_at', thirtyDaysAgo.toISOString())

  // Process calendar data
  const calendarData = new Map<string, number>()
  flashcards?.forEach((card) => {
    const date = card.next_review_date
    calendarData.set(date, (calendarData.get(date) || 0) + 1)
  })

  // Process heatmap data (30 days)
  const heatmapData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toISOString().split('T')[0]
    const daySessions = sessions?.filter(
      (s) => s.studied_at.split('T')[0] === dateStr
    ) || []
    return {
      date: dateStr,
      minutes: daySessions.length,
    }
  })

  return (
    <CalendarClient
      calendarData={Array.from(calendarData.entries())}
      heatmapData={heatmapData}
    />
  )
}


