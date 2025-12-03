'use client'

import { Input } from './input'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { cn } from '@/lib/utils/cn'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
  debounceMs?: number
}

export function SearchBar({ 
  placeholder = 'Tìm kiếm...', 
  value: controlledValue,
  onChange,
  onSearch,
  className,
  debounceMs = 300
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('')
  const value = controlledValue ?? internalValue

  const debouncedOnSearch = useDebouncedCallback(
    (searchValue: string) => {
      if (onSearch) {
        onSearch(searchValue)
      }
    },
    debounceMs
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (onChange) {
      onChange(newValue)
    } else {
      setInternalValue(newValue)
    }
    // Debounce search callback
    debouncedOnSearch(newValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <Input
        variant="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={cn(
          // Mobile: Full-width, 48px height
          'w-full',
          // Desktop: Max-width 400px, 40px height
          'md:max-w-[400px]'
        )}
      />
    </form>
  )
}

