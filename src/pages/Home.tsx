import { motion } from 'motion/react';
import { Search, Shield, Clock, Users, TrendingUp, MapPin } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { LogementCard } from '../components/LogementCard';
import { EmptyState } from '../components/EmptyState';
import { Logement } from '../types/logement';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomeProps {
  logements: Logement[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onNavigateToLogements: () => void;
  onViewLogement: (id: string) => void;
}

export function Home({ logements, favorites, onToggleFavorite, onNavigateToLogements, onViewLogement }: HomeProps) {
  const features = [
    {
      icon: Search,
      title: 'Recherche simplifiée',
      description: 'Trouvez votre logement idéal en quelques clics avec nos filtres avancés.',
    },
    {
      icon: Shield,
      title: 'Logements vérifiés',
      description: 'Tous les logements sont vérifiés pour garantir votre sécurité et confort.',
    },
    {
      icon: Clock,
      title: 'Disponibilité en temps réel',
      description: 'Consultez les disponibilités mises à jour quotidiennement.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Logements disponibles' },
    { value: '2000+', label: 'Étudiants satisfaits' },
    { value: '0.5 km', label: 'Distance moyenne du campus' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #6D7F33 0%, #8CA24D 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1687866394811-9fe40749c860?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2NDA1OTQ1OHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="UQAC Campus"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-white mb-6">
              Trouvez votre logement étudiant<br />près de l'UQAC
            </h1>
            <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto">
              La plateforme de référence pour les étudiants de l'Université du Québec à Chicoutimi
            </p>
          </motion.div>

          {/* Search Bar */}
          <SearchBar onSearch={onNavigateToLogements} />

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white"
              >
                <div className="text-4xl mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Popular Listings */}
      <section className="py-32 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4">Logements populaires</h2>
            <p className="text-gray-600 text-lg">
              Découvrez nos logements les plus demandés par les étudiants
            </p>
          </motion.div>

          {logements.length === 0 ? (
            <EmptyState
              type="no-properties"
              showActionButton={true}
              onAction={onNavigateToLogements}
              actionLabel="Explorer les logements"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {logements.slice(0, 6).map((logement, index) => (
                <motion.div
                  key={logement.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToLogements}
              className="bg-uqac-green text-white px-8 py-4 rounded-2xl hover:bg-uqac-green-light transition-colors"
            >
              Voir tous les logements
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4">Pourquoi choisir notre plateforme ?</h2>
            <p className="text-gray-600 text-lg">
              Une expérience optimisée pour les étudiants de l'UQAC
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -8 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-uqac-green/10 rounded-3xl mb-6"
                  >
                    <Icon className="w-10 h-10 text-uqac-green" />
                  </motion.div>
                  <h4 className="mb-3">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-uqac-green to-uqac-green-light" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white mb-6">
              Prêt à trouver votre logement idéal ?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Rejoignez des milliers d'étudiants qui ont trouvé leur logement grâce à notre plateforme
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToLogements}
              className="bg-uqac-green text-white px-8 py-4 rounded-2xl hover:bg-uqac-green-light transition-colors inline-flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Commencer la recherche</span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
