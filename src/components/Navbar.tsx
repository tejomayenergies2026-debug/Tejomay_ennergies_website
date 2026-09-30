import React from 'react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onToggleCalculator?: () => void;
  onCloseCalculator?: () => void;
}

export default function Navbar({ onOpenAdmin, isAdminLoggedIn, onToggleCalculator, onCloseCalculator }: NavbarProps) {

  const handleWhatsApp = () => {
    window.open("https://wa.me/918468903255?text=Hi%20Tejomay%2C%20I%20would%20like%20to%20book%20a%20solar%20consultation", "_blank");
  };

  const handleNavClick = (id: string) => {
    if (onCloseCalculator) {
      onCloseCalculator();
    }
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCalculatorClick = () => {
    if (onToggleCalculator) {
      onToggleCalculator();
    } else {
      handleNavClick('calculator');
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: '1.25rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: 'max-content',
      maxWidth: '92vw',
      pointerEvents: 'auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        background: 'rgba(11, 19, 31, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '9999px',
        padding: '0.55rem 1.4rem',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.55)',
        transition: 'all 0.3s ease'
      }}>
        
        {/* Center: Perfectly Centered Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button onClick={() => handleNavClick('home')} style={navBtnStyle}>Home</button>
          <button onClick={handleCalculatorClick} style={navBtnStyle}>Calculator</button>
          <button onClick={() => handleNavClick('services')} style={navBtnStyle}>Services</button>
          <button onClick={() => handleNavClick('work')} style={navBtnStyle}>Work Done</button>
          <button onClick={() => handleNavClick('cities')} style={navBtnStyle}>Cities</button>
          <button onClick={() => handleNavClick('founders')} style={navBtnStyle}>Founders</button>
        </nav>

        {/* Vertical Divider */}
        <div style={{ width: '1px', height: '22px', background: 'rgba(255, 255, 255, 0.15)' }} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onOpenAdmin}
            style={{
              background: isAdminLoggedIn ? 'rgba(107, 174, 35, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: isAdminLoggedIn ? '1px solid #6BAE23' : '1px solid rgba(255, 255, 255, 0.18)',
              color: isAdminLoggedIn ? '#6BAE23' : '#ffffff',
              padding: '0.5rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {isAdminLoggedIn ? '⚡ Admin' : '🔒 Login'}
          </button>

          <button 
            onClick={handleWhatsApp} 
            className="btn-lime" 
            style={{ 
              padding: '0.5rem 1.25rem', 
              fontSize: '0.82rem',
              borderRadius: '9999px',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            <span>Book a Call ↗</span>
          </button>
        </div>

      </div>
    </header>
  );
}

const navBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: '0.85rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  padding: '0.25rem 0',
  whiteSpace: 'nowrap'
};
