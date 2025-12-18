import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { ContactMessage, Property } from '../types/database';

export interface MessageWithProperty extends ContactMessage {
  property: Property;
}

export function useMessages(ownerId?: string) {
  const [messages, setMessages] = useState<MessageWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMessages = async () => {
    if (!ownerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('contact_messages')
        .select(`
          *,
          property:properties(*)
        `)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setMessages((data || []) as MessageWithProperty[]);
      setError(null);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [ownerId]);

  const updateMessageStatus = async (messageId: string, status: 'new' | 'read' | 'archived') => {
    try {
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);

      if (updateError) throw updateError;

      // Update local state
      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, status } : msg)
      );

      return true;
    } catch (err) {
      console.error('Error updating message status:', err);
      return false;
    }
  };

  const getNewMessagesCount = () => {
    return messages.filter(msg => msg.status === 'new').length;
  };

  const getMessagesByProperty = (propertyId: string) => {
    return messages.filter(msg => msg.property_id === propertyId);
  };

  const getNewMessagesByProperty = (propertyId: string) => {
    return messages.filter(msg => msg.property_id === propertyId && msg.status === 'new').length;
  };

  return {
    messages,
    loading,
    error,
    loadMessages,
    updateMessageStatus,
    getNewMessagesCount,
    getMessagesByProperty,
    getNewMessagesByProperty,
  };
}