export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  requirement: number
  currentProgress: number
  unlocked: boolean
  unlockedAt?: string
  category: 'streak' | 'cards' | 'time' | 'accuracy' | 'social'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const ACHIEVEMENTS: Omit<Achievement, 'currentProgress' | 'unlocked' | 'unlockedAt'>[] = [
  // Streak Achievements
  {
    id: 'streak_3',
    title: 'Khởi đầu tốt',
    description: 'Học liên tục 3 ngày',
    icon: '🔥',
    requirement: 3,
    category: 'streak',
    rarity: 'common',
  },
  {
    id: 'streak_7',
    title: 'Tuần hoàn hảo',
    description: 'Học liên tục 7 ngày',
    icon: '⚡',
    requirement: 7,
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'streak_30',
    title: 'Tháng kiên trì',
    description: 'Học liên tục 30 ngày',
    icon: '💪',
    requirement: 30,
    category: 'streak',
    rarity: 'epic',
  },
  {
    id: 'streak_100',
    title: 'Huyền thoại',
    description: 'Học liên tục 100 ngày',
    icon: '👑',
    requirement: 100,
    category: 'streak',
    rarity: 'legendary',
  },

  // Cards Achievements
  {
    id: 'cards_10',
    title: 'Học sinh mới',
    description: 'Ôn tập 10 flashcards',
    icon: '📚',
    requirement: 10,
    category: 'cards',
    rarity: 'common',
  },
  {
    id: 'cards_100',
    title: 'Chăm chỉ',
    description: 'Ôn tập 100 flashcards',
    icon: '📖',
    requirement: 100,
    category: 'cards',
    rarity: 'rare',
  },
  {
    id: 'cards_500',
    title: 'Học bá',
    description: 'Ôn tập 500 flashcards',
    icon: '🎓',
    requirement: 500,
    category: 'cards',
    rarity: 'epic',
  },
  {
    id: 'cards_1000',
    title: 'Bậc thầy',
    description: 'Ôn tập 1000 flashcards',
    icon: '🏆',
    requirement: 1000,
    category: 'cards',
    rarity: 'legendary',
  },

  // Time Achievements
  {
    id: 'time_1h',
    title: 'Giờ đầu tiên',
    description: 'Học tổng cộng 1 giờ',
    icon: '⏰',
    requirement: 60,
    category: 'time',
    rarity: 'common',
  },
  {
    id: 'time_10h',
    title: 'Nỗ lực không ngừng',
    description: 'Học tổng cộng 10 giờ',
    icon: '⏱️',
    requirement: 600,
    category: 'time',
    rarity: 'rare',
  },
  {
    id: 'time_50h',
    title: 'Kiên trì vượt bậc',
    description: 'Học tổng cộng 50 giờ',
    icon: '⌛',
    requirement: 3000,
    category: 'time',
    rarity: 'epic',
  },

  // Accuracy Achievements
  {
    id: 'accuracy_50',
    title: 'Tiến bộ tốt',
    description: '50 flashcards đánh giá "Dễ"',
    icon: '✅',
    requirement: 50,
    category: 'accuracy',
    rarity: 'rare',
  },
  {
    id: 'accuracy_100',
    title: 'Thành thạo',
    description: '100 flashcards đánh giá "Dễ"',
    icon: '💯',
    requirement: 100,
    category: 'accuracy',
    rarity: 'epic',
  },

  // Social Achievements
  {
    id: 'social_share',
    title: 'Người chia sẻ',
    description: 'Chia sẻ flashcards với lớp học',
    icon: '🤝',
    requirement: 1,
    category: 'social',
    rarity: 'rare',
  },
  {
    id: 'social_create_class',
    title: 'Giáo viên',
    description: 'Tạo lớp học đầu tiên',
    icon: '👨‍🏫',
    requirement: 1,
    category: 'social',
    rarity: 'rare',
  },
]

