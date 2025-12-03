'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-new-password`,
      })

      if (error) throw error

      setIsSent(true)
      toast.success('Email đặt lại mật khẩu đã được gửi!')
    } catch (error: any) {
      toast.error(error.message || 'Gửi email thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-sm text-center">
          <div className="mb-6 text-6xl">📧</div>
          <h1 className="text-gray-900 dark:text-white text-[28px] font-bold mb-4">
            Kiểm tra email của bạn
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-8">
            Chúng tôi đã gửi link đặt lại mật khẩu đến {email}
          </p>
          <Link href="/login">
            <Button variant="primary" size="md" className="w-full">
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm">
        <h1 className="text-gray-900 dark:text-white text-[28px] font-bold text-center mb-2">
          Quên mật khẩu?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base text-center mb-8">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            isLoading={isLoading}
          >
            Gửi link đặt lại mật khẩu
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-primary-500 hover:underline"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}

