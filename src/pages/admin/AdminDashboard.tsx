import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Home, LogOut, CheckCircle, XCircle, Trash2, BarChart3, ArrowLeft, List, Building2, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabase/client';
import { Owner } from '../../types/database';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onViewOwnerMessages?: (ownerId: string) => void;
}

interface OwnerWithStats extends Owner {
  property_count: number;
}

export function AdminDashboard({ onLogout, onNavigate, onViewOwnerMessages }: AdminDashboardProps) {
  const { user, signOut } = useAuth();
  const [owners, setOwners] = useState<OwnerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOwners: 0,
    activeOwners: 0,
    totalProperties: 0,
    availableProperties: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load owners
      const { data: ownersData, error: ownersError } = await supabase
        .from('owners')
        .select('*')
        .order('created_at', { ascending: false });

      if (ownersError) throw ownersError;

      // Load properties count for each owner
      const ownersWithStats: OwnerWithStats[] = [];
      for (const owner of ownersData || []) {
        const { count } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', owner.id);
        
        ownersWithStats.push({
          ...owner,
          property_count: count || 0,
        });
      }

      setOwners(ownersWithStats);

      // Load stats
      const { count: totalProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      const { count: availableProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'disponible');

      setStats({
        totalOwners: ownersWithStats.length,
        activeOwners: ownersWithStats.filter(o => o.is_active).length,
        totalProperties: totalProperties || 0,
        availableProperties: availableProperties || 0,
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (ownerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('owners')
        .update({ is_active: !currentStatus })
        .eq('id', ownerId);

      if (error) throw error;

      setOwners(prev =>
        prev.map(o => o.id === ownerId ? { ...o, is_active: !currentStatus } : o)
      );

      setStats(prev => ({
        ...prev,
        activeOwners: prev.activeOwners + (currentStatus ? -1 : 1),
      }));
    } catch (error) {
      console.error('Error toggling owner status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteOwner = async (ownerId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce propriétaire ? Tous ses logements seront également supprimés.')) {
      return;
    }

    try {
      // First delete all properties
      await supabase.from('properties').delete().eq('owner_id', ownerId);
      
      // Then delete owner
      const { error } = await supabase.from('owners').delete().eq('id', ownerId);
      if (error) throw error;

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error deleting owner:', error);
      alert('Erreur lors de la suppression du propriétaire');
    }
  };

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-light pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="mb-2">Administration</h2>
            <p className="text-gray-600">Gestion des propriétaires et logements</p>
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
              onClick={() => onNavigate('dashboard')}
              className="bg-uqac-green text-white px-6 py-3 rounded-xl hover:bg-uqac-green-light transition-colors flex items-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              <span>Accéder au dashboard Propriétaire</span>
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total propriétaires', value: stats.totalOwners, icon: Users, color: 'bg-blue-500' },
            { label: 'Propriétaires actifs', value: stats.activeOwners, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Total logements', value: stats.totalProperties, icon: Home, color: 'bg-purple-500' },
            { label: 'Logements disponibles', value: stats.availableProperties, icon: BarChart3, color: 'bg-orange-500' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.color} rounded-xl mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Owners Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3>Gestion des propriétaires</h3>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-uqac-green border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : owners.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun propriétaire enregistré</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Nom</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Téléphone</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Logements</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Statut</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Date d'inscription</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {owners.map((owner) => (
                    <motion.tr
                      key={owner.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>{owner.full_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{owner.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{owner.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-uqac-green/10 text-uqac-green rounded-lg">
                          {owner.property_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs ${
                            owner.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {owner.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(owner.created_at).toLocaleDateString('fr-CA')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleActive(owner.id, owner.is_active)}
                            className={`p-2 rounded-lg transition-colors ${
                              owner.is_active
                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                            title={owner.is_active ? 'Désactiver' : 'Activer'}
                          >
                            {owner.is_active ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteOwner(owner.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                          {onViewOwnerMessages && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onViewOwnerMessages(owner.id)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Voir les messages"
                            >
                              <Mail className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}