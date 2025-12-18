import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Clock, Users } from 'lucide-react';

export function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'info@uqaclogement.ca',
      description: 'Réponse en moins de 24h',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: '(418) 545-5011',
      description: 'Lun-Ven, 9h-17h',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: '555, boulevard de l\'Université',
      description: 'Chicoutimi, QC G7H 2B1',
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-uqac-green to-uqac-green-light text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-white mb-4">Contactez-nous</h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Notre équipe est là pour vous aider à trouver le logement idéal près de l'UQAC
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl p-8 shadow-lg text-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-uqac-green/10 rounded-2xl mb-4"
                  >
                    <Icon className="w-8 h-8 text-uqac-green" />
                  </motion.div>
                  <h4 className="mb-2">{info.title}</h4>
                  <p className="mb-1">{info.details}</p>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & About */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="mb-6">Envoyez-nous un message</h2>
              <p className="text-gray-600 mb-8">
                Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Prénom</label>
                    <input
                      type="text"
                      placeholder="Jean"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Nom</label>
                    <input
                      type="text"
                      placeholder="Tremblay"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="jean.tremblay@uqac.ca"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="(418) 555-0123"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Sujet</label>
                  <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors">
                    <option>Question générale</option>
                    <option>Problème avec un logement</option>
                    <option>Ajouter mon logement</option>
                    <option>Support technique</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Message</label>
                  <textarea
                    placeholder="Décrivez votre demande..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-uqac-green transition-colors resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-uqac-green text-white py-4 rounded-xl hover:bg-uqac-green-light transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Envoyer le message</span>
                </motion.button>
              </form>
            </motion.div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="mb-6">À propos de nous</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  UQAC Logement est la plateforme de référence pour les étudiants de l'Université du Québec 
                  à Chicoutimi cherchant un logement près du campus. Nous facilitons la recherche en offrant 
                  une interface moderne, des filtres avancés et des logements vérifiés.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Notre mission est de simplifier la vie des étudiants en leur offrant un accès rapide et 
                  fiable aux meilleures options de logement dans la région de Chicoutimi.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-light rounded-2xl p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-uqac-green/10 rounded-xl mb-3">
                    <Users className="w-6 h-6 text-uqac-green" />
                  </div>
                  <div className="text-2xl mb-1">2000+</div>
                  <div className="text-sm text-gray-600">Étudiants aidés</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-light rounded-2xl p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-uqac-green/10 rounded-xl mb-3">
                    <Clock className="w-6 h-6 text-uqac-green" />
                  </div>
                  <div className="text-2xl mb-1">24h</div>
                  <div className="text-sm text-gray-600">Temps de réponse</div>
                </motion.div>
              </div>

              {/* FAQ Teaser */}
              <div className="bg-uqac-green/5 rounded-3xl p-8 border-2 border-uqac-green/20">
                <h4 className="mb-4">Questions fréquentes</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-uqac-green">•</span>
                    <span className="text-gray-700">Comment ajouter mon logement sur la plateforme ?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-uqac-green">•</span>
                    <span className="text-gray-700">Les logements sont-ils vérifiés ?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-uqac-green">•</span>
                    <span className="text-gray-700">Y a-t-il des frais pour utiliser le service ?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-uqac-green">•</span>
                    <span className="text-gray-700">Comment contacter un propriétaire ?</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 text-uqac-green hover:underline"
                >
                  Voir toutes les questions →
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl overflow-hidden shadow-lg"
          >
            <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-uqac-green" />
                <h4 className="mb-2">Trouvez-nous sur le campus</h4>
                <p>555, boulevard de l'Université, Chicoutimi</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
