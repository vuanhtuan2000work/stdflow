'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface ReviewTodayCardProps {
  dueCount: number
  totalCount: number
}

export function ReviewTodayCard({ dueCount, totalCount }: ReviewTodayCardProps) {
  const router = useRouter()
  const progress = totalCount > 0 ? (dueCount / totalCount) * 100 : 0

  return (
    <Card
      variant="hoverable"
      className={cn(
        'mb-6',
        // Gradient background on mobile
        'md:bg-white md:dark:bg-gray-800',
        'bg-gradient-to-br from-primary-500 to-secondary-500 text-white md:text-gray-900 md:dark:text-white'
      )}
    >
      <div className="p-4 md:p-6">
        <h2 className={cn(
          'text-lg font-bold mb-4',
          'text-white md:text-gray-900 md:dark:text-white'
        )}>
          Ôn tập hôm nay
        </h2>
        
        <div className="mb-4">
          <p className={cn(
            'text-2xl font-bold mb-2',
            'text-white md:text-gray-900 md:dark:text-white'
          )}>
            {dueCount} thẻ đang chờ
          </p>
          <ProgressBar
            value={progress}
            showPercentage={false}
            className={cn(
              'opacity-80 md:opacity-100'
            )}
          />
        </div>

        <Button
          variant="primary"
          size="md"
          className={cn(
            'w-full md:w-auto',
            dueCount === 0 && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => {
            if (dueCount > 0) {
              router.push('/review')
            }
          }}
          disabled={dueCount === 0}
        >
          Bắt đầu
        </Button>
      </div>
    </Card>
  )
}


