'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { toast } from 'react-hot-toast'
import type { Flashcard, Subject } from '@/lib/types/database.types'

interface EditFlashcardClientProps {
  flashcard: Flashcard & { subjects: Subject | null }
  subjects: Subject[]
}

export function EditFlashcardClient({ flashcard: initialFlashcard, subjects }: EditFlashcardClientProps) {
  const router = useRouter()
  const [frontText, setFrontText] = useState(initialFlashcard.front_text)
  const [backText, setBackText] = useState(initialFlashcard.back_text)
  const [subjectId, setSubjectId] = useState(initialFlashcard.subject_id || '')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!frontText.trim()) {
      toast.error('Vui lòng nhập câu hỏi')
      return
    }

    if (!backText.trim()) {
      toast.error('Vui lòng nhập đáp án')
      return
    }

    if (!subjectId) {
      toast.error('Vui lòng chọn môn học')
      return
    }

    if (frontText.length > 500) {
      toast.error('Câu hỏi không được quá 500 ký tự')
      return
    }

    if (backText.length > 500) {
      toast.error('Đáp án không được quá 500 ký tự')
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

      const { error } = await supabase
        .from('flashcards')
        .update({
          front_text: frontText.trim(),
          back_text: backText.trim(),
          subject_id: subjectId,
        })
        .eq('id', initialFlashcard.id)
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Cập nhật flashcard thành công!')
      router.push(`/subjects/${subjectId}`)
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
        .from('flashcards')
        .delete()
        .eq('id', initialFlashcard.id)
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Xóa flashcard thành công!')
      router.push('/flashcards')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Xóa thất bại')
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={subjects} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <Icon name="arrow-left" size={20} />
                <span>Quay lại</span>
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Chỉnh sửa Flashcard
              </h1>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <FormField
                label="Câu hỏi (Front) *"
                required
                variant="textarea"
                value={frontText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFrontText(e.target.value)}
                disabled={isLoading}
                helperText={`${frontText.length}/500`}
              />

              <FormField
                label="Đáp án (Back) *"
                required
                variant="textarea"
                value={backText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBackText(e.target.value)}
                disabled={isLoading}
                helperText={`${backText.length}/500`}
              />

              <Input
                label="Môn học *"
                variant="dropdown"
                value={subjectId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubjectId(e.target.value)}
                disabled={isLoading}
                options={[
                  { value: '', label: 'Chọn môn học' },
                  ...subjects.map((s) => ({ value: s.id, label: s.name })),
                ]}
                error={!subjectId ? 'Vui lòng chọn môn học' : undefined}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Icon name="delete" size={20} className="mr-2" />
                  Xóa
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => router.back()}
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
              Bạn có chắc chắn muốn xóa flashcard này?
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

