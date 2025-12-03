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
import type { Subject } from '@/lib/types/database.types'

interface CreateFlashcardClientProps {
  subjects: Subject[]
  defaultSubjectId?: string
}

export function CreateFlashcardClient({ subjects, defaultSubjectId }: CreateFlashcardClientProps) {
  const router = useRouter()
  const [frontText, setFrontText] = useState('')
  const [backText, setBackText] = useState('')
  const [subjectId, setSubjectId] = useState(defaultSubjectId || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          user_id: user.id,
          subject_id: subjectId,
          front_text: frontText.trim(),
          back_text: backText.trim(),
          next_review_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Tạo flashcard thành công!')
      router.push(`/subjects/${subjectId}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Tạo flashcard thất bại')
    } finally {
      setIsLoading(false)
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
                Tạo Flashcard Mới
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Câu hỏi (Front) *"
                required
                variant="textarea"
                value={frontText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFrontText(e.target.value)}
                placeholder="Nhập câu hỏi..."
                disabled={isLoading}
                helperText={`${frontText.length}/500`}
              />

              <FormField
                label="Đáp án (Back) *"
                required
                variant="textarea"
                value={backText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBackText(e.target.value)}
                placeholder="Nhập đáp án..."
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
    </div>
  )
}

