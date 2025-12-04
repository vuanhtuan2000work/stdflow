import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SubjectsClient } from './subjects-client'
import type { Subject } from '@/lib/types/database.types'

export default async function SubjectsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch subjects with flashcard counts
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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

  return <SubjectsClient subjects={subjectsWithCounts} />
}


