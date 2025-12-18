-- ========================================
-- UQAC LOGEMENT - INITIAL SCHEMA
-- ========================================
-- Execute this SQL in your Supabase SQL Editor
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- Copy/paste this entire file and click RUN

-- ========================================
-- 1. CREATE TABLES
-- ========================================

-- Create owners table
CREATE TABLE IF NOT EXISTS public.owners (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  address TEXT NOT NULL,
  distance_min INTEGER NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'pris', 'suspendu')),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 1,
  surface INTEGER DEFAULT 0,
  furnished BOOLEAN DEFAULT false,
  utilities TEXT DEFAULT 'Non inclus',
  services TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. CREATE HELPER FUNCTIONS
-- ========================================

-- Helper function to get user role (with secure access to auth.users)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This function automatically creates an owner record when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create owner if role is 'owner'
  IF NEW.raw_user_meta_data->>'role' = 'owner' THEN
    INSERT INTO public.owners (id, email, full_name, phone)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.raw_user_meta_data->>'phone'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 3. CREATE TRIGGER
-- ========================================

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. RLS POLICIES FOR OWNERS TABLE
-- ========================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Owners can view own data" ON public.owners;
DROP POLICY IF EXISTS "Owners can update own data" ON public.owners;
DROP POLICY IF EXISTS "Admins can view all owners" ON public.owners;
DROP POLICY IF EXISTS "Admins can update all owners" ON public.owners;
DROP POLICY IF EXISTS "Admins can delete owners" ON public.owners;
DROP POLICY IF EXISTS "Owners can insert own data" ON public.owners;

-- Owners can read their own data
CREATE POLICY "Owners can view own data"
  ON public.owners FOR SELECT
  USING (auth.uid() = id);

-- Owners can update their own data
CREATE POLICY "Owners can update own data"
  ON public.owners FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all owners
CREATE POLICY "Admins can view all owners"
  ON public.owners FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Admins can update all owners
CREATE POLICY "Admins can update all owners"
  ON public.owners FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Admins can delete owners
CREATE POLICY "Admins can delete owners"
  ON public.owners FOR DELETE
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Allow system to insert owner records (via trigger)
CREATE POLICY "System can insert owners"
  ON public.owners FOR INSERT
  WITH CHECK (true);

-- ========================================
-- 6. RLS POLICIES FOR PROPERTIES TABLE
-- ========================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can insert own properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can delete own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;

-- Anyone can view all properties (public access)
CREATE POLICY "Anyone can view properties"
  ON public.properties FOR SELECT
  USING (true);

-- Owners can insert their own properties
CREATE POLICY "Owners can insert own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own properties
CREATE POLICY "Owners can update own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = owner_id);

-- Owners can delete their own properties
CREATE POLICY "Owners can delete own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = owner_id);

-- Admins can do everything with properties
CREATE POLICY "Admins can manage all properties"
  ON public.properties FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ========================================
-- 7. CREATE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_owners_email ON public.owners(email);
CREATE INDEX IF NOT EXISTS idx_owners_is_active ON public.owners(is_active);

-- ========================================
-- 8. CREATE UPDATED_AT TRIGGER
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for properties updated_at
DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 9. VERIFICATION
-- ========================================

-- Check if tables were created successfully
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'owners') THEN
    RAISE NOTICE '✅ Table "owners" created successfully';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'properties') THEN
    RAISE NOTICE '✅ Table "properties" created successfully';
  END IF;
END $$;

-- ========================================
-- DONE! 
-- ========================================
-- Your database is now ready to use.
-- Next steps:
-- 1. Create an admin user in Authentication > Users
-- 2. Add metadata: { "role": "admin", "full_name": "Admin" }
-- 3. Test by creating a new owner account
