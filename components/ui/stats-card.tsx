'use client'

import { Card } from './card'
import { Icon } from './icon'
import { cn } from '@/lib/utils/cn'
import type { IconName } from './icon'

interface StatsCardProps {
  icon: IconName
  value: string | number
  label: string
  className?: string
  gradient?: boolean
}

export function StatsCard({ icon, value, label, className, gradient }: StatsCardProps) {
  return (
    <Card
      className={cn(
        // Padding: 16px, Border-radius: 12px
        'p-4',
        // Background: white or gradient
        gradient && 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white',
        className
      )}
    >
      {/* Icon 32px */}
      <div className="mb-3">
        <Icon 
          name={icon} 
          size={32} 
          color={gradient ? 'default' : 'active'}
          className={gradient ? 'text-white' : ''}
        />
      </div>
      
      {/* Value: 32px Bold */}
      <div className={cn(
        'text-[32px] font-bold mb-1',
        gradient ? 'text-white' : 'text-gray-900 dark:text-white'
      )}>
        {value}
      </div>
      
      {/* Label: 14px Regular gray-500 */}
      <div className={cn(
        'text-sm font-normal',
        gradient ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
      )}>
        {label}
      </div>
    </Card>
  )
}


