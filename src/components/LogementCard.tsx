import { motion } from 'motion/react';
import { MapPin, Heart } from 'lucide-react';
import { Logement } from '../types/logement';
import { ImageCarousel } from './ImageCarousel';
import { usePropertyImages } from '../hooks/usePropertyImages';

interface LogementCardProps {
  logement: Logement;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onClick?: () => void;
}

export function LogementCard({ logement, isFavorite = false, onToggleFavorite, onClick }: LogementCardProps) {
  const { images } = usePropertyImages(logement.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer"
      onClick={onClick}
    >
      {/* Image Carousel */}
      <div className="relative h-48 overflow-hidden">
        <ImageCarousel 
          images={images.length > 0 ? images : (logement.image ? [logement.image] : [])}
          alt={logement.title}
          className="h-full"
        />
        
        {/* Badge Type */}
        <div className="absolute top-4 left-4 bg-uqac-green text-white px-4 py-2 rounded-full z-20">
          {logement.type}
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(logement.id);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-20"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="mb-2 text-black">{logement.title}</h4>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-4 h-4 text-uqac-green" />
          <span className="text-sm">{logement.distance} km de l'UQAC</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-uqac-green">{logement.price} $</span>
            <span className="text-gray-500 text-sm">/mois</span>
          </div>
          
          {logement.furnished && (
            <span className="text-xs bg-gray-light px-3 py-1 rounded-full text-gray-700">
              Meublé
            </span>
          )}
        </div>

        {logement.available === 'Disponible maintenant' && (
          <div className="mt-4 text-xs text-uqac-green px-3 py-2 bg-green-50 rounded-lg text-center">
            ✓ {logement.available}
          </div>
        )}
      </div>
    </motion.div>
  );
}