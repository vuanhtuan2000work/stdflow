import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ClassDetailClient } from './class-detail-client'

export default async function ClassDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch class
  const { data: classData } = await supabase
    .from('classes')
    .select(`
      *,
      profiles (
        full_name,
        username
      )
    `)
    .eq('id', params.id)
    .eq('teacher_id', user.id)
    .single()

  if (!classData) {
    notFound()
  }

  // Fetch class members
  const { data: members } = await supabase
    .from('class_members')
    .select(`
      *,
      profiles (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('class_id', params.id)
    .order('joined_at', { ascending: false })

  // Fetch shared flashcards
  const { data: sharedFlashcards } = await supabase
    .from('shared_flashcards')
    .select(`
      *,
      flashcards (
        id,
        front_text,
        back_text,
        subjects (
          name,
          color
        )
      ),
      profiles (
        full_name,
        username
      )
    `)
    .eq('class_id', params.id)
    .order('shared_at', { ascending: false })

  return (
    <ClassDetailClient
      classData={classData}
      members={members || []}
      sharedFlashcards={sharedFlashcards || []}
    />
  )
}

