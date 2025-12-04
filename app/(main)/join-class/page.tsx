import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { JoinClassClient } from './join-class-client'

export default async function JoinClassPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get classes user has joined
  const { data: enrolledClasses } = await supabase
    .from('class_members')
    .select(`
      *,
      classes (
        id,
        name,
        description,
        class_code,
        teacher_id,
        profiles (
          full_name,
          username
        )
      )
    `)
    .eq('student_id', user.id)
    .eq('status', 'active')

  return <JoinClassClient enrolledClasses={enrolledClasses || []} />
}

