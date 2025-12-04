// TypeScript types based on Database Schema
// Generated from StudyFlow-Database-Schema-with-User-Roles.md

export type EducationLevel = 'high_school' | 'university' | 'working' | 'other'

export type Profile = {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  education_level: EducationLevel | null
  study_streak: number
  last_study_date: string | null
  total_study_time_minutes: number
  created_at: string
  updated_at: string
}

export type Subject = {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  created_at: string
}

export type Flashcard = {
  id: string
  user_id: string
  subject_id: string | null
  front_text: string
  back_text: string
  next_review_date: string
  interval_days: number
  ease_factor: number
  review_count: number
  is_public: boolean
  created_at: string
  updated_at: string
}

export type StudySession = {
  id: string
  user_id: string
  flashcard_id: string
  rating: 'hard' | 'medium' | 'easy'
  studied_at: string
}

export type Note = {
  id: string
  user_id: string
  subject_id: string | null
  title: string
  content: any // JSONB
  tags: string[]
  created_at: string
  updated_at: string
}

// Role-based types (from schema)
export type Role = {
  id: string
  name: 'student' | 'teacher' | 'admin'
  description: string | null
  permissions: Record<string, any> // JSONB
  created_at: string
}

export type UserRole = {
  id: string
  user_id: string
  role_id: string
  assigned_at: string
  expires_at: string | null
}

// Class-related types (for future implementation)
export type Class = {
  id: string
  teacher_id: string
  name: string
  description: string | null
  class_code: string
  is_active: boolean
  created_at: string
}

export type ClassMember = {
  id: string
  class_id: string
  student_id: string
  status: 'active' | 'inactive'
  joined_at: string
}

export type SharedFlashcard = {
  id: string
  flashcard_id: string
  class_id: string
  shared_by: string
  shared_at: string
}


