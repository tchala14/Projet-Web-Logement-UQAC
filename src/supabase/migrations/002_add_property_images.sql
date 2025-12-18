-- ========================================
-- UQAC LOGEMENT - GALERIE D'IMAGES
-- ========================================
-- Cette migration ajoute le support pour plusieurs images par logement
-- Execute this SQL in your Supabase SQL Editor

-- ========================================
-- 1. CREATE PROPERTY_IMAGES TABLE
-- ========================================

-- Table pour stocker plusieurs images par logement
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. RLS POLICIES FOR PROPERTY_IMAGES
-- ========================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view property images" ON public.property_images;
DROP POLICY IF EXISTS "Owners can insert images for their properties" ON public.property_images;
DROP POLICY IF EXISTS "Owners can update images for their properties" ON public.property_images;
DROP POLICY IF EXISTS "Owners can delete images for their properties" ON public.property_images;

-- Anyone can view property images (public access)
CREATE POLICY "Anyone can view property images"
  ON public.property_images FOR SELECT
  USING (true);

-- Owners can insert images for their own properties
CREATE POLICY "Owners can insert images for their properties"
  ON public.property_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

-- Owners can update images for their own properties
CREATE POLICY "Owners can update images for their properties"
  ON public.property_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

-- Owners can delete images for their own properties
CREATE POLICY "Owners can delete images for their properties"
  ON public.property_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

-- Admins can do everything with property images
CREATE POLICY "Admins can manage all property images"
  ON public.property_images FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ========================================
-- 4. CREATE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_display_order ON public.property_images(property_id, display_order);

-- ========================================
-- 5. MIGRATE EXISTING IMAGES
-- ========================================
-- Migrer les images existantes de image_url vers la table property_images

INSERT INTO public.property_images (property_id, image_url, display_order)
SELECT id, image_url, 0
FROM public.properties
WHERE image_url IS NOT NULL AND image_url != ''
ON CONFLICT DO NOTHING;

-- ========================================
-- 6. VERIFICATION
-- ========================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'property_images') THEN
    RAISE NOTICE '✅ Table "property_images" created successfully';
  END IF;
END $$;

-- ========================================
-- DONE! 
-- ========================================
-- Les propriétaires peuvent maintenant ajouter plusieurs images par logement.
-- L'ancienne colonne image_url dans properties est conservée pour la compatibilité,
-- mais les nouvelles images seront stockées dans property_images.
