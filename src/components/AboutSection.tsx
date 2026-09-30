import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" style={{ background: '#44D944', padding: '5.5rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Single Short Vision Statement Quote (Clean & Minimal - Badge Removed) */}
        <h2 style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
          fontWeight: 700,
          color: '#0b131f',
          lineHeight: 1.35,
          letterSpacing: '-0.01em',
          margin: 0
        }}>
          "Empowering a zero-carbon future by transforming everyday sunlight into clean, reliable, and intelligent energy for every roof."
        </h2>

      </div>
    </section>
  );
}
