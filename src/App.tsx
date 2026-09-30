import React, { useState } from 'react';
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

export default function App() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
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

  const handleLogout = () => {
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
        <Footer />
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
      <Footer />

      {/* Admin Login Dialog */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
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
