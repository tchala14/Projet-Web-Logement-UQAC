import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

export function useFavoritesCount(propertyId: string | null | undefined) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      setCount(0);
      return;
    }

    loadCount();
  }, [propertyId]);

  const loadCount = async () => {
    if (!propertyId) return;

    setLoading(true);
    try {
      const { count: favCount, error } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId);

      if (error) throw error;

      setCount(favCount || 0);
    } catch (error) {
      console.error('Error loading favorites count:', error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  return { count, loading, reload: loadCount };
}
