import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateSubjectClient } from './create-subject-client'

export default async function NewSubjectPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <CreateSubjectClient />
}


