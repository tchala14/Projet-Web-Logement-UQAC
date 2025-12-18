import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { Mail, MailOpen, Archive, X, Calendar, User, AtSign, Home, Filter, Inbox, CheckCircle2 } from 'lucide-react';
import { MessageWithProperty } from '../hooks/useMessages';
import { Property } from '../types/database';

interface MessagesInboxProps {
  messages: MessageWithProperty[];
  properties: Property[];
  onUpdateStatus: (messageId: string, status: 'new' | 'read' | 'archived') => Promise<boolean>;
}

export function MessagesInbox({ messages, properties, onUpdateStatus }: MessagesInboxProps) {
  const [selectedMessage, setSelectedMessage] = useState<MessageWithProperty | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    const statusMatch = statusFilter === 'all' || msg.status === statusFilter;
    const propertyMatch = propertyFilter === 'all' || msg.property_id === propertyFilter;
    return statusMatch && propertyMatch;
  });

  // Group messages by property
  const messagesByProperty = filteredMessages.reduce((acc, msg) => {
    const propertyId = msg.property_id;
    if (!acc[propertyId]) {
      acc[propertyId] = [];
    }
    acc[propertyId].push(msg);
    return acc;
  }, {} as Record<string, MessageWithProperty[]>);

  const handleMarkAsRead = async (messageId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'read' ? 'new' : 'read';
    await onUpdateStatus(messageId, newStatus);
  };

  const handleArchive = async (messageId: string) => {
    await onUpdateStatus(messageId, 'archived');
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700', icon: Mail },
      read: { label: 'Lu', color: 'bg-gray-100 text-gray-700', icon: MailOpen },
      archived: { label: 'Archivé', color: 'bg-orange-100 text-orange-700', icon: Archive },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return `Il y a ${days} jours`;
    } else {
      return date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  const getMessagePreview = (message: string, maxLength: number = 80) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    archived: messages.filter(m => m.status === 'archived').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-500' },
          { label: 'Nouveaux', value: stats.new, color: 'bg-green-500' },
          { label: 'Lus', value: stats.read, color: 'bg-gray-500' },
          { label: 'Archivés', value: stats.archived, color: 'bg-orange-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className={`inline-block w-2 h-2 rounded-full ${stat.color} mb-2`} />
            <div className="text-2xl mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="w-5 h-5" />
          <span>Filtres</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Par statut</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'new', label: 'Nouveaux' },
                { id: 'read', label: 'Lus' },
                { id: 'archived', label: 'Archivés' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id as any)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    statusFilter === filter.id
                      ? 'bg-uqac-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Property Filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Par logement</label>
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-uqac-green"
            >
              <option value="all">Tous les logements</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center shadow-sm"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="mb-2">Aucun message</h4>
          <p className="text-gray-600">
            {statusFilter !== 'all' || propertyFilter !== 'all'
              ? 'Aucun message ne correspond aux filtres sélectionnés'
              : 'Vous n\'avez pas encore reçu de messages'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(messagesByProperty).map(([propertyId, propertyMessages]) => {
            const property = properties.find(p => p.id === propertyId);
            
            // Skip if property not found (deleted property)
            if (!property) {
              console.warn(`Property ${propertyId} not found for messages`);
              return null;
            }

            return (
              <motion.div
                key={propertyId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Property Header */}
                <div className="bg-uqac-green/10 px-6 py-4 border-b border-uqac-green/20">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-uqac-green" />
                    <div>
                      <h4 className="text-uqac-green">{property.title}</h4>
                      <p className="text-sm text-gray-600">{property.address}</p>
                    </div>
                    <div className="ml-auto bg-uqac-green text-white px-3 py-1 rounded-full text-sm">
                      {propertyMessages.length} message{propertyMessages.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="divide-y divide-gray-200">
                  {propertyMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                        message.status === 'new' ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          message.status === 'new' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}>
                          <User className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={message.status === 'new' ? '' : 'text-gray-700'}>
                                  {message.sender_name}
                                </span>
                                {getStatusBadge(message.status)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <AtSign className="w-3 h-3" />
                                {message.sender_email}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                              <Calendar className="w-3 h-3" />
                              {formatDate(message.created_at)}
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2">
                            {getMessagePreview(message.message)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3>Détail du message</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Property Info */}
                <div className="bg-uqac-green/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-uqac-green mt-1" />
                    <div>
                      <div className="text-uqac-green mb-1">{selectedMessage.property.title}</div>
                      <div className="text-sm text-gray-600">{selectedMessage.property.address}</div>
                    </div>
                  </div>
                </div>

                {/* Sender Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Nom</div>
                      <div className="text-gray-900">{selectedMessage.sender_name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <AtSign className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Email</div>
                      <div className="text-gray-900">{selectedMessage.sender_email}</div>
                    </div>
                  </div>
                </div>

                {/* Date and Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(selectedMessage.created_at)}</span>
                  </div>
                  {getStatusBadge(selectedMessage.status)}
                </div>

                {/* Message */}
                <div>
                  <div className="text-sm text-gray-500 mb-2">Message</div>
                  <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-gray-900">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.status)}
                    className="flex items-center gap-2 px-6 py-3 bg-uqac-green text-white rounded-xl hover:bg-uqac-green-light transition-colors"
                  >
                    {selectedMessage.status === 'read' ? (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Marquer comme non lu</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Marquer comme lu</span>
                      </>
                    )}
                  </motion.button>

                  {selectedMessage.status !== 'archived' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleArchive(selectedMessage.id)}
                      className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      <span>Archiver</span>
                    </motion.button>
                  )}

                  <a
                    href={`mailto:${selectedMessage.sender_email}`}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    <AtSign className="w-4 h-4" />
                    <span>Répondre par email</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}