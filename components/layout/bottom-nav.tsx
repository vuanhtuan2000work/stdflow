'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/flashcards', icon: 'cards', label: 'Flashcards' },
  { href: '/calendar', icon: 'calendar', label: 'Lịch' },
  { href: '/profile', icon: 'profile', label: 'Tôi' },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        // Mobile only (< 768px)
        'md:hidden',
        // Height: 64px + safe-area
        'h-16 pb-safe',
        // Border-top: 1px gray-200, Shadow: 0 -4px 6px rgba(0,0,0,0.05)
        'border-t border-gray-200 dark:border-gray-800',
        'shadow-[0_-4px_6px_rgba(0,0,0,0.05)]',
        // Fixed bottom
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white dark:bg-gray-900',
        // Flex layout
        'flex items-center justify-around'
      )}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              // Tap target: 64x64px min
              'flex flex-col items-center justify-center',
              'min-w-[64px] min-h-[64px]',
              'transition-colors',
              // Active: primary-500 text + icon, 4px top indicator
              isActive
                ? 'text-primary-500'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {/* Icon */}
            <div className="relative">
              <Icon
                name={item.icon}
                size={24}
                color={isActive ? 'active' : 'inactive'}
              />
              {/* 4px top indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
              )}
            </div>
            
            {/* Label */}
            <span className={cn(
              'text-xs mt-1',
              isActive ? 'font-medium' : 'font-normal'
            )}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}


