'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { useState, useMemo } from 'react'
import { Flashcard } from '@/lib/types/database.types'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils/cn'

interface CalendarClientProps {
  flashcards: Flashcard[]
}

export function CalendarClient({ flashcards }: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  // Group flashcards by date
  const flashcardsByDate = useMemo(() => {
    const grouped = new Map<string, Flashcard[]>()

    flashcards.forEach(card => {
      const dateKey = format(new Date(card.next_review_date), 'yyyy-MM-dd')
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(card)
    })

    return grouped
  }, [flashcards])

  // Get flashcards for selected date
  const selectedFlashcards = useMemo(() => {
    if (!selectedDate) return []
    const dateKey = format(selectedDate, 'yyyy-MM-dd')
    return flashcardsByDate.get(dateKey) || []
  }, [selectedDate, flashcardsByDate])

  // Get first day of month for padding
  const firstDayOfMonth = startOfMonth(currentDate)
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Lịch ôn tập
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-2">
                <div className="p-4 md:p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {format(currentDate, 'MMMM yyyy', { locale: vi })}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Tháng trước"
                      >
                        <Icon name="chevron-left" size={20} />
                      </button>
                      <button
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Tháng sau"
                      >
                        <Icon name="chevron-right" size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Calendar days */}
                    {calendarDays.map(day => {
                      const dateKey = format(day, 'yyyy-MM-dd')
                      const cardsCount = flashcardsByDate.get(dateKey)?.length || 0
                      const isSelected = selectedDate && isSameDay(day, selectedDate)
                      const isTodayDate = isToday(day)

                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            'relative aspect-square p-2 rounded-lg text-sm transition-colors',
                            isSelected 
                              ? 'bg-primary-500 text-white' 
                              : isTodayDate 
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-500 font-semibold' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          )}
                        >
                          <span>{format(day, 'd')}</span>
                          {cardsCount > 0 && (
                            <div className={cn(
                              'absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full',
                              isSelected ? 'bg-white' : 'bg-primary-500'
                            )} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Card>

              {/* Flashcards list */}
              <Card>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {selectedDate 
                      ? format(selectedDate, 'd MMMM yyyy', { locale: vi })
                      : 'Chọn một ngày'
                    }
                  </h3>

                  {selectedDate ? (
                    selectedFlashcards.length > 0 ? (
                      <div className="space-y-3">
                        {selectedFlashcards.map(card => (
                          <div
                            key={card.id}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {card.front_text}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Ôn lần {card.review_count + 1}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Không có flashcard nào cần ôn trong ngày này
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chọn một ngày trên lịch để xem flashcards cần ôn tập
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}


