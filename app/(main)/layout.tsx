import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'
import { BottomNav } from '@/components/layout/bottom-nav'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.username) {
    redirect('/setup-profile')
  }

  // Check if user is teacher
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
  ) || false

  // Get subjects for sidebar
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Desktop only */}
      <Sidebar subjects={subjects || []} isTeacher={isTeacher} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        {/* TopNav - Desktop only */}
        <TopNav
          user={{
            id: profile.id,
            avatar_url: profile.avatar_url,
            full_name: profile.full_name,
            username: profile.username,
          }}
        />
        
        {/* Main Content */}
        <main className="flex-1 pb-20 md:pb-6">
          {children}
        </main>

        {/* BottomNav - Mobile only */}
        <BottomNav />
      </div>
    </div>
  )
}


