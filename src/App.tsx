import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import OfferingsSection from './components/OfferingsSection';
import EpcDetailsPage from './components/EpcDetailsPage';
import TestimonialsSection from './components/TestimonialsSection';
import PotentialSection from './components/PotentialSection';
import WhySonoraSection from './components/WhySonoraSection';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import LegalModal from './components/LegalModal';

import { supabase } from './lib/supabase';

export default function App() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [legalModalState, setLegalModalState] = useState<{ isOpen: boolean; type: 'privacy' | 'terms' }>({
    isOpen: false,
    type: 'privacy'
  });

  // 404 URL Normalization: Gracefully clean unknown subpaths back to root on mount
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname && pathname !== '/' && !pathname.includes('.')) {
      if (window.history.replaceState) {
        window.history.replaceState(null, '', '/' + window.location.hash);
      }
    }
  }, []);

  // Restore session on page load (survives refresh)
  useEffect(() => {
    const verifySessionSecurity = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        setIsAdminLoggedIn(false);
        return;
      }
      try {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
          // Account has 2FA enabled but current session lacks TOTP verification
          setIsAdminLoggedIn(false);
          return;
        }
      } catch {
        // ignore
      }
      setIsAdminLoggedIn(true);
    };

    verifySessionSecurity();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setIsAdminLoggedIn(false);
        setIsAdminPanelOpen(false);
        return;
      }
      try {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
          setIsAdminLoggedIn(false);
          setIsAdminPanelOpen(false);
          return;
        }
      } catch {
        // ignore
      }
      setIsAdminLoggedIn(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Stealth Access Layer 1: Secret URL triggers (e.g. #/x9k2-admin or ?portal=admin)
  useEffect(() => {
    const checkSecretRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash === '#/x9k2-admin' || 
        hash === '#/admin' || 
        search.includes('admin=tejomay') || 
        search.includes('portal=admin')
      ) {
        // Clear secret hash from browser bar to maintain stealth
        if (window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        handleOpenAdminClick();
      }
    };

    checkSecretRoute();
    window.addEventListener('hashchange', checkSecretRoute);
    return () => window.removeEventListener('hashchange', checkSecretRoute);
  }, [isAdminLoggedIn]);

  // Stealth Access Layer 2: Keyboard shortcut (Ctrl + Shift + A / Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdminClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);
  
  // Dedicated EPC Details Page State
  const [isEpcDetailsPageOpen, setIsEpcDetailsPageOpen] = useState(false);

  const handleToggleCalculator = () => {
    setIsCalculatorOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return nextState;
    });
  };

  const handleCloseCalculator = () => {
    setIsCalculatorOpen(false);
  };

  const handleOpenAdminClick = () => {
    if (isAdminLoggedIn) {
      setIsAdminPanelOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsLoginModalOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminLoggedIn(false);
    setIsAdminPanelOpen(false);
  };

  // If Dedicated EPC Details Page is open, render EpcDetailsPage
  if (isEpcDetailsPageOpen) {
    return (
      <div style={{ minHeight: '100vh', background: '#0b131f', color: '#ffffff' }}>
        <Navbar 
          onOpenAdmin={handleOpenAdminClick} 
          isAdminLoggedIn={isAdminLoggedIn} 
          onToggleCalculator={() => {
            setIsEpcDetailsPageOpen(false);
            handleToggleCalculator();
          }}
          onCloseCalculator={handleCloseCalculator}
        />
        <EpcDetailsPage onBack={() => setIsEpcDetailsPageOpen(false)} />
        <Footer 
          onSecretAdminTrigger={handleOpenAdminClick} 
          onOpenLegal={(type) => setLegalModalState({ isOpen: true, type })}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0b131f', color: '#ffffff' }}>
      {/* Navigation Bar */}
      <Navbar 
        onOpenAdmin={handleOpenAdminClick} 
        isAdminLoggedIn={isAdminLoggedIn} 
        onToggleCalculator={handleToggleCalculator}
        onCloseCalculator={handleCloseCalculator}
      />

      {/* Main Website Sections */}
      <main>
        {/* Section 1: Hero Section + Interactive Solar Cost & Savings Calculator */}
        <HeroSection 
          isCalculatorOpen={isCalculatorOpen} 
          setIsCalculatorOpen={setIsCalculatorOpen} 
        />

        {/* Section 2: About Us Section (Background: #44D944) */}
        <AboutSection />

        {/* Section 3: Services & Products Showcase with OUR SERVICES Tag */}
        <OfferingsSection onOpenEpcDetailsPage={() => setIsEpcDetailsPageOpen(true)} />

        {/* Section 4: Work Done & Client Testimonials */}
        <TestimonialsSection />

        {/* Section 5: Active Cities & WhatsApp Consultation */}
        <PotentialSection />

        {/* Section 6: Founders & Leadership Team */}
        <WhySonoraSection />
      </main>

      {/* Section 7: Footer */}
      <Footer 
        onSecretAdminTrigger={handleOpenAdminClick} 
        onOpenLegal={(type) => setLegalModalState({ isOpen: true, type })}
      />

      {/* Admin Login Dialog */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Legal & Compliance Modal (Privacy Policy / Terms of Service) */}
      <LegalModal
        isOpen={legalModalState.isOpen}
        type={legalModalState.type}
        onClose={() => setLegalModalState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Single-Page Owner Admin Panel Dashboard */}
      {isAdminPanelOpen && (
        <AdminPanel
          onClose={() => setIsAdminPanelOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
