import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
}

export function Register({ onRegisterSuccess, onNavigateToLogin, onBack }: RegisterProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName, phone);
      if (error) {
        if (error.message.includes('already registered')) {
          setError('Cet email est déjà utilisé');
        } else {
          setError(error.message);
        }
      } else {
        onRegisterSuccess();
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-light pt-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -4 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-uqac-green transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour à l'accueil</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-uqac-green/10 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8 text-uqac-green" />
            </div>
            <h2 className="mb-2">Créer un compte</h2>
            <p className="text-gray-600">
              Devenez propriétaire et gérez vos logements
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-gray-700">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Tremblay"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Téléphone <span className="text-gray-400">(optionnel)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(418) 555-0123"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
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
                <span>Création du compte...</span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Créer mon compte</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-uqac-green hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
