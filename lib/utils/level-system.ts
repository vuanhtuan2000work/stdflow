export interface Level {
  level: number
  minXP: number
  maxXP: number
  title: string
}

export const LEVELS: Level[] = [
  { level: 1, minXP: 0, maxXP: 100, title: 'Học sinh mới' },
  { level: 2, minXP: 100, maxXP: 250, title: 'Tân binh' },
  { level: 3, minXP: 250, maxXP: 500, title: 'Học viên' },
  { level: 4, minXP: 500, maxXP: 850, title: 'Chăm chỉ' },
  { level: 5, minXP: 850, maxXP: 1300, title: 'Nỗ lực' },
  { level: 6, minXP: 1300, maxXP: 1900, title: 'Chuyên nghiệp' },
  { level: 7, minXP: 1900, maxXP: 2650, title: 'Thành thạo' },
  { level: 8, minXP: 2650, maxXP: 3600, title: 'Chuyên gia' },
  { level: 9, minXP: 3600, maxXP: 4800, title: 'Cao thủ' },
  { level: 10, minXP: 4800, maxXP: 6300, title: 'Học bá' },
  { level: 11, minXP: 6300, maxXP: 8100, title: 'Đại sư' },
  { level: 12, minXP: 8100, maxXP: 10200, title: 'Tôn sư' },
  { level: 13, minXP: 10200, maxXP: 12700, title: 'Tông sư' },
  { level: 14, minXP: 12700, maxXP: 15600, title: 'Bậc thầy' },
  { level: 15, minXP: 15600, maxXP: Infinity, title: 'Huyền thoại' },
]

export function calculateLevel(totalXP: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      return LEVELS[i]
    }
  }
  return LEVELS[0]
}

export function calculateXPForAction(action: string): number {
  const xpTable: Record<string, number> = {
    'flashcard_easy': 10,
    'flashcard_medium': 7,
    'flashcard_hard': 5,
    'complete_session': 25,
    'daily_streak': 15,
    'create_flashcard': 5,
    'create_note': 8,
    'share_flashcard': 20,
    'join_class': 10,
  }

  return xpTable[action] || 0
}

export function getNextLevel(currentLevel: number): Level | null {
  const nextLevel = LEVELS.find(l => l.level === currentLevel + 1)
  return nextLevel || null
}

export function getProgressToNextLevel(totalXP: number): {
  current: Level
  next: Level | null
  progress: number
  xpNeeded: number
} {
  const current = calculateLevel(totalXP)
  const next = getNextLevel(current.level)

  if (!next) {
    return {
      current,
      next: null,
      progress: 100,
      xpNeeded: 0,
    }
  }

  const xpInCurrentLevel = totalXP - current.minXP
  const xpNeededForNext = next.minXP - current.minXP
  const progress = Math.round((xpInCurrentLevel / xpNeededForNext) * 100)

  return {
    current,
    next,
    progress,
    xpNeeded: next.minXP - totalXP,
  }
}

