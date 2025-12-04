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
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Bell,
  Flame,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Moon,
  Database,
  Camera,
  Settings,
  LogOut,
  BookOpen,
  BarChart3,
  Users,
  Share2,
  UserCheck,
  Copy,
  Check,
  UserX,
  TrendingUp,
  Clock,
  Target,
  Trophy,
  RefreshCw,
  WifiOff,
  Wifi,
  type LucideIcon,
} from 'lucide-react'

// Icon name mapping
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  cards: FileText,
  notes: BookOpen,
  calendar: Calendar,
  profile: User,
  plus: Plus,
  edit: Edit,
  delete: Trash2,
  search: Search,
  close: X,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'arrow-left': ArrowLeft,
  bell: Bell,
  fire: Flame,
  'check-circle': CheckCircle2,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  moon: Moon,
  database: Database,
  camera: Camera,
  settings: Settings,
  'log-out': LogOut,
  'bar-chart': BarChart3,
  statistics: BarChart3,
  users: Users,
  share: Share2,
  'user-check': UserCheck,
  copy: Copy,
  check: Check,
  'user-x': UserX,
  'trending-up': TrendingUp,
  clock: Clock,
  target: Target,
  trophy: Trophy,
  'refresh-cw': RefreshCw,
  'wifi-off': WifiOff,
  wifi: Wifi,
}

interface IconProps {
  name: keyof typeof iconMap
  size?: 16 | 20 | 24 | 32 | 48
  className?: string
  color?: 'default' | 'inactive' | 'active' | 'white' | 'error'
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
        // Colors: gray-900 (default) | gray-500 (inactive) | primary-500 (active) | white | error-500
        {
          'text-gray-900 dark:text-white': color === 'default',
          'text-gray-500 dark:text-gray-400': color === 'inactive',
          'text-primary-500': color === 'active',
          'text-white': color === 'white',
          'text-error-500': color === 'error',
        },
        className
      )}
    />
  )
}

// Export icon names for type safety
export type IconName = keyof typeof iconMap


