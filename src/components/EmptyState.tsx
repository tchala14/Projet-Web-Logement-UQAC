import { motion } from 'motion/react';
import { Home, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  type?: 'no-properties' | 'no-favorites' | 'no-results';
  message?: string;
  description?: string;
  showActionButton?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  type = 'no-properties',
  message,
  description,
  showActionButton = true,
  onAction,
  actionLabel,
}: EmptyStateProps) {
  const configs = {
    'no-properties': {
      icon: Home,
      defaultMessage: 'Aucun logement disponible',
      defaultDescription: 'Il n\'y a actuellement aucun logement disponible dans notre base de données. Les propriétaires peuvent ajouter leurs logements pour qu\'ils apparaissent ici.',
      defaultActionLabel: 'Explorer les options',
    },
    'no-favorites': {
      icon: Search,
      defaultMessage: 'Aucun favori enregistré',
      defaultDescription: 'Vous n\'avez pas encore ajouté de logements à vos favoris. Parcourez les annonces et cliquez sur le cœur pour sauvegarder vos préférés.',
      defaultActionLabel: 'Parcourir les logements',
    },
    'no-results': {
      icon: Search,
      defaultMessage: 'Aucun résultat trouvé',
      defaultDescription: 'Essayez de modifier vos critères de recherche ou vos filtres pour voir plus de résultats.',
      defaultActionLabel: 'Réinitialiser les filtres',
    },
  };

  const config = configs[type];
  const Icon = config.icon;
  const displayMessage = message || config.defaultMessage;
  const displayDescription = description || config.defaultDescription;
  const displayActionLabel = actionLabel || config.defaultActionLabel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
      >
        <Icon className="w-12 h-12 text-gray-400" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-900 mb-2 text-center"
      >
        {displayMessage}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 text-center max-w-md mb-8"
      >
        {displayDescription}
      </motion.p>

      {showActionButton && onAction && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="bg-uqac-green text-white px-6 py-3 rounded-xl hover:bg-uqac-green-light transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {displayActionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
