import React, { useState, useEffect } from 'react';
import { getStoredFounders, FounderItem } from '../services/store';

export default function WhySonoraSection() {
  const [founders, setFounders] = useState<FounderItem[]>([]);

  useEffect(() => {
    setFounders(getStoredFounders());
  }, []);

  return (
    <section id="founders" className="section-dark" style={{ background: '#0b131f', padding: '5.5rem 1.5rem' }}>
      <div className="container">
        
        {/* Section Header: Minimal Bold Title */}
        <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            Founders
          </h2>
        </div>

        {/* Side-by-Side Left & Right Founders (White Cards Theme) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '2.25rem' }}>
          {founders.map((founder, idx) => (
            <div key={founder.id} className="founder-card-wrapper">
              
              {/* =========================================================================
                 SVG HOVER ANIMATED GREEN LINE (Snug Hugging: inset: -1px)
                 ========================================================================= */}
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
                  {/* Linear Gradient for Variable Glow & Thickness Effect */}
                  <linearGradient id={`traceGrad-${founder.id}`} x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6BAE23" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#6BAE23" stopOpacity="1" />
                    <stop offset="100%" stopColor="#6BAE23" stopOpacity="0.5" />
                  </linearGradient>
                </defs>

                {/* Solid #44D944 Path hugging card rounded border snugly */}
                <rect
                  className="founder-trace-path"
                  x="1"
                  y="1"
                  width="calc(100% - 2px)"
                  height="calc(100% - 2px)"
                  rx="28"
                  ry="28"
                  stroke={`url(#traceGrad-${founder.id})`}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              {/* Main White Founder Card Container */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '28px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
                  display: 'grid',
                  gridTemplateColumns: '175px 1fr',
                  gap: '1.75rem',
                  alignItems: 'center',
                  color: '#0f172a',
                  position: 'relative',
                  zIndex: 5,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 30px 75px rgba(68, 217, 68, 0.22)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.45)';
                }}
              >
                
                {/* LEFT SIDE: Fitted Photo Frame */}
                <div style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: '240px',
                  width: '100%',
                  background: '#0b131f',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                  border: '2px solid #6BAE23'
                }}>
                  <img
                    src={founder.photo}
                    alt={founder.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top'
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: '0.65rem', left: '0.65rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0b131f', background: '#6BAE23', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                      Founder #{idx + 1}
                    </span>
                  </div>
                </div>

                {/* RIGHT SIDE: Information & Social Buttons Below */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0b131f', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(107, 174, 35, 0.25)', padding: '0.25rem 0.65rem', borderRadius: '6px', display: 'inline-block', marginBottom: '0.4rem' }}>
                      {founder.role}
                    </span>

                    <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.7rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem', lineHeight: 1.2 }}>
                      {founder.name}
                    </h3>

                    <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                      {founder.bio}
                    </p>
                  </div>

                  {/* Social Media Buttons Below Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#0b131f',
                        color: '#ffffff',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>LinkedIn ↗</span>
                    </a>

                    <a
                      href={founder.twitter}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#0b131f',
                        color: '#ffffff',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>X ↗</span>
                    </a>

                    <a
                      href={`mailto:${founder.email}`}
                      style={{
                        background: '#6BAE23',
                        color: '#0b131f',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(68, 217, 68, 0.3)'
                      }}
                    >
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
