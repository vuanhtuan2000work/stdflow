'use client'

import { LoadingSpinner } from './loading-spinner'

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = 'Đang tải...' }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  )
}

