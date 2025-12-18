import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { LogementCard } from '../components/LogementCard';
import { EmptyState } from '../components/EmptyState';
import { Logement } from '../types/logement';

interface LogementsProps {
  logements: Logement[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewLogement: (id: string) => void;
}

export function Logements({ logements, favorites, onToggleFavorite, onViewLogement }: LogementsProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [distanceFilter, setDistanceFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filters = [
    { id: 'furnished', label: 'Meublé' },
    { id: 'available', label: 'Disponible maintenant' },
    { id: 'utilities', label: 'Services inclus' },
    { id: 'parking', label: 'Stationnement' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId]
    );
  };

  const filteredLogements = logements.filter((logement) => {
    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      if (logement.price < min || logement.price > max) return false;
    }

    // Distance filter
    if (distanceFilter !== 'all') {
      const maxDistance = Number(distanceFilter);
      if (logement.distance > maxDistance) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && logement.type !== typeFilter) return false;

    // Custom filters
    if (selectedFilters.includes('furnished') && !logement.furnished) return false;
    if (selectedFilters.includes('available') && logement.available !== 'Disponible maintenant')
      return false;
    if (selectedFilters.includes('utilities') && logement.utilities !== 'Inclus') return false;
    if (
      selectedFilters.includes('parking') &&
      !logement.services.some((s) => s.toLowerCase().includes('stationnement'))
    )
      return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-light pt-20">
      {/* Sticky Filter Bar */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: scrolled ? -10 : 0 }}
        className={`sticky top-20 z-40 bg-white border-b transition-all duration-300 ${
          scrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-uqac-green flex-shrink-0" />

            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                    selectedFilters.includes(filter.id)
                      ? 'bg-uqac-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                  {selectedFilters.includes(filter.id) && (
                    <X className="w-3 h-3 inline ml-1" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Dropdowns */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-100 text-sm border-0 outline-none cursor-pointer"
            >
              <option value="all">Tous les prix</option>
              <option value="0-900">Moins de 900$</option>
              <option value="900-1200">900$ - 1200$</option>
              <option value="1200-1500">1200$ - 1500$</option>
              <option value="1500-10000">Plus de 1500$</option>
            </select>

            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-100 text-sm border-0 outline-none cursor-pointer"
            >
              <option value="all">Toutes distances</option>
              <option value="0.5">Moins de 0.5 km</option>
              <option value="1">Moins de 1 km</option>
              <option value="2">Moins de 2 km</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-100 text-sm border-0 outline-none cursor-pointer"
            >
              <option value="all">Tous les types</option>
              <option value="Studio">Studio</option>
              <option value="3½">3½</option>
              <option value="4½">4½</option>
              <option value="5½">5½</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-2">Logements disponibles</h2>
          <p className="text-gray-600">
            {filteredLogements.length} logement{filteredLogements.length > 1 ? 's' : ''} disponible
            {filteredLogements.length > 1 ? 's' : ''}
          </p>
        </motion.div>
      </div>

      {/* Logements Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {logements.length === 0 ? (
          <EmptyState
            type="no-properties"
            showActionButton={false}
          />
        ) : filteredLogements.length === 0 ? (
          <EmptyState
            type="no-results"
            showActionButton={true}
            onAction={() => {
              setSelectedFilters([]);
              setPriceRange('all');
              setDistanceFilter('all');
              setTypeFilter('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLogements.map((logement, index) => (
              <motion.div
                key={logement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
      </div>
    </div>
  );
}
