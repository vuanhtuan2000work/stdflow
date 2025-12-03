'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import type { EducationLevel } from '@/lib/types/database.types'

export default function SetupProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, education_level')
        .eq('id', user.id)
        .single()

      if (profile?.username) {
        router.push('/dashboard')
        return
      }

      if (profile) {
        setFullName(profile.full_name || '')
        setEducationLevel(profile.education_level || '')
      }

      setIsChecking(false)
    }

    checkProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      toast.error('Vui lòng nhập tên người dùng')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Không tìm thấy người dùng')
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          full_name: fullName.trim() || null,
          education_level: educationLevel || null,
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Cập nhật hồ sơ thành công!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <h1 className="text-gray-900 dark:text-white text-[32px] font-bold text-center mb-2">
          Thiết lập hồ sơ
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base text-center mb-8">
          Hoàn tất thông tin để bắt đầu học tập
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên người dùng *"
            placeholder="Nhập tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />

          <Input
            label="Họ và tên"
            placeholder="Nhập họ và tên (tùy chọn)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
              Trình độ học vấn
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
              className="flex w-full rounded-lg border bg-white dark:bg-gray-800 h-12 md:h-10 px-4 text-base md:text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isLoading}
            >
              <option value="">Chọn trình độ</option>
              <option value="high_school">Trung học phổ thông</option>
              <option value="university">Đại học</option>
              <option value="working">Đang đi làm</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-8"
            isLoading={isLoading}
          >
            Hoàn tất
          </Button>
        </form>
      </div>
    </div>
  )
}

