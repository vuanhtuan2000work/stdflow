import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ClassesClient } from './classes-client'

export default async function ClassesPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Check if teacher
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select(`
      roles (
        name
      )
    `)
    .eq('user_id', user.id)

  const isTeacher = userRoles?.some(ur => 
    ur.roles && (ur.roles.name === 'teacher' || ur.roles.name === 'admin')
  )

  if (!isTeacher) {
    redirect('/dashboard')
  }

  // Fetch teacher's classes
  const { data: classes } = await supabase
    .from('classes')
    .select(`
      *,
      class_members (
        id,
        status
      )
    `)
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  return <ClassesClient classes={classes || []} />
}

