import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { NoteDetailClient } from './note-detail-client'

export default async function NoteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch note
  const { data: note } = await supabase
    .from('notes')
    .select(`
      *,
      subjects (
        id,
        name,
        color
      )
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!note) {
    notFound()
  }

  // Fetch subjects for edit mode
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return <NoteDetailClient note={note} subjects={subjects || []} />
}

