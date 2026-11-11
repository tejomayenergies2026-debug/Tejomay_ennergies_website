import React from 'react';

interface TejomayLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  isLightMode?: boolean;
}

export default function TejomayLogo({ size = 'md' }: TejomayLogoProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const logoDimension = isSmall ? '80px' : isLarge ? '140px' : '110px';

  return (
    <a
      href="https://www.tejomayenergies.com/"
      aria-label="Tejomay Energies Home"
      style={{ display: 'inline-flex', alignItems: 'center', userSelect: 'none', cursor: 'pointer', textDecoration: 'none' }}
    >
      {/* Official Tejomay Circular Logo */}
      <img
        src="/tejomay-circle-logo.png"
        alt="Tejomay Energies Official Logo"
        style={{
          width: logoDimension,
          height: logoDimension,
          borderRadius: '50%',
          objectFit: 'contain',
          background: '#ffffff',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          border: '2px solid #6BAE23',
          display: 'block',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 14px 35px rgba(107, 174, 35, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        }}
      />
    </a>
  );
}
