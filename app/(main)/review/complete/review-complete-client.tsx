'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { Confetti } from '@/components/features/review/confetti'

interface ReviewCompleteClientProps {
  stats: {
    hard: number
    medium: number
    easy: number
    total: number
  }
}

export function ReviewCompleteClient({ stats }: ReviewCompleteClientProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Confetti />
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6 flex items-center justify-center">
          <div className="w-full max-w-md text-center">
            {/* Confetti effect */}
            <div className="text-6xl mb-6 animate-bounce">
              🎉 🎉 🎉
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tuyệt vời!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Bạn đã học xong {stats.total} thẻ
            </p>

            {/* Stats breakdown */}
            <Card className="mb-8">
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Khó:</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.hard}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Trung Bình:</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.medium}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Dễ:</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.easy}
                  </span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => router.push('/dashboard')}
              >
                Về Dashboard
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => router.push('/review')}
              >
                Học thêm 10 thẻ
              </Button>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

