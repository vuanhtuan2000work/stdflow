'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils/cn'
import type { Subject } from '@/lib/types/database.types'

interface SidebarProps {
  subjects?: Subject[]
}

const mainNavItems = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/flashcards', icon: 'cards', label: 'Flashcards' },
  { href: '/calendar', icon: 'calendar', label: 'Lịch' },
  { href: '/profile', icon: 'profile', label: 'Tôi' },
] as const

export function Sidebar({ subjects = [] }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        // Desktop only (≥ 1024px)
        'hidden lg:block',
        // Width: 240px fixed
        'w-60 fixed left-0 top-0 bottom-0',
        // Background: gray-50
        'bg-gray-50 dark:bg-gray-900',
        // Border-right: 1px gray-200
        'border-r border-gray-200 dark:border-gray-800',
        // Padding: 24px 16px
        'p-6 px-4',
        // Overflow
        'overflow-y-auto'
      )}
    >
      {/* Main Navigation */}
      <nav className="space-y-1 mb-6">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                // Item: 40px height, padding 8px 12px
                'flex items-center gap-3 h-10 px-3 rounded-lg',
                'transition-colors',
                // Hover: bg-gray-100
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                // Active: bg-primary-50, left-border 4px
                isActive && 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 pl-2'
              )}
            >
              <Icon
                name={item.icon}
                size={20}
                color={isActive ? 'active' : 'inactive'}
              />
              <span className={cn(
                'text-sm font-medium',
                isActive
                  ? 'text-primary-500'
                  : 'text-gray-700 dark:text-gray-300'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-800 my-4" />

      {/* Subjects Section */}
      <div>
        <div className="px-3 mb-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Môn học
          </h3>
        </div>
        
        {/* Add Subject Button */}
        <Link
          href="/subjects/new"
          className={cn(
            'flex items-center gap-3 h-10 px-3 rounded-lg',
            'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
            'transition-colors'
          )}
        >
          <Icon name="plus" size={20} color="active" />
          <span className="text-sm font-medium">Thêm môn</span>
        </Link>

        {/* Subjects List */}
        <nav className="mt-2 space-y-1">
          {subjects.map((subject) => {
            const isActive = pathname === `/subjects/${subject.id}`
            
            return (
              <Link
                key={subject.id}
                href={`/subjects/${subject.id}`}
                className={cn(
                  'flex items-center gap-3 h-10 px-3 rounded-lg',
                  'transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  isActive && 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 pl-2'
                )}
              >
                {/* Color indicator */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: subject.color }}
                />
                <span className={cn(
                  'text-sm font-medium truncate',
                  isActive
                    ? 'text-primary-500'
                    : 'text-gray-700 dark:text-gray-300'
                )}>
                  {subject.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}


