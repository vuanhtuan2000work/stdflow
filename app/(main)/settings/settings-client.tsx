'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { Profile } from '@/lib/types/database.types'
import Link from 'next/link'

interface SettingsClientProps {
  profile: Profile
}

const settingsSections = [
  {
    title: 'Thông báo',
    icon: 'bell' as const,
    items: [
      { label: 'Nhắc nhở ôn tập', href: '/settings/notifications', value: 'Bật' },
      { label: 'Thông báo streak', href: '/settings/notifications', value: 'Bật' },
    ]
  },
  {
    title: 'Giao diện',
    icon: 'moon' as const,
    items: [
      { label: 'Chế độ tối', href: '/settings/appearance', value: 'Tắt' },
      { label: 'Ngôn ngữ', href: '/settings/appearance', value: 'Tiếng Việt' },
    ]
  },
  {
    title: 'Học tập',
    icon: 'database' as const,
    items: [
      { label: 'Số thẻ mỗi phiên', href: '/settings/study', value: '20' },
      { label: 'Độ khó mặc định', href: '/settings/study', value: 'Trung bình' },
    ]
  },
]

export function SettingsClient({ profile }: SettingsClientProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav
          user={{
            id: profile.id,
            avatar_url: profile.avatar_url,
            full_name: profile.full_name,
            username: profile.username,
          }}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Cài đặt
            </h1>

            <div className="space-y-4">
              {settingsSections.map((section) => (
                <Card key={section.title}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <Icon name={section.icon} size={20} color="primary" />
                      </div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>

                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {item.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {item.value}
                            </span>
                            <Icon name="chevron-right" size={16} color="inactive" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* About */}
            <Card className="mt-6">
              <div className="p-6 text-center space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  StudyFlow v1.0.0
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <Link 
                    href="/privacy" 
                    className="text-primary-500 hover:underline dark:text-primary-400"
                  >
                    Chính sách bảo mật
                  </Link>
                  <Link 
                    href="/terms" 
                    className="text-primary-500 hover:underline dark:text-primary-400"
                  >
                    Điều khoản sử dụng
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

