import React from 'react';

export default function PotentialSection() {
  const openMaps = (query: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  const callPhone = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
  };

  return (
    <section id="cities" className="section-sky" style={{ background: '#b2e3f7', padding: '5.5rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        {/* 1. Centered Vision Quote Line */}
        <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto 1.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
            margin: 0
          }}>
            “The Future of Energy Begins with the Sun.”
          </h2>
        </div>

        {/* 2. OUR LOCATIONS - (Left Aligned) */}
        <div style={{ textAlign: 'left', maxWidth: '1240px', margin: '0 auto 1.25rem' }}>
          <span style={{
            fontSize: '0.88rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'inline-block'
          }}>
            OUR LOCATIONS -
          </span>
        </div>

        {/* 3. 2 Hub Location Cards Grid (Larger Dimension Cards, No Animation) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '2.25rem', maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* CARD 1: NEW DELHI NCR */}
          <div style={{
            background: '#ffffff',
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(15, 23, 42, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Top Photo Cover (Increased Height) */}
            <div style={{ position: 'relative', height: '260px', width: '100%' }}>
              <img 
                src="/solar2.avif" 
                alt="New Delhi NCR Solar Center" 
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '1.1rem',
                left: '1.1rem',
                background: '#44D944',
                color: '#0b131f',
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '0.4rem 0.9rem',
                borderRadius: '8px'
              }}>
                🏙️ New Delhi NCR
              </span>
            </div>

            {/* Card Body (Increased Padding & Typography) */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <span style={{
                  background: 'rgba(68, 217, 68, 0.25)',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.35rem 0.8rem',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '0.75rem'
                }}>
                  📍 CONNAUGHT PLACE
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.25,
                  margin: '0 0 0.75rem 0'
                }}>
                  Tejomay Solar Experience Center — North Hub
                </h3>

                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.55, fontWeight: 500, margin: '0 0 1.2rem 0' }}>
                  <strong>Address:</strong> Level 4, Barakhamba Tower, Connaught Place, New Delhi - 110001
                </p>

                {/* Store Hours Box (Clock Emoji Removed) */}
                <div style={{
                  background: '#f1f5f9',
                  borderRadius: '12px',
                  padding: '0.75rem 1.1rem',
                  marginBottom: '1.4rem',
                  fontSize: '0.85rem',
                  color: '#475569',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span><strong>Store Hours:</strong> Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openMaps('Level 4, Barakhamba Tower, Connaught Place, New Delhi - 110001')}
                  style={{
                    background: '#f1f5f9',
                    color: '#0f172a',
                    border: 'none',
                    padding: '0.85rem 1.4rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    flex: 1,
                    textAlign: 'center',
                    transition: 'background 0.2s ease'
                  }}
                >
                  📍 Google Maps ↗
                </button>

                <button
                  onClick={() => callPhone('+91 8468903255')}
                  style={{
                    background: '#0b131f',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.85rem 1.4rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    flex: 1.3,
                    textAlign: 'center',
                    transition: 'background 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <img src="/call-icon.png" alt="Call" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                  <span>Call: +91 8468903255 ↗</span>
                </button>
              </div>
            </div>

          </div>

          {/* CARD 2: MUMBAI, MAHARASHTRA */}
          <div style={{
            background: '#ffffff',
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(15, 23, 42, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Top Photo Cover (Increased Height) */}
            <div style={{ position: 'relative', height: '260px', width: '100%' }}>
              <img 
                src="/solar3.avif" 
                alt="Mumbai Solar Experience Center" 
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '1.1rem',
                left: '1.1rem',
                background: '#44D944',
                color: '#0b131f',
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '0.4rem 0.9rem',
                borderRadius: '8px'
              }}>
                🏙️ Mumbai, Maharashtra
              </span>
            </div>

            {/* Card Body (Increased Padding & Typography) */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <span style={{
                  background: 'rgba(68, 217, 68, 0.25)',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.35rem 0.8rem',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '0.75rem'
                }}>
                  📍 BANDRA KURLA COMPLEX (BKC)
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.25,
                  margin: '0 0 0.75rem 0'
                }}>
                  Tejomay Solar Experience Center — West Hub
                </h3>

                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.55, fontWeight: 500, margin: '0 0 1.2rem 0' }}>
                  <strong>Address:</strong> Suite 802, Maker Maxity, Bandra Kurla Complex, Mumbai - 400051
                </p>

                {/* Store Hours Box (Clock Emoji Removed) */}
                <div style={{
                  background: '#f1f5f9',
                  borderRadius: '12px',
                  padding: '0.75rem 1.1rem',
                  marginBottom: '1.4rem',
                  fontSize: '0.85rem',
                  color: '#475569',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span><strong>Store Hours:</strong> Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <button
                  onClick={() => openMaps('Suite 802, Maker Maxity, Bandra Kurla Complex, Mumbai - 400051')}
                  style={{
                    background: '#f1f5f9',
                    color: '#0f172a',
                    border: 'none',
                    padding: '0.85rem 1.4rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    flex: 1,
                    textAlign: 'center',
                    transition: 'background 0.2s ease'
                  }}
                >
                  📍 Google Maps ↗
                </button>

                <button
                  onClick={() => callPhone('+91 8468903255')}
                  style={{
                    background: '#0b131f',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.85rem 1.4rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    flex: 1.3,
                    textAlign: 'center',
                    transition: 'background 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <img src="/call-icon.png" alt="Call" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                  <span>Call: +91 8468903255 ↗</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
