import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateFlashcardClient } from './create-flashcard-client'

export default async function NewFlashcardPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  return <CreateFlashcardClient subjects={subjects || []} defaultSubjectId={params.subject} />
}


