'use client'

import { cn } from '@/lib/utils/cn'
import { User } from 'lucide-react'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: 24 | 32 | 40 | 64 | 96
  className?: string
}

export function Avatar({ src, alt, name, size = 40, className }: AvatarProps) {
  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const sizeClasses = {
    24: 'h-6 w-6 text-xs',
    32: 'h-8 w-8 text-sm',
    40: 'h-10 w-10 text-base',
    64: 'h-16 w-16 text-xl',
    96: 'h-24 w-24 text-2xl',
  }

  // With image: display photo
  if (src) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-full flex-shrink-0',
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={src}
          alt={alt || name || 'Avatar'}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      </div>
    )
  }

  // Placeholder: initials on primary-500
  if (name) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center flex-shrink-0',
          'bg-primary-500 text-white font-medium',
          sizeClasses[size],
          className
        )}
      >
        {getInitials(name)}
      </div>
    )
  }

  // Empty: user icon on gray-200
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0',
        'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
        sizeClasses[size],
        className
      )}
    >
      <User className={cn(
        {
          'h-3 w-3': size === 24,
          'h-4 w-4': size === 32,
          'h-5 w-5': size === 40,
          'h-6 w-6': size === 64,
          'h-8 w-8': size === 96,
        }
      )} />
    </div>
  )
}

