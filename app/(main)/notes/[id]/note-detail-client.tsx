'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { RichTextEditor } from '@/components/features/notes/rich-text-editor'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

interface Note {
  id: string
  title: string
  content: any
  tags: string[] | null
  subject_id: string | null
  created_at: string
  updated_at: string
  subjects?: {
    id: string
    name: string
    color: string
  }
}

interface Subject {
  id: string
  name: string
  color: string
}

interface NoteDetailClientProps {
  note: Note
  subjects: Subject[]
}

export function NoteDetailClient({ note, subjects }: NoteDetailClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [subjectId, setSubjectId] = useState(note.subject_id || '')
  const [tags, setTags] = useState<string[]>(note.tags || [])
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Tiêu đề không được để trống')
      return
    }

    try {
      setIsLoading(true)

      const { error } = await supabase
        .from('notes')
        .update({
          title: title.trim(),
          content,
          subject_id: subjectId || null,
          tags: tags.length > 0 ? tags : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', note.id)

      if (error) throw error

      toast.success('Cập nhật ghi chú thành công!')
      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(error.message || 'Không thể cập nhật. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa ghi chú này?')) return

    try {
      setIsDeleting(true)

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)

      if (error) throw error

      toast.success('Xóa ghi chú thành công!')
      router.push('/notes')
      router.refresh()
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Không thể xóa. Vui lòng thử lại.')
    } finally {
      setIsDeleting(false)
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
              <Button
                variant="ghost"
                onClick={() => router.back()}
              >
                <Icon name="arrow-left" size={20} className="mr-2" />
                Quay lại
              </Button>

              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Icon name="edit" size={20} className="mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleDelete}
                      isLoading={isDeleting}
                    >
                      <Icon name="delete" size={20} className="mr-2" />
                      Xóa
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setTitle(note.title)
                        setContent(note.content)
                        setSubjectId(note.subject_id || '')
                        setTags(note.tags || [])
                      }}
                      disabled={isLoading}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSave}
                      isLoading={isLoading}
                    >
                      Lưu
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <Card>
              <div className="p-4 md:p-6">
                {!isEditing ? (
                  <div className="space-y-6">
                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {note.title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-3 items-center text-sm text-gray-500 dark:text-gray-400">
                      {note.subjects && (
                        <Badge
                          style={{ 
                            backgroundColor: note.subjects.color,
                            color: 'white'
                          }}
                        >
                          <Icon name="home" size={14} className="mr-1" />
                          {note.subjects.name}
                        </Badge>
                      )}

                      <div className="flex items-center gap-1">
                        <Icon name="calendar" size={14} color="inactive" />
                        Cập nhật: {new Date(note.updated_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Title Edit */}
                    <FormField
                      label="Tiêu đề"
                      required
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    />

                    {/* Subject Edit */}
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

                    {/* Tags Edit */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags
                      </label>
                      
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

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
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

                    {/* Content Edit */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nội dung
                      </label>
                      <RichTextEditor
                        content={content}
                        onChange={setContent}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

