import React, { useState, useEffect, useCallback } from 'react';
import { getStoredServices, ServiceItem } from '../services/store';
import { fetchServices } from '../services/supabaseStore';

interface OfferingsSectionProps {
  onOpenEpcDetailsPage?: () => void;
}

export default function OfferingsSection({ onOpenEpcDetailsPage }: OfferingsSectionProps) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeSolarTab, setActiveSolarTab] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  
  // Hover State for Accordion Expansion on Stacked Cards (Desktop)
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Tap State for Accordion Expansion on Stacked Cards (Mobile)
  const [tappedCardId, setTappedCardId] = useState<string | null>(null);

  // Detect if the user is on a mobile / touch device
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Modal State for Expanded Specification Details
  const [selectedModalCard, setSelectedModalCard] = useState<ServiceItem | null>(null);

  useEffect(() => {
    const handleStorageChange = () => setServices(getStoredServices());
    handleStorageChange();

    // Hydrate from Supabase Cloud
    fetchServices().then(remoteServices => {
      if (remoteServices && remoteServices.length > 0) {
        setServices(remoteServices);
      }
    });

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tejomay_data_update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tejomay_data_update', handleStorageChange);
    };
  }, []);

  const handleWhatsApp = (serviceTitle: string) => {
    window.open(`https://wa.me/918468903255?text=Hi%20Tejomay%2C%20I%20want%20to%20inquire%20about%20${encodeURIComponent(serviceTitle)}`, '_blank', 'noopener,noreferrer');
  };

  const getAvifFallback = (cat: string) => {
    if (cat === 'residential') return '/solar_res_1.jpg';
    if (cat === 'commercial') return '/solar_res_2.jpg';
    if (cat === 'industrial') return '/solar_ind_1.jpg';
    if (cat === 'epc') return '/solar_res_3.jpg';
    return '/solar_ind_3.jpg';
  };

  // -------------------------------------------------------------------------
  // HELPER STACKED CARD RENDERER
  // Desktop: Expands on Hover | Mobile: Expands on Tap
  // -------------------------------------------------------------------------
  const renderStackedSmallCard = (card: ServiceItem, isExpanded: boolean, isCompressed: boolean, currentCategory: string) => {
    const handleCardInteraction = () => {
      if (isMobile) {
        // Toggle tap on mobile
        setTappedCardId(prev => prev === card.id ? null : card.id);
      }
    };

    return (
      <div 
        key={card.id}
        onMouseEnter={() => { if (!isMobile) setHoveredCardId(card.id); }}
        onMouseLeave={() => { if (!isMobile) setHoveredCardId(null); }}
        onClick={handleCardInteraction}
        style={{
          flex: isMobile ? 'none' : (isExpanded ? '2.5' : '1'),
          transition: 'flex 0.62s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.62s ease, padding 0.62s ease, max-height 0.62s cubic-bezier(0.16, 1, 0.3, 1)',
          background: '#f8fafc',
          borderRadius: '20px',
          padding: isExpanded ? '1.1rem' : '0.6rem',
          border: isExpanded ? '1.5px solid #0b131f' : '1px solid rgba(11, 19, 31, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: isExpanded ? '0 15px 35px rgba(0,0,0,0.14)' : 'none',
          willChange: 'flex',
          cursor: 'pointer',
          // Mobile: fixed heights instead of flex accordion
          ...(isMobile ? {
            width: '100%',
            minHeight: isExpanded ? '340px' : '180px',
            maxHeight: isExpanded ? '420px' : '180px',
          } : {})
        }}
      >
        {/* Card Background / Full Cover Image in Collapsed State */}
        <div style={{
          position: 'relative',
          borderRadius: '14px',
          overflow: 'hidden',
          height: isExpanded ? '140px' : '100%',
          minHeight: isExpanded ? '140px' : '100%',
          transition: 'height 0.62s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
          flexShrink: 0
        }}>
          <img 
            src={card.image || getAvifFallback(currentCategory)} 
            alt={card.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11, 19, 31, 0.85) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: '0.6rem', left: '0.75rem', right: '0.75rem' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#ffffff', background: '#0b131f', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
              {card.capacityRange}
            </span>
            <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: isExpanded ? '1.05rem' : '1rem', marginTop: '0.2rem', fontFamily: 'var(--font-outfit)', lineHeight: 1.15 }}>
              {card.title}
            </h4>
          </div>
        </div>

        {/* Detailed Content (Revealed on Hover / Expansion with Symmetrical Opening & Closing Transitions) */}
        <div style={{
          marginTop: isExpanded ? '0.5rem' : '0px',
          maxHeight: isExpanded ? '320px' : '0px',
          opacity: isExpanded ? 1 : 0,
          visibility: isExpanded ? 'visible' : 'hidden',
          transition: 'max-height 0.62s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, margin-top 0.62s ease, visibility 0.62s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
          overflow: 'hidden'
        }}>
          <div>
            <span style={{ color: '#0b131f', fontSize: '0.78rem', fontWeight: 800 }}>{card.tagline}</span>
            <p style={{ color: '#334155', fontSize: '0.78rem', marginTop: '0.2rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {card.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', margin: '0.5rem 0' }}>
              {card.features?.slice(0, 4).map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1e293b', fontSize: '0.73rem', fontWeight: 600 }}>
                  <span style={{ color: '#0b131f', fontWeight: 800 }}>✓</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.45rem', borderTop: '1px solid rgba(11, 19, 31, 0.08)', gap: '0.5rem', flexShrink: 0 }}>
            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748b' }}>Savings / SLA</span>
              <div style={{ color: '#0b131f', fontWeight: 800, fontSize: '0.88rem', lineHeight: 1.2 }}>{card.estimatedSavings}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedModalCard(card); }}
                style={{ background: '#ffffff', color: '#0b131f', border: '1.5px solid #0b131f', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Details 🔍
              </button>
              {currentCategory === 'epc' && onOpenEpcDetailsPage ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenEpcDetailsPage(); }}
                  style={{ background: '#0b131f', color: '#ffffff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  View Details ↗
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); handleWhatsApp(card.title); }}
                  className="btn-lime"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  Book ↗
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // MOBILE FULL CARD RENDERER — simple readable card, no accordion
  // -------------------------------------------------------------------------
  const renderMobileFullCard = (card: ServiceItem, currentCategory: string) => (
    <div key={card.id} style={{
      background: '#f8fafc',
      borderRadius: '18px',
      overflow: 'hidden',
      border: '1px solid rgba(11,19,31,0.08)',
      boxShadow: '0 4px 18px rgba(0,0,0,0.07)'
    }}>
      {/* Image */}
      <div style={{ position: 'relative', height: '180px', width: '100%' }}>
        <img src={card.image || getAvifFallback(currentCategory)} alt={card.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11,19,31,0.82) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.85rem', right: '0.85rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff', background: '#0b131f', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>{card.capacityRange}</span>
          <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginTop: '0.2rem', fontFamily: 'var(--font-outfit)', lineHeight: 1.2 }}>{card.title}</h4>
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '1rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0b131f' }}>{card.tagline}</span>
        <p style={{ color: '#475569', fontSize: '0.82rem', marginTop: '0.3rem', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{card.description}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', margin: '0.6rem 0' }}>
          {card.features?.slice(0, 4).map((feat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1e293b', fontSize: '0.73rem', fontWeight: 600 }}>
              <span style={{ color: '#0b131f', fontWeight: 800 }}>✓</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feat}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid rgba(11,19,31,0.08)', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.62rem', color: '#64748b' }}>Savings / SLA</span>
            <div style={{ color: '#0b131f', fontWeight: 800, fontSize: '0.9rem' }}>{card.estimatedSavings}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => setSelectedModalCard(card)}
              style={{ background: '#fff', color: '#0b131f', border: '1.5px solid #0b131f', padding: '0.4rem 0.7rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Details 🔍
            </button>
            {currentCategory === 'epc' && onOpenEpcDetailsPage ? (
              <button onClick={onOpenEpcDetailsPage}
                style={{ background: '#0b131f', color: '#fff', border: 'none', padding: '0.4rem 0.7rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                View ↗
              </button>
            ) : (
              <button onClick={() => handleWhatsApp(card.title)} className="btn-lime"
                style={{ padding: '0.4rem 0.7rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                Book ↗
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // REUSABLE DYNAMIC CARD LAYOUT ENGINE (1, 2, 3, 4 CARDS)
  // -------------------------------------------------------------------------
  const renderDynamicCardsEngine = (matchingCards: ServiceItem[], currentCategory: string) => {
    if (matchingCards.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
          No cards configured for this category yet. Add cards via Admin Panel.
        </div>
      );
    }

    // MOBILE: render ALL card counts (1, 2, 3, 4+ cards) as clean full-width stacked cards
    if (isMobile) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          {matchingCards.map(card => renderMobileFullCard(card, currentCategory))}
        </div>
      );
    }

    // 1 CARD -> EXACT HORIZONTAL SIDE-BY-SIDE LAYOUT
    if (matchingCards.length === 1) {
      const card = matchingCards[0];
      return (
        <div className="perspective-container">
          <div 
            className="card-3d-rotate"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(11, 19, 31, 0.08)'
            }}
          >
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '300px', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)' }}>
              <img src={card.image || getAvifFallback(currentCategory)} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11, 19, 31, 0.8) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ffffff', background: '#0b131f', padding: '0.35rem 0.8rem', borderRadius: '6px' }}>
                  {card.capacityRange}
                </span>
                <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.25rem', marginTop: '0.5rem' }}>
                  {card.title}
                </h4>
              </div>
            </div>

            <div>
              <span style={{ color: '#0b131f', fontSize: '0.85rem', fontWeight: 800 }}>{card.tagline}</span>
              <p style={{ color: '#334155', fontSize: '0.95rem', marginTop: '0.6rem', lineHeight: 1.6 }}>
                {card.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1.5rem 0' }}>
                {card.features?.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span style={{ color: '#0b131f', fontWeight: 800 }}>✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px solid rgba(11, 19, 31, 0.08)', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Savings / Guarantee</span>
                  <div style={{ color: '#0b131f', fontWeight: 800, fontSize: '1.15rem' }}>{card.estimatedSavings}</div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedModalCard(card)}
                    style={{ background: '#ffffff', color: '#0b131f', border: '1.5px solid #0b131f', padding: '0.75rem 1.4rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    <span>View Specifications 🔍</span>
                  </button>
                  {currentCategory === 'epc' && onOpenEpcDetailsPage ? (
                    <button
                      onClick={onOpenEpcDetailsPage}
                      style={{ background: '#0b131f', color: '#ffffff', border: 'none', padding: '0.75rem 1.4rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(11,19,31,0.25)' }}
                    >
                      <span>View More Details ↗</span>
                    </button>
                  ) : (
                    <button onClick={() => handleWhatsApp(card.title)} className="btn-lime" style={{ padding: '0.75rem 1.4rem' }}>
                      <span>Book Call ↗</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2 CARDS -> EQUAL 2-COLUMN SIDE-BY-SIDE
    if (matchingCards.length === 2) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
          {matchingCards.map((card) => (
            <div key={card.id} style={{ background: '#f8fafc', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(11,19,31,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '200px', marginBottom: '1rem' }}>
                <img src={card.image || getAvifFallback(currentCategory)} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11, 19, 31, 0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '0.85rem', left: '1rem', right: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ffffff', background: '#0b131f', padding: '0.3rem 0.75rem', borderRadius: '6px' }}>
                    {card.capacityRange}
                  </span>
                  <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.35rem' }}>
                    {card.title}
                  </h4>
                </div>
              </div>

              <div>
                <span style={{ color: '#0b131f', fontSize: '0.82rem', fontWeight: 800 }}>{card.tagline}</span>
                <p style={{ color: '#334155', fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: 1.45 }}>
                  {card.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', margin: '0.85rem 0' }}>
                  {card.features?.slice(0, 4).map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1e293b', fontSize: '0.76rem', fontWeight: 600 }}>
                      <span style={{ color: '#0b131f', fontWeight: 800 }}>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(11, 19, 31, 0.08)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Savings / SLA</span>
                  <div style={{ color: '#0b131f', fontWeight: 800, fontSize: '1rem' }}>{card.estimatedSavings}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setSelectedModalCard(card)} style={{ background: '#ffffff', color: '#0b131f', border: '1.5px solid #0b131f', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Details 🔍</button>
                  <button onClick={() => handleWhatsApp(card.title)} className="btn-lime" style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem' }}>Book ↗</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 3 CARDS -> 2 SMALL STACKED LEFT + 1 LARGE RIGHT (desktop) / simple stack (mobile)
    if (matchingCards.length === 3) {
      const card1 = matchingCards[0];
      const card2 = matchingCards[1];
      const card3 = matchingCards[2];

      // MOBILE: render all 3 as simple full cards
      if (isMobile) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[card1, card2, card3].map(card => renderMobileFullCard(card, currentCategory))}
          </div>
        );
      }

      // DESKTOP: original 2-col accordion layout
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', height: '540px', overflow: 'hidden' }}>
          {/* LEFT COLUMN: 2 STACKED FULL COVER PHOTO CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', height: '100%', overflow: 'hidden' }}>
            {renderStackedSmallCard(card1, hoveredCardId === card1.id, hoveredCardId === card2.id, currentCategory)}
            {renderStackedSmallCard(card2, hoveredCardId === card2.id, hoveredCardId === card1.id, currentCategory)}
          </div>

          {/* RIGHT COLUMN: 1 LARGE CARD */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '1.25rem',
            border: '1px solid rgba(11, 19, 31, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '230px', flexShrink: 0 }}>
              <img src={card3.image || getAvifFallback(currentCategory)} alt={card3.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11, 19, 31, 0.8) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '0.85rem', left: '0.85rem', right: '0.85rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', background: '#0b131f', padding: '0.25rem 0.65rem', borderRadius: '5px' }}>
                  {card3.capacityRange}
                </span>
                <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.15rem', marginTop: '0.25rem', fontFamily: 'var(--font-outfit)' }}>
                  {card3.title}
                </h4>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, overflow: 'hidden', marginTop: '0.65rem' }}>
              <div>
                <span style={{ color: '#0b131f', fontSize: '0.8rem', fontWeight: 800 }}>{card3.tagline}</span>
                <p style={{ color: '#334155', fontSize: '0.8rem', marginTop: '0.25rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {card3.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', margin: '0.65rem 0' }}>
                  {card3.features?.slice(0, 4).map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#1e293b', fontSize: '0.74rem', fontWeight: 600 }}>
                      <span style={{ color: '#0b131f', fontWeight: 800 }}>✓</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(11, 19, 31, 0.08)', flexShrink: 0 }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Savings / SLA</span>
                  <div style={{ color: '#0b131f', fontWeight: 800, fontSize: '0.98rem', lineHeight: 1.2 }}>{card3.estimatedSavings}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button onClick={() => setSelectedModalCard(card3)} style={{ background: '#ffffff', color: '#0b131f', border: '1.5px solid #0b131f', padding: '0.45rem 0.85rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Details 🔍</button>
                  <button onClick={() => handleWhatsApp(card3.title)} className="btn-lime" style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Book ↗</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }


    // 4 CARDS (4+ CARDS) -> TWIN STACKED COLUMNS (desktop) / simple stack (mobile)
    const card1 = matchingCards[0];
    const card2 = matchingCards[1];
    const card3 = matchingCards[2];
    const card4 = matchingCards[3];

    // MOBILE: render all 4 as simple full cards
    if (isMobile) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[card1, card2, card3, card4].map(card => renderMobileFullCard(card, currentCategory))}
        </div>
      );
    }

    // DESKTOP: Twin stacked columns with hover-to-expand
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', height: '540px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', height: '100%', overflow: 'hidden' }}>
          {renderStackedSmallCard(card1, hoveredCardId === card1.id, hoveredCardId === card3.id, currentCategory)}
          {renderStackedSmallCard(card3, hoveredCardId === card3.id, hoveredCardId === card1.id, currentCategory)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', height: '100%', overflow: 'hidden' }}>
          {renderStackedSmallCard(card2, hoveredCardId === card2.id, hoveredCardId === card4.id, currentCategory)}
          {renderStackedSmallCard(card4, hoveredCardId === card4.id, hoveredCardId === card2.id, currentCategory)}
        </div>
      </div>
    );
  };

  // Filter Sub-Services by Category
  const matchingSolarServices = services.filter(s => s.category === activeSolarTab);
  const epcServices = services.filter(s => s.category === 'epc');
  const amcServices = services.filter(s => s.category === 'amc');

  return (
    <section id="services" style={{ background: '#8CC63F', padding: 'clamp(3rem, 5.5vw, 5.5rem) clamp(0.75rem, 3vw, 1.5rem)', position: 'relative' }}>
      <div className="container">
        
        {/* Left-Aligned Subtle 'Our Services' Heading */}
        <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
          <span style={{
            color: '#0b131f',
            fontSize: '1.05rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            opacity: 0.9,
            display: 'inline-block'
          }}>
            OUR SERVICES
          </span>
        </div>

        {/* 3 MAJOR VERTICAL PILLARS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 3.5vw, 3.5rem)' }}>
          
          {/* =========================================================================
             VERTICAL PILLAR 1: SOLAR PANEL INFRASTRUCTURE & SALES
             ========================================================================= */}
          <div style={{
            background: '#ffffff',
            borderRadius: '28px',
            padding: 'clamp(1.25rem, 3vw, 2.5rem)',
            boxShadow: '0 20px 50px rgba(11, 19, 31, 0.15)',
            border: '1px solid rgba(11, 19, 31, 0.08)',
            overflow: 'hidden'
          }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0b131f', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  VERTICAL PILLAR 01
                </span>
                <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.3rem, 3.5vw, 2.1rem)', fontWeight: 700, color: '#0b131f', marginTop: '0.2rem' }}>
                  Solar Panel Infrastructure &amp; Sales
                </h3>
              </div>

              {/* 3 Horizontal Sub-Section Tabs — scrollable on mobile */}
              <div style={{ 
                display: 'flex', 
                gap: '0.4rem', 
                background: '#f1f5f9', 
                padding: '0.4rem', 
                borderRadius: '12px', 
                border: '1px solid rgba(11, 19, 31, 0.08)',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch' as any,
                flexShrink: 0,
                maxWidth: '100%',
                scrollbarWidth: 'none' as any
              }}>
                {(['residential', 'commercial', 'industrial'] as const).map((tab) => {
                  const isActive = activeSolarTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveSolarTab(tab)}
                      style={{
                        padding: isMobile ? '0.45rem 0.65rem' : '0.6rem 1.4rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: isActive ? '#0b131f' : 'transparent',
                        color: isActive ? '#ffffff' : '#475569',
                        fontWeight: isActive ? 700 : 600,
                        fontSize: isMobile ? '0.78rem' : '0.85rem',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.25s ease',
                        whiteSpace: 'nowrap',
                        boxShadow: isActive ? '0 4px 14px rgba(11, 19, 31, 0.25)' : 'none'
                      }}
                    >
                      {tab} Solar
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC CARD ENGINE FOR PILLAR 1 */}
            {renderDynamicCardsEngine(matchingSolarServices, activeSolarTab)}

          </div>

          {/* =========================================================================
             VERTICAL PILLAR 2: TURNKEY EPC SOLUTIONS
             ========================================================================= */}
          <div style={{
            background: '#ffffff',
            borderRadius: '28px',
            padding: 'clamp(1.25rem, 3vw, 2.5rem)',
            boxShadow: '0 20px 50px rgba(11, 19, 31, 0.15)',
            border: '1px solid rgba(11, 19, 31, 0.08)',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0b131f', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              VERTICAL PILLAR 02
            </span>
            <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.1rem, 3vw, 2.1rem)', fontWeight: 700, color: '#0b131f', marginTop: '0.2rem', marginBottom: '2rem' }}>
              Turnkey EPC Solutions (Engineering, Procurement &amp; Construction)
            </h3>

            {/* DYNAMIC CARD ENGINE FOR PILLAR 2 */}
            {renderDynamicCardsEngine(epcServices, 'epc')}
          </div>

          {/* =========================================================================
             VERTICAL PILLAR 3: TEJOMAY SHIELD AMC SERVICES
             ========================================================================= */}
          <div style={{
            background: '#ffffff',
            borderRadius: '28px',
            padding: 'clamp(1.25rem, 3vw, 2.5rem)',
            boxShadow: '0 20px 50px rgba(11, 19, 31, 0.15)',
            border: '1px solid rgba(11, 19, 31, 0.08)',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0b131f', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              VERTICAL PILLAR 03
            </span>
            <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.1rem, 3vw, 2.1rem)', fontWeight: 700, color: '#0b131f', marginTop: '0.2rem', marginBottom: '2rem' }}>
              Tejomay Shield™ AMC &amp; Operation Services
            </h3>

            {/* DYNAMIC CARD ENGINE FOR PILLAR 3 */}
            {renderDynamicCardsEngine(amcServices, 'amc')}
          </div>

        </div>

      </div>

      {/* =========================================================================
         MODAL POPUP FOR EXPANDED TECHNICAL SPECIFICATIONS
         ========================================================================= */}
      {selectedModalCard && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 110,
          background: 'rgba(5, 10, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '28px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.5rem',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6)',
            position: 'relative',
            border: '2px solid #0b131f',
            margin: 'auto'
          }}>
            <button
              onClick={() => setSelectedModalCard(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#0b131f',
                border: 'none',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              ✕
            </button>

            <div style={{ position: 'relative', height: '260px', borderRadius: '20px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img
                src={selectedModalCard.image || getAvifFallback(selectedModalCard.category)}
                alt={selectedModalCard.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11, 19, 31, 0.75) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0b131f', background: '#44D944', padding: '0.35rem 0.85rem', borderRadius: '6px' }}>
                  {selectedModalCard.capacityRange}
                </span>
                <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginTop: '0.4rem' }}>
                  {selectedModalCard.title}
                </h3>
              </div>
            </div>

            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0b131f' }}>
              {selectedModalCard.tagline}
            </span>
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, marginTop: '0.6rem', marginBottom: '1.5rem' }}>
              {selectedModalCard.description}
            </p>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0b131f', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Technical Infrastructure Specs
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {selectedModalCard.features?.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span style={{ color: '#44D944', fontWeight: 800, background: '#0b131f', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Financial Return / SLA</span>
                <div style={{ color: '#0b131f', fontWeight: 800, fontSize: '1.2rem' }}>
                  {selectedModalCard.estimatedSavings}
                </div>
              </div>

              <button
                onClick={() => {
                  handleWhatsApp(selectedModalCard.title);
                  setSelectedModalCard(null);
                }}
                className="btn-lime"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                <span>Book Site Survey ↗</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
