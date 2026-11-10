import React, { useState } from 'react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onToggleCalculator?: () => void;
  onCloseCalculator?: () => void;
}

export default function Navbar({ onOpenAdmin, isAdminLoggedIn, onToggleCalculator, onCloseCalculator }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open("https://wa.me/917447449534?text=Hi%20Tejomay%2C%20I%20would%20like%20to%20book%20a%20solar%20consultation", "_blank", "noopener,noreferrer");
  };

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    if (onCloseCalculator) onCloseCalculator();
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCalculatorClick = () => {
    setMenuOpen(false);
    if (onToggleCalculator) {
      onToggleCalculator();
    } else {
      handleNavClick('calculator');
    }
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Calculator', id: 'calculator', special: true },
    { label: 'Services', id: 'services' },
    { label: 'Work Done', id: 'work' },
    { label: 'Cities', id: 'cities' },
    { label: 'Founders', id: 'founders' },
  ];

  return (
    <>
      {/* ================================================================
          DESKTOP PILL NAVBAR — hidden on mobile via CSS
          ================================================================ */}
      <header className="navbar-desktop-pill" style={{
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
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={link.special ? handleCalculatorClick : () => handleNavClick(link.id)}
                style={navBtnStyle}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {isAdminLoggedIn && (
            <>
              <div style={{ width: '1px', height: '22px', background: 'rgba(255, 255, 255, 0.15)' }} />
              <button
                onClick={onOpenAdmin}
                style={{
                  background: 'rgba(107, 174, 35, 0.15)',
                  border: '1px solid #6BAE23',
                  color: '#6BAE23',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><img src="/lightning-icon.png" alt="Admin" style={{ width: '13px', height: '13px', objectFit: 'contain' }} />Admin</span>
              </button>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleWhatsApp}
              className="btn-lime"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.82rem', borderRadius: '9999px', fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <img src="/call-icon.png" alt="Call" style={{ width: '14px', height: '14px', borderRadius: '50%' }} />
                Book a Call ↗
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================
          MOBILE HAMBURGER BUTTON — fixed top-right, shown only on mobile
          ================================================================ */}
      <button
        className="navbar-mobile-fab"
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label="Open menu"
      >
        <span style={{
          display: 'block', width: '18px', height: '2px', background: '#ffffff', borderRadius: '2px',
          transition: 'transform 0.3s, opacity 0.3s',
          transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none'
        }} />
        <span style={{
          display: 'block', width: '18px', height: '2px', background: '#ffffff', borderRadius: '2px',
          opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s'
        }} />
        <span style={{
          display: 'block', width: '18px', height: '2px', background: '#ffffff', borderRadius: '2px',
          transition: 'transform 0.3s, opacity 0.3s',
          transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none'
        }} />
      </button>

      {/* ================================================================
          MOBILE DRAWER BACKDROP
          ================================================================ */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 998,
            background: 'rgba(11,19,31,0.6)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)'
          }}
        />
      )}

      {/* ================================================================
          MOBILE DRAWER PANEL — slides down from top
          ================================================================ */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 999,
        background: 'rgba(11, 19, 31, 0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '5.5rem 1.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: menuOpen ? 'auto' : 'none',
        // Only matters on mobile — on desktop this drawer is behind the pill and never triggered
      }}>
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={link.special ? handleCalculatorClick : () => handleNavClick(link.id)}
            style={{
              background: 'none', border: 'none',
              color: '#ffffff', fontSize: '1.25rem', fontWeight: 600,
              textAlign: 'left', padding: '0.9rem 0', cursor: 'pointer',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              fontFamily: 'var(--font-outfit)', letterSpacing: '-0.01em'
            }}
          >
            {link.label}
          </button>
        ))}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          {isAdminLoggedIn && (
            <button
              onClick={() => { setMenuOpen(false); onOpenAdmin(); }}
              style={{
                flex: 1, padding: '0.85rem', borderRadius: '12px',
                background: 'rgba(107,174,35,0.2)',
                border: '1px solid #6BAE23',
                color: '#6BAE23',
                fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}><img src="/lightning-icon.png" alt="Admin" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />Admin</span>
            </button>
          )}
          <button
            onClick={() => { setMenuOpen(false); handleWhatsApp(); }}
            className="btn-lime"
            style={{ flex: 1, padding: '0.85rem', fontSize: '0.95rem', borderRadius: '12px', justifyContent: 'center' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <img src="/call-icon.png" alt="Call" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
              Book a Call ↗
            </span>
          </button>
        </div>
      </div>
    </>
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
