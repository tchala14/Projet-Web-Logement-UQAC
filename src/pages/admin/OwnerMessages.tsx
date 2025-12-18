import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User } from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';
import { supabase } from '../../utils/supabase/client';
import { Owner, Property } from '../../types/database';
import { MessagesInbox } from '../../components/MessagesInbox';

interface OwnerMessagesProps {
  ownerId: string;
  onBack: () => void;
}

export function OwnerMessages({ ownerId, onBack }: OwnerMessagesProps) {
  const { messages, loading, updateMessageStatus } = useMessages(ownerId);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    loadOwnerData();
  }, [ownerId]);

  const loadOwnerData = async () => {
    try {
      // Load owner info
      const { data: ownerData, error: ownerError } = await supabase
        .from('owners')
        .select('*')
        .eq('id', ownerId)
        .single();

      if (ownerError) throw ownerError;
      setOwner(ownerData);

      // Load owner's properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error loading owner data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-light pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à la liste des propriétaires</span>
          </motion.button>

          {owner && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-uqac-green/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-uqac-green" />
                </div>
                <div>
                  <h2 className="mb-1">Messages de {owner.full_name}</h2>
                  <p className="text-gray-600">{owner.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {properties.length} logement{properties.length > 1 ? 's' : ''} • {messages.length} message{messages.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Messages Inbox */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-uqac-green border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 mt-4">Chargement...</p>
          </div>
        ) : (
          <MessagesInbox
            messages={messages}
            properties={properties}
            onUpdateStatus={updateMessageStatus}
          />
        )}
      </div>
    </div>
  );
}
