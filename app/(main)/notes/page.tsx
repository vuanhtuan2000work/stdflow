import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NotesClient } from './notes-client'

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch notes with subject info
  const { data: notes } = await supabase
    .from('notes')
    .select(`
      *,
      subjects (
        id,
        name,
        color
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  // Fetch subjects for filter
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return <NotesClient notes={notes || []} subjects={subjects || []} />
}

