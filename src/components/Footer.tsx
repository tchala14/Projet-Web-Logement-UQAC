import { motion } from 'motion/react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { AuthUser } from '../types/auth';

interface FooterProps {
  onNavigate?: (page: string) => void;
  user?: AuthUser | null;
}

export function Footer({ onNavigate, user }: FooterProps) {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white mb-4">
              <span className="text-uqac-green">UQAC</span> Logement
            </h4>
            <p className="text-gray-400 mb-6">
              La plateforme de référence pour trouver votre logement étudiant près du campus de l'UQAC. 
              Simple, rapide et fiable.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-uqac-green transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h5 className="text-white mb-4">Liens rapides</h5>
            <ul className="space-y-2">
              {[
                { label: 'Accueil', id: 'accueil' },
                { label: 'Logements', id: 'logements' },
                { label: 'Favoris', id: 'favoris' },
                { label: 'Contact', id: 'contact' },
              ].map((item) => (
                <li key={item.id}>
                  <motion.button
                    onClick={() => onNavigate?.(item.id)}
                    whileHover={{ x: 4 }}
                    className="text-gray-400 hover:text-uqac-green transition-colors text-left"
                  >
                    {item.label}
                  </motion.button>
                </li>
              ))}
              {!user && (
                <li>
                  <motion.button
                    onClick={() => onNavigate?.('login')}
                    whileHover={{ x: 4 }}
                    className="text-gray-400 hover:text-uqac-green transition-colors text-left"
                  >
                    Espace Propriétaires
                  </motion.button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white mb-4">Contact</h5>
            <ul className="space-y-2 text-gray-400">
              <li>555, boulevard de l'Université</li>
              <li>Chicoutimi, QC G7H 2B1</li>
              <li>info@uqaclogement.ca</li>
              <li>(418) 545-5011</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2025 UQAC Logement. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
