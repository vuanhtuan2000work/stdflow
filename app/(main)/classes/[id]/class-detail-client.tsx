'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface ClassData {
  id: string
  name: string
  description: string | null
  class_code: string
  is_active: boolean
  created_at: string
  profiles: {
    full_name: string | null
    username: string
  }
}

interface Member {
  id: string
  status: string
  joined_at: string
  profiles: {
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
  }
}

interface SharedFlashcard {
  id: string
  shared_at: string
  flashcards: {
    id: string
    front_text: string
    back_text: string
    subjects: {
      name: string
      color: string
    } | null
  }
  profiles: {
    full_name: string | null
    username: string
  }
}

interface ClassDetailClientProps {
  classData: ClassData
  members: Member[]
  sharedFlashcards: SharedFlashcard[]
}

export function ClassDetailClient({ 
  classData, 
  members, 
  sharedFlashcards 
}: ClassDetailClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<'members' | 'shared'>('members')
  const [copiedCode, setCopiedCode] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(classData.class_code)
      setCopiedCode(true)
      toast.success('Đã sao chép mã lớp!')
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (error) {
      toast.error('Không thể sao chép mã lớp')
    }
  }

  const handleToggleActive = async () => {
    try {
      const { error } = await supabase
        .from('classes')
        .update({ is_active: !classData.is_active })
        .eq('id', classData.id)

      if (error) throw error

      toast.success(classData.is_active ? 'Đã đóng lớp' : 'Đã mở lại lớp')
      router.refresh()
    } catch (error: any) {
      console.error('Toggle error:', error)
      toast.error(error.message || 'Không thể cập nhật trạng thái lớp')
    }
  }

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Xóa ${memberName} khỏi lớp?`)) return

    try {
      const { error } = await supabase
        .from('class_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error

      toast.success('Đã xóa thành viên khỏi lớp')
      router.refresh()
    } catch (error: any) {
      console.error('Remove error:', error)
      toast.error(error.message || 'Không thể xóa thành viên')
    }
  }

  const handleDeleteClass = async () => {
    if (!confirm('Bạn có chắc muốn xóa lớp này? Hành động này không thể hoàn tác.')) return

    try {
      setIsDeleting(true)

      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classData.id)

      if (error) throw error

      toast.success('Đã xóa lớp học')
      router.push('/classes')
      router.refresh()
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Không thể xóa lớp')
    } finally {
      setIsDeleting(false)
    }
  }

  const activeMembers = members.filter(m => m.status === 'active')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} isTeacher={true} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => router.back()}>
                <Icon name="arrow-left" size={20} className="mr-2" />
                Quay lại
              </Button>
              <div className="flex gap-2">
                <Link href={`/classes/${classData.id}/share`}>
                  <Button>
                    <Icon name="share" size={20} className="mr-2" />
                    Chia sẻ flashcards
                  </Button>
                </Link>
                <Link href={`/classes/${classData.id}/progress`}>
                  <Button variant="outline">
                    <Icon name="statistics" size={20} className="mr-2" />
                    Tiến độ học sinh
                  </Button>
                </Link>
              </div>
            </div>

            {/* Class Info Card */}
            <Card>
              <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {classData.name}
                    </h1>
                    {classData.description && (
                      <p className="text-gray-600 dark:text-gray-400">{classData.description}</p>
                    )}
                  </div>
                  <Badge 
                    variant="solid"
                    color={classData.is_active ? 'success' : 'gray'}
                  >
                    {classData.is_active ? 'Đang hoạt động' : 'Đã đóng'}
                  </Badge>
                </div>

                {/* Class Code */}
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mã lớp:</p>
                      <p className="font-mono text-xl font-bold text-primary-500">
                        {classData.class_code}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="p-3 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
                      aria-label="Sao chép mã lớp"
                    >
                      {copiedCode ? (
                        <Icon name="check" size={24} color="success" />
                      ) : (
                        <Icon name="copy" size={24} color="active" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeMembers.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Học sinh</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {sharedFlashcards.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Flashcards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(classData.created_at).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Ngày tạo</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    variant="outline"
                    onClick={handleToggleActive}
                    className="flex-1"
                  >
                    {classData.is_active ? 'Đóng lớp' : 'Mở lại lớp'}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteClass}
                    isLoading={isDeleting}
                  >
                    <Icon name="delete" size={20} className="mr-2" />
                    Xóa lớp
                  </Button>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setActiveTab('members')}
                className={cn(
                  'px-4 py-2 font-medium transition-colors border-b-2',
                  activeTab === 'members'
                    ? 'text-primary-500 border-primary-500'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <Icon name="users" size={20} className="inline mr-2" />
                Học sinh ({activeMembers.length})
              </button>
              <button
                onClick={() => setActiveTab('shared')}
                className={cn(
                  'px-4 py-2 font-medium transition-colors border-b-2',
                  activeTab === 'shared'
                    ? 'text-primary-500 border-primary-500'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <Icon name="cards" size={20} className="inline mr-2" />
                Flashcards ({sharedFlashcards.length})
              </button>
            </div>

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-4">
                {activeMembers.length === 0 ? (
                  <Card className="text-center py-8">
                    <Icon name="users" size={48} color="inactive" className="mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Chưa có học sinh nào tham gia</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeMembers.map(member => (
                      <Card key={member.id}>
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={member.profiles.avatar_url}
                                name={member.profiles.full_name || member.profiles.username}
                                size={40}
                              />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {member.profiles.full_name || member.profiles.username}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  @{member.profiles.username}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                  Tham gia: {new Date(member.joined_at).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveMember(
                                member.id, 
                                member.profiles.full_name || member.profiles.username
                              )}
                              className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                              aria-label="Xóa thành viên"
                            >
                              <Icon name="user-x" size={20} />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Shared Flashcards Tab */}
            {activeTab === 'shared' && (
              <div className="space-y-4">
                {sharedFlashcards.length === 0 ? (
                  <Card className="text-center py-8">
                    <Icon name="cards" size={48} color="inactive" className="mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Chưa chia sẻ flashcard nào</p>
                    <Link href={`/classes/${classData.id}/share`}>
                      <Button>
                        <Icon name="share" size={20} className="mr-2" />
                        Chia sẻ flashcards
                      </Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sharedFlashcards.map(shared => (
                      <Card key={shared.id}>
                        <div className="p-4 space-y-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {shared.flashcards.front_text}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {shared.flashcards.back_text}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            {shared.flashcards.subjects && (
                              <Badge
                                style={{
                                  backgroundColor: shared.flashcards.subjects.color,
                                  color: 'white'
                                }}
                              >
                                {shared.flashcards.subjects.name}
                              </Badge>
                            )}
                            <span>
                              {new Date(shared.shared_at).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

