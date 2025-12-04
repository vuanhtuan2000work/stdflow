'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line 
} from 'recharts'
import { format, subDays, eachDayOfInterval, startOfDay, parseISO } from 'date-fns'
import { cn } from '@/lib/utils/cn'

interface ClassData {
  id: string
  name: string
}

interface Member {
  id: string
  joined_at: string
  profiles: {
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
    study_streak: number
    total_study_time_minutes: number
  } | null
}

interface StudySession {
  user_id: string
  rating: 'hard' | 'medium' | 'easy'
  studied_at: string
  flashcards: {
    id: string
    front_text: string
  } | null
}

interface StudentProgressClientProps {
  classData: ClassData
  members: Member[]
  studySessions: StudySession[]
}

export function StudentProgressClient({
  classData,
  members,
  studySessions,
}: StudentProgressClientProps) {
  const router = useRouter()
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  // Calculate student stats
  const studentStats = useMemo(() => {
    return members
      .filter(m => m.profiles)
      .map(member => {
        const sessions = studySessions.filter(s => s.user_id === member.profiles!.id)
        
        const totalSessions = sessions.length
        const easyCount = sessions.filter(s => s.rating === 'easy').length
        const mediumCount = sessions.filter(s => s.rating === 'medium').length
        const hardCount = sessions.filter(s => s.rating === 'hard').length
        
        const accuracy = totalSessions > 0
          ? Math.round(((easyCount + mediumCount * 0.5) / totalSessions) * 100)
          : 0

        return {
          ...member,
          totalSessions,
          accuracy,
          easyCount,
          mediumCount,
          hardCount,
        }
      })
  }, [members, studySessions])

  // Get selected student data
  const selectedStudentData = useMemo(() => {
    if (!selectedStudent) return null
    
    const student = studentStats.find(s => s.profiles?.id === selectedStudent)
    if (!student || !student.profiles) return null

    const sessions = studySessions.filter(s => s.user_id === selectedStudent)

    // Daily activity (last 7 days)
    const days = 7
    const startDate = subDays(new Date(), days - 1)
    const dateRange = eachDayOfInterval({ start: startDate, end: new Date() })

    const sessionsByDate = new Map<string, number>()
    sessions.forEach(session => {
      const dateKey = format(startOfDay(parseISO(session.studied_at)), 'yyyy-MM-dd')
      sessionsByDate.set(dateKey, (sessionsByDate.get(dateKey) || 0) + 1)
    })

    const dailyActivity = dateRange.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd')
      return {
        date: format(date, 'dd/MM'),
        count: sessionsByDate.get(dateKey) || 0,
      }
    })

    return {
      student,
      sessions,
      dailyActivity,
    }
  }, [selectedStudent, studentStats, studySessions])

  // Leaderboard
  const leaderboard = useMemo(() => {
    return [...studentStats]
      .sort((a, b) => b.totalSessions - a.totalSessions)
      .slice(0, 10)
  }, [studentStats])

  const totalAccuracy = studentStats.length > 0
    ? Math.round(studentStats.reduce((sum, s) => sum + s.accuracy, 0) / studentStats.length)
    : 0

  const totalStudyTime = members.reduce((sum, m) => 
    sum + (m.profiles?.total_study_time_minutes || 0), 0
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} isTeacher={true} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <Button variant="ghost" onClick={() => router.back()}>
                  <Icon name="arrow-left" size={20} className="mr-2" />
                  Quay lại
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  Tiến độ học sinh
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lớp: {classData.name}</p>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <div className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary-500">
                    {members.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Học sinh</div>
                </div>
              </Card>
              
              <Card>
                <div className="p-4 text-center">
                  <div className="text-3xl font-bold text-success-500">
                    {studySessions.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Lượt ôn tập</div>
                </div>
              </Card>

              <Card>
                <div className="p-4 text-center">
                  <div className="text-3xl font-bold text-warning-500">
                    {totalAccuracy}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Độ chính xác TB</div>
                </div>
              </Card>

              <Card>
                <div className="p-4 text-center">
                  <div className="text-3xl font-bold text-error-500">
                    {Math.floor(totalStudyTime / 60)}h
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tổng thời gian</div>
                </div>
              </Card>
            </div>

            {/* Leaderboard */}
            <Card>
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🏆 Bảng xếp hạng
                </h2>
                
                <div className="space-y-3">
                  {leaderboard.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      Chưa có dữ liệu học tập
                    </p>
                  ) : (
                    leaderboard.map((student, index) => {
                      if (!student.profiles) return null
                      
                      return (
                        <div
                          key={student.profiles.id}
                          onClick={() => setSelectedStudent(student.profiles!.id)}
                          className={cn(
                            'flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors',
                            selectedStudent === student.profiles.id
                              ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          )}
                        >
                          {/* Rank */}
                          <div className="w-8 text-center font-bold text-gray-500 dark:text-gray-400">
                            #{index + 1}
                          </div>

                          {/* Avatar */}
                          <Avatar
                            src={student.profiles.avatar_url}
                            name={student.profiles.full_name || student.profiles.username}
                            size={40}
                          />

                          {/* Name */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {student.profiles.full_name || student.profiles.username}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>🔥 {student.profiles.study_streak} ngày</span>
                              <span>⏱️ {Math.floor(student.profiles.total_study_time_minutes / 60)}h</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {student.totalSessions} lượt
                            </div>
                            <Badge 
                              variant="solid"
                              color={student.accuracy >= 70 ? 'success' : 'warning'}
                            >
                              {student.accuracy}%
                            </Badge>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </Card>

            {/* Student Detail */}
            {selectedStudentData && selectedStudentData.student.profiles && (
              <Card>
                <div className="p-4 md:p-6 space-y-6">
                  {/* Student Info */}
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={selectedStudentData.student.profiles.avatar_url}
                      name={selectedStudentData.student.profiles.full_name || selectedStudentData.student.profiles.username}
                      size={64}
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedStudentData.student.profiles.full_name || 
                         selectedStudentData.student.profiles.username}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{selectedStudentData.student.profiles.username}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label="Đóng"
                    >
                      <Icon name="close" size={24} />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <Icon name="trophy" size={20} color="active" className="mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedStudentData.student.profiles.study_streak}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Streak</div>
                    </div>

                    <div className="text-center p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
                      <Icon name="target" size={20} color="active" className="mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedStudentData.student.totalSessions}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Lượt ôn</div>
                    </div>

                    <div className="text-center p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                      <Icon name="trending-up" size={20} color="active" className="mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedStudentData.student.accuracy}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Chính xác</div>
                    </div>

                    <div className="text-center p-3 bg-error-50 dark:bg-error-900/20 rounded-lg">
                      <Icon name="clock" size={20} color="active" className="mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {Math.floor(selectedStudentData.student.profiles.total_study_time_minutes / 60)}h
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Thời gian</div>
                    </div>
                  </div>

                  {/* Activity Chart */}
                  {selectedStudentData.dailyActivity.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Hoạt động 7 ngày gần đây
                      </h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={selectedStudentData.dailyActivity}>
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
                          />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#4F46E5" 
                            strokeWidth={2}
                            dot={{ fill: '#4F46E5', r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Rating Distribution */}
                  {selectedStudentData.student.totalSessions > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Phân bố độ khó
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Dễ</span>
                          <ProgressBar 
                            value={(selectedStudentData.student.easyCount / selectedStudentData.student.totalSessions) * 100}
                            showPercentage={false}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                            {selectedStudentData.student.easyCount}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Trung bình</span>
                          <ProgressBar 
                            value={(selectedStudentData.student.mediumCount / selectedStudentData.student.totalSessions) * 100}
                            showPercentage={false}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                            {selectedStudentData.student.mediumCount}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Khó</span>
                          <ProgressBar 
                            value={(selectedStudentData.student.hardCount / selectedStudentData.student.totalSessions) * 100}
                            showPercentage={false}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                            {selectedStudentData.student.hardCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

