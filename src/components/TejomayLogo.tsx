import React from 'react';

interface TejomayLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  isLightMode?: boolean;
}

export default function TejomayLogo({ size = 'md', showSubtitle = true }: TejomayLogoProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const logoHeight = isSmall ? '32px' : isLarge ? '55px' : '42px';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', userSelect: 'none', cursor: 'pointer' }}>
      {/* Official Tejomay Logo Graphic / Emblem */}
      <div style={{
        height: logoHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Render logo image from public/tejomay-logo.png with fallback SVG */}
        <img
          src="/tejomay-logo.png"
          alt="Tejomay Energies Logo"
          style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
          onError={(e) => {
            // Fallback SVG Emblem matching the uploaded photo
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        
        {/* Fallback Styled SVG Logo Emblem */}
        <svg
          viewBox="0 0 160 50"
          style={{ height: logoHeight, width: 'auto' }}
          className="logo-svg-fallback"
        >
          {/* Blue Solar Panels */}
          <polygon points="10,12 28,12 24,24 6,24" fill="#1e3a8a" />
          <polygon points="30,12 48,12 44,24 26,24" fill="#2563eb" />
          <polygon points="12,26 30,26 26,38 8,38" fill="#1d4ed8" />
          <polygon points="32,26 50,26 46,38 28,38" fill="#10b981" />
          
          {/* Sun Core */}
          <circle cx="55" cy="25" r="11" fill="#f97316" />
          <path d="M55,10 L55,6 M55,40 L55,44 M40,25 L36,25 M70,25 L74,25 M44,14 L41,11 M66,36 L69,39 M44,36 L41,39 M66,14 L69,11" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Lightning Swoosh */}
          <path d="M52,22 L58,16 L56,26 L64,24 L54,34 L56,28 Z" fill="#84cc16" />

          {/* TEJOMAY Wordmark */}
          <text x="75" y="27" fontFamily="var(--font-outfit), sans-serif" fontWeight="900" fontSize="22" fill="#ffffff" letterSpacing="0.5">
            TEJ<tspan fill="#f97316">O</tspan>MAY
          </text>
          
          {/* Subtitle */}
          {showSubtitle && (
            <text x="75" y="38" fontFamily="var(--font-inter), sans-serif" fontWeight="700" fontSize="7.5" fill="#6BAE23" letterSpacing="0.8">
              TEJOMAY ENERGIES
            </text>
          )}
        </svg>
      </div>

      {/* Brand Text Header */}
      <div>
        <div style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: isSmall ? '1.25rem' : isLarge ? '2.1rem' : '1.5rem',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          lineHeight: 1.1
        }}>
          Tejomay <span style={{ color: '#6BAE23' }}>Energies</span>
        </div>
        {showSubtitle && (
          <div style={{ fontSize: '0.62rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.65)', letterSpacing: '0.04em' }}>
            Solar Solutions for a Brighter Tomorrow
          </div>
        )}
      </div>
    </div>
  );
}
