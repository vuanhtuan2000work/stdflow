import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ReviewClient } from './review-client'
import type { Flashcard } from '@/lib/types/database.types'

export default async function ReviewPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get due flashcards (next_review_date <= today)
  const today = new Date().toISOString().split('T')[0]
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', user.id)
    .lte('next_review_date', today)
    .order('next_review_date', { ascending: true })
    .order('created_at', { ascending: true })

  if (!flashcards || flashcards.length === 0) {
    redirect('/dashboard')
  }

  return <ReviewClient initialFlashcards={flashcards} />
}


