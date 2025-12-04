'use client'

import { Card } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { Profile } from '@/lib/types/database.types'
import { useMemo, useState } from 'react'
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from 'date-fns'
import { cn } from '@/lib/utils/cn'

interface Subject {
  id: string
  name: string
  color: string
}

interface StudySession {
  id: string
  rating: 'hard' | 'medium' | 'easy'
  studied_at: string
  flashcards?: {
    subject_id: string | null
  }
}

interface RatingStat {
  rating: 'hard' | 'medium' | 'easy'
}

interface SubjectSession {
  rating: 'hard' | 'medium' | 'easy'
  flashcards: {
    subject_id: string | null
    subjects: {
      id: string
      name: string
      color: string
    } | null
  } | null
}

interface StatisticsClientProps {
  profile: Profile
  subjects: Subject[]
  totalCards: number
  totalSessions: number
  recentSessions: StudySession[]
  ratingStats: RatingStat[]
  subjectSessions: SubjectSession[]
}

export function StatisticsClient({
  profile,
  subjects,
  totalCards,
  totalSessions,
  recentSessions,
  ratingStats,
  subjectSessions,
}: StatisticsClientProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Calculate daily study data
  const dailyStudyData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const startDate = subDays(new Date(), days - 1)
    const dateRange = eachDayOfInterval({ start: startDate, end: new Date() })

    const sessionsByDate = new Map<string, number>()
    recentSessions.forEach(session => {
      const dateKey = format(startOfDay(parseISO(session.studied_at)), 'yyyy-MM-dd')
      sessionsByDate.set(dateKey, (sessionsByDate.get(dateKey) || 0) + 1)
    })

    return dateRange.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd')
      return {
        date: format(date, 'dd/MM'),
        fullDate: dateKey,
        count: sessionsByDate.get(dateKey) || 0,
      }
    })
  }, [recentSessions, timeRange])

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const distribution = {
      hard: 0,
      medium: 0,
      easy: 0,
    }

    ratingStats.forEach(stat => {
      distribution[stat.rating]++
    })

    return [
      { name: 'Khó', value: distribution.hard, color: '#EF4444' },
      { name: 'Trung bình', value: distribution.medium, color: '#F59E0B' },
      { name: 'Dễ', value: distribution.easy, color: '#10B981' },
    ]
  }, [ratingStats])

  // Calculate subject performance
  const subjectPerformance = useMemo(() => {
    const performance = new Map<string, { 
      name: string
      color: string
      total: number
      hard: number
      medium: number
      easy: number
    }>()

    subjectSessions.forEach(session => {
      if (!session.flashcards?.subjects) return

      const subject = session.flashcards.subjects

      if (!performance.has(subject.id)) {
        performance.set(subject.id, {
          name: subject.name,
          color: subject.color,
          total: 0,
          hard: 0,
          medium: 0,
          easy: 0,
        })
      }

      const stats = performance.get(subject.id)!
      stats.total++
      stats[session.rating]++
    })

    return Array.from(performance.values()).map(stats => ({
      name: stats.name,
      color: stats.color,
      total: stats.total,
      accuracy: stats.total > 0 ? Math.round(((stats.easy + stats.medium * 0.5) / stats.total) * 100) : 0,
    }))
  }, [subjectSessions])

  // Calculate weekly comparison
  const weeklyComparison = useMemo(() => {
    const thisWeekStart = subDays(new Date(), 7)
    const lastWeekStart = subDays(new Date(), 14)

    const thisWeek = recentSessions.filter(s => 
      parseISO(s.studied_at) >= thisWeekStart
    ).length

    const lastWeek = recentSessions.filter(s => {
      const date = parseISO(s.studied_at)
      return date >= lastWeekStart && date < thisWeekStart
    }).length

    const change = lastWeek > 0 
      ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
      : thisWeek > 0 ? 100 : 0

    return { thisWeek, lastWeek, change }
  }, [recentSessions])

  // Calculate average accuracy
  const averageAccuracy = useMemo(() => {
    if (ratingStats.length === 0) return 0

    const scores = {
      hard: 0.3,
      medium: 0.7,
      easy: 1.0,
    }

    const totalScore = ratingStats.reduce((sum, stat) => 
      sum + scores[stat.rating], 0
    )

    return Math.round((totalScore / ratingStats.length) * 100)
  }, [ratingStats])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Thống kê
              </h1>
              
              {/* Time Range Selector */}
              <div className="flex gap-2">
                {(['7d', '30d', '90d'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      timeRange === range
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                  >
                    {range === '7d' ? '7 ngày' : range === '30d' ? '30 ngày' : '90 ngày'}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                icon="cards"
                value={totalCards}
                label="Tổng flashcards"
              />
              <StatsCard
                icon="calendar"
                value={totalSessions}
                label="Lượt ôn tập"
              />
              <StatsCard
                icon="fire"
                value={profile.study_streak}
                label="Streak hiện tại"
              />
              <StatsCard
                icon="check-circle"
                value={`${averageAccuracy}%`}
                label="Độ chính xác"
              />
            </div>

            {/* Weekly Progress */}
            <Card>
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tiến độ tuần này
                  </h2>
                  <Badge 
                    variant={weeklyComparison.change >= 0 ? 'solid' : 'solid'}
                    color={weeklyComparison.change >= 0 ? 'success' : 'error'}
                  >
                    {weeklyComparison.change >= 0 ? '+' : ''}{weeklyComparison.change}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-primary-500">
                      {weeklyComparison.thisWeek}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tuần này</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-gray-500 dark:text-gray-400">
                      {weeklyComparison.lastWeek}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tuần trước</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Daily Activity Chart */}
            <Card>
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hoạt động hàng ngày
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyStudyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      stroke="#e5e7eb"
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      stroke="#e5e7eb"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value} lượt`, 'Ôn tập']}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#4F46E5" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Rating Distribution & Subject Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rating Distribution */}
              <Card>
                <div className="p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Phân bố độ khó
                  </h2>
                  
                  {ratingDistribution.some(d => d.value > 0) ? (
                    <>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={ratingDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => 
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            dataKey="value"
                          >
                            {ratingDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="flex justify-center gap-6 mt-4">
                        {ratingDistribution.map(item => (
                          <div key={item.name} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {item.name}: {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Chưa có dữ liệu ôn tập
                    </div>
                  )}
                </div>
              </Card>

              {/* Subject Performance */}
              <Card>
                <div className="p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Hiệu suất theo môn
                  </h2>
                  
                  {subjectPerformance.length > 0 ? (
                    <div className="space-y-4">
                      {subjectPerformance
                        .sort((a, b) => b.total - a.total)
                        .slice(0, 5)
                        .map(subject => (
                          <div key={subject.name}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: subject.color }}
                                />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {subject.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {subject.total} lượt
                                </span>
                                <Badge 
                                  variant="solid"
                                  color={subject.accuracy >= 70 ? 'success' : 'warning'}
                                >
                                  {subject.accuracy}%
                                </Badge>
                              </div>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  backgroundColor: subject.color,
                                  width: `${subject.accuracy}%`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Chưa có dữ liệu theo môn học
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Study Insights */}
            <Card>
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Thông tin chi tiết
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Best Day */}
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="calendar" size={20} color="active" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ngày học nhiều nhất
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-primary-500">
                      {dailyStudyData.length > 0 ? dailyStudyData.reduce((max, day) => 
                        day.count > max.count ? day : max
                      , dailyStudyData[0]).date : '-'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {dailyStudyData.length > 0 ? dailyStudyData.reduce((max, day) => 
                        day.count > max.count ? day : max
                      , dailyStudyData[0]).count : 0} lượt ôn tập
                    </div>
                  </div>

                  {/* Total Study Time */}
                  <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="calendar" size={20} color="active" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tổng thời gian học
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-success-500">
                      {Math.floor(profile.total_study_time_minutes / 60)}h {profile.total_study_time_minutes % 60}m
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Trung bình {totalSessions > 0 ? Math.round(profile.total_study_time_minutes / totalSessions) : 0} phút/lượt
                    </div>
                  </div>

                  {/* Mastery Rate */}
                  <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="check-circle" size={20} color="active" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tỷ lệ thành thạo
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-warning-500">
                      {averageAccuracy}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {ratingDistribution.find(r => r.name === 'Dễ')?.value || 0} thẻ dễ
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Study Streak Calendar */}
            <Card>
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Lịch sử streak
                </h2>
                
                <div className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="p-3 bg-primary-500 rounded-full">
                    <Icon name="fire" size={32} color="white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-primary-500">
                      {profile.study_streak} ngày
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Học liên tục không nghỉ! Tiếp tục phát huy! 🔥
                    </p>
                  </div>
                  {profile.study_streak >= 7 && (
                    <Badge variant="solid" color="success" className="text-base">
                      <Icon name="check-circle" size={16} className="mr-1" />
                      Streak Master
                    </Badge>
                  )}
                </div>

                {profile.study_streak > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Mẹo:</strong> Để duy trì streak, hãy ôn tập ít nhất 1 flashcard mỗi ngày!
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

