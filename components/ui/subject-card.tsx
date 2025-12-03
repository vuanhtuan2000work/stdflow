'use client'

import { Card } from './card'
import { Icon } from './icon'
import { cn } from '@/lib/utils/cn'
import type { IconName } from './icon'

interface SubjectCardProps {
  name: string
  color: string
  icon: IconName
  cardCount: number
  onClick?: () => void
  className?: string
}

export function SubjectCard({ name, color, icon, cardCount, onClick, className }: SubjectCardProps) {
  return (
    <Card
      variant="hoverable"
      onClick={onClick}
      className={cn(
        'relative overflow-hidden',
        // Mobile: Full-width horizontal, Desktop: Min-width 200px
        'md:min-w-[200px]',
        className
      )}
    >
      {/* 4px color bar left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: color }}
      />
      
      <div className="pl-4 flex items-center gap-3">
        {/* Icon */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon name={icon} size={24} className="text-gray-900 dark:text-white" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {cardCount} {cardCount === 1 ? 'flashcard' : 'flashcards'}
          </p>
        </div>
      </div>
    </Card>
  )
}

