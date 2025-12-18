-- ========================================
-- FIX POUR LES UTILISATEURS EXISTANTS
-- ========================================
-- Ce script corrige le problème des utilisateurs qui existent
-- dans auth.users mais pas dans la table owners

-- ========================================
-- 1. CRÉER LES ENREGISTREMENTS MANQUANTS
-- ========================================

-- Insérer les utilisateurs existants qui manquent dans la table owners
INSERT INTO public.owners (id, email, full_name, phone, is_active)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email) as full_name,
  u.raw_user_meta_data->>'phone' as phone,
  true as is_active
FROM auth.users u
WHERE 
  -- Seulement les utilisateurs avec le rôle 'owner'
  u.raw_user_meta_data->>'role' = 'owner'
  -- Qui n'existent pas déjà dans la table owners
  AND NOT EXISTS (
    SELECT 1 FROM public.owners o WHERE o.id = u.id
  )
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 2. VÉRIFICATION
-- ========================================

-- Afficher les utilisateurs qui ont été ajoutés
DO $$
DECLARE
  owner_count INTEGER;
  auth_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO owner_count FROM public.owners;
  SELECT COUNT(*) INTO auth_count FROM auth.users WHERE raw_user_meta_data->>'role' = 'owner';
  
  RAISE NOTICE '✅ Nombre de propriétaires dans la table owners: %', owner_count;
  RAISE NOTICE '✅ Nombre d''utilisateurs avec rôle owner dans auth.users: %', auth_count;
  
  IF owner_count = auth_count THEN
    RAISE NOTICE '✅✅ Tous les utilisateurs owner ont un enregistrement dans la table owners !';
  ELSE
    RAISE NOTICE '⚠️ Il y a une différence de % utilisateurs', (auth_count - owner_count);
  END IF;
END $$;

-- ========================================
-- 3. AMÉLIORER LE TRIGGER
-- ========================================

-- Recréer le trigger pour qu'il fonctionne correctement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Fonction améliorée pour gérer les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier si c'est un propriétaire
  IF NEW.raw_user_meta_data->>'role' = 'owner' THEN
    -- Insérer dans la table owners (avec gestion des conflits)
    INSERT INTO public.owners (id, email, full_name, phone, is_active)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.raw_user_meta_data->>'phone',
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      is_active = EXCLUDED.is_active;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 4. POLITIQUE RLS POUR L'INSERTION
-- ========================================

-- S'assurer que la politique d'insertion permet au système d'insérer
DROP POLICY IF EXISTS "System can insert owners" ON public.owners;

CREATE POLICY "System can insert owners"
  ON public.owners FOR INSERT
  WITH CHECK (true);

-- ========================================
-- TERMINÉ !
-- ========================================

RAISE NOTICE '═══════════════════════════════════════════════════════';
RAISE NOTICE '✅ Correction terminée !';
RAISE NOTICE '';
RAISE NOTICE 'Les utilisateurs existants ont été ajoutés à la table owners.';
RAISE NOTICE 'Le trigger a été amélioré pour gérer les nouveaux utilisateurs.';
RAISE NOTICE '';
RAISE NOTICE 'Vous pouvez maintenant créer des logements sans erreur !';
RAISE NOTICE '═══════════════════════════════════════════════════════';
