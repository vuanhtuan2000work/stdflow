import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ReviewCompleteClient } from './review-complete-client'

export default async function ReviewCompletePage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get today's study sessions for stats
  const today = new Date().toISOString().split('T')[0]
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('rating')
    .eq('user_id', user.id)
    .gte('studied_at', `${today}T00:00:00`)
    .lt('studied_at', `${today}T23:59:59`)

  const stats = {
    hard: sessions?.filter((s) => s.rating === 'hard').length || 0,
    medium: sessions?.filter((s) => s.rating === 'medium').length || 0,
    easy: sessions?.filter((s) => s.rating === 'easy').length || 0,
    total: sessions?.length || 0,
  }

  return <ReviewCompleteClient stats={stats} />
}

