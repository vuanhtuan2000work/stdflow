'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface EnrolledClass {
  id: string
  status: string
  joined_at: string
  classes: {
    id: string
    name: string
    description: string | null
    class_code: string
    teacher_id: string
    profiles: {
      full_name: string | null
      username: string
    }
  }
}

interface JoinClassClientProps {
  enrolledClasses: EnrolledClass[]
}

export function JoinClassClient({ enrolledClasses }: JoinClassClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [classCode, setClassCode] = useState('')
  const [error, setError] = useState('')

  const handleJoin = async () => {
    if (!classCode.trim()) {
      setError('Vui lòng nhập mã lớp')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Check if class exists
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, name, is_active')
        .eq('class_code', classCode.trim().toUpperCase())
        .single()

      if (classError || !classData) {
        setError('Mã lớp không tồn tại')
        return
      }

      if (!classData.is_active) {
        setError('Lớp học này đã đóng')
        return
      }

      // Check if already joined
      const { data: existing } = await supabase
        .from('class_members')
        .select('id')
        .eq('class_id', classData.id)
        .eq('student_id', user.id)
        .maybeSingle()

      if (existing) {
        setError('Bạn đã tham gia lớp này rồi')
        return
      }

      // Join class
      const { error: joinError } = await supabase
        .from('class_members')
        .insert({
          class_id: classData.id,
          student_id: user.id,
          status: 'active',
        })

      if (joinError) throw joinError

      toast.success(`Tham gia lớp "${classData.name}" thành công!`)
      setClassCode('')
      router.refresh()
    } catch (error: any) {
      console.error('Join error:', error)
      setError(error.message || 'Không thể tham gia lớp. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} isTeacher={false} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Tham gia lớp học
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Nhập mã lớp do giáo viên cung cấp để tham gia
              </p>
            </div>

            {/* Join Form */}
            <Card>
              <div className="p-4 md:p-6 space-y-4">
                <FormField
                  label="Mã lớp"
                  value={classCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setClassCode(e.target.value.toUpperCase())
                    setError('')
                  }}
                  placeholder="Nhập mã lớp (VD: ABC123)"
                  error={error}
                  className="font-mono"
                />

                <Button
                  onClick={handleJoin}
                  isLoading={isLoading}
                  className="w-full"
                >
                  <Icon name="user-check" size={20} className="mr-2" />
                  Tham gia lớp
                </Button>
              </div>
            </Card>

            {/* Enrolled Classes */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Lớp đã tham gia ({enrolledClasses.length})
              </h2>

              {enrolledClasses.length === 0 ? (
                <Card className="text-center py-8">
                  <Icon name="users" size={48} color="inactive" className="mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bạn chưa tham gia lớp nào
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolledClasses.map(enrollment => (
                    <Card key={enrollment.id} variant="outlined">
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {enrollment.classes.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Giáo viên: {enrollment.classes.profiles.full_name || enrollment.classes.profiles.username}
                            </p>
                          </div>
                          <Badge variant="solid" color="success">
                            <Icon name="check" size={12} className="mr-1" />
                            Đã tham gia
                          </Badge>
                        </div>

                        {enrollment.classes.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {enrollment.classes.description}
                          </p>
                        )}

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Tham gia: {new Date(enrollment.joined_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

