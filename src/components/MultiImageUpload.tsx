import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';

interface PropertyImage {
  id?: string;
  image_url: string;
  display_order: number;
}

interface MultiImageUploadProps {
  propertyId?: string;
  images: PropertyImage[];
  onImagesChange: (images: PropertyImage[]) => void;
}

export function MultiImageUpload({ propertyId, images, onImagesChange }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate total images (max 10)
    if (images.length + files.length > 10) {
      toast.error('❌ Maximum 10 images par logement');
      return;
    }

    setUploading(true);

    try {
      const newImages: PropertyImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`❌ ${file.name} n'est pas une image`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`❌ ${file.name} dépasse 5 MB`);
          continue;
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uqac-logements')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('uqac-logements')
          .getPublicUrl(filePath);

        newImages.push({
          image_url: publicUrl,
          display_order: images.length + newImages.length,
        });
      }

      // If we have a propertyId, save to database immediately
      if (propertyId && newImages.length > 0) {
        const { error } = await supabase
          .from('property_images')
          .insert(
            newImages.map(img => ({
              property_id: propertyId,
              image_url: img.image_url,
              display_order: img.display_order,
            }))
          );

        if (error) throw error;

        // Reload images from database to get IDs
        const { data, error: fetchError } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .order('display_order');

        if (fetchError) throw fetchError;

        onImagesChange(data || []);
        toast.success(`✅ ${newImages.length} image(s) ajoutée(s)`);
      } else {
        // Just add to state for new properties
        onImagesChange([...images, ...newImages]);
        toast.success(`✅ ${newImages.length} image(s) ajoutée(s)`);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(`❌ ${err.message || 'Erreur lors de l\'upload'}`);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index];

    try {
      // Delete from storage
      const urlParts = imageToRemove.image_url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'uqac-logements');
      if (bucketIndex !== -1) {
        const filePath = urlParts.slice(bucketIndex + 1).join('/');
        await supabase.storage.from('uqac-logements').remove([filePath]);
      }

      // If we have a propertyId and image ID, delete from database
      if (propertyId && imageToRemove.id) {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('id', imageToRemove.id);

        if (error) throw error;
      }

      // Update local state
      const newImages = images.filter((_, i) => i !== index);
      // Reorder remaining images
      const reorderedImages = newImages.map((img, i) => ({
        ...img,
        display_order: i,
      }));

      onImagesChange(reorderedImages);
      toast.success('🗑️ Image supprimée');
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error(`❌ ${err.message || 'Erreur lors de la suppression'}`);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    // Reorder
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      display_order: i,
    }));

    onImagesChange(reorderedImages);

    // If we have a propertyId, update order in database
    if (propertyId) {
      updateImageOrder(reorderedImages);
    }
  };

  const updateImageOrder = async (orderedImages: PropertyImage[]) => {
    try {
      for (const img of orderedImages) {
        if (img.id) {
          await supabase
            .from('property_images')
            .update({ display_order: img.display_order })
            .eq('id', img.id);
        }
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm text-gray-700">
          Photos du logement ({images.length}/10)
        </label>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current?.click()}
          type="button"
          disabled={uploading || images.length >= 10}
          className="bg-uqac-green text-white px-4 py-2 rounded-xl hover:bg-uqac-green-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Ajouter des photos</span>
        </motion.button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="popLayout">
        {images.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="aspect-video rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 bg-gray-50"
          >
            <div className="p-4 bg-uqac-green bg-opacity-10 rounded-full">
              <ImageIcon className="w-8 h-8 text-uqac-green" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700">Aucune photo ajoutée</p>
              <p className="text-sm text-gray-500 mt-1">
                Cliquez sur "Ajouter des photos" pour commencer
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={image.id || index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={image.image_url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Badge for first image */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-uqac-green text-white text-xs px-2 py-1 rounded-full">
                    Photo principale
                  </div>
                )}

                {/* Order indicator */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                  {index + 1}
                </div>

                {/* Remove button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(index)}
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </motion.button>

                {/* Move buttons */}
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => moveImage(index, index - 1)}
                      type="button"
                      className="bg-black bg-opacity-50 text-white p-1.5 rounded-full hover:bg-opacity-70 transition-colors"
                      title="Déplacer à gauche"
                    >
                      <GripVertical className="w-3 h-3 rotate-90" />
                    </motion.button>
                  )}
                  {index < images.length - 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => moveImage(index, index + 1)}
                      type="button"
                      className="bg-black bg-opacity-50 text-white p-1.5 rounded-full hover:bg-opacity-70 transition-colors"
                      title="Déplacer à droite"
                    >
                      <GripVertical className="w-3 h-3 -rotate-90" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {uploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin text-uqac-green" />
          <span>Upload en cours...</span>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Conseils :</strong>
        </p>
        <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
          <li>La première photo sera l'image principale de votre annonce</li>
          <li>Vous pouvez réorganiser les photos en cliquant sur les flèches</li>
          <li>Maximum 10 photos par logement (JPG, PNG ou WEBP, max. 5 MB chacune)</li>
          <li>Des photos lumineuses et de qualité attirent plus d'étudiants !</li>
        </ul>
      </div>
    </div>
  );
}
