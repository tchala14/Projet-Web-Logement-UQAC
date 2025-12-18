import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../hooks/useAuth';

interface ContactPropertyFormProps {
  propertyId: string;
  ownerId: string;
  propertyTitle?: string;
}

export function ContactPropertyForm({ propertyId, ownerId, propertyTitle }: ContactPropertyFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if ownerId is valid
  if (!ownerId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3>Contact indisponible</h3>
          </div>
        </div>
        <p className="text-gray-600">
          Le formulaire de contact n'est pas disponible pour ce logement. 
          Veuillez contacter l'administrateur pour plus d'informations.
        </p>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          property_id: propertyId,
          owner_id: ownerId,
          sender_id: user?.id || null,
          sender_name: name.trim(),
          sender_email: email.trim(),
          message: message.trim(),
          status: 'new',
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      toast.success('✅ Message envoyé avec succès !');
      
      // Reset form only if user is not authenticated
      if (!user) {
        setName('');
        setEmail('');
      }
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('❌ Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-uqac-green/10 rounded-xl flex items-center justify-center">
          <Mail className="w-6 h-6 text-uqac-green" />
        </div>
        <div>
          <h3>Contacter le propriétaire</h3>
          {propertyTitle && (
            <p className="text-sm text-gray-500">Pour : {propertyTitle}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-2 text-gray-700">
            Votre nom <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Tremblay"
              required
              disabled={!!user}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-700">
            Votre email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean.tremblay@example.com"
              required
              disabled={!!user}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-700">
            Votre message <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bonjour, je suis intéressé par votre logement..."
              required
              rows={5}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors resize-none"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-uqac-green text-white py-4 rounded-xl hover:bg-uqac-green-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Envoi en cours...</span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Envoyer le message</span>
            </>
          )}
        </motion.button>

        {user && (
          <p className="text-xs text-gray-500 text-center">
            Votre nom et email sont pré-remplis depuis votre compte
          </p>
        )}
      </form>
    </motion.div>
  );
}