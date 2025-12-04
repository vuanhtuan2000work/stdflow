'use client'

import { cn } from '@/lib/utils/cn'
import { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        {
          'rounded-full': variant === 'circular',
          'rounded': variant === 'rectangular',
          'rounded-md h-4': variant === 'text',
        },
        className
      )}
      style={{ width, height }}
      {...props}
    />
  )
}

// Preset skeletons
export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
    </div>
  )
}

export function FlashcardSkeleton() {
  return (
    <div className="p-6 space-y-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton width={60} height={24} />
      </div>
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="70%" />
      <div className="flex gap-2 mt-4">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <Skeleton height={100} />
    </div>
  )
}


