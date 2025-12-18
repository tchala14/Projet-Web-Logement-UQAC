-- Seed Data for UQAC Logement
-- This file contains sample data for testing purposes
-- Execute this AFTER running the initial migration

-- Note: You need to manually create users in Supabase Auth first
-- Then use their IDs here

-- ========================================
-- INSTRUCTIONS
-- ========================================
-- 1. Create test users in Supabase Dashboard:
--    - Go to Authentication > Users
--    - Create users with emails: owner1@test.com, owner2@test.com
--    - Copy their UUIDs
-- 2. Replace 'YOUR_OWNER_1_UUID' and 'YOUR_OWNER_2_UUID' below
-- 3. Run this SQL script in Supabase SQL Editor

-- ========================================
-- SAMPLE OWNERS
-- ========================================
-- These will be automatically created when users sign up
-- But you can manually insert them for testing:

-- INSERT INTO owners (id, email, full_name, phone, is_active) VALUES
-- ('YOUR_OWNER_1_UUID', 'owner1@test.com', 'Jean Tremblay', '(418) 555-0123', true),
-- ('YOUR_OWNER_2_UUID', 'owner2@test.com', 'Marie Gagnon', '(418) 555-0456', true);

-- ========================================
-- SAMPLE PROPERTIES
-- ========================================
-- Replace 'YOUR_OWNER_1_UUID' with the actual UUID from the owner

-- Property 1: Studio for Owner 1
INSERT INTO properties (
  owner_id,
  title,
  description,
  price,
  address,
  distance_min,
  type,
  status,
  bedrooms,
  bathrooms,
  surface,
  furnished,
  utilities,
  services
) VALUES (
  'YOUR_OWNER_1_UUID',  -- Replace with actual UUID
  'Studio moderne près de l''UQAC',
  'Studio lumineux et moderne, parfait pour un étudiant. Entièrement rénové avec cuisine équipée et salle de bain moderne. À quelques minutes à pied de l''UQAC.',
  850,
  '123 Rue des Étudiants, Chicoutimi, QC',
  5,
  'Studio',
  'disponible',
  0,
  1,
  35,
  true,
  'Inclus',
  ARRAY['Wi-Fi inclus', 'Meublé', 'Chauffage inclus', 'Stationnement']
);

-- Property 2: 3½ for Owner 1
INSERT INTO properties (
  owner_id,
  title,
  description,
  price,
  address,
  distance_min,
  type,
  status,
  bedrooms,
  bathrooms,
  surface,
  furnished,
  utilities,
  services
) VALUES (
  'YOUR_OWNER_1_UUID',  -- Replace with actual UUID
  'Appartement 3½ lumineux',
  'Grand appartement 3½ avec une chambre spacieuse, salon lumineux et cuisine moderne. Idéal pour colocation ou couple étudiant.',
  1100,
  '456 Avenue du Campus, Chicoutimi, QC',
  8,
  '3½',
  'disponible',
  1,
  1,
  65,
  false,
  'Non inclus',
  ARRAY['Wi-Fi inclus', 'Stationnement', 'Balcon', 'Animaux acceptés']
);

-- Property 3: 4½ for Owner 2
INSERT INTO properties (
  owner_id,
  title,
  description,
  price,
  address,
  distance_min,
  type,
  status,
  bedrooms,
  bathrooms,
  surface,
  furnished,
  utilities,
  services
) VALUES (
  'YOUR_OWNER_2_UUID',  -- Replace with actual UUID
  '4½ parfait pour colocation',
  'Appartement spacieux avec 2 chambres fermées, parfait pour partager le loyer. Grandes fenêtres, beaucoup de rangement.',
  1400,
  '789 Boulevard Université, Chicoutimi, QC',
  12,
  '4½',
  'disponible',
  2,
  1,
  85,
  false,
  'Inclus',
  ARRAY['Wi-Fi inclus', 'Laveuse/Sécheuse', 'Stationnement (2 places)', 'Chauffage inclus']
);

-- Property 4: Studio Luxe for Owner 2
INSERT INTO properties (
  owner_id,
  title,
  description,
  price,
  address,
  distance_min,
  type,
  status,
  bedrooms,
  bathrooms,
  surface,
  furnished,
  utilities,
  services
) VALUES (
  'YOUR_OWNER_2_UUID',  -- Replace with actual UUID
  'Studio luxe tout inclus',
  'Studio haut de gamme avec finitions modernes, meublé avec goût. Internet haute vitesse, tous les services inclus.',
  950,
  '321 Rue Principale, Chicoutimi, QC',
  3,
  'Studio',
  'disponible',
  0,
  1,
  40,
  true,
  'Inclus',
  ARRAY['Wi-Fi inclus', 'Meublé', 'Tout inclus', 'Gym', 'Stationnement']
);

-- Property 5: 5½ for Owner 1
INSERT INTO properties (
  owner_id,
  title,
  description,
  price,
  address,
  distance_min,
  type,
  status,
  bedrooms,
  bathrooms,
  surface,
  furnished,
  utilities,
  services
) VALUES (
  'YOUR_OWNER_1_UUID',  -- Replace with actual UUID
  '5½ spacieux pour groupe',
  'Grand appartement avec 3 chambres fermées, parfait pour 3-4 colocataires. Deux salles de bain, grand salon et cuisine spacieuse.',
  1650,
  '555 Chemin Université, Chicoutimi, QC',
  15,
  '5½',
  'pris',
  3,
  2,
  110,
  false,
  'Non inclus',
  ARRAY['Stationnement (3 places)', 'Laveuse/Sécheuse', 'Cour arrière', 'Déneigement inclus']
);

-- Property 6: 3½ Meublé for Owner 2
INSERT INTO properties (
  owner_id,
  title,
  description,
  price,
  address,
  distance_min,
  type,
  status,
  bedrooms,
  bathrooms,
  surface,
  furnished,
  utilities,
  services
) VALUES (
  'YOUR_OWNER_2_UUID',  -- Replace with actual UUID
  '3½ meublé disponible immédiatement',
  'Appartement meublé avec tout le nécessaire pour emménager immédiatement. Idéal pour étudiants internationaux.',
  1250,
  '234 Avenue des Pins, Chicoutimi, QC',
  6,
  '3½',
  'disponible',
  1,
  1,
  70,
  true,
  'Inclus',
  ARRAY['Wi-Fi inclus', 'Meublé', 'Chauffage inclus', 'Stationnement', 'Laveuse/Sécheuse']
);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify your data was inserted correctly

-- Check owners
-- SELECT id, email, full_name, is_active FROM owners;

-- Check properties count per owner
-- SELECT o.full_name, COUNT(p.id) as property_count
-- FROM owners o
-- LEFT JOIN properties p ON o.id = p.owner_id
-- GROUP BY o.id, o.full_name;

-- Check all properties with owner name
-- SELECT p.title, p.price, p.type, p.status, o.full_name as owner
-- FROM properties p
-- JOIN owners o ON p.owner_id = o.id
-- ORDER BY p.created_at DESC;

-- Check properties by status
-- SELECT status, COUNT(*) 
-- FROM properties 
-- GROUP BY status;
