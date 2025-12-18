import { motion } from 'motion/react';
import { Edit, Trash2, MapPin, DollarSign, Heart, Mail } from 'lucide-react';
import { Property } from '../types/database';
import { ImageCarousel } from './ImageCarousel';
import { usePropertyImages } from '../hooks/usePropertyImages';
import { useFavoritesCount } from '../hooks/useFavoritesCount';

interface PropertyCardProps {
  property: Property;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: 'disponible' | 'pris' | 'suspendu') => void;
  messagesCount?: number;
  newMessagesCount?: number;
}

export function PropertyCard({ property, onEdit, onDelete, onStatusChange, messagesCount, newMessagesCount }: PropertyCardProps) {
  const { images } = usePropertyImages(property.id);
  const { count: favoritesCount } = useFavoritesCount(property.id);
  
  const statusColors = {
    disponible: 'bg-green-100 text-green-700 border-green-200',
    pris: 'bg-orange-100 text-orange-700 border-orange-200',
    suspendu: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const statusLabels = {
    disponible: 'Disponible',
    pris: 'Pris',
    suspendu: 'Suspendu',
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg"
    >
      {/* Image Carousel */}
      <ImageCarousel 
        images={images.length > 0 ? images : (property.image_url ? [property.image_url] : [])}
        alt={property.title}
        className="h-48"
      />

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-black flex-1">{property.title}</h4>
          <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[property.status]}`}>
            {statusLabels[property.status]}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4 text-uqac-green" />
            <span>{property.distance_min} min</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-uqac-green" />
            <span className="text-uqac-green">{property.price} $</span>
          </div>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
            {property.type}
          </span>
        </div>

        {/* Favorites Count */}
        {favoritesCount > 0 && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-pink-50 rounded-lg">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span className="text-sm text-pink-700">
              Ajouté aux favoris {favoritesCount} fois
            </span>
          </div>
        )}

        {/* Messages Count */}
        {messagesCount !== undefined && messagesCount > 0 && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-blue-50 rounded-lg">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-700">
              {messagesCount} message{messagesCount > 1 ? 's' : ''}
              {newMessagesCount && newMessagesCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs">
                  {newMessagesCount} nouveau{newMessagesCount > 1 ? 'x' : ''}
                </span>
              )}
            </span>
          </div>
        )}

        {/* Status Change Buttons */}
        <div className="flex gap-2 mb-4">
          {(['disponible', 'pris', 'suspendu'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(property.id, status)}
              disabled={property.status === status}
              className={`flex-1 px-3 py-2 rounded-lg text-xs transition-colors ${
                property.status === status
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="flex-1 bg-uqac-green text-white py-2 rounded-xl hover:bg-uqac-green-light transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}