import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner@2.0.3';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Logements } from './pages/Logements';
import { LogementDetail } from './pages/LogementDetail';
import { Favoris } from './pages/Favoris';
import { Contact } from './pages/Contact';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/proprietaires/Dashboard';
import { PropertyForm } from './pages/proprietaires/PropertyForm';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { OwnerMessages } from './pages/admin/OwnerMessages';
import { SetupGuide } from './components/SetupGuide';
import { useAuth } from './hooks/useAuth';
import { useProperties } from './hooks/useProperties';
import { useMessages } from './hooks/useMessages';
import { mockLogements } from './types/logement';
import { supabase } from './utils/supabase/client';

type Page =
  | 'accueil'
  | 'logements'
  | 'favoris'
  | 'contact'
  | 'detail'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'property-form'
  | 'property-edit'
  | 'admin'
  | 'admin-owner-messages';

export default function App() {
  const { user, loading: authLoading, isAdmin, isOwner } = useAuth();
  const { properties, loading: propertiesLoading } = useProperties();
  // Only load messages for owners and admins
  const { getNewMessagesCount } = useMessages((user && (isOwner || isAdmin)) ? user.id : undefined);
  const [currentPage, setCurrentPage] = useState<Page>('accueil');
  const [selectedLogementId, setSelectedLogementId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [dbCheckDone, setDbCheckDone] = useState(false);

  // Check if database tables exist
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const { error } = await supabase.from('properties').select('id').limit(1);
        
        if (error && error.code === 'PGRST205') {
          // Table doesn't exist - show setup guide
          setShowSetupGuide(true);
        }
      } catch (err) {
        console.error('Database check error:', err);
      } finally {
        setDbCheckDone(true);
      }
    };

    checkDatabase();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id);
      }
      return [...prev, id];
    });
  };

  const clearFavorites = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      setFavorites([]);
    }
  };

  const navigateTo = (page: Page) => {
    // Protected routes check
    if (page === 'dashboard' || page === 'property-form' || page === 'property-edit') {
      // Allow both owners and admins to access proprietaire pages
      if (!user || (!isOwner && !isAdmin)) {
        setCurrentPage('login');
        return;
      }
    }

    if (page === 'admin' || page === 'admin-owner-messages') {
      if (!user || !isAdmin) {
        alert('Accès refusé. Cette page est réservée aux administrateurs.');
        setCurrentPage('accueil');
        return;
      }
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewLogement = (id: string) => {
    setSelectedLogementId(id);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setCurrentPage('logements');
    setSelectedLogementId(null);
  };

  const handleLoginSuccess = () => {
    navigateTo(isAdmin ? 'admin' : 'dashboard');
  };

  const handleRegisterSuccess = () => {
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    navigateTo('accueil');
  };

  const handleCreateProperty = () => {
    setSelectedPropertyId(null);
    navigateTo('property-form');
  };

  const handleEditProperty = (id: string) => {
    setSelectedPropertyId(id);
    navigateTo('property-edit');
  };

  const handlePropertyFormSuccess = () => {
    setSelectedPropertyId(null);
    navigateTo('dashboard');
  };

  const handleViewOwnerMessages = (ownerId: string) => {
    setSelectedOwnerId(ownerId);
    navigateTo('admin-owner-messages');
  };

  // Use real properties from database, fallback to mock data if empty (for demo purposes)
  const logements = properties.length > 0 ? properties : mockLogements;

  const selectedLogement = logements.find((l) => l.id === selectedLogementId);
  const favoriteLogements = logements.filter((l) => favorites.includes(l.id));
  const similarLogements = selectedLogement
    ? logements
        .filter((l) => l.id !== selectedLogement.id && l.type === selectedLogement.type)
        .slice(0, 3)
    : [];

  // Show loading while checking auth, database, or fetching properties
  if (authLoading || !dbCheckDone || propertiesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-uqac-green border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show setup guide if database tables don't exist
  if (showSetupGuide) {
    return <SetupGuide />;
  }

  // Public pages that don't need header/footer modification
  const isPublicPage = ['accueil', 'logements', 'detail', 'favoris', 'contact'].includes(
    currentPage
  );
  const isAuthPage = ['login', 'register'].includes(currentPage);
  const isProtectedPage = ['dashboard', 'property-form', 'property-edit', 'admin', 'admin-owner-messages'].includes(
    currentPage
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Show header on all pages except auth pages */}
      {!isAuthPage && (
        <Header 
          currentPage={currentPage} 
          onNavigate={navigateTo} 
          user={user} 
          newMessagesCount={(user && (isOwner || isAdmin)) ? getNewMessagesCount() : undefined}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Public Pages */}
          {currentPage === 'accueil' && (
            <Home
              logements={logements}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onNavigateToLogements={() => navigateTo('logements')}
              onViewLogement={viewLogement}
            />
          )}

          {currentPage === 'logements' && (
            <Logements
              logements={logements}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onViewLogement={viewLogement}
            />
          )}

          {currentPage === 'detail' && selectedLogement && (
            <LogementDetail
              logement={selectedLogement}
              similarLogements={similarLogements}
              isFavorite={favorites.includes(selectedLogement.id)}
              onToggleFavorite={toggleFavorite}
              onBack={goBack}
              onViewLogement={viewLogement}
              favorites={favorites}
            />
          )}

          {currentPage === 'favoris' && (
            <Favoris
              favoriteLogements={favoriteLogements}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onViewLogement={viewLogement}
              onClearFavorites={clearFavorites}
            />
          )}

          {currentPage === 'contact' && <Contact />}

          {/* Auth Pages */}
          {currentPage === 'login' && (
            <Login
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => navigateTo('register')}
              onBack={() => navigateTo('accueil')}
            />
          )}

          {currentPage === 'register' && (
            <Register
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateToLogin={() => navigateTo('login')}
              onBack={() => navigateTo('accueil')}
            />
          )}

          {/* Owner/Admin Protected Pages */}
          {currentPage === 'dashboard' && user && (isOwner || isAdmin) && (
            <Dashboard
              onLogout={handleLogout}
              onCreateProperty={handleCreateProperty}
              onEditProperty={handleEditProperty}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'property-form' && user && (isOwner || isAdmin) && (
            <PropertyForm
              onBack={() => navigateTo('dashboard')}
              onSuccess={handlePropertyFormSuccess}
            />
          )}

          {currentPage === 'property-edit' && user && (isOwner || isAdmin) && selectedPropertyId && (
            <PropertyForm
              propertyId={selectedPropertyId}
              onBack={() => navigateTo('dashboard')}
              onSuccess={handlePropertyFormSuccess}
            />
          )}

          {/* Admin Protected Page */}
          {currentPage === 'admin' && user && isAdmin && (
            <AdminDashboard 
              onLogout={handleLogout} 
              onNavigate={navigateTo}
              onViewOwnerMessages={handleViewOwnerMessages}
            />
          )}

          {currentPage === 'admin-owner-messages' && user && isAdmin && selectedOwnerId && (
            <OwnerMessages
              ownerId={selectedOwnerId}
              onBack={() => navigateTo('admin')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Show footer on all pages except auth pages */}
      {!isAuthPage && <Footer onNavigate={navigateTo} user={user} />}

      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#000',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '16px',
          },
          className: 'text-sm',
        }}
      />
    </div>
  );
}