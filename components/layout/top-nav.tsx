'use client'

import Link from 'next/link'
import { SearchBar } from '@/components/ui/search-bar'
import { Icon } from '@/components/ui/icon'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils/cn'

interface TopNavProps {
  user?: {
    id: string
    avatar_url?: string | null
    full_name?: string | null
    username?: string
  }
}

export function TopNav({ user }: TopNavProps) {
  return (
    <nav
      className={cn(
        // Desktop only (≥ 1024px)
        'hidden lg:flex',
        // Height: 64px, Padding: 0 24px
        'h-16 px-6',
        // Border-bottom: 1px gray-200
        'border-b border-gray-200 dark:border-gray-800',
        // Position: sticky top-0
        'sticky top-0 z-40',
        // Background: white
        'bg-white dark:bg-gray-900',
        // Flex layout
        'items-center justify-between gap-4'
      )}
    >
      {/* Left: Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
        <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">SF</span>
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          StudyFlow
        </span>
      </Link>

      {/* Center: Search */}
      <div className="flex-1 max-w-md">
        <SearchBar placeholder="Tìm kiếm..." />
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <Icon name="bell" size={24} color="inactive" />
          {/* Notification badge */}
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error-500" />
        </button>

        {/* Profile Avatar */}
        <Link href="/profile">
          <Avatar
            src={user?.avatar_url}
            name={user?.full_name || user?.username}
            size={40}
          />
        </Link>
      </div>
    </nav>
  )
}


