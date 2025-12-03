'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils/cn'

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning-500 text-white px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
        <Icon name="alert-circle" size={16} className="text-white" />
        <span>Bạn đang offline. Một số tính năng có thể không hoạt động.</span>
      </div>
    </div>
  )
}

