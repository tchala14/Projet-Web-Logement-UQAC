import { motion } from 'motion/react';
import { Home, List, Heart, Mail, Menu, X, User, Shield, Building2 } from 'lucide-react';
import { useState } from 'react';
import { AuthUser } from '../types/auth';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: AuthUser | null;
  newMessagesCount?: number;
}

export function Header({ currentPage, onNavigate, user, newMessagesCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'logements', label: 'Logements', icon: List },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => onNavigate('accueil')}
          >
            <h3 className="text-white flex items-center gap-2">
              <span className="text-uqac-green">UQAC</span> Logement
            </h3>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    currentPage === item.id
                      ? 'bg-uqac-green text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
            
            {/* Auth Buttons */}
            {user ? (
              <>
                {/* Propriétaire link for owners AND admins */}
                {(user.role === 'owner' || user.role === 'admin') && (
                  <motion.button
                    onClick={() => onNavigate('dashboard')}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      currentPage === 'dashboard' || currentPage === 'property-form' || currentPage === 'property-edit'
                        ? 'bg-uqac-green text-white'
                        : 'bg-uqac-green/20 text-uqac-green hover:bg-uqac-green hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Propriétaire</span>
                    {newMessagesCount !== undefined && newMessagesCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {newMessagesCount > 9 ? '9+' : newMessagesCount}
                      </span>
                    )}
                  </motion.button>
                )}
                {/* Admin link only for admins */}
                {user.role === 'admin' && (
                  <motion.button
                    onClick={() => onNavigate('admin')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      currentPage === 'admin'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </motion.button>
                )}
              </>
            ) : (
              <motion.button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-uqac-green text-white hover:bg-uqac-green-light transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-4 h-4" />
                <span>Propriétaires</span>
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-black border-t border-gray-800"
        >
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-uqac-green text-white'
                      : 'text-gray-300 hover:bg-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* Auth Buttons Mobile */}
            <div className="pt-4 border-t border-gray-800 space-y-2">
              {user ? (
                <>
                  {(user.role === 'owner' || user.role === 'admin') && (
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-uqac-green text-white"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5" />
                        <span>Propriétaire</span>
                      </div>
                      {newMessagesCount !== undefined && newMessagesCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {newMessagesCount > 9 ? '9+' : newMessagesCount}
                        </span>
                      )}
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white"
                    >
                      <Shield className="w-5 h-5" />
                      <span>Admin</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-uqac-green text-white"
                >
                  <User className="w-5 h-5" />
                  <span>Propriétaires</span>
                </button>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}