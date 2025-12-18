import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      // Load from localStorage for non-authenticated users
      const stored = localStorage.getItem('favorites');
      setFavorites(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const favIds = data?.map(fav => fav.property_id) || [];
      setFavorites(favIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      // For non-authenticated users, use localStorage
      setFavorites(prev => {
        const newFavorites = prev.includes(propertyId)
          ? prev.filter(id => id !== propertyId)
          : [...prev, propertyId];
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      });
      return;
    }

    try {
      const isFavorite = favorites.includes(propertyId);

      if (isFavorite) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;

        setFavorites(prev => prev.filter(id => id !== propertyId));
      } else {
        // Add favorite
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            property_id: propertyId,
          });

        if (error) throw error;

        setFavorites(prev => [...prev, propertyId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const clearFavorites = async () => {
    if (!user) {
      setFavorites([]);
      localStorage.removeItem('favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    clearFavorites,
    isFavorite: (propertyId: string) => favorites.includes(propertyId),
  };
}
