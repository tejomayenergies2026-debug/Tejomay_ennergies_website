import React, { useState, useEffect } from 'react';
import { getStoredTestimonials, TestimonialItem } from '../services/store';
import { fetchTestimonials } from '../services/supabaseStore';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [activeTab, setActiveTab] = useState<'residential' | 'industrial'>('residential');
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleStorageChange = () => setTestimonials(getStoredTestimonials());
    handleStorageChange();

    // Hydrate from Supabase Cloud
    fetchTestimonials().then(remoteTestimonials => {
      if (remoteTestimonials && remoteTestimonials.length > 0) {
        setTestimonials(remoteTestimonials);
      }
    });

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tejomay_data_update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tejomay_data_update', handleStorageChange);
    };
  }, []);

  const toggleFlip = (id: string) => {
    setFlippedCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter items into Residential vs Industrial
  const filteredTestimonials = testimonials.filter(item => item.category === activeTab);

  // Custom photo fallback helper
  const getPhotoForCard = (idx: number, item: TestimonialItem) => {
    if (item.photo && !item.photo.includes('solar1_custom.jpeg') && !item.photo.includes('.avif')) {
      return item.photo;
    }
    if (idx === 0) return '/solar_res_1.jpg';
    if (idx === 1) return '/solar_res_2.jpg';
    if (idx === 2) return '/solar_res_3.jpg';
    if (idx === 3) return '/solar_ind_1.jpg';
    if (idx === 4) return '/solar_ind_2.jpg';
    return '/solar_ind_3.jpg';
  };

  return (
    <section id="work" className="section-sand" style={{ background: '#f5f0eb', padding: '5.5rem 1.5rem' }}>
      <div className="container">
        
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
            “Turning Renewable Energy into Real-World Impact.”
          </h2>
        </div>

        {/* 2. OUR PREVIOUS WORK - (Strictly Left Aligned) */}
        <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
          <span style={{
            fontSize: '0.88rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'inline-block'
          }}>
            OUR PREVIOUS WORK -
          </span>
        </div>

        {/* 3. Centered Filter Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', gap: '0.5rem', background: '#e2e8f0', padding: '0.35rem', borderRadius: '12px' }}>
            <button
              onClick={() => setActiveTab('residential')}
              style={{
                padding: '0.6rem 1.6rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'residential' ? '#0f172a' : 'transparent',
                color: activeTab === 'residential' ? '#ffffff' : '#475569',
                fontWeight: activeTab === 'residential' ? 700 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              Residential Solar
            </button>

            <button
              onClick={() => setActiveTab('industrial')}
              style={{
                padding: '0.6rem 1.6rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'industrial' ? '#0f172a' : 'transparent',
                color: activeTab === 'industrial' ? '#ffffff' : '#475569',
                fontWeight: activeTab === 'industrial' ? 700 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              Industrial & Commercial
            </button>
          </div>
        </div>

        {/* 4. 3 Cards Horizontal Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2rem', justifyContent: 'center' }}>
          {filteredTestimonials.map((item, idx) => {
            const isFlipped = !!flippedCardIds[item.id];
            const cardPhoto = getPhotoForCard(idx, item);

            return (
              <div 
                key={item.id} 
                className={`flip-card-container ${isFlipped ? 'is-flipped' : ''}`}
                onClick={() => toggleFlip(item.id)}
                style={{ touchAction: 'manipulation' }}
              >
                <div className="flip-card-inner">
                  
                  {/* FRONT PAGE OF CARD */}
                  <div className="flip-card-front">
                    <img 
                      src={cardPhoto} 
                      alt={item.projectCapacity}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11, 19, 31, 0.88) 0%, rgba(11, 19, 31, 0.3) 50%, transparent 100%)' }} />
                    
                    {/* Top Right Transparent Glassmorphic Hover Overlay */}
                    <div className="front-hover-badge" style={{
                      position: 'absolute',
                      top: '1.1rem',
                      right: '1.1rem',
                      background: 'rgba(11, 19, 31, 0.65)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '14px',
                      padding: '0.7rem 0.9rem',
                      color: '#ffffff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                      maxWidth: '220px'
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#44D944', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <img src="/location-icon.png" alt="Location" style={{ width: '13px', height: '13px', objectFit: 'contain' }} />
                          {item.companyOrLocation}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '0.2rem', color: '#ffffff' }}>
                        {item.projectCapacity}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>🔄 Click to read review</span>
                      </div>
                    </div>

                    {/* Front Bottom Label */}
                    <div style={{ position: 'absolute', bottom: '1.4rem', left: '1.4rem', right: '1.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0b131f', background: '#44D944', padding: '0.35rem 0.8rem', borderRadius: '6px' }}>
                        ⚡ {item.projectCapacity}
                      </span>
                      <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.25rem', marginTop: '0.5rem', fontFamily: 'var(--font-outfit)' }}>
                        {item.companyOrLocation}
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.2rem' }}>
                        Click card to flip 3D & view partner testimonial 🔄
                      </p>
                    </div>
                  </div>

                  {/* BACK PAGE OF CARD: White Card */}
                  <div className="flip-card-back" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                    
                    <div style={{ width: '100%', minWidth: 0 }}>
                      {/* Top Capacity Badge & Date */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', gap: '0.5rem', width: '100%', minWidth: 0 }}>
                        <span className="truncate-1" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', background: 'rgba(68, 217, 68, 0.3)', padding: '0.35rem 0.85rem', borderRadius: '9999px', flexShrink: 0, maxWidth: '62%' }}>
                          ⚡ {item.projectCapacity}
                        </span>
                        <span className="truncate-1" style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, maxWidth: '38%', textAlign: 'right', flexShrink: 1 }}>
                          {item.date}
                        </span>
                      </div>

                      {/* 5-Star Rating */}
                      <div style={{ color: '#f59e0b', fontSize: '0.98rem', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
                        ★★★★★
                      </div>

                      {/* Testimonial Quote Paragraph */}
                      <p className="clamp-4 card-text-safe" style={{ color: '#334155', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.55, marginBottom: '1rem' }}>
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Client Avatar & Details Footer */}
                    <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, width: '100%' }}>
                      {/* Avatar Circle */}
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #44D944, #0b131f)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        border: '2px solid rgba(68, 217, 68, 0.4)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        flexShrink: 0
                      }}>
                        {item.clientName ? item.clientName.split(' ').map(n => n[0]).join('') : 'TM'}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 className="truncate-1" style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                          {item.clientName}
                        </h4>
                        <span className="truncate-1" style={{ fontSize: '0.76rem', color: '#64748b', display: 'block', marginTop: '0.15rem' }}>
                          {item.clientRole} • {item.companyOrLocation}
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
