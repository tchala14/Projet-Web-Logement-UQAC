-- ========================================
-- FIX DES PERMISSIONS RLS POUR LA TABLE OWNERS
-- ========================================
-- Ce script corrige les permissions Row Level Security
-- pour permettre la création automatique des enregistrements owners

-- ========================================
-- 1. ACTIVER RLS (SI PAS DÉJÀ ACTIVÉ)
-- ========================================

ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. SUPPRIMER LES ANCIENNES POLITIQUES
-- ========================================

DROP POLICY IF EXISTS "System can insert owners" ON public.owners;
DROP POLICY IF EXISTS "Owners can view own record" ON public.owners;
DROP POLICY IF EXISTS "Owners can update own record" ON public.owners;
DROP POLICY IF EXISTS "Admins can view all owners" ON public.owners;
DROP POLICY IF EXISTS "Admins can update all owners" ON public.owners;
DROP POLICY IF EXISTS "Admins can delete owners" ON public.owners;

-- ========================================
-- 3. CRÉER LES NOUVELLES POLITIQUES
-- ========================================

-- Permettre l'insertion (nécessaire pour la création automatique)
CREATE POLICY "System can insert owners"
  ON public.owners FOR INSERT
  WITH CHECK (true);

-- Permettre à un owner de voir son propre enregistrement
CREATE POLICY "Owners can view own record"
  ON public.owners FOR SELECT
  USING (auth.uid() = id);

-- Permettre à un owner de mettre à jour son propre enregistrement
CREATE POLICY "Owners can update own record"
  ON public.owners FOR UPDATE
  USING (auth.uid() = id);

-- Permettre aux admins de tout voir
CREATE POLICY "Admins can view all owners"
  ON public.owners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Permettre aux admins de tout modifier
CREATE POLICY "Admins can update all owners"
  ON public.owners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Permettre aux admins de supprimer
CREATE POLICY "Admins can delete owners"
  ON public.owners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ========================================
-- 4. VÉRIFICATION
-- ========================================

-- Afficher toutes les politiques sur la table owners
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count 
  FROM pg_policies 
  WHERE tablename = 'owners';
  
  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE '✅ Politiques RLS créées sur la table owners: %', policy_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Liste des politiques:';
  RAISE NOTICE '  1. System can insert owners (INSERT)';
  RAISE NOTICE '  2. Owners can view own record (SELECT)';
  RAISE NOTICE '  3. Owners can update own record (UPDATE)';
  RAISE NOTICE '  4. Admins can view all owners (SELECT)';
  RAISE NOTICE '  5. Admins can update all owners (UPDATE)';
  RAISE NOTICE '  6. Admins can delete owners (DELETE)';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Les permissions RLS sont maintenant correctement configurées !';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
END $$;

-- ========================================
-- 5. ACCORDER LES PERMISSIONS NÉCESSAIRES
-- ========================================

-- S'assurer que les rôles ont accès à la table
GRANT SELECT, INSERT, UPDATE ON TABLE public.owners TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.owners TO service_role;

-- ========================================
-- TERMINÉ !
-- ========================================

RAISE NOTICE '';
RAISE NOTICE '🎉 Permissions RLS configurées avec succès !';
RAISE NOTICE '';
RAISE NOTICE 'Vous pouvez maintenant:';
RAISE NOTICE '  ✅ Créer des logements sans erreur';
RAISE NOTICE '  ✅ Les owners sont créés automatiquement';
RAISE NOTICE '  ✅ Les admins peuvent gérer tous les owners';
RAISE NOTICE '';
