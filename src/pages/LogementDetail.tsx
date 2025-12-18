import { motion } from 'motion/react';
import { useState } from 'react';
import {
  MapPin,
  Heart,
  Bed,
  Bath,
  Maximize,
  Calendar,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Mail,
  Phone,
} from 'lucide-react';
import { Logement } from '../types/logement';
import { LogementCard } from '../components/LogementCard';
import { ImageCarousel } from '../components/ImageCarousel';
import { ContactPropertyForm } from '../components/ContactPropertyForm';
import { usePropertyImages } from '../hooks/usePropertyImages';

interface LogementDetailProps {
  logement: Logement;
  similarLogements: Logement[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onViewLogement: (id: string) => void;
  favorites: string[];
}

export function LogementDetail({
  logement,
  similarLogements,
  isFavorite,
  onToggleFavorite,
  onBack,
  onViewLogement,
  favorites,
}: LogementDetailProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const { images } = usePropertyImages(logement.id);

  // Use carousel images or fallback to logement images
  const displayImages = images.length > 0 ? images : (logement.images || [logement.image]).filter(Boolean);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-uqac-green transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </motion.button>
      </div>

      {/* Hero Image Carousel with Parallax */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[500px] overflow-hidden"
      >
        <ImageCarousel 
          images={displayImages}
          alt={logement.title}
          className="h-full"
        />

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleFavorite(logement.id)}
          className="absolute top-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl z-20"
        >
          <Heart
            className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </motion.button>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-block bg-uqac-green text-white px-4 py-1 rounded-full text-sm mb-3">
                    {logement.type}
                  </div>
                  <h2 className="mb-2">{logement.title}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-uqac-green" />
                    <span>{logement.address}</span>
                    <span className="text-uqac-green ml-2">• {logement.distance} km de l'UQAC</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-light rounded-2xl">
                {logement.bedrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6 text-uqac-green" />
                    <div>
                      <div className="text-sm text-gray-600">Chambres</div>
                      <div>{logement.bedrooms}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Bath className="w-6 h-6 text-uqac-green" />
                  <div>
                    <div className="text-sm text-gray-600">Salle de bain</div>
                    <div>{logement.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Maximize className="w-6 h-6 text-uqac-green" />
                  <div>
                    <div className="text-sm text-gray-600">Surface</div>
                    <div>{logement.surface} m²</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-uqac-green" />
                  <div>
                    <div className="text-sm text-gray-600">Disponibilité</div>
                    <div className="text-sm">{logement.available}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="mb-4">Description</h4>
              <p className="text-gray-600 leading-relaxed">{logement.description}</p>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="mb-4">Services inclus</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {logement.services.map((service, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-4 bg-gray-light rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5 text-uqac-green flex-shrink-0" />
                    <span>{service}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="mb-4">Localisation</h4>
              <div className="bg-gray-light rounded-2xl h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-uqac-green" />
                  <p>Carte interactive</p>
                  <p className="text-sm">{logement.address}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 space-y-6"
            >
              {/* Price Card */}
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl text-uqac-green">{logement.price} $</span>
                  <span className="text-gray-600">/mois</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services</span>
                    <span>{logement.utilities}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meublé</span>
                    <span>{logement.furnished ? 'Oui' : 'Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disponibilité</span>
                    <span className="text-sm">{logement.available}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-uqac-green text-white py-4 rounded-2xl hover:bg-uqac-green-light transition-colors mb-3"
                >
                  Contacter le propriétaire
                </motion.button>

                <p className="text-xs text-gray-500 text-center">
                  Réponse généralement en moins de 24h
                </p>
              </div>

              {/* Contact Form */}
              {showContactForm && logement.owner_id && (
                <ContactPropertyForm
                  propertyId={logement.id}
                  ownerId={logement.owner_id}
                  propertyTitle={logement.title}
                />
              )}

              {/* Show message if owner_id is missing */}
              {showContactForm && !logement.owner_id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-6"
                >
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Le formulaire de contact n'est pas disponible pour ce logement.
                    Il s'agit probablement d'un logement de démonstration.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Similar Logements */}
      {similarLogements.length > 0 && (
        <section className="bg-gray-light py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              Logements similaires
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarLogements.map((similar, index) => (
                <motion.div
                  key={similar.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LogementCard
                    logement={similar}
                    isFavorite={favorites.includes(similar.id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={() => onViewLogement(similar.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}