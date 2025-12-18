import { motion } from 'motion/react';
import { Heart, Trash2 } from 'lucide-react';
import { LogementCard } from '../components/LogementCard';
import { EmptyState } from '../components/EmptyState';
import { Logement } from '../types/logement';

interface FavorisProps {
  favoriteLogements: Logement[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewLogement: (id: string) => void;
  onClearFavorites: () => void;
}

export function Favoris({
  favoriteLogements,
  favorites,
  onToggleFavorite,
  onViewLogement,
  onClearFavorites,
}: FavorisProps) {
  return (
    <div className="min-h-screen bg-gray-light pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="mb-2">Mes favoris</h2>
            <p className="text-gray-600">
              {favoriteLogements.length} logement{favoriteLogements.length !== 1 ? 's' : ''} sauvegardé
              {favoriteLogements.length !== 1 ? 's' : ''}
            </p>
          </div>

          {favoriteLogements.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearFavorites}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Tout supprimer</span>
            </motion.button>
          )}
        </motion.div>

        {/* Empty State */}
        {favoriteLogements.length === 0 ? (
          <EmptyState
            type="no-favorites"
            showActionButton={false}
          />
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteLogements.map((logement, index) => (
              <motion.div
                key={logement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <LogementCard
                  logement={logement}
                  isFavorite={favorites.includes(logement.id)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={() => onViewLogement(logement.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {favoriteLogements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-white rounded-3xl p-8 shadow-sm"
          >
            <h4 className="mb-4">Conseil</h4>
            <p className="text-gray-600">
              Contactez plusieurs propriétaires pour augmenter vos chances de trouver le logement idéal. 
              Les logements disponibles partent rapidement, surtout en début de session !
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
