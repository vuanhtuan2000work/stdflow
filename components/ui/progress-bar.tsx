'use client'

import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  value: number // 0-100
  label?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressBar({ value, label, showPercentage = true, className }: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {/* Label + Percentage text (12px Medium) */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      {/* Progress bar */}
      <div className="relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        {/* Height: 8px (mobile), 6px (desktop), Border-radius: 4px full */}
        <div
          className={cn(
            'h-2 md:h-1.5 rounded-full transition-all duration-300',
            'bg-primary-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

