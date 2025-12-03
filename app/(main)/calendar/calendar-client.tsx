'use client'

import { useState } from 'react'
import { Heatmap } from '@/components/features/dashboard/heatmap'
import { StatsCard } from '@/components/ui/stats-card'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface CalendarClientProps {
  calendarData: [string, number][] // [date, count]
  heatmapData: { date: string; minutes: number }[]
}

export function CalendarClient({ calendarData, heatmapData }: CalendarClientProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Get current month dates
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const calendarMap = new Map(calendarData)

  const getDateString = (day: number) => {
    const date = new Date(year, month, day)
    return date.toISOString().split('T')[0]
  }

  const getDueCount = (day: number) => {
    const dateStr = getDateString(day)
    return calendarMap.get(dateStr) || 0
  }

  const isToday = (day: number) => {
    const dateStr = getDateString(day)
    const todayStr = today.toISOString().split('T')[0]
    return dateStr === todayStr
  }

  const isPast = (day: number) => {
    const dateStr = getDateString(day)
    return dateStr < today.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Lịch học tập
            </h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatsCard
                icon="calendar"
                value={calendarData.reduce((sum, [, count]) => sum + count, 0)}
                label="Thẻ cần ôn tập"
              />
              <StatsCard
                icon="fire"
                value={heatmapData.filter((d) => d.minutes > 0).length}
                label="Ngày đã học"
              />
              <StatsCard
                icon="cards"
                value={heatmapData.reduce((sum, d) => sum + d.minutes, 0)}
                label="Thẻ đã học (30 ngày)"
              />
            </div>

            {/* Calendar Grid */}
            <Card className="mb-8">
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {today.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </h2>
                
                {/* Day labels */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Days of month */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1
                    const dueCount = getDueCount(day)
                    const dateStr = getDateString(day)

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(selectedDate === dateStr ? null : dateStr)}
                        className={cn(
                          'aspect-square rounded-lg border-2 transition-all',
                          'flex flex-col items-center justify-center',
                          isToday(day) && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20',
                          !isToday(day) && isPast(day) && 'border-gray-300 dark:border-gray-700',
                          !isToday(day) && !isPast(day) && 'border-gray-200 dark:border-gray-800',
                          selectedDate === dateStr && 'ring-2 ring-primary-500',
                          dueCount > 0 && 'bg-primary-100 dark:bg-primary-900/30'
                        )}
                      >
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isToday(day)
                              ? 'text-primary-500'
                              : 'text-gray-700 dark:text-gray-300'
                          )}
                        >
                          {day}
                        </span>
                        {dueCount > 0 && (
                          <span className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                            {dueCount}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </Card>

            {/* Heatmap */}
            <div className="mb-8">
              <Heatmap data={heatmapData} />
            </div>

            {/* Selected date details */}
            {selectedDate && (
              <Card>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {new Date(selectedDate).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {calendarMap.get(selectedDate) || 0} thẻ cần ôn tập
                  </p>
                </div>
              </Card>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

