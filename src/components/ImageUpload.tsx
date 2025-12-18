import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase/client';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
}

export function ImageUpload({ currentImageUrl, onImageUploaded, onImageRemoved }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image doit faire moins de 5 MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

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

      onImageUploaded(publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Erreur lors de l\'upload');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentImageUrl) return;

    try {
      // Extract file path from URL
      const urlParts = currentImageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'uqac-logements');
      if (bucketIndex !== -1) {
        const filePath = urlParts.slice(bucketIndex + 1).join('/');
        
        // Delete from storage
        await supabase.storage
          .from('uqac-logements')
          .remove([filePath]);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }

    setPreview(null);
    onImageRemoved();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm mb-2 text-gray-700">
        Photo du logement
      </label>

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              
              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                type="button"
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              type="button"
              disabled={uploading}
              className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-300 hover:border-uqac-green transition-colors flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 className="w-12 h-12 text-uqac-green animate-spin" />
              ) : (
                <>
                  <div className="p-4 bg-uqac-green bg-opacity-10 rounded-full">
                    <ImageIcon className="w-8 h-8 text-uqac-green" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-700">Cliquez pour ajouter une photo</p>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG ou WEBP (max. 5 MB)
                    </p>
                  </div>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm"
        >
          {error}
        </motion.div>
      )}

      <p className="text-xs text-gray-500">
        💡 Une belle photo attire plus d'étudiants ! Prenez une photo lumineuse de votre logement.
      </p>
    </div>
  );
}
