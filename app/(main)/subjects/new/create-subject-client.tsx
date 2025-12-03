'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { toast } from 'react-hot-toast'
import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icon'

const colors = [
  '#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#F97316', '#14B8A6', '#6366F1',
]

const icons: IconName[] = [
  'home', 'cards', 'calendar', 'profile', 'plus', 'edit',
  'search', 'bell', 'fire', 'check-circle', 'alert-circle',
]

export function CreateSubjectClient() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [color, setColor] = useState(colors[0])
  const [icon, setIcon] = useState<IconName>('home')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Vui lòng nhập tên môn học')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Unauthorized')
      }

      const { data, error } = await supabase
        .from('subjects')
        .insert({
          user_id: user.id,
          name: name.trim(),
          color,
          icon,
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Tạo môn học thành công!')
      router.push(`/subjects/${data.id}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Tạo môn học thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <Icon name="arrow-left" size={20} />
                <span>Quay lại</span>
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Tạo môn học mới
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Tên môn học"
                required
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Ví dụ: Toán, Văn, Anh..."
                disabled={isLoading}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Màu sắc
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`
                        w-12 h-12 rounded-lg border-2 transition-all
                        ${color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-700'}
                      `}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {icons.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setIcon(iconName)}
                      className={`
                        p-3 rounded-lg border-2 transition-all flex items-center justify-center
                        ${icon === iconName 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                        }
                      `}
                    >
                      <Icon
                        name={iconName}
                        size={24}
                        color={icon === iconName ? 'active' : 'inactive'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Tạo môn học
                </Button>
              </div>
            </form>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

