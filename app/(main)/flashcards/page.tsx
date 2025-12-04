import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FlashcardsClient } from './flashcards-client'
import type { Flashcard, Subject } from '@/lib/types/database.types'

export default async function FlashcardsPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Build query
  let query = supabase
    .from('flashcards')
    .select('*, subjects(id, name, color, icon)')
    .eq('user_id', user.id)

  // Filter by subject if provided
  if (params.subject) {
    query = query.eq('subject_id', params.subject)
  }

  // Search if provided
  if (params.search) {
    query = query.or(`front_text.ilike.%${params.search}%,back_text.ilike.%${params.search}%`)
  }

  const { data: flashcards } = await query.order('created_at', { ascending: false })

  // Fetch all subjects for filter
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  return (
    <FlashcardsClient
      flashcards={flashcards || []}
      subjects={subjects || []}
      selectedSubjectId={params.subject}
      searchQuery={params.search}
    />
  )
}


