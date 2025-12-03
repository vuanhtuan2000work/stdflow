'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Icon } from '@/components/ui/icon'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { toast } from 'react-hot-toast'
import { calculateSM2, type Rating } from '@/lib/utils/spaced-repetition'
import type { Flashcard } from '@/lib/types/database.types'
import { cn } from '@/lib/utils/cn'

interface ReviewClientProps {
  initialFlashcards: Flashcard[]
}

export function ReviewClient({ initialFlashcards }: ReviewClientProps) {
  const router = useRouter()
  const [flashcards, setFlashcards] = useState(initialFlashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [ratings, setRatings] = useState<Record<string, Rating>>({})

  const currentFlashcard = flashcards[currentIndex]
  const progress = ((currentIndex + completedCount) / initialFlashcards.length) * 100

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isProcessing) return

      if (e.key === ' ') {
        e.preventDefault()
        if (!isFlipped) {
          setIsFlipped(true)
        }
      } else if (isFlipped) {
        if (e.key === '1') handleRating('hard')
        else if (e.key === '2') handleRating('medium')
        else if (e.key === '3') handleRating('easy')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFlipped, isProcessing])

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true)
    }
  }

  const handleRating = async (rating: Rating) => {
    if (isProcessing || !currentFlashcard) return

    setIsProcessing(true)
    setRatings({ ...ratings, [currentFlashcard.id]: rating })

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Unauthorized')
      }

      // Calculate next review using SM-2
      const sm2Result = calculateSM2({
        currentIntervalDays: currentFlashcard.interval_days,
        easeFactor: Number(currentFlashcard.ease_factor),
        reviewCount: currentFlashcard.review_count,
        rating,
      })

      // Update flashcard
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
          interval_days: sm2Result.intervalDays,
          ease_factor: sm2Result.easeFactor,
          review_count: sm2Result.reviewCount,
        })
        .eq('id', currentFlashcard.id)
        .eq('user_id', user.id)

      if (updateError) throw updateError

      // Create study session
      await supabase.from('study_sessions').insert({
        user_id: user.id,
        flashcard_id: currentFlashcard.id,
        rating,
      })

      // Update user streak (call database function if exists)
      // Note: Function may not exist yet, so we catch error silently
      try {
        await supabase.rpc('update_user_streak', {
          user_uuid: user.id,
        })
      } catch (error) {
        // Function may not exist, ignore
        console.log('update_user_streak function not available')
      }

      // Move to next flashcard
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsFlipped(false)
        setCompletedCount(completedCount + 1)
      } else {
        // All done - show congratulations
        setCompletedCount(completedCount + 1)
        setTimeout(() => {
          router.push('/review/complete')
        }, 500)
      }
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật thất bại')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!currentFlashcard) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar subjects={[]} />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav user={undefined} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Header with progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Review Mode
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentIndex + 1} / {initialFlashcards.length}
                </span>
              </div>
              <ProgressBar value={progress} />
            </div>

            {/* Flashcard */}
            <div className="relative mb-6">
              <div
                className={cn(
                  'relative w-full min-h-[300px] md:min-h-[400px]',
                  'transition-transform duration-300',
                  '[transform-style:preserve-3d]',
                  isFlipped && '[transform:rotateY(180deg)]'
                )}
                style={{ perspective: '1000px' }}
              >
                {/* Front */}
                <Card
                  variant="default"
                  className={cn(
                    'w-full h-full flex flex-col items-center justify-center p-8',
                    'cursor-pointer',
                    '[backface-visibility:hidden]',
                    '[transform:rotateY(0deg)]'
                  )}
                  onClick={handleFlip}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Câu hỏi
                  </p>
                  <p className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white text-center mb-8">
                    {currentFlashcard.front_text}
                  </p>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFlip()
                    }}
                  >
                    Lật thẻ
                  </Button>
                </Card>

                {/* Back */}
                <Card
                  variant="default"
                  className={cn(
                    'absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8',
                    '[backface-visibility:hidden]',
                    '[transform:rotateY(180deg)]'
                  )}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Đáp án
                  </p>
                  <p className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white text-center mb-8">
                    {currentFlashcard.back_text}
                  </p>
                  
                  {/* Rating buttons */}
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleRating('hard')}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      😫 Khó
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleRating('medium')}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      😐 TB
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleRating('easy')}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      😊 Dễ
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Keyboard shortcuts hint (desktop) */}
            <div className="hidden md:block text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Space: Lật thẻ | 1: Khó | 2: TB | 3: Dễ</p>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

