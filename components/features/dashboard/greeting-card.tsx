'use client'

import { Avatar } from '@/components/ui/avatar'
import { Icon } from '@/components/ui/icon'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface GreetingCardProps {
  user: {
    avatar_url?: string | null
    full_name?: string | null
    username: string
    study_streak: number
  }
}

export function GreetingCard({ user }: GreetingCardProps) {
  const greeting = getGreeting()
  const displayName = user.full_name || user.username

  return (
    <div className="mb-6">
      {/* Mobile: Gradient header */}
      <div className="md:hidden bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-xl mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatar_url}
              name={displayName}
              size={40}
            />
            <div>
              <h1 className="text-white text-lg font-bold">
                {greeting}, {displayName.split(' ')[0]} 👋
              </h1>
              {user.study_streak > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="fire" size={16} className="text-orange-300" />
                  <span className="text-white/90 text-sm">
                    {user.study_streak} ngày streak
                  </span>
                </div>
              )}
            </div>
          </div>
          <button className="p-2 text-white/90 hover:text-white">
            <Icon name="bell" size={24} />
          </button>
        </div>
      </div>

      {/* Desktop: Simple greeting */}
      <div className="hidden md:block mb-6">
        <h1 className="text-gray-900 dark:text-white text-3xl font-bold mb-2">
          {greeting}, {displayName.split(' ')[0]}!
        </h1>
        {user.study_streak > 0 && (
          <div className="flex items-center gap-2">
            <Icon name="fire" size={20} color="active" />
            <span className="text-gray-600 dark:text-gray-400">
              {user.study_streak} ngày streak
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Xin chào'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}


