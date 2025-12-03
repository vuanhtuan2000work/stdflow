'use client'

import { cn } from '@/lib/utils/cn'
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'
import { Icon } from './icon'

export interface BaseInputProps {
  label?: string | React.ReactNode
  error?: string
  helperText?: string
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {
  variant?: 'text' | 'search'
}

interface TextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {
  variant: 'textarea'
}

interface SelectInputProps extends InputHTMLAttributes<HTMLSelectElement>, BaseInputProps {
  variant: 'dropdown'
  options: { value: string; label: string }[]
}

type InputProps = TextInputProps | TextareaInputProps | SelectInputProps

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputProps>(
  ({ className, label, error, helperText, variant = 'text', ...props }, ref) => {
    const baseInputClasses = cn(
      // Base styles - Mobile: 48px height, 16px font (prevent zoom), Desktop: 40px height, 14px font
      'flex w-full rounded-lg border bg-white dark:bg-gray-800',
      'h-12 md:h-10 px-4 text-base md:text-sm', // Mobile: 48px (h-12), Desktop: 40px (h-10)
      'text-gray-900 dark:text-white',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'border-gray-300 dark:border-gray-700',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Error state: 2px error-500, bg-error-50
      error && 'border-error-500 focus:ring-error-500 focus:border-error-500 bg-error-50 dark:bg-error-900/20',
      className
    )

    if (variant === 'textarea') {
      const textareaProps = props as TextareaInputProps
      return (
        <div className="flex flex-col w-full">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
              {label}
            </label>
          )}
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={cn(baseInputClasses, 'min-h-[120px] py-3 resize-none')}
            {...textareaProps}
          />
          {(error || helperText) && (
            <p className={cn('mt-1 text-sm', error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400')}>
              {error || helperText}
            </p>
          )}
        </div>
      )
    }

    if (variant === 'dropdown') {
      const selectProps = props as SelectInputProps
      return (
        <div className="flex flex-col w-full">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
              {label}
            </label>
          )}
          <div className="relative">
            <select
              ref={ref as React.ForwardedRef<HTMLSelectElement>}
              className={cn(baseInputClasses, 'appearance-none pr-10')}
              {...selectProps}
            >
              {selectProps.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Icon name="chevron-down" size={20} color="inactive" />
            </div>
          </div>
          {(error || helperText) && (
            <p className={cn('mt-1 text-sm', error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400')}>
              {error || helperText}
            </p>
          )}
        </div>
      )
    }

    const inputProps = props as TextInputProps
    const isSearch = variant === 'search'

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {isSearch && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Icon name="search" size={20} color="inactive" />
            </div>
          )}
          <input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            type="text"
            className={cn(baseInputClasses, isSearch && 'pl-10 pr-10')}
            {...inputProps}
          />
          {isSearch && inputProps.value && (
            <button
              type="button"
              onClick={() => {
                if (inputProps.onChange) {
                  const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>
                  inputProps.onChange(event)
                }
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              <Icon name="close" size={20} />
            </button>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn('mt-1 text-sm', error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

