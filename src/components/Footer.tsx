import React from 'react';
import TejomayLogo from './TejomayLogo';

interface FooterProps {
  onAdminTrigger?: () => void;
  onOpenLegal?: (type: 'privacy' | 'terms') => void;
}

export default function Footer({ onAdminTrigger, onOpenLegal }: FooterProps) {
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<number | null>(null);

  const handleCopyrightClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onAdminTrigger?.();
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/918468903255?text=Hi%20Tejomay%2C%20I%20want%20to%20connect%20with%20your%20solar%20team", "_blank");
  };

  return (
    <footer style={{
      background: '#060a11',
      color: '#ffffff',
      padding: '4.5rem 1.5rem 2.5rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <TejomayLogo size="lg" />
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '280px' }}>
              Premier green infrastructure provider designing high-yield rooftop solar systems, EPC grid integration, and proactive AMC maintenance.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6BAE23', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><a href="#hero" style={footerLinkStyle}>Home & Calculator</a></li>
              <li><a href="#services" style={footerLinkStyle}>Services & Products</a></li>
              <li><a href="#work" style={footerLinkStyle}>Work Done & Testimonials</a></li>
              <li><a href="#cities" style={footerLinkStyle}>Active Cities</a></li>
              <li><a href="#founders" style={footerLinkStyle}>Founders & Team</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6BAE23', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Contact Us
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.7 }}>
              📍 Metro Solar Tower, Sector 62<br />
              <a href="tel:+918468903255" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s' }}>
                📞 +91 8468903255
              </a><br />
              <a href="mailto:support@tejomay.com" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s' }}>
                ✉️ support@tejomay.com
              </a>
            </p>
            <button
              onClick={handleWhatsApp}
              className="btn-lime"
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              WhatsApp Support ↗
            </button>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6BAE23', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Follow Social Medias
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[
                { name: 'LinkedIn', url: 'https://www.linkedin.com/company/tejomay-energies' },
                { name: 'X / Twitter', url: 'https://x.com/tejomayenergies' },
                { name: 'Instagram', url: 'https://www.instagram.com/tejomayenergies' },
                { name: 'YouTube', url: 'https://www.youtube.com/@tejomayenergies' },
                { name: 'Facebook', url: 'https://www.facebook.com/tejomayenergies' }
              ].map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'border-color 0.2s, background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#6BAE23';
                    e.currentTarget.style.background = 'rgba(107, 174, 35, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {soc.name} ↗
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'rgba(255, 255, 255, 0.45)',
          fontSize: '0.78rem'
        }}>
          <div 
            onClick={handleCopyrightClick} 
            title="© 2026 Tejomay Energies Ltd."
            style={{ cursor: 'default', userSelect: 'none' }}
          >
            © 2026 Tejomay Energies Ltd. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span 
              onClick={() => onOpenLegal?.('privacy')}
              style={{ cursor: 'pointer', transition: 'color 0.2s ease', color: 'rgba(255, 255, 255, 0.65)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#6BAE23')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
            >
              Privacy Policy
            </span>
            <span 
              onClick={() => onOpenLegal?.('terms')}
              style={{ cursor: 'pointer', transition: 'color 0.2s ease', color: 'rgba(255, 255, 255, 0.65)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#6BAE23')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
            >
              Terms of Service
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

const footerLinkStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.85rem',
  textDecoration: 'none',
  transition: 'color 0.2s ease'
};
