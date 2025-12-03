'use client'

import { GreetingCard } from '@/components/features/dashboard/greeting-card'
import { ReviewTodayCard } from '@/components/features/dashboard/review-today-card'
import { Heatmap } from '@/components/features/dashboard/heatmap'
import { StatsCard } from '@/components/ui/stats-card'
import { SubjectCard } from '@/components/ui/subject-card'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import type { Profile, Subject } from '@/lib/types/database.types'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/icon'

interface DashboardClientProps {
  user: Profile
  subjects: (Subject & { cardCount: number })[]
  dueCount: number
  totalCount: number
  heatmapData: { date: string; minutes: number }[]
}

export function DashboardClient({
  user,
  subjects,
  dueCount,
  totalCount,
  heatmapData,
}: DashboardClientProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Desktop only */}
      <Sidebar subjects={subjects} />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-60">
        {/* TopNav - Desktop only */}
        <TopNav
          user={{
            id: user.id,
            avatar_url: user.avatar_url,
            full_name: user.full_name,
            username: user.username,
          }}
        />

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {/* Greeting */}
            <GreetingCard user={user} />

            {/* Review Today Card */}
            <ReviewTodayCard dueCount={dueCount} totalCount={totalCount} />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <StatsCard
                icon="cards"
                value={totalCount}
                label="thẻ đã học"
              />
              <StatsCard
                icon="home"
                value={subjects.length}
                label="môn học"
              />
            </div>

            {/* Subjects List */}
            {subjects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-[22px] font-bold text-gray-900 dark:text-white mb-4 px-4 md:px-0">
                  Môn học của bạn
                </h2>
                <div className="flex overflow-x-auto gap-4 px-4 md:px-0 pb-2 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {subjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      name={subject.name}
                      color={subject.color}
                      icon={(subject.icon as any) || 'home'}
                      cardCount={subject.cardCount}
                      onClick={() => router.push(`/subjects/${subject.id}`)}
                    />
                  ))}
                  {/* Add Subject Button */}
                  <div
                    onClick={() => router.push('/subjects/new')}
                    className="flex items-center justify-center min-w-[200px] h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon name="plus" size={32} color="inactive" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Thêm môn
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Heatmap */}
            <div className="px-4 md:px-0">
              <Heatmap data={heatmapData} />
            </div>
          </div>
        </main>

        {/* BottomNav - Mobile only */}
        <BottomNav />
      </div>
    </div>
  )
}

