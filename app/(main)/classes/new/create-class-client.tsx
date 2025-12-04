'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export function CreateClassClient() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ name?: string }>({})

  const handleCreate = async () => {
    // Validation
    if (!name.trim()) {
      setErrors({ name: 'Tên lớp không được để trống' })
      return
    }

    try {
      setIsLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Generate class code using RPC
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_class_code')

      if (codeError) {
        // Fallback: generate code manually if RPC doesn't exist
        const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        const { error } = await supabase.from('classes').insert({
          teacher_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          class_code: fallbackCode,
          is_active: true,
        })

        if (error) throw error
      } else {
        const { error } = await supabase.from('classes').insert({
          teacher_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          class_code: codeData,
          is_active: true,
        })

        if (error) throw error
      }

      toast.success('Tạo lớp học thành công!')
      router.push('/classes')
      router.refresh()
    } catch (error: any) {
      console.error('Create error:', error)
      toast.error(error.message || 'Không thể tạo lớp học. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} isTeacher={true} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Tạo lớp học mới
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button onClick={handleCreate} isLoading={isLoading}>
                  Tạo lớp
                </Button>
              </div>
            </div>

            {/* Form */}
            <Card>
              <div className="p-4 md:p-6 space-y-6">
                <FormField
                  label="Tên lớp"
                  required
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value)
                    setErrors(prev => ({ ...prev, name: undefined }))
                  }}
                  placeholder="VD: Toán 12A1 - Ôn thi THPT"
                  error={errors.name}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mô tả
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả ngắn về lớp học (tùy chọn)"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-base md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    📌 Lưu ý:
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                    <li>Mã lớp sẽ được tạo tự động sau khi tạo lớp</li>
                    <li>Học sinh có thể tham gia lớp bằng mã lớp</li>
                    <li>Bạn có thể chia sẻ flashcards với toàn bộ lớp</li>
                    <li>Có thể theo dõi tiến độ học tập của học sinh</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

