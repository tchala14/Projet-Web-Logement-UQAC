-- ============================================
-- 🚀 MIGRATION UQAC LOGEMENT
-- ============================================
-- INSTRUCTIONS :
-- 1. Copiez TOUT ce fichier (Ctrl+A, Ctrl+C)
-- 2. Allez sur https://supabase.com/dashboard
-- 3. SQL Editor > New Query
-- 4. Collez ce code (Ctrl+V)
-- 5. Cliquez sur RUN ▶️
-- 6. ✅ Attendez "Success. No rows returned"
-- ============================================

-- Table des propriétaires
CREATE TABLE IF NOT EXISTS public.owners (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Table des logements
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

-- Fonction helper pour récupérer le rôle de l'utilisateur (avec accès sécurisé à auth.users)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer automatiquement un owner lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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

-- Trigger pour appeler la fonction
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Activer la sécurité Row Level Security
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour OWNERS
DROP POLICY IF EXISTS "Owners can view own data" ON public.owners;
DROP POLICY IF EXISTS "Owners can update own data" ON public.owners;
DROP POLICY IF EXISTS "Admins can view all owners" ON public.owners;
DROP POLICY IF EXISTS "Admins can update all owners" ON public.owners;
DROP POLICY IF EXISTS "Admins can delete owners" ON public.owners;
DROP POLICY IF EXISTS "System can insert owners" ON public.owners;

CREATE POLICY "Owners can view own data" ON public.owners FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Owners can update own data" ON public.owners FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all owners" ON public.owners FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can update all owners" ON public.owners FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can delete owners" ON public.owners FOR DELETE USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "System can insert owners" ON public.owners FOR INSERT WITH CHECK (true);

-- Politiques de sécurité pour PROPERTIES
DROP POLICY IF EXISTS "Anyone can view properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can insert own properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can delete own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;

CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Owners can insert own properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own properties" ON public.properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete own properties" ON public.properties FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all properties" ON public.properties FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Index pour la performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_owners_email ON public.owners(email);
CREATE INDEX IF NOT EXISTS idx_owners_is_active ON public.owners(is_active);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 🔧 CORRECTION : Créer les entrées manquantes dans la table owners
-- ============================================
-- Cette fonction crée automatiquement une entrée dans owners
-- pour tous les utilisateurs avec role='owner' qui n'en ont pas encore
INSERT INTO public.owners (id, email, full_name, phone, is_active)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
  raw_user_meta_data->>'phone' as phone,
  true as is_active
FROM auth.users
WHERE 
  raw_user_meta_data->>'role' = 'owner'
  AND id NOT IN (SELECT id FROM public.owners)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ✅ TERMINÉ !
-- ============================================
-- Si vous voyez "Success. No rows returned", c'est bon !
-- Vous pouvez maintenant utiliser le site normalement.
-- ============================================
