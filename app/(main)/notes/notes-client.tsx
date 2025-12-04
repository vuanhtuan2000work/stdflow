'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SearchBar } from '@/components/ui/search-bar'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { cn } from '@/lib/utils/cn'

interface Note {
  id: string
  title: string
  content: any
  tags: string[]
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

interface NotesClientProps {
  notes: Note[]
  subjects: Subject[]
}

export function NotesClient({ notes, subjects }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const debouncedSearch = useDebounce(searchQuery, 300)

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    notes.forEach(note => {
      note.tags?.forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  }, [notes])

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase()
        const matchesTitle = note.title.toLowerCase().includes(searchLower)
        const matchesTags = note.tags?.some(tag => 
          tag.toLowerCase().includes(searchLower)
        )
        if (!matchesTitle && !matchesTags) return false
      }

      // Subject filter
      if (selectedSubject !== 'all' && note.subjects?.id !== selectedSubject) {
        return false
      }

      // Tag filter
      if (selectedTag !== 'all' && !note.tags?.includes(selectedTag)) {
        return false
      }

      return true
    })
  }, [notes, debouncedSearch, selectedSubject, selectedTag])

  // Strip HTML tags for preview
  const getTextPreview = (content: any): string => {
    if (typeof content === 'string') {
      const text = content.replace(/<[^>]*>/g, '')
      return text.slice(0, 150) + (text.length > 150 ? '...' : '')
    }
    return ''
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Ghi chú
              </h1>
              <Link href="/notes/new">
                <Button>
                  <Icon name="plus" size={20} className="mr-2" />
                  Tạo ghi chú mới
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <Card>
              <div className="p-4 md:p-6 space-y-4">
                {/* Search */}
                <SearchBar
                  placeholder="Tìm kiếm ghi chú..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                />

                {/* Subject filter */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedSubject('all')}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                      selectedSubject === 'all'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                  >
                    Tất cả môn
                  </button>
                  {subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                        selectedSubject === subject.id
                          ? 'text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                      style={{
                        backgroundColor: selectedSubject === subject.id ? subject.color : undefined
                      }}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>

                {/* Tag filter */}
                {allTags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedTag('all')}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                        selectedTag === 'all'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                    >
                      Tất cả tags
                    </button>
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                          selectedTag === tag
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <Card className="text-center py-12">
                <Icon name="cards" size={48} color="inactive" className="mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchQuery || selectedSubject !== 'all' || selectedTag !== 'all'
                    ? 'Không tìm thấy ghi chú nào'
                    : 'Chưa có ghi chú nào. Tạo ghi chú đầu tiên của bạn!'}
                </p>
                {!searchQuery && selectedSubject === 'all' && selectedTag === 'all' && (
                  <Link href="/notes/new">
                    <Button>
                      <Icon name="plus" size={20} className="mr-2" />
                      Tạo ghi chú
                    </Button>
                  </Link>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map(note => (
                  <Link key={note.id} href={`/notes/${note.id}`}>
                    <Card variant="hoverable" className="h-full">
                      <div className="space-y-3">
                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {note.title}
                        </h3>

                        {/* Preview */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                          {getTextPreview(note.content)}
                        </p>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 dark:text-gray-400">
                          {note.subjects && (
                            <Badge
                              variant="outline"
                              style={{ 
                                borderColor: note.subjects.color,
                                color: note.subjects.color 
                              }}
                            >
                              <Icon name="home" size={12} className="mr-1" />
                              {note.subjects.name}
                            </Badge>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <Icon name="calendar" size={12} color="inactive" />
                            {new Date(note.updated_at).toLocaleDateString('vi-VN')}
                          </div>
                        </div>

                        {/* Tags */}
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map(tag => (
                              <Badge key={tag} variant="outline">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
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

