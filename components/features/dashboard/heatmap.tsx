'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'

interface HeatmapData {
  date: string
  minutes: number
}

interface HeatmapProps {
  data: HeatmapData[]
  className?: string
}

export const Heatmap = memo(function Heatmap({ data, className }: HeatmapProps) {
  // Get last 7 days
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const getIntensity = (minutes: number) => {
    if (minutes >= 30) return 'high'
    if (minutes >= 15) return 'medium'
    if (minutes >= 5) return 'low'
    if (minutes > 0) return 'minimal'
    return 'none'
  }

  const getColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-primary-500'
      case 'medium':
        return 'bg-primary-300'
      case 'low':
        return 'bg-primary-100'
      case 'minimal':
        return 'bg-gray-100 dark:bg-gray-700'
      default:
        return 'bg-gray-50 dark:bg-gray-800'
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
        Hoạt động 7 ngày qua
      </h3>
      <div className="flex items-end gap-2">
        {last7Days.map((date, index) => {
          const dayData = data.find((d) => d.date === date)
          const minutes = dayData?.minutes || 0
          const intensity = getIntensity(minutes)

          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-full rounded',
                  // Cell: 32x32px (mobile), 24x24px (desktop)
                  'h-8 md:h-6',
                  getColor(intensity),
                  'transition-colors'
                )}
                title={`${new Date(date).toLocaleDateString('vi-VN')}: ${minutes} phút`}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {days[index]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
})


