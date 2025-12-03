'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const slides = [
  {
    title: 'Tổ chức ghi chú dễ dàng',
    description: 'Quản lý tất cả ghi chú và tài liệu học tập của bạn ở một nơi duy nhất.',
    illustration: '📝',
  },
  {
    title: 'Ôn tập thông minh với Flashcards',
    description: 'Sử dụng thuật toán spaced repetition để ghi nhớ lâu dài và hiệu quả.',
    illustration: '🎯',
  },
  {
    title: 'Theo dõi tiến độ mỗi ngày',
    description: 'Xem thống kê học tập, streak và cải thiện liên tục với StudyFlow.',
    illustration: '📊',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      router.push('/signup')
    }
  }

  const handleSkip = () => {
    router.push('/signup')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleSkip}
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-500"
        >
          Bỏ qua →
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Illustration */}
        <div className="mb-8 flex items-center justify-center">
          <div className="text-8xl md:text-9xl">
            {slides[currentSlide].illustration}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-gray-900 dark:text-white text-[28px] md:text-[32px] font-bold text-center mb-4 px-4">
          {slides[currentSlide].title}
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-normal text-center mb-12 px-4 max-w-md">
          {slides[currentSlide].description}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2 mb-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-primary-500'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="w-full p-4 space-y-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleNext}
        >
          {currentSlide === slides.length - 1 ? 'Bắt đầu' : 'Tiếp theo'}
        </Button>
        {currentSlide === 0 && (
          <Link href="/login">
            <Button variant="secondary" size="md" className="w-full">
              Đã có tài khoản? Đăng nhập
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
