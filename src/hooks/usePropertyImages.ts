import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export function usePropertyImages(propertyId: string | null | undefined) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      setImages([]);
      return;
    }

    loadImages();
  }, [propertyId]);

  const loadImages = async () => {
    if (!propertyId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('image_url')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setImages(data?.map(img => img.image_url) || []);
    } catch (error) {
      console.error('Error loading property images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  return { images, loading, reload: loadImages };
}
