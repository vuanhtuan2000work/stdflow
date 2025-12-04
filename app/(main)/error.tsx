'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6 flex items-center justify-center">
          <Card className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-error-50 dark:bg-error-900/20 rounded-full flex items-center justify-center">
                <Icon name="alert-triangle" size={32} color="error" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Có lỗi xảy ra
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {error.message || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={reset} className="flex-1">
                Thử lại
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1"
              >
                Về trang chủ
              </Button>
            </div>
          </Card>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

