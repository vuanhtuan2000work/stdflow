'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SearchBar } from '@/components/ui/search-bar'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { cn } from '@/lib/utils/cn'

interface Flashcard {
  id: string
  front_text: string
  back_text: string
  subjects: {
    id: string
    name: string
    color: string
  } | null
}

interface ShareFlashcardsClientProps {
  classId: string
  className: string
  flashcards: Flashcard[]
  sharedIds: Set<string>
}

export function ShareFlashcardsClient({
  classId,
  className,
  flashcards,
  sharedIds,
}: ShareFlashcardsClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSharing, setIsSharing] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  // Filter flashcards
  const filteredFlashcards = useMemo(() => {
    return flashcards.filter(card => {
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase()
        return (
          card.front_text.toLowerCase().includes(searchLower) ||
          card.back_text.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [flashcards, debouncedSearch])

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = () => {
    const availableCards = filteredFlashcards.filter(f => !sharedIds.has(f.id))
    if (selectedIds.size === availableCards.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(availableCards.map(f => f.id)))
    }
  }

  const handleShare = async () => {
    if (selectedIds.size === 0) {
      toast.error('Vui lòng chọn ít nhất 1 flashcard')
      return
    }

    try {
      setIsSharing(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Insert shared flashcards
      const shareBatch = Array.from(selectedIds).map(flashcardId => ({
        flashcard_id: flashcardId,
        class_id: classId,
        shared_by: user.id,
      }))

      const { error } = await supabase
        .from('shared_flashcards')
        .insert(shareBatch)

      if (error) throw error

      toast.success(`Đã chia sẻ ${selectedIds.size} flashcards!`)
      router.push(`/classes/${classId}`)
      router.refresh()
    } catch (error: any) {
      console.error('Share error:', error)
      toast.error(error.message || 'Không thể chia sẻ flashcards. Vui lòng thử lại.')
    } finally {
      setIsSharing(false)
    }
  }

  const availableCards = filteredFlashcards.filter(f => !sharedIds.has(f.id))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} isTeacher={true} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <Button variant="ghost" onClick={() => router.back()}>
                  <Icon name="arrow-left" size={20} className="mr-2" />
                  Quay lại
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  Chia sẻ flashcards
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lớp: {className}
                </p>
              </div>
              <Button
                onClick={handleShare}
                isLoading={isSharing}
                disabled={selectedIds.size === 0}
              >
                <Icon name="share" size={20} className="mr-2" />
                Chia sẻ ({selectedIds.size})
              </Button>
            </div>

            {/* Search & Select All */}
            <Card>
              <div className="p-4 md:p-6 space-y-4">
                <SearchBar
                  placeholder="Tìm kiếm flashcards..."
                  value={searchQuery}
                  onChange={(value) => setSearchQuery(value)}
                />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredFlashcards.length} flashcards ({availableCards.length} có thể chia sẻ)
                  </p>
                  {availableCards.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedIds.size === availableCards.length
                        ? 'Bỏ chọn tất cả'
                        : 'Chọn tất cả'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Flashcards List */}
            {filteredFlashcards.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Không tìm thấy flashcard nào</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFlashcards.map(card => {
                  const isSelected = selectedIds.has(card.id)
                  const isAlreadyShared = sharedIds.has(card.id)

                  return (
                    <Card
                      key={card.id}
                      className={cn(
                        'relative cursor-pointer transition-all',
                        isSelected && 'ring-2 ring-primary-500',
                        isAlreadyShared && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => !isAlreadyShared && handleToggleSelect(card.id)}
                    >
                      {/* Checkbox */}
                      <div className="absolute top-4 right-4">
                        {isAlreadyShared ? (
                          <Badge variant="solid" color="success">
                            <Icon name="check" size={12} className="mr-1" />
                            Đã chia sẻ
                          </Badge>
                        ) : (
                          <div
                            className={cn(
                              'w-6 h-6 rounded border-2 flex items-center justify-center',
                              isSelected
                                ? 'bg-primary-500 border-primary-500'
                                : 'border-gray-300 dark:border-gray-700'
                            )}
                          >
                            {isSelected && <Icon name="check" size={16} color="white" />}
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-3 pr-10">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {card.front_text}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {card.back_text}
                          </p>
                        </div>

                        {card.subjects && (
                          <Badge
                            style={{
                              backgroundColor: card.subjects.color,
                              color: 'white'
                            }}
                          >
                            {card.subjects.name}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

