import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../hooks/useAuth';
import { MultiImageUpload } from '../../components/MultiImageUpload';
import { PropertyInsert } from '../../types/property';
import { supabase } from '../../utils/supabase/client';
import { ensureOwnerRecord } from '../../utils/ensureOwnerRecord';

interface PropertyImage {
  id?: string;
  property_id?: string;
  image_url: string;
  display_order: number;
}

interface PropertyFormProps {
  propertyId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function PropertyForm({ propertyId, onBack, onSuccess }: PropertyFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    distance_min: '',
    type: 'Studio',
    status: 'disponible' as 'disponible' | 'pris' | 'suspendu',
    bedrooms: '0',
    bathrooms: '1',
    surface: '',
    furnished: false,
    utilities: 'Non inclus',
    services: [] as string[],
  });

  useEffect(() => {
    if (propertyId) {
      loadProperty();
      loadImages();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    if (!propertyId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price.toString(),
          address: data.address,
          distance_min: data.distance_min.toString(),
          type: data.type,
          status: data.status,
          bedrooms: data.bedrooms.toString(),
          bathrooms: data.bathrooms.toString(),
          surface: data.surface.toString(),
          furnished: data.furnished,
          utilities: data.utilities,
          services: data.services || [],
        });
      }
    } catch (error) {
      console.error('Error loading property:', error);
      setError('Erreur lors du chargement du logement');
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    if (!propertyId) return;

    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        address: formData.address,
        distance_min: parseInt(formData.distance_min),
        type: formData.type,
        status: formData.status,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        surface: parseInt(formData.surface),
        furnished: formData.furnished,
        utilities: formData.utilities,
        services: formData.services,
        image_url: images.length > 0 ? images[0].image_url : null,
        updated_at: new Date().toISOString(),
      };

      if (propertyId) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId);

        if (error) throw error;
        toast.success('✅ Logement mis à jour avec succès !');
      } else {
        // IMPORTANT: Ensure the owner record exists before creating the property
        // This prevents the foreign key constraint error
        try {
          await ensureOwnerRecord(user.id, user.email, {
            full_name: user.full_name,
            phone: null,
          });
        } catch (ownerError) {
          console.error('Error ensuring owner record:', ownerError);
          throw new Error('Impossible de vérifier le compte propriétaire. Veuillez contacter le support.');
        }

        // Create new property
        const { data: newProperty, error } = await supabase
          .from('properties')
          .insert({
            ...propertyData,
            owner_id: user.id,
          } as PropertyInsert)
          .select()
          .single();

        if (error) throw error;

        // Save images for new property
        if (newProperty && images.length > 0) {
          const { error: imagesError } = await supabase
            .from('property_images')
            .insert(
              images.map((img, index) => ({
                property_id: newProperty.id,
                image_url: img.image_url,
                display_order: index,
              }))
            );

          if (imagesError) {
            console.error('Error saving images:', imagesError);
            // Don't fail the whole operation if images fail
          }
        }

        toast.success('✅ Logement créé avec succès !');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving property:', error);
      const errorMessage = error.message || 'Erreur lors de la sauvegarde du logement';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const servicesList = [
    'Wi-Fi inclus',
    'Meublé',
    'Chauffage inclus',
    'Stationnement',
    'Laveuse/Sécheuse',
    'Balcon',
    'Animaux acceptés',
    'Gym',
    'Piscine',
  ];

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  if (loading && propertyId) {
    return (
      <div className="min-h-screen bg-gray-light pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-uqac-green border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -4 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-uqac-green transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au tableau de bord</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <h2 className="mb-8">
            {propertyId ? 'Modifier le logement' : 'Ajouter un logement'}
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <MultiImageUpload
              propertyId={propertyId}
              images={images}
              onImagesChange={setImages}
            />

            {/* Title */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">Titre du logement *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Studio moderne près de l'UQAC"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre logement..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors resize-none"
              />
            </div>

            {/* Price and Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Prix mensuel ($) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="1000"
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                >
                  <option value="Studio">Studio</option>
                  <option value="3½">3½</option>
                  <option value="4½">4½</option>
                  <option value="5½">5½</option>
                  <option value="6½">6½</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Statut *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                >
                  <option value="disponible">Disponible</option>
                  <option value="pris">Pris</option>
                  <option value="suspendu">Suspendu</option>
                </select>
              </div>
            </div>

            {/* Address and Distance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-700">Adresse *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Rue des Étudiants, Chicoutimi"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Distance UQAC (min) *</label>
                <input
                  type="number"
                  value={formData.distance_min}
                  onChange={(e) => setFormData({ ...formData, distance_min: e.target.value })}
                  placeholder="5"
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Chambres *</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Salles de bain *</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Surface (m²) *</label>
                <input
                  type="number"
                  value={formData.surface}
                  onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Services inclus *</label>
                <select
                  value={formData.utilities}
                  onChange={(e) => setFormData({ ...formData, utilities: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                >
                  <option value="Inclus">Inclus</option>
                  <option value="Non inclus">Non inclus</option>
                  <option value="Partiellement inclus">Partiellement inclus</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.furnished}
                    onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                    className="w-5 h-5 text-uqac-green rounded focus:ring-uqac-green"
                  />
                  <span className="text-sm text-gray-700">Logement meublé</span>
                </label>
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm mb-3 text-gray-700">Commodités</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {servicesList.map((service) => (
                  <label key={service} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => toggleService(service)}
                      className="w-4 h-4 text-uqac-green rounded focus:ring-uqac-green"
                    />
                    <span className="text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-uqac-green text-white py-4 rounded-xl hover:bg-uqac-green-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Enregistrement...</span>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{propertyId ? 'Mettre à jour' : 'Créer le logement'}</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}