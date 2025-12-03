'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { SubjectCard } from '@/components/ui/subject-card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { SearchBar } from '@/components/ui/search-bar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import type { Subject } from '@/lib/types/database.types'

interface SubjectsClientProps {
  subjects: (Subject & { cardCount: number })[]
}

export function SubjectsClient({ subjects: initialSubjects }: SubjectsClientProps) {
  const router = useRouter()
  const [subjects] = useState(initialSubjects)
  const [searchQuery, setSearchQuery] = useState('')

  // Memoize filtered subjects
  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects
    const query = searchQuery.toLowerCase()
    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(query) ||
        subject.color.toLowerCase().includes(query)
    )
  }, [subjects, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={subjects} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Môn học
              </h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SearchBar
                  placeholder="Tìm kiếm môn học..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="flex-1 sm:flex-initial"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push('/subjects/new')}
                >
                  <Icon name="plus" size={20} className="mr-2" />
                  Thêm môn
                </Button>
              </div>
            </div>

            {filteredSubjects.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="home" size={48} color="inactive" className="mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Bạn chưa có môn học nào
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push('/subjects/new')}
                >
                  Tạo môn học đầu tiên
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    name={subject.name}
                    color={subject.color}
                    icon={(subject.icon as any) || 'home'}
                    cardCount={subject.cardCount}
                    onClick={() => router.push(`/subjects/${subject.id}`)}
                  />
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

