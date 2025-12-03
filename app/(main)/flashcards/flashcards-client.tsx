'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/ui/search-bar'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { toast } from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { Flashcard, Subject } from '@/lib/types/database.types'
import { cn } from '@/lib/utils/cn'

interface FlashcardsClientProps {
  flashcards: (Flashcard & { subjects: Subject | null })[]
  subjects: Subject[]
  selectedSubjectId?: string
  searchQuery?: string
}

function FlashcardsContent({
  flashcards: initialFlashcards,
  subjects,
  selectedSubjectId,
  searchQuery: initialSearch,
}: FlashcardsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialSearch || '')
  const [selectedSubject, setSelectedSubject] = useState(selectedSubjectId || 'all')
  const [flashcards, setFlashcards] = useState(initialFlashcards)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.push(`/flashcards?${params.toString()}`)
  }

  const handleSubjectFilter = (subjectId: string) => {
    setSelectedSubject(subjectId)
    const params = new URLSearchParams(searchParams.toString())
    if (subjectId === 'all') {
      params.delete('subject')
    } else {
      params.set('subject', subjectId)
    }
    router.push(`/flashcards?${params.toString()}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa flashcard này?')) {
      return
    }

    setIsDeleting(id)

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
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setFlashcards(flashcards.filter((f) => f.id !== id))
      toast.success('Xóa flashcard thành công!')
    } catch (error: any) {
      toast.error(error.message || 'Xóa thất bại')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={subjects} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Flashcards
                </h1>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push('/flashcards/new')}
                >
                  <Icon name="plus" size={20} className="mr-2" />
                  Thêm flashcard
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Tìm kiếm flashcards..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={handleSearch}
                  />
                </div>
                <div className="md:w-64">
                  <Input
                    variant="dropdown"
                    label="Lọc theo môn"
                    value={selectedSubject}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleSubjectFilter(e.target.value)
                    }
                    options={[
                      { value: 'all', label: 'Tất cả môn' },
                      ...subjects.map((s) => ({ value: s.id, label: s.name })),
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Flashcards List */}
            {flashcards.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="cards" size={48} color="inactive" className="mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchQuery || selectedSubject !== 'all'
                    ? 'Không tìm thấy flashcard nào'
                    : 'Bạn chưa có flashcard nào'}
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push('/flashcards/new')}
                >
                  Tạo flashcard đầu tiên
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flashcards.map((flashcard) => (
                  <Card key={flashcard.id} variant="hoverable">
                    <div className="p-4">
                      {/* Subject badge */}
                      {flashcard.subjects && (
                        <div className="mb-3">
                          <span
                            className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: flashcard.subjects.color }}
                          >
                            {flashcard.subjects.name}
                          </span>
                        </div>
                      )}

                      {/* Front text */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Câu hỏi:
                        </p>
                        <p className="text-base font-medium text-gray-900 dark:text-white line-clamp-2">
                          {flashcard.front_text}
                        </p>
                      </div>

                      {/* Back text preview */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Đáp án:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {flashcard.back_text}
                        </p>
                      </div>

                      {/* Review info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span>
                          Ôn lại: {new Date(flashcard.next_review_date).toLocaleDateString('vi-VN')}
                        </span>
                        <span>Lần: {flashcard.review_count}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/flashcards/${flashcard.id}`)}
                          className="flex-1"
                        >
                          <Icon name="edit" size={16} className="mr-1" />
                          Sửa
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(flashcard.id)}
                          disabled={isDeleting === flashcard.id}
                          isLoading={isDeleting === flashcard.id}
                          className="flex-1"
                        >
                          <Icon name="delete" size={16} className="mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

export function FlashcardsClient(props: FlashcardsClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Sidebar subjects={props.subjects} />
        <div className="flex-1 flex flex-col lg:ml-60">
          <TopNav user={undefined} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
            <div className="max-w-7xl mx-auto">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </main>
          <BottomNav />
        </div>
      </div>
    }>
      <FlashcardsContent {...props} />
    </Suspense>
  )
}

