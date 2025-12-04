'use client'

import { cn } from '@/lib/utils/cn'
import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'outline' | 'dot'
  color?: 'primary' | 'success' | 'warning' | 'error' | 'gray'
  children: React.ReactNode
}

export function Badge({ 
  className, 
  variant = 'solid', 
  color = 'primary',
  children,
  ...props 
}: BadgeProps) {
  return (
    <div
      className={cn(
        // Base styles - Height: 24px, Padding: 4px 12px, Border-radius: 12px (pill), Font: 12px Medium
        'inline-flex items-center justify-center h-6 px-3 rounded-full text-xs font-medium',
        
        // Solid variant (colored bg, white text)
        variant === 'solid' && {
          'bg-primary-500 text-white': color === 'primary',
          'bg-success-500 text-white': color === 'success',
          'bg-warning-500 text-white': color === 'warning',
          'bg-error-500 text-white': color === 'error',
          'bg-gray-500 text-white': color === 'gray',
        },
        
        // Outline variant (transparent bg, gray text, border)
        variant === 'outline' && {
          'bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300': color === 'primary' || color === 'gray',
          'bg-transparent border border-primary-500 text-primary-500': color === 'primary',
          'bg-transparent border border-success-500 text-success-500': color === 'success',
          'bg-transparent border border-warning-500 text-warning-500': color === 'warning',
          'bg-transparent border border-error-500 text-error-500': color === 'error',
        },
        
        // Dot variant (8px colored circle + text)
        variant === 'dot' && 'gap-1.5',
        
        className
      )}
      {...props}
    >
      {variant === 'dot' && (
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            {
              'bg-primary-500': color === 'primary',
              'bg-success-500': color === 'success',
              'bg-warning-500': color === 'warning',
              'bg-error-500': color === 'error',
              'bg-gray-500': color === 'gray',
            }
          )}
        />
      )}
      {children}
    </div>
  )
}


