import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { StudentProgressClient } from './student-progress-client'

export default async function StudentProgressPage({
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

  // Get class members with their study stats
  const { data: members } = await supabase
    .from('class_members')
    .select(`
      *,
      profiles (
        id,
        username,
        full_name,
        avatar_url,
        study_streak,
        total_study_time_minutes
      )
    `)
    .eq('class_id', params.id)
    .eq('status', 'active')

  // Get study sessions for class members
  const memberIds = members?.map(m => m.profiles?.id).filter(Boolean) || []
  
  const { data: studySessions } = memberIds.length > 0
    ? await supabase
        .from('study_sessions')
        .select(`
          user_id,
          rating,
          studied_at,
          flashcards (
            id,
            front_text
          )
        `)
        .in('user_id', memberIds)
        .gte('studied_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    : { data: null }

  return (
    <StudentProgressClient
      classData={classData}
      members={members || []}
      studySessions={studySessions || []}
    />
  )
}

