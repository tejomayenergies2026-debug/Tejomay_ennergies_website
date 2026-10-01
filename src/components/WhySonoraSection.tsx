import React, { useState, useEffect } from 'react';
import { getStoredFounders, FounderItem } from '../services/store';

export default function WhySonoraSection() {
  const [founders, setFounders] = useState<FounderItem[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setFounders(getStoredFounders());
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="founders" className="section-dark" style={{ background: '#0b131f', padding: 'clamp(3.5rem, 5vw, 5.5rem) 1.25rem' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#6BAE23',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.35rem'
          }}>
            LEADERSHIP &amp; VISION
          </span>
          <h2 style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            Founders
          </h2>
        </div>

        {/* Single Centered Founder Card */}
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {founders.slice(0, 1).map((founder) => (
            <div key={founder.id} className="founder-card-wrapper">
              
              {/* SVG Hover Animated Green Line */}
              <svg
                style={{
                  position: 'absolute',
                  inset: '-1px',
                  width: 'calc(100% + 2px)',
                  height: 'calc(100% + 2px)',
                  pointerEvents: 'none',
                  zIndex: 20,
                  overflow: 'visible'
                }}
              >
                <defs>
                  <linearGradient id={`traceGrad-${founder.id}`} x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6BAE23" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#6BAE23" stopOpacity="1" />
                    <stop offset="100%" stopColor="#6BAE23" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <rect
                  className="founder-trace-path"
                  x="1" y="1"
                  width="calc(100% - 2px)"
                  height="calc(100% - 2px)"
                  rx="28" ry="28"
                  stroke={`url(#traceGrad-${founder.id})`}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              {/* Main White Founder Card */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '28px',
                  padding: isMobile ? '1.5rem' : '2.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
                  display: isMobile ? 'flex' : 'grid',
                  flexDirection: isMobile ? 'column' : undefined,
                  gridTemplateColumns: isMobile ? undefined : '200px 1fr',
                  gap: isMobile ? '1.25rem' : '1.75rem',
                  alignItems: 'center',
                  color: '#0f172a',
                  position: 'relative',
                  zIndex: 5,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 30px 75px rgba(68, 217, 68, 0.22)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.45)';
                  }
                }}
              >
                
                {/* On Mobile: Role & Name Header at Top */}
                {isMobile && (
                  <div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#0b131f',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      background: 'rgba(107, 174, 35, 0.25)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '6px',
                      display: 'inline-block',
                      marginBottom: '0.35rem'
                    }}>
                      {founder.role}
                    </span>
                    <h3 style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      margin: 0,
                      lineHeight: 1.2
                    }}>
                      {founder.name}
                    </h3>
                  </div>
                )}

                {/* Founder Photo */}
                <div style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: isMobile ? '250px' : '240px',
                  width: '100%',
                  background: '#0b131f',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                  border: '2px solid #6BAE23',
                  flexShrink: 0
                }}>
                  <img
                    src={founder.photo}
                    alt={founder.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                  />
                  <div style={{ position: 'absolute', bottom: '0.65rem', left: '0.65rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0b131f', background: '#6BAE23', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                      Founder &amp; CEO
                    </span>
                  </div>
                </div>

                {/* Founder Details */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: isMobile ? '0' : '0.2rem 0', minWidth: 0 }}>
                  <div>
                    {!isMobile && (
                      <>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0b131f', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(107, 174, 35, 0.25)', padding: '0.25rem 0.65rem', borderRadius: '6px', display: 'inline-block', marginBottom: '0.4rem' }}>
                          {founder.role}
                        </span>

                        <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem', lineHeight: 1.2 }}>
                          {founder.name}
                        </h3>
                      </>
                    )}

                    <p style={{ color: '#475569', fontSize: isMobile ? '0.9rem' : '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                      "{founder.bio}"
                    </p>
                  </div>

                  {/* Social Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <a href={founder.instagram || "https://www.instagram.com/tejomay_energies/"} target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: 'linear-gradient(135deg, #e1306c, #c13584)', color: '#ffffff' }}>
                      <span>Instagram ↗</span>
                    </a>
                    <a href={founder.linkedin} target="_blank" rel="noreferrer" style={socialBtnStyle}>
                      <span>LinkedIn ↗</span>
                    </a>
                    <a href={`mailto:${founder.email}`} style={{ ...socialBtnStyle, background: '#6BAE23', color: '#0b131f', boxShadow: '0 4px 12px rgba(68, 217, 68, 0.3)' }}>
                      <span>Email ✉</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

const socialBtnStyle: React.CSSProperties = {
  background: '#0b131f',
  color: '#ffffff',
  padding: '0.4rem 0.75rem',
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: 700,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  transition: 'all 0.2s ease'
};
