import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ShareFlashcardsClient } from './share-flashcards-client'

export default async function ShareFlashcardsPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Verify teacher owns this class
  const { data: classData } = await supabase
    .from('classes')
    .select('id, name')
    .eq('id', params.id)
    .eq('teacher_id', user.id)
    .single()

  if (!classData) {
    notFound()
  }

  // Get teacher's flashcards
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select(`
      *,
      subjects (
        id,
        name,
        color
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get already shared flashcard IDs
  const { data: alreadyShared } = await supabase
    .from('shared_flashcards')
    .select('flashcard_id')
    .eq('class_id', params.id)

  const sharedIds = new Set(alreadyShared?.map(s => s.flashcard_id) || [])

  return (
    <ShareFlashcardsClient
      classId={params.id}
      className={classData.name}
      flashcards={flashcards || []}
      sharedIds={sharedIds}
    />
  )
}

