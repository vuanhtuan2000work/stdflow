-- ============================================
-- XP System Migration
-- ============================================
-- Adds XP tracking and level system to StudyFlow

-- ============================================
-- 1. Add XP column to profiles
-- ============================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_xp INT DEFAULT 0;

-- ============================================
-- 2. Create XP history table
-- ============================================
CREATE TABLE IF NOT EXISTS public.xp_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  xp_earned INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_history_user ON public.xp_history(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_history_created ON public.xp_history(created_at DESC);

-- ============================================
-- 3. Enable RLS
-- ============================================
ALTER TABLE public.xp_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS Policies
-- ============================================
DROP POLICY IF EXISTS "Users view own XP history" ON public.xp_history;
CREATE POLICY "Users view own XP history"
ON public.xp_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- 5. Function to add XP
-- ============================================
CREATE OR REPLACE FUNCTION public.add_xp(
  user_uuid UUID,
  action_type TEXT,
  xp_amount INT
)
RETURNS VOID AS $$
BEGIN
  -- Insert XP history
  INSERT INTO public.xp_history (user_id, action, xp_earned)
  VALUES (user_uuid, action_type, xp_amount);

  -- Update total XP
  UPDATE public.profiles
  SET total_xp = total_xp + xp_amount
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

