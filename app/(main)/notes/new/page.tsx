import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateNoteClient } from './create-note-client'

export default async function CreateNotePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return <CreateNoteClient subjects={subjects || []} />
}

