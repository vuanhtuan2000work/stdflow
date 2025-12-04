'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

interface ClassItem {
  id: string
  name: string
  description: string | null
  class_code: string
  is_active: boolean
  created_at: string
  class_members: Array<{ id: string; status: string }>
}

interface ClassesClientProps {
  classes: ClassItem[]
}

export function ClassesClient({ classes }: ClassesClientProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      toast.success('Đã sao chép mã lớp!')
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      toast.error('Không thể sao chép mã lớp')
    }
  }

  const activeMemberCount = (classItem: ClassItem) => {
    return classItem.class_members.filter(m => m.status === 'active').length
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} isTeacher={true} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Lớp học của tôi
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Quản lý lớp học và chia sẻ flashcards với học sinh
                </p>
              </div>
              <Link href="/classes/new">
                <Button>
                  <Icon name="plus" size={20} className="mr-2" />
                  Tạo lớp mới
                </Button>
              </Link>
            </div>

            {/* Classes List */}
            {classes.length === 0 ? (
              <Card className="text-center py-12">
                <Icon name="users" size={48} color="inactive" className="mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Chưa có lớp học nào. Tạo lớp đầu tiên để bắt đầu chia sẻ!
                </p>
                <Link href="/classes/new">
                  <Button>
                    <Icon name="plus" size={20} className="mr-2" />
                    Tạo lớp học
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map(classItem => (
                  <Card key={classItem.id} variant="hoverable" className="relative">
                    {!classItem.is_active && (
                      <Badge variant="outline" className="absolute top-4 right-4">
                        Đã đóng
                      </Badge>
                    )}

                    <div className="space-y-4">
                      {/* Class Info */}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {classItem.name}
                        </h3>
                        {classItem.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {classItem.description}
                          </p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Icon name="users" size={16} color="inactive" />
                          <span>{activeMemberCount(classItem)} học sinh</span>
                        </div>
                        <Badge 
                          variant="solid"
                          color={classItem.is_active ? 'success' : 'gray'}
                        >
                          {classItem.is_active ? 'Đang hoạt động' : 'Đã đóng'}
                        </Badge>
                      </div>

                      {/* Class Code */}
                      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Mã lớp:</p>
                            <p className="font-mono font-bold text-primary-500">
                              {classItem.class_code}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopyCode(classItem.class_code)}
                            className="p-2 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
                            aria-label="Sao chép mã lớp"
                          >
                            {copiedCode === classItem.class_code ? (
                              <Icon name="check" size={20} color="success" />
                            ) : (
                              <Icon name="copy" size={20} color="active" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/classes/${classItem.id}`} className="flex-1">
                          <Button variant="outline" className="w-full" size="sm">
                            <Icon name="settings" size={16} className="mr-2" />
                            Quản lý
                          </Button>
                        </Link>
                        <Link href={`/classes/${classItem.id}/share`} className="flex-1">
                          <Button variant="primary" className="w-full" size="sm">
                            <Icon name="share" size={16} className="mr-2" />
                            Chia sẻ
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

