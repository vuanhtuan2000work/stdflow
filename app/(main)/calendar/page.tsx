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

  // Fetch flashcards with all needed fields for calendar
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('id, front_text, back_text, next_review_date, review_count, interval_days, ease_factor, user_id, subject_id, is_public, created_at, updated_at')
    .eq('user_id', user.id)

  return (
    <CalendarClient
      flashcards={flashcards || []}
    />
  )
}


