/**
 * SM-2 Algorithm for Spaced Repetition
 * Based on SuperMemo 2 algorithm
 */

export type Rating = 'hard' | 'medium' | 'easy'

export interface SM2Result {
  nextReviewDate: Date
  intervalDays: number
  easeFactor: number
  reviewCount: number
}

export interface SM2Input {
  currentIntervalDays: number
  easeFactor: number
  reviewCount: number
  rating: Rating
}

/**
 * Calculate next review date and update intervals using SM-2 algorithm
 */
export function calculateSM2({
  currentIntervalDays,
  easeFactor,
  reviewCount,
  rating,
}: SM2Input): SM2Result {
  let newIntervalDays: number
  let newEaseFactor = easeFactor
  let newReviewCount = reviewCount + 1

  // Calculate new ease factor based on rating
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // where q is quality: 0 (hard), 1 (medium), 2 (easy)
  const quality = rating === 'hard' ? 0 : rating === 'medium' ? 1 : 2
  const efChange = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  newEaseFactor = Math.max(1.3, easeFactor + efChange) // Minimum EF is 1.3

  // Calculate new interval
  if (rating === 'hard') {
    // Hard: repeat with same interval (or 1 day if first review)
    newIntervalDays = currentIntervalDays === 0 ? 1 : currentIntervalDays
  } else if (rating === 'medium') {
    // Medium: increase interval
    if (newReviewCount === 1) {
      newIntervalDays = 1
    } else if (newReviewCount === 2) {
      newIntervalDays = 6
    } else {
      newIntervalDays = Math.round(currentIntervalDays * newEaseFactor)
    }
  } else {
    // Easy: larger increase
    if (newReviewCount === 1) {
      newIntervalDays = 4
    } else if (newReviewCount === 2) {
      newIntervalDays = 6
    } else {
      newIntervalDays = Math.round(currentIntervalDays * newEaseFactor * 1.2)
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + newIntervalDays)

  return {
    nextReviewDate,
    intervalDays: newIntervalDays,
    easeFactor: newEaseFactor,
    reviewCount: newReviewCount,
  }
}


