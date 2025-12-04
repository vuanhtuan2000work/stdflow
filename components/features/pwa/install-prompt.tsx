'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsVisible(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Store dismissal in localStorage
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Check if user dismissed recently (within 7 days)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      if (dismissedTime > sevenDaysAgo) {
        setIsVisible(false)
      }
    }
  }, [])

  if (isInstalled || !isVisible || !deferredPrompt) {
    return null
  }

  return (
    <>
      {/* Mobile Banner (bottom) */}
      <div className="md:hidden fixed bottom-20 left-0 right-0 z-40 p-4">
        <Card className="bg-primary-500 text-white border-0">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Cài đặt StudyFlow</h3>
                <p className="text-sm text-white/90">
                  Thêm vào màn hình chính để truy cập nhanh hơn
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white ml-2"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleInstall}
                className="flex-1 bg-white text-primary-500 hover:bg-gray-100"
              >
                Cài đặt
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20"
              >
                Không, cảm ơn
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Desktop Card (top-right) */}
      <div className="hidden md:block fixed top-20 right-4 z-40 max-w-sm">
        <Card className="shadow-lg">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Cài đặt StudyFlow
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cài đặt ứng dụng để truy cập nhanh hơn
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleInstall}
                className="flex-1"
              >
                Cài đặt
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
              >
                Bỏ qua
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}


