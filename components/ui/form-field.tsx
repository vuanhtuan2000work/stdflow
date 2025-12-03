'use client'

import { Input } from './input'
import { cn } from '@/lib/utils/cn'
import { ComponentProps } from 'react'

type InputProps = ComponentProps<typeof Input>

interface FormFieldProps extends Omit<InputProps, 'label'> {
  label: string
  required?: boolean
  description?: string
}

export function FormField({ 
  label, 
  required, 
  description, 
  error, 
  helperText,
  className,
  ...inputProps 
}: FormFieldProps) {
  return (
    <div className={cn('w-full', className)}>
      <Input
        label={`${label}${required ? ' *' : ''}`}
        error={error}
        helperText={helperText || description}
        {...(inputProps as any)}
      />
    </div>
  )
}

