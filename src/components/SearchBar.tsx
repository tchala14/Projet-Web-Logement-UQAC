import { motion } from 'motion/react';
import { Search, MapPin, DollarSign, Home } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string, budget: string, type: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl shadow-2xl p-2 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
          <MapPin className="w-5 h-5 text-uqac-green flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Localisation</label>
            <input
              type="text"
              placeholder="Près de l'UQAC"
              className="w-full border-0 outline-none text-sm text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
          <DollarSign className="w-5 h-5 text-uqac-green flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Budget max</label>
            <input
              type="text"
              placeholder="1000 $"
              className="w-full border-0 outline-none text-sm text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
          <Home className="w-5 h-5 text-uqac-green flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Type de logement</label>
            <select className="w-full border-0 outline-none text-sm text-gray-900">
              <option>Tous les types</option>
              <option>Studio</option>
              <option>3½</option>
              <option>4½</option>
              <option>5½</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-center justify-center px-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-uqac-green text-white rounded-2xl px-6 py-4 flex items-center justify-center gap-2 hover:bg-uqac-green-light transition-colors"
            onClick={() => onSearch?.('', '', '')}
          >
            <Search className="w-5 h-5" />
            <span>Rechercher</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
