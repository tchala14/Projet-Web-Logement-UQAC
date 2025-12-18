import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Home, LogOut, Edit, Trash2, Eye, EyeOff, ArrowLeft, List, Inbox, Building2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import { supabase } from '../../utils/supabase/client';
import { Property } from '../../types/database';
import { PropertyCard } from '../../components/PropertyCard';
import { MessagesInbox } from '../../components/MessagesInbox';

interface DashboardProps {
  onLogout: () => void;
  onCreateProperty: () => void;
  onEditProperty: (id: string) => void;
  onNavigate: (page: string) => void;
}

export function Dashboard({ onLogout, onCreateProperty, onEditProperty, onNavigate }: DashboardProps) {
  const { user, signOut } = useAuth();
  const { messages, updateMessageStatus, getMessagesByProperty, getNewMessagesByProperty } = useMessages(user?.id);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'disponible' | 'pris' | 'suspendu'>('all');

  useEffect(() => {
    loadProperties();
    // Messages are loaded automatically by the useMessages hook
  }, [user]);

  const loadProperties = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'disponible' | 'pris' | 'suspendu') => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setProperties(prev =>
        prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
      );
      
      const statusText = newStatus === 'disponible' ? 'Disponible' : newStatus === 'pris' ? 'Pris' : 'Suspendu';
      toast.success(`✅ Statut changé en "${statusText}"`);
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('❌ Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce logement ?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('🗑️ Logement supprimé avec succès');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('❌ Erreur lors de la suppression du logement');
    }
  };

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const filteredProperties = filter === 'all'
    ? properties
    : properties.filter(p => p.status === filter);

  const stats = {
    total: properties.length,
    disponible: properties.filter(p => p.status === 'disponible').length,
    pris: properties.filter(p => p.status === 'pris').length,
    suspendu: properties.filter(p => p.status === 'suspendu').length,
  };

  return (
    <div className="min-h-screen bg-gray-light pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
        >
          <div>
            <h2 className="mb-2">Tableau de bord</h2>
            <p className="text-gray-600">
              Bienvenue, {user?.full_name || user?.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('accueil')}
              className="bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('logements')}
              className="bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 border border-gray-200"
            >
              <List className="w-4 h-4" />
              <span>Voir les logements</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateProperty}
              className="bg-uqac-green text-white px-6 py-3 rounded-xl hover:bg-uqac-green-light transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter un logement</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-500' },
            { label: 'Disponibles', value: stats.disponible, color: 'bg-green-500' },
            { label: 'Pris', value: stats.pris, color: 'bg-orange-500' },
            { label: 'Suspendus', value: stats.suspendu, color: 'bg-gray-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className={`inline-block w-3 h-3 rounded-full ${stat.color} mb-2`} />
              <div className="text-3xl mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'disponible', label: 'Disponibles' },
            { id: 'pris', label: 'Pris' },
            { id: 'suspendu', label: 'Suspendus' },
          ].map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id as any)}
              className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-uqac-green text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* Properties List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-uqac-green border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 mt-4">Chargement...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4">
              <Home className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="mb-2">Aucun logement trouvé</h4>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'Commencez par ajouter votre premier logement'
                : `Aucun logement ${filter}`}
            </p>
            {filter === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateProperty}
                className="bg-uqac-green text-white px-6 py-3 rounded-xl"
              >
                Ajouter un logement
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PropertyCard
                  property={property}
                  onEdit={() => onEditProperty(property.id)}
                  onDelete={() => handleDelete(property.id)}
                  onStatusChange={handleStatusChange}
                  messagesCount={getMessagesByProperty(property.id).length}
                  newMessagesCount={getNewMessagesByProperty(property.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Messages Inbox */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3>Messages</h3>
            {messages.length > 0 && (
              <div className="text-sm text-gray-600">
                {messages.filter(m => m.status === 'new').length} nouveau{messages.filter(m => m.status === 'new').length > 1 ? 'x' : ''} message{messages.filter(m => m.status === 'new').length > 1 ? 's' : ''}
              </div>
            )}
          </div>
          <MessagesInbox messages={messages} properties={properties} onUpdateStatus={updateMessageStatus} />
        </div>
      </div>
    </div>
  );
}