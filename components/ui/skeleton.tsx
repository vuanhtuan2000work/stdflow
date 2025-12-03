'use client'

import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        {
          'rounded-lg': variant === 'rectangular',
          'rounded-full': variant === 'circular',
          'rounded': variant === 'text',
        },
        className
      )}
    />
  )
}

