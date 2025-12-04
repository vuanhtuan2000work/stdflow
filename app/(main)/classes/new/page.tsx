import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateClassClient } from './create-class-client'

export default async function CreateClassPage() {
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

  return <CreateClassClient />
}

