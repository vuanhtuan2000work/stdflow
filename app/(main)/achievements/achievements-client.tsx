'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { ACHIEVEMENTS, Achievement } from '@/lib/types/achievements'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface AchievementsClientProps {
  stats: {
    streak: number
    totalSessions: number
    totalTime: number
    easyCount: number
    classesCreated: number
    flashcardsShared: number
  }
}

export function AchievementsClient({ stats }: AchievementsClientProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  // Calculate achievement progress
  const achievements = useMemo((): Achievement[] => {
    return ACHIEVEMENTS.map(achievement => {
      let currentProgress = 0

      switch (achievement.category) {
        case 'streak':
          currentProgress = stats.streak
          break
        case 'cards':
          currentProgress = stats.totalSessions
          break
        case 'time':
          currentProgress = stats.totalTime
          break
        case 'accuracy':
          currentProgress = stats.easyCount
          break
        case 'social':
          if (achievement.id === 'social_create_class') {
            currentProgress = stats.classesCreated
          } else if (achievement.id === 'social_share') {
            currentProgress = stats.flashcardsShared
          }
          break
      }

      const unlocked = currentProgress >= achievement.requirement

      return {
        ...achievement,
        currentProgress: Math.min(currentProgress, achievement.requirement),
        unlocked,
        unlockedAt: unlocked ? new Date().toISOString() : undefined,
      }
    })
  }, [stats])

  const filteredAchievements = useMemo(() => {
    if (filter === 'unlocked') return achievements.filter(a => a.unlocked)
    if (filter === 'locked') return achievements.filter(a => !a.unlocked)
    return achievements
  }, [achievements, filter])

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => {
    const points = {
      common: 10,
      rare: 25,
      epic: 50,
      legendary: 100,
    }
    return sum + points[a.rarity]
  }, 0)

  const rarityColors = {
    common: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    rare: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    epic: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
    legendary: 'bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300',
  }

  const rarityLabels = {
    common: 'Thường',
    rare: 'Hiếm',
    epic: 'Sử thi',
    legendary: 'Huyền thoại',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} isTeacher={false} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Thành tựu
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Hoàn thành thử thách để mở khóa huy hiệu
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center p-4">
                <Icon name="trophy" size={32} color="active" className="mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {unlockedCount}/{achievements.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Đã mở khóa</div>
              </Card>

              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary-500 mb-2">
                  {totalPoints}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Điểm thành tích</div>
              </Card>

              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-success-500 mb-2">
                  {Math.round((unlockedCount / achievements.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Hoàn thành</div>
              </Card>

              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-warning-500 mb-2">
                  {achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Huyền thoại</div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {(['all', 'unlocked', 'locked'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filter === f
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {f === 'all' && 'Tất cả'}
                  {f === 'unlocked' && 'Đã mở khóa'}
                  {f === 'locked' && 'Chưa mở'}
                </button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.map(achievement => (
                <Card
                  key={achievement.id}
                  className={cn(
                    'relative',
                    achievement.unlocked && 'ring-2 ring-success-500'
                  )}
                >
                  <div className="p-4 md:p-6 space-y-4">
                    {/* Rarity Badge */}
                    <Badge
                      className={cn(
                        'absolute top-4 right-4',
                        rarityColors[achievement.rarity]
                      )}
                    >
                      {rarityLabels[achievement.rarity]}
                    </Badge>

                    {/* Icon */}
                    <div className="relative">
                      <div
                        className={cn(
                          'text-6xl',
                          !achievement.unlocked && 'grayscale opacity-50'
                        )}
                      >
                        {achievement.icon}
                      </div>
                      {!achievement.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon name="alert-circle" size={32} color="inactive" />
                        </div>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>

                    {/* Progress */}
                    {achievement.unlocked ? (
                      <Badge variant="solid" color="success" className="w-full justify-center">
                        <Icon name="check-circle" size={16} className="mr-1" />
                        Đã mở khóa
                      </Badge>
                    ) : (
                      <div className="space-y-2">
                        <ProgressBar
                          value={(achievement.currentProgress / achievement.requirement) * 100}
                          showPercentage={false}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          {achievement.currentProgress} / {achievement.requirement}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

