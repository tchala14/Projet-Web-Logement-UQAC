-- ============================================
-- 🖼️ CONFIGURATION SUPABASE STORAGE
-- ============================================
-- Ce fichier configure le stockage d'images pour UQAC Logement
-- 
-- INSTRUCTIONS :
-- 1. Allez dans votre Supabase Dashboard
-- 2. Storage > Create a new bucket
-- 3. Nom du bucket: "uqac-logements"
-- 4. Public bucket: ✅ OUI (cochez la case)
-- 5. Cliquez sur "Create bucket"
-- 
-- OU utilisez le SQL Editor avec ce code :
-- ============================================

-- Créer le bucket pour les images de logements
INSERT INTO storage.buckets (id, name, public)
VALUES ('uqac-logements', 'uqac-logements', true)
ON CONFLICT (id) DO NOTHING;

-- Politique : Tout le monde peut lire les images
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uqac-logements' );

-- Politique : Les propriétaires connectés peuvent uploader des images
CREATE POLICY IF NOT EXISTS "Owners can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uqac-logements' 
  AND auth.role() = 'authenticated'
);

-- Politique : Les propriétaires peuvent mettre à jour leurs images
CREATE POLICY IF NOT EXISTS "Owners can update their images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'uqac-logements'
  AND auth.role() = 'authenticated'
);

-- Politique : Les propriétaires peuvent supprimer leurs images
CREATE POLICY IF NOT EXISTS "Owners can delete their images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'uqac-logements'
  AND auth.role() = 'authenticated'
);

-- ============================================
-- ✅ CONFIGURATION TERMINÉE !
-- ============================================
-- Votre bucket "uqac-logements" est maintenant prêt à recevoir des images.
-- Les propriétaires peuvent uploader, modifier et supprimer des photos.
-- Les visiteurs peuvent voir toutes les photos publiées.
-- ============================================
