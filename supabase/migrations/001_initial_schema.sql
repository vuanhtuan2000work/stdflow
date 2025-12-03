-- ============================================
-- StudyFlow Database Schema Migration
-- ============================================
-- Run this in Supabase SQL Editor
-- This creates all tables, RLS policies, functions, and triggers

-- ============================================
-- 1. ROLES SYSTEM
-- ============================================
-- Table: roles (Định nghĩa các vai trò)
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL CHECK (name IN ('student', 'teacher', 'admin')),
  description TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.roles (name, description, permissions) VALUES
('student', 'Học sinh/sinh viên', '{"can_create_flashcards": true, "can_join_classes": true, "can_view_shared_content": true}'::jsonb),
('teacher', 'Giáo viên', '{"can_create_flashcards": true, "can_create_classes": true, "can_share_flashcards": true, "can_view_student_progress": true}'::jsonb),
('admin', 'Quản trị viên', '{"full_access": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Table: user_roles (Gán vai trò cho user)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Nullable, cho phép role tạm thời
  UNIQUE(user_id, role_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role_id);

-- ============================================
-- 2. PROFILES (Extended với ownership)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  education_level TEXT CHECK (education_level IN ('high_school', 'university', 'working', 'other')),
  study_streak INT DEFAULT 0,
  last_study_date DATE,
  total_study_time_minutes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ============================================
-- 3. SUBJECTS (Ownership by user_id)
-- ============================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#4F46E5',
  icon TEXT DEFAULT 'book',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_subjects_user ON public.subjects(user_id);

-- ============================================
-- 4. FLASHCARDS (Ownership + Sharing)
-- ============================================
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  -- Spaced Repetition
  next_review_date DATE DEFAULT CURRENT_DATE,
  interval_days INT DEFAULT 1,
  ease_factor DECIMAL DEFAULT 2.5,
  review_count INT DEFAULT 0,
  -- Sharing
  is_public BOOLEAN DEFAULT false, -- Cho phép chia sẻ công khai
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flashcards_user ON public.flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_subject ON public.flashcards(subject_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_review_date ON public.flashcards(next_review_date);
CREATE INDEX IF NOT EXISTS idx_flashcards_public ON public.flashcards(is_public) WHERE is_public = true;

-- ============================================
-- 5. CLASSES (Giáo viên tạo lớp học)
-- ============================================
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  class_code TEXT UNIQUE NOT NULL, -- Mã lớp để học sinh tham gia
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_code ON public.classes(class_code);

-- Function: Generate unique class code
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.classes WHERE class_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. CLASS MEMBERS (Học sinh trong lớp)
-- ============================================
CREATE TABLE IF NOT EXISTS public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_class_members_class ON public.class_members(class_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student ON public.class_members(student_id);

-- ============================================
-- 7. SHARED FLASHCARDS (Chia sẻ với lớp)
-- ============================================
CREATE TABLE IF NOT EXISTS public.shared_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(flashcard_id, class_id)
);

CREATE INDEX IF NOT EXISTS idx_shared_flashcards_class ON public.shared_flashcards(class_id);
CREATE INDEX IF NOT EXISTS idx_shared_flashcards_card ON public.shared_flashcards(flashcard_id);

-- ============================================
-- 8. STUDY SESSIONS (History)
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('hard', 'medium', 'easy')),
  studied_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON public.study_sessions(user_id, studied_at DESC);

-- ============================================
-- 9. NOTES (Ownership)
-- ============================================
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content JSONB,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_user ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON public.notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON public.notes USING GIN(tags);

-- ============================================
-- 10. ROW LEVEL SECURITY POLICIES
-- ============================================
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS: PROFILES
-- ============================================
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================
-- RLS: ROLES (Read-only for all users)
-- ============================================
DROP POLICY IF EXISTS "Anyone can view roles" ON public.roles;
CREATE POLICY "Anyone can view roles"
ON public.roles FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- RLS: USER_ROLES
-- ============================================
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
CREATE POLICY "Users view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can manage roles
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  )
);

-- ============================================
-- RLS: SUBJECTS (Ownership)
-- ============================================
DROP POLICY IF EXISTS "Users manage own subjects" ON public.subjects;
CREATE POLICY "Users manage own subjects"
ON public.subjects FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS: FLASHCARDS (Ownership + Sharing)
-- ============================================
-- Owner có thể CRUD flashcards của mình
DROP POLICY IF EXISTS "Users manage own flashcards" ON public.flashcards;
CREATE POLICY "Users manage own flashcards"
ON public.flashcards FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Students có thể VIEW flashcards được share trong class
DROP POLICY IF EXISTS "Students view shared flashcards" ON public.flashcards;
CREATE POLICY "Students view shared flashcards"
ON public.flashcards FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT sf.flashcard_id 
    FROM public.shared_flashcards sf
    JOIN public.class_members cm ON sf.class_id = cm.class_id
    WHERE cm.student_id = auth.uid() AND cm.status = 'active'
  )
);

