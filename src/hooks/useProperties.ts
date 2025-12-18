import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { Property } from '../types/database';
import { Logement } from '../types/logement';

/**
 * Hook to fetch and manage properties from Supabase
 * Converts database Property format to frontend Logement format
 */
export function useProperties() {
  const [properties, setProperties] = useState<Logement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('properties_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
        },
        () => {
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'disponible')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching properties:', fetchError);
        setError(fetchError.message);
        return;
      }

      // Convert Property[] to Logement[]
      const logements: Logement[] = (data || []).map(propertyToLogement);
      setProperties(logements);
    } catch (err) {
      console.error('Unexpected error fetching properties:', err);
      setError('Erreur lors du chargement des logements');
    } finally {
      setLoading(false);
    }
  };

  return { properties, loading, error, refetch: fetchProperties };
}

/**
 * Convert database Property to frontend Logement format
 */
export function propertyToLogement(property: Property): Logement {
  // Calculate available date text
  const availableText = property.status === 'disponible' 
    ? 'Disponible maintenant' 
    : 'Non disponible';

  // Use image_url if available, otherwise use a placeholder
  const imageUrl = property.image_url || 'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2Mzk3NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080';

  return {
    id: property.id,
    title: property.title,
    type: property.type,
    price: property.price,
    distance: property.distance_min,
    address: property.address,
    image: imageUrl,
    images: [imageUrl], // For now, single image. Later we can add multiple images support
    description: property.description,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    surface: property.surface,
    available: availableText,
    services: property.services || [],
    furnished: property.furnished,
    utilities: property.utilities || 'Non inclus',
    owner_id: property.owner_id, // Include owner_id for contact messages
  };
}