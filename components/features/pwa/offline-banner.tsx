'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils/cn'

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

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
    <div className={cn(
      'fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50',
      'animate-in slide-in-from-bottom'
    )}>
      <Badge 
        variant="solid" 
        color="error" 
        className="flex items-center gap-2 p-3 shadow-lg"
      >
        <Icon name="alert-circle" size={16} color="white" />
        <span className="text-sm">
          Bạn đang offline. Một số tính năng có thể bị giới hạn.
        </span>
      </Badge>
    </div>
  )
}


