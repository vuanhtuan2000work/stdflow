'use client'

import { cn } from '@/lib/utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Variants (from design tokens)
          {
            'bg-primary-500 text-white hover:bg-primary-600 shadow-sm': variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700': variant === 'secondary',
            'border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20': variant === 'outline',
            'bg-error-500 text-white hover:bg-error-600': variant === 'danger',
            'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20': variant === 'ghost',
          },
          
          // Sizes (from design spec: mobile 48px height, padding 12px 24px, desktop 40px height, padding 10px 20px)
          {
            'h-10 px-3 text-sm': size === 'sm',
            'h-12 md:h-10 px-6 md:px-5 text-base font-medium': size === 'md', // Mobile: 48px (h-12), Desktop: 40px (h-10)
            'h-14 md:h-12 px-8 md:px-6 text-base md:text-lg font-medium': size === 'lg',
          },
          
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Đang xử lý...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

