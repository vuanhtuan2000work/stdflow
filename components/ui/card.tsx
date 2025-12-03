'use client'

import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hoverable' | 'pressable' | 'outlined'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl bg-white dark:bg-gray-800',
          
          // Mobile: Full-width (margin 0 16px), Padding: 16px, Border-radius: 12px, Shadow: 0 1px 2px rgba(0,0,0,0.05)
          'w-full mx-4 md:mx-0 p-4',
          // Desktop: Auto-width, Padding: 20px 24px, Shadow: 0 4px 6px rgba(0,0,0,0.1)
          'md:w-auto md:p-5 md:px-6',
          'shadow-card-mobile md:shadow-card-desktop',
          
          // Variants
          variant === 'hoverable' && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
          variant === 'pressable' && 'transition-all duration-150 active:scale-[0.98] cursor-pointer',
          variant === 'outlined' && 'border border-gray-200 dark:border-gray-700 shadow-none',
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

