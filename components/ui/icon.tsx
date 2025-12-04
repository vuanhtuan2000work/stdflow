'use client'

import { cn } from '@/lib/utils/cn'
import {
  Home,
  FileText,
  Calendar,
  User,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  ChevronDown,
  ArrowLeft,
  Bell,
  Flame,
  CheckCircle2,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react'

// Icon name mapping
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  cards: FileText,
  calendar: Calendar,
  profile: User,
  plus: Plus,
  edit: Edit,
  delete: Trash2,
  search: Search,
  close: X,
  'chevron-down': ChevronDown,
  'arrow-left': ArrowLeft,
  bell: Bell,
  fire: Flame,
  'check-circle': CheckCircle2,
  'alert-circle': AlertCircle,
}

interface IconProps {
  name: keyof typeof iconMap
  size?: 16 | 20 | 24 | 32 | 48
  className?: string
  color?: 'default' | 'inactive' | 'active'
}

export function Icon({ name, size = 24, className, color = 'default' }: IconProps) {
  const IconComponent = iconMap[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <IconComponent
      className={cn(
        // Base: SVG only format
        'flex-shrink-0',
        // Sizes: 16px | 20px | 24px | 32px | 48px
        {
          'h-4 w-4': size === 16,
          'h-5 w-5': size === 20,
          'h-6 w-6': size === 24,
          'h-8 w-8': size === 32,
          'h-12 w-12': size === 48,
        },
        // Colors: gray-900 (default) | gray-500 (inactive) | primary-500 (active)
        {
          'text-gray-900 dark:text-white': color === 'default',
          'text-gray-500 dark:text-gray-400': color === 'inactive',
          'text-primary-500': color === 'active',
        },
        className
      )}
    />
  )
}

// Export icon names for type safety
export type IconName = keyof typeof iconMap


