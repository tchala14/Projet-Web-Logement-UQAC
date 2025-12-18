import React, { useState } from 'react';
import { Copy, Check, ExternalLink, AlertCircle } from 'lucide-react';

export function SetupGuide() {
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- ============================================
-- 🚀 MIGRATION UQAC LOGEMENT (VERSION CORRIGÉE)
-- ============================================
-- COPIEZ TOUT CE CODE ET EXÉCUTEZ-LE DANS SUPABASE
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

-- Fonction helper pour récupérer le rôle (avec permissions sécurisées)
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
  EXECUTE FUNCTION public.update_updated_at_column();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h1 className="text-yellow-900 mb-2">
                ⚠️ Configuration Requise
              </h1>
              <p className="text-yellow-800">
                Les tables de la base de données n'ont pas encore été créées. Suivez les étapes ci-dessous pour configurer votre base de données Supabase (2 minutes).
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-[#6D7F33] mb-6">
            📋 Instructions en 4 Étapes
          </h2>

          {/* Step 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#6D7F33] text-white rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <h3 className="text-black">
                Copier le Code SQL
              </h3>
            </div>
            <p className="text-gray-700 ml-11 mb-3">
              Cliquez sur le bouton ci-dessous pour copier le code SQL dans votre presse-papiers.
            </p>
            <div className="ml-11">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-3 bg-[#6D7F33] text-white rounded-lg hover:bg-[#5a6829] transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    <span>Copier le Code SQL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#6D7F33] text-white rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <h3 className="text-black">
                Ouvrir Supabase Dashboard
              </h3>
            </div>
            <p className="text-gray-700 ml-11 mb-3">
              Ouvrez le tableau de bord Supabase dans un nouvel onglet.
            </p>
            <div className="ml-11">
              <a
                href="https://supabase.com/dashboard/project/odsgweajducranfunrkz/editor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8CA24D] text-white rounded-lg hover:bg-[#7a8f42] transition-colors"
              >
                <ExternalLink size={20} />
                <span>Ouvrir Supabase Dashboard</span>
              </a>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#6D7F33] text-white rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <h3 className="text-black">
                Exécuter dans SQL Editor
              </h3>
            </div>
            <div className="ml-11 space-y-2 text-gray-700">
              <p>Dans Supabase Dashboard :</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Cliquez sur <strong className="text-black">"SQL Editor"</strong> dans le menu de gauche (icône {'</>'})</li>
                <li>Cliquez sur <strong className="text-black">"New Query"</strong> (bouton vert en haut à droite)</li>
                <li><strong className="text-black">Collez</strong> le code SQL copié (Ctrl+V ou Cmd+V)</li>
                <li>Cliquez sur <strong className="text-black">"RUN"</strong> (bouton ▶️ en bas à droite)</li>
                <li>Attendez 2-3 secondes jusqu'à voir <strong className="text-green-600">"✅ Success"</strong></li>
              </ol>
            </div>
          </div>

          {/* Step 4 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#6D7F33] text-white rounded-full flex items-center justify-center flex-shrink-0">
                4
              </div>
              <h3 className="text-black">
                Actualiser Cette Page
              </h3>
            </div>
            <p className="text-gray-700 ml-11 mb-3">
              Une fois le code SQL exécuté avec succès, actualisez cette page.
            </p>
            <div className="ml-11">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                🔄 Actualiser la Page
              </button>
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-[#6D7F33] mb-4">
            📄 Aperçu du Code SQL
          </h2>
          <p className="text-gray-700 mb-4">
            Ce code crée les tables nécessaires, configure les permissions et les triggers automatiques.
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-gray-100 text-sm">
              <code>{sqlCode.substring(0, 800)}...</code>
            </pre>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Aperçu des 800 premiers caractères. Le code complet sera copié.
          </p>
        </div>

        {/* Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-blue-900 mb-2">
            💡 Besoin d'Aide ?
          </h3>
          <p className="text-blue-800 mb-3">
            Si vous rencontrez des difficultés, consultez les guides de documentation :
          </p>
          <ul className="text-blue-700 space-y-1 ml-4">
            <li>• <strong>/START_HERE.md</strong> - Guide de démarrage simple</li>
            <li>• <strong>/INSTRUCTIONS_VISUELLES.md</strong> - Instructions détaillées avec captures</li>
            <li>• <strong>/CORRIGER_ERREUR.md</strong> - Résolution des problèmes courants</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
