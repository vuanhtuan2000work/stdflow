import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { EditFlashcardClient } from './edit-flashcard-client'

export default async function EditFlashcardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch flashcard
  const { data: flashcard } = await supabase
    .from('flashcards')
    .select('*, subjects(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!flashcard) {
    notFound()
  }

  // Fetch subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  return (
    <EditFlashcardClient
      flashcard={flashcard}
      subjects={subjects || []}
    />
  )
}