-- Mọi người có thể VIEW public flashcards
DROP POLICY IF EXISTS "Anyone view public flashcards" ON public.flashcards;
CREATE POLICY "Anyone view public flashcards"
ON public.flashcards FOR SELECT
TO authenticated
USING (is_public = true);

-- ============================================
-- RLS: CLASSES
-- ============================================
-- Teachers manage own classes
DROP POLICY IF EXISTS "Teachers manage own classes" ON public.classes;
CREATE POLICY "Teachers manage own classes"
ON public.classes FOR ALL
TO authenticated
USING (
  auth.uid() = teacher_id
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'teacher'
  )
)
WITH CHECK (
  auth.uid() = teacher_id
);

-- Students view classes they're enrolled in
DROP POLICY IF EXISTS "Students view enrolled classes" ON public.classes;
CREATE POLICY "Students view enrolled classes"
ON public.classes FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT class_id FROM public.class_members
    WHERE student_id = auth.uid()
  )
);

-- ============================================
-- RLS: CLASS_MEMBERS
-- ============================================
-- Teachers view members of their classes
DROP POLICY IF EXISTS "Teachers view class members" ON public.class_members;
CREATE POLICY "Teachers view class members"
ON public.class_members FOR SELECT
TO authenticated
USING (
  class_id IN (
    SELECT id FROM public.classes WHERE teacher_id = auth.uid()
  )
);

-- Students view their own enrollment
DROP POLICY IF EXISTS "Students view own enrollment" ON public.class_members;
CREATE POLICY "Students view own enrollment"
ON public.class_members FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

-- Students can join classes (INSERT)
DROP POLICY IF EXISTS "Students join classes" ON public.class_members;
CREATE POLICY "Students join classes"
ON public.class_members FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

-- ============================================
-- RLS: SHARED_FLASHCARDS
-- ============================================
-- Teachers share flashcards to their classes
DROP POLICY IF EXISTS "Teachers share flashcards" ON public.shared_flashcards;
CREATE POLICY "Teachers share flashcards"
ON public.shared_flashcards FOR ALL
TO authenticated
USING (
  class_id IN (
    SELECT id FROM public.classes WHERE teacher_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() = shared_by
);

-- Students view shared flashcards in their classes
DROP POLICY IF EXISTS "Students view shared flashcards" ON public.shared_flashcards;
CREATE POLICY "Students view shared flashcards"
ON public.shared_flashcards FOR SELECT
TO authenticated
USING (
  class_id IN (
    SELECT class_id FROM public.class_members 
    WHERE student_id = auth.uid() AND status = 'active'
  )
);

-- ============================================
-- RLS: STUDY_SESSIONS (Own data only)
-- ============================================
DROP POLICY IF EXISTS "Users manage own sessions" ON public.study_sessions;
CREATE POLICY "Users manage own sessions"
ON public.study_sessions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Teachers can view sessions of their students
DROP POLICY IF EXISTS "Teachers view student sessions" ON public.study_sessions;
CREATE POLICY "Teachers view student sessions"
ON public.study_sessions FOR SELECT
TO authenticated
USING (
  user_id IN (
    SELECT cm.student_id
    FROM public.class_members cm
    JOIN public.classes c ON cm.class_id = c.id
    WHERE c.teacher_id = auth.uid()
  )
);

-- ============================================
-- RLS: NOTES (Ownership)
-- ============================================
DROP POLICY IF EXISTS "Users manage own notes" ON public.notes;
CREATE POLICY "Users manage own notes"
ON public.notes FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 11. HELPER FUNCTIONS
-- ============================================
-- Function: Check if user has role
CREATE OR REPLACE FUNCTION public.user_has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid 
      AND r.name = role_name
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Assign default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  student_role_id UUID;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  -- Assign default 'student' role
  SELECT id INTO student_role_id FROM public.roles WHERE name = 'student';
  
  IF student_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (NEW.id, student_role_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 12. VIEWS (Convenience queries)
-- ============================================
-- View: User với roles
CREATE OR REPLACE VIEW public.users_with_roles AS
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.education_level,
  ARRAY_AGG(r.name) AS roles
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
LEFT JOIN public.roles r ON ur.role_id = r.id
WHERE ur.expires_at IS NULL OR ur.expires_at > NOW()
GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.education_level;

-- View: Class với số lượng members
CREATE OR REPLACE VIEW public.classes_with_stats AS
SELECT 
  c.*,
  COUNT(cm.id) AS member_count,
  p.full_name AS teacher_name
FROM public.classes c
LEFT JOIN public.class_members cm ON c.id = cm.class_id AND cm.status = 'active'
LEFT JOIN public.profiles p ON c.teacher_id = p.id
GROUP BY c.id, p.full_name;

