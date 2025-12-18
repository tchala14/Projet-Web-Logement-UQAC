-- ========================================
-- UQAC LOGEMENT - MESSAGES ET FAVORIS
-- ========================================
-- Execute this SQL in your Supabase SQL Editor
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- Copy/paste this entire file and click RUN

-- ========================================
-- 1. CREATE CONTACT_MESSAGES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. CREATE FAVORITES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure a user can only favorite a property once
  UNIQUE(property_id, user_id)
);

-- ========================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. RLS POLICIES FOR CONTACT_MESSAGES
-- ========================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owners can view their messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owners can update their messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update all messages" ON public.contact_messages;

-- Anyone (even not authenticated) can send a contact message
CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Owners can view messages for their properties
CREATE POLICY "Owners can view their messages"
  ON public.contact_messages FOR SELECT
  USING (owner_id = auth.uid());

-- Owners can update status of their messages
CREATE POLICY "Owners can update their messages"
  ON public.contact_messages FOR UPDATE
  USING (owner_id = auth.uid());

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
  ON public.contact_messages FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Admins can update all messages
CREATE POLICY "Admins can update all messages"
  ON public.contact_messages FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ========================================
-- 5. RLS POLICIES FOR FAVORITES
-- ========================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Owners can view favorites for their properties" ON public.favorites;
DROP POLICY IF EXISTS "Admins can view all favorites" ON public.favorites;

-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can insert their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their favorites
CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Owners can view favorites count for their properties (for statistics)
CREATE POLICY "Owners can view favorites for their properties"
  ON public.favorites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

-- Admins can view all favorites
CREATE POLICY "Admins can view all favorites"
  ON public.favorites FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ========================================
-- 6. CREATE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_contact_messages_property_id ON public.contact_messages(property_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_owner_id ON public.contact_messages(owner_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON public.favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(created_at DESC);

-- ========================================
-- 7. VERIFICATION
-- ========================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages') THEN
    RAISE NOTICE '✅ Table "contact_messages" created successfully';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'favorites') THEN
    RAISE NOTICE '✅ Table "favorites" created successfully';
  END IF;
END $$;

-- ========================================
-- DONE! 
-- ========================================
-- Your database now supports:
-- - Contact messages from visitors to property owners
-- - User favorites with duplicate prevention
-- - Statistics for owners and admins
