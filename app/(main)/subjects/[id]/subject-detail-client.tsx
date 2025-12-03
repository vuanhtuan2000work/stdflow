'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { toast } from 'react-hot-toast'
import type { Subject } from '@/lib/types/database.types'
import type { IconName } from '@/components/ui/icon'

const colors = [
  '#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#F97316', '#14B8A6', '#6366F1',
]

const icons: IconName[] = [
  'home', 'cards', 'calendar', 'profile', 'plus', 'edit',
  'search', 'bell', 'fire', 'check-circle', 'alert-circle',
]

interface SubjectDetailClientProps {
  subject: Subject
  flashcardCount: number
}

export function SubjectDetailClient({ subject: initialSubject, flashcardCount }: SubjectDetailClientProps) {
  const router = useRouter()
  const [subject, setSubject] = useState(initialSubject)
  const [name, setName] = useState(subject.name)
  const [color, setColor] = useState(subject.color)
  const [icon, setIcon] = useState<IconName>((subject.icon as IconName) || 'home')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Vui lòng nhập tên môn học')
      return
    }

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
        .from('subjects')
        .update({
          name: name.trim(),
          color,
          icon,
        })
        .eq('id', subject.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setSubject(data)
      setIsEditing(false)
      toast.success('Cập nhật môn học thành công!')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Unauthorized')
      }

      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subject.id)
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Xóa môn học thành công!')
      router.push('/subjects')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Xóa thất bại')
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[subject]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <Icon name="arrow-left" size={20} />
                <span>Quay lại</span>
              </button>
              
              {!isEditing ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <Icon
                        name={(subject.icon as IconName) || 'home'}
                        size={32}
                        color="active"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {subject.name}
                      </h1>
                      <p className="text-gray-500 dark:text-gray-400">
                        {flashcardCount} {flashcardCount === 1 ? 'flashcard' : 'flashcards'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setIsEditing(true)}
                    >
                      <Icon name="edit" size={20} className="mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Icon name="delete" size={20} className="mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <FormField
                    label="Tên môn học"
                    required
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    disabled={isLoading}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Màu sắc
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`
                            w-12 h-12 rounded-lg border-2 transition-all
                            ${color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-700'}
                          `}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Icon
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                      {icons.map((iconName) => (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setIcon(iconName)}
                          className={`
                            p-3 rounded-lg border-2 transition-all flex items-center justify-center
                            ${icon === iconName 
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                            }
                          `}
                        >
                          <Icon
                            name={iconName}
                            size={24}
                            color={icon === iconName ? 'active' : 'inactive'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setIsEditing(false)
                        setName(subject.name)
                        setColor(subject.color)
                        setIcon((subject.icon as IconName) || 'home')
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
              )}
            </div>

            {/* Flashcards list will go here */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Flashcards
                </h2>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push(`/flashcards/new?subject=${subject.id}`)}
                >
                  <Icon name="plus" size={20} className="mr-2" />
                  Thêm flashcard
                </Button>
              </div>
              {/* TODO: Add flashcards list */}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn có chắc chắn muốn xóa môn học "{subject.name}"? Tất cả flashcards trong môn học này cũng sẽ bị xóa.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleDelete}
                isLoading={isLoading}
                className="flex-1"
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

