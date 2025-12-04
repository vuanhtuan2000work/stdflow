'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { RichTextEditor } from '@/components/features/notes/rich-text-editor'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { Icon } from '@/components/ui/icon'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

interface Subject {
  id: string
  name: string
  color: string
}

interface CreateNoteClientProps {
  subjects: Subject[]
}

export function CreateNoteClient({ subjects }: CreateNoteClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subjectId, setSubjectId] = useState<string>('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSave = async () => {
    // Validation
    const newErrors: typeof errors = {}
    if (!title.trim()) newErrors.title = 'Tiêu đề không được để trống'
    if (!content.trim() || content === '<p></p>') newErrors.content = 'Nội dung không được để trống'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        title: title.trim(),
        content,
        subject_id: subjectId || null,
        tags: tags.length > 0 ? tags : null,
      })

      if (error) throw error

      toast.success('Tạo ghi chú thành công!')
      router.push('/notes')
      router.refresh()
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error.message || 'Không thể lưu ghi chú. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Tạo ghi chú mới
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  isLoading={isLoading}
                >
                  Lưu ghi chú
                </Button>
              </div>
            </div>

            {/* Form */}
            <Card>
              <div className="p-4 md:p-6 space-y-6">
                {/* Title */}
                <FormField
                  label="Tiêu đề"
                  required
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.target.value)
                    setErrors(prev => ({ ...prev, title: undefined }))
                  }}
                  placeholder="Nhập tiêu đề ghi chú..."
                  error={errors.title}
                />

                {/* Subject */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Môn học
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full h-12 md:h-10 px-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-base md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Không chọn môn</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags
                  </label>
                  
                  {/* Tag list */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map(tag => (
                        <div
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-primary-900 dark:hover:text-primary-100"
                          >
                            <Icon name="close" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tag input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập tag và nhấn Enter..."
                      className="flex-1 h-10 px-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                      size="sm"
                    >
                      Thêm
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nội dung <span className="text-error-500">*</span>
                  </label>
                  <RichTextEditor
                    content={content}
                    onChange={(newContent) => {
                      setContent(newContent)
                      setErrors(prev => ({ ...prev, content: undefined }))
                    }}
                    placeholder="Bắt đầu viết ghi chú của bạn..."
                  />
                  {errors.content && (
                    <p className="text-xs text-error-500">{errors.content}</p>
                  )}
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

