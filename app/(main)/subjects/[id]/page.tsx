import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { SubjectDetailClient } from './subject-detail-client'

export default async function SubjectDetailPage({
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

  // Fetch subject
  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!subject) {
    notFound()
  }

  // Fetch flashcards count
  const { count } = await supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('subject_id', id)

  return <SubjectDetailClient subject={subject} flashcardCount={count || 0} />
}


