'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { StatsCard } from '@/components/ui/stats-card'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { toast } from 'react-hot-toast'
import type { Profile, EducationLevel } from '@/lib/types/database.types'
import { cn } from '@/lib/utils/cn'

interface ProfileClientProps {
  profile: Profile
  stats: {
    totalFlashcards: number
    totalSubjects: number
    totalSessions: number
  }
}

export function ProfileClient({ profile: initialProfile, stats }: ProfileClientProps) {
  const router = useRouter()
  const [profile, setProfile] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>(
    profile.education_level || ''
  )

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Unauthorized')
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim() || null,
          education_level: educationLevel || null,
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      setIsEditing(false)
      toast.success('Cập nhật hồ sơ thành công!')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav
          user={{
            id: profile.id,
            avatar_url: profile.avatar_url,
            full_name: profile.full_name,
            username: profile.username,
          }}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Hồ sơ
            </h1>

            {/* Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Avatar and Basic Info */}
              <Card className="lg:col-span-1">
                <div className="p-6 text-center">
                  <Avatar
                    src={profile.avatar_url}
                    name={profile.full_name || profile.username}
                    size={96}
                    className="mx-auto mb-4"
                  />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {profile.full_name || profile.username}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    @{profile.username}
                  </p>
                  {profile.study_streak > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Icon name="fire" size={20} color="active" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {profile.study_streak} ngày streak
                      </span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full"
                  >
                    <Icon name="edit" size={16} className="mr-2" />
                    {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
                  </Button>
                </div>
              </Card>

              {/* Stats */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                  icon="cards"
                  value={stats.totalFlashcards}
                  label="Tổng flashcards"
                />
                <StatsCard
                  icon="home"
                  value={stats.totalSubjects}
                  label="Môn học"
                />
                <StatsCard
                  icon="calendar"
                  value={stats.totalSessions}
                  label="Lần ôn tập"
                />
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <Card className="mb-8">
                <form onSubmit={handleUpdate} className="p-6 space-y-6">
                  <FormField
                    label="Họ và tên"
                    value={fullName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                    disabled={isLoading}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setIsEditing(false)
                        setFullName(profile.full_name || '')
                        setEducationLevel(profile.education_level || '')
                      }}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isLoading}
                      className="flex-1"
                    >
                      Lưu
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Additional Info */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Thông tin khác
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tổng thời gian học:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {Math.floor(profile.total_study_time_minutes / 60)} giờ{' '}
                      {profile.total_study_time_minutes % 60} phút
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ngày tham gia:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {new Date(profile.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Logout */}
            <div className="mt-8">
              <Button
                variant="danger"
                size="md"
                onClick={handleLogout}
                className="w-full md:w-auto"
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

