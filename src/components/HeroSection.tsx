import React, { useState, useRef, useEffect } from 'react';

interface HeroSectionProps {
  isCalculatorOpen?: boolean;
  setIsCalculatorOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeroSection({
  isCalculatorOpen: externalIsOpen,
  setIsCalculatorOpen: externalSetIsOpen
}: HeroSectionProps = {}) {
  // Slide-out Calculator Drawer State
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isCalculatorOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsCalculatorOpen = externalSetIsOpen || setInternalIsOpen;

  // Calculator Inputs (Official Indian Solar Formula - MNRE Standard)
  const [customerType, setCustomerType] = useState<'residential' | 'commercial'>('residential');
  const [monthlyBill, setMonthlyBill] = useState<number>(8500);
  const [systemKw, setSystemKw] = useState<number>(9);

  // Official MNRE / Industry Solar Formula Constants
  const TARIFF_RATE = customerType === 'residential' ? 8.0 : 9.5; // Avg ₹/kWh in India
  const UNITS_PER_KW_MONTH = 120; // 4 units/day * 30 days = 120 kWh per 1 kW/month

  // Two-way synchronized input handlers (Bill and kW are directly connected)
  const handleBillChange = (newBill: number) => {
    setMonthlyBill(newBill);
    const units = newBill / TARIFF_RATE;
    const derivedKw = Math.max(1, Math.min(25, Math.round((units / UNITS_PER_KW_MONTH) * 2) / 2));
    setSystemKw(derivedKw);
  };

  const handleKwChange = (newKw: number) => {
    setSystemKw(newKw);
    const derivedBill = Math.round(newKw * UNITS_PER_KW_MONTH * TARIFF_RATE);
    setMonthlyBill(Math.min(60000, Math.max(1500, derivedBill)));
  };

  const handleCustomerTypeChange = (type: 'residential' | 'commercial') => {
    setCustomerType(type);
    const newRate = type === 'residential' ? 8.0 : 9.5;
    const derivedBill = Math.round(systemKw * UNITS_PER_KW_MONTH * newRate);
    setMonthlyBill(Math.min(60000, Math.max(1500, derivedBill)));
  };

  // Required Shadow-free Roof Space (Standard: 90 sq ft per 1 kW for modern monocrystalline panels)
  const requiredRoofSqFt = Math.round(systemKw * 90);

  // Solar Monthly Generation & Financial Savings
  const monthlySolarGenUnits = Math.round(systemKw * UNITS_PER_KW_MONTH);
  const estMonthlySavings = Math.round(Math.min(monthlyBill, monthlySolarGenUnits * TARIFF_RATE));
  const estAnnualSavings = estMonthlySavings * 12;
  const est25YrSavings = estAnnualSavings * 25;

  const handleWhatsAppConsult = () => {
    const text = `Hi Tejomay! I am interested in your solar services and would like to schedule a consultation.`;
    window.open(`https://wa.me/917447449534?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  // Words sequence for Lego 3D Pop-in Animation
  // "Tejomay - Solar Solutions for a Brighter Tomorrow"
  const titleWords = [
    { text: 'Tejomay', isBrand: true },
    { text: '-', isBrand: false },
    { text: 'Solar', isBrand: false },
    { text: 'Solutions', isBrand: false },
    { text: 'for', isBrand: false },
    { text: 'a', isBrand: false },
    { text: 'Brighter', isBrand: false },
    { text: 'Tomorrow.', isBrand: false }
  ];

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Enforce Safari/iOS autoplay compliance and recover if CoreMedia hits edge challenge
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isDisposed = false;
    let blobUrl: string | null = null;
    let fallbackTried = false;
    const abortController = new AbortController();

    // Set required DOM attributes BEFORE assigning src so WebKit sees muted+playsinline on load
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');

    const attemptPlay = () => {
      if (isDisposed) return;
      video.muted = true;
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    const loadViaBlobFallback = async () => {
      if (fallbackTried || isDisposed) return;
      fallbackTried = true;

      for (const candidate of ['/solar-bg-instant.mp4', '/solar-bg.mp4']) {
        try {
          const res = await fetch(candidate, {
            credentials: 'same-origin',
            signal: abortController.signal,
          });
          if (!res.ok) continue;
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('text/html')) continue;

          const buffer = await res.arrayBuffer();
          if (isDisposed || buffer.byteLength < 10000) continue;

          const blob = new Blob([buffer], { type: 'video/mp4' });
          blobUrl = URL.createObjectURL(blob);
          video.src = blobUrl;
          video.load();
          attemptPlay();
          return;
        } catch {
          // Try next source candidate
        }
      }
    };

    const handleDirectError = () => {
      void loadViaBlobFallback();
    };

    video.src = '/solar-bg-instant.mp4';
    video.load();
    attemptPlay();

    video.addEventListener('loadeddata', attemptPlay);
    video.addEventListener('canplay', attemptPlay);
    video.addEventListener('error', handleDirectError);

    // If Safari CoreMedia stalls at HAVE_NOTHING (e.g. challenged Range request), load via fetch+blob
    const stallTimer = window.setTimeout(() => {
      if (!isDisposed && video.readyState === 0) {
        void loadViaBlobFallback();
      }
    }, 1500);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') attemptPlay();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Fallback for iOS Low Power Mode until first user interaction
    const handleFirstInteraction = () => attemptPlay();
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true });

    return () => {
      isDisposed = true;
      abortController.abort();
      window.clearTimeout(stallTimer);
      video.removeEventListener('loadeddata', attemptPlay);
      video.removeEventListener('canplay', attemptPlay);
      video.removeEventListener('error', handleDirectError);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, []);

  return (
    <section id="hero" style={{
      position: 'relative',
      minHeight: '100vh',
      paddingTop: '8rem',
      paddingBottom: '4rem',
      display: 'flex',
      alignItems: 'flex-end',
      overflow: 'hidden'
    }}>
      {/* Background Video with H.264 MP4 and Safari Blob Fallback */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
        poster="/solar_res_3.jpg"
        aria-hidden="true"
        className="hero-video-bg"
      />

      {/* Video Dark Overlay */}
      <div className="hero-video-overlay" />

      {/* Top Left Official Tejomay Circular Logo */}
      <a
        href="https://www.tejomayenergies.com/"
        aria-label="Tejomay Energies Home"
        className="hero-top-left-logo"
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '2.5rem',
          zIndex: 40,
          cursor: 'pointer',
          userSelect: 'none',
          display: 'inline-block',
          textDecoration: 'none'
        }}
      >
        <img
          src="/tejomay-circle-logo.png"
          alt="Tejomay Energies Official Logo"
          style={{
            width: 'clamp(72px, 8.5vw, 102px)',
            height: 'clamp(72px, 8.5vw, 102px)',
            borderRadius: '50%',
            objectFit: 'contain',
            background: '#ffffff',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.55)',
            border: '2.5px solid #6BAE23',
            display: 'block',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(107, 174, 35, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.55)';
          }}
        />
      </a>

      {/* Hero Content Container: Positioned Bottom Left */}
      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{
          maxWidth: '720px',
          paddingBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>

          {/* 3D Animated Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: 'clamp(1.9rem, 6.5vw, 3.8rem)',
              fontWeight: 600,
              lineHeight: 1.18,
              color: '#ffffff',
              marginBottom: '2rem',
              letterSpacing: '-0.02em',
              wordBreak: 'break-word'
            }}
          >
            {titleWords.map((item, idx) => (
              <span
                key={idx}
                className="lego-word"
                style={{
                  animationDelay: `${idx * 0.12}s`,
                  marginRight: '0.32em'
                }}
              >
                {item.isBrand ? (
                  <span className="word-tejomay-silver-shine">
                    {item.text}
                  </span>
                ) : (
                  item.text
                )}
              </span>
            ))}
          </h1>

          {/* Action Buttons Positioned Lower Bottom Left */}
          <div className="hero-action-buttons-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleWhatsAppConsult}
              className="btn-lime"
              style={{ padding: '0.85rem 1.8rem', fontSize: '0.92rem', borderRadius: '10px' }}
            >
              <span>Start Solar Installation ↗</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('services');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-solid-white"
              style={{ padding: '0.85rem 1.8rem', fontSize: '0.92rem', borderRadius: '10px' }}
            >
              Explore Services
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
         HERO-BOUNDED CALCULATOR TOGGLE BUTTON (Absolute to Hero - Does NOT follow scrolling)
         ========================================================================= */}
      {/* Calculator Toggle Side Tab */}
      <button
        onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
        className="calc-side-tab"
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <img src="/lightning-icon.png" alt="Solar" style={{ width: '13px', height: '13px', objectFit: 'contain' }} />
          SOLAR CALCULATOR
        </span>
        <span
          style={{
            display: 'inline-block',
            fontSize: '1.25rem',
            lineHeight: 1,
            transform: isCalculatorOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          ‹
        </span>
      </button>

      {/* Backdrop overlay when calculator is open inside Hero */}
      {isCalculatorOpen && (
        <div
          onClick={() => setIsCalculatorOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(11, 19, 31, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
        />
      )}

      {/* =========================================================================
         HERO-BOUNDED CALCULATOR DRAWER (Absolute to Hero - Positioned at right: 3.5rem)
         ========================================================================= */}
      <div
        id="calculator"
        className="calc-drawer"
        style={{
          transform: isCalculatorOpen ? 'translateX(0)' : 'translateX(140%)',
          opacity: isCalculatorOpen ? 1 : 0,
          pointerEvents: isCalculatorOpen ? 'auto' : 'none',
        }}
      >

        {/* Calculator Header with Close Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#6BAE23', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/lightning-icon.png" alt="Solar" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
            </span>
            <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Solar Cost & Savings Calculator
            </h3>
          </div>

          <button
            onClick={() => setIsCalculatorOpen(false)}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Subtitle */}
        <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Calculate your rooftop solar capacity, terrace area requirement, and electricity bill savings based on official MNRE benchmarks.
        </p>

        {/* Sector Switcher (Residential vs Commercial) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '10px' }}>
            {([
              { id: 'residential', label: 'Residential Home', icon: '/calc-home-icon.png' },
              { id: 'commercial', label: 'Commercial / Factory', icon: '/calc-factory-icon.png' },
            ] as const).map((sector) => {
              const isActive = customerType === sector.id;
              return (
                <button
                  key={sector.id}
                  type="button"
                  onClick={() => handleCustomerTypeChange(sector.id)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 0.35rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? '#0f172a' : 'transparent',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontWeight: 600,
                    fontSize: '0.73rem',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <img
                    src={sector.icon}
                    alt=""
                    style={{ width: '14px', height: '14px', objectFit: 'contain', flexShrink: 0 }}
                  />
                  <span>{sector.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Both Sliders: Monthly Bill AND Solar System Size (Stacked one below another) */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* Slider 1: Monthly Electricity Bill */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Average Monthly Electricity Bill:</span>
              <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-outfit)' }}>
                ₹{monthlyBill.toLocaleString('en-IN')} / mo
              </span>
            </div>
            <input
              type="range"
              min={1500}
              max={60000}
              step={500}
              value={monthlyBill}
              onChange={(e) => handleBillChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6BAE23', cursor: 'pointer', height: '6px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              <span>₹1,500</span>
              <span>₹25,000</span>
              <span>₹60,000+</span>
            </div>
          </div>

          {/* Slider 2: Desired Solar System Size (kW) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Recommended Solar System Size:</span>
              <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-outfit)' }}>
                {systemKw} kW System
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={0.5}
              value={systemKw}
              onChange={(e) => handleKwChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6BAE23', cursor: 'pointer', height: '6px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              <span>1 kW</span>
              <span>10 kW</span>
              <span>25 kW</span>
            </div>
          </div>

        </div>

        {/* Dynamic System Output Specs Badge */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '14px',
          padding: '0.9rem 1rem',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          marginBottom: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Estimated Energy Output</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-outfit)' }}>
              ~ {monthlySolarGenUnits} Units
            </div>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>per month</span>
          </div>

          <div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Shadow-free Rooftop</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-outfit)' }}>
              ~ {requiredRoofSqFt} sq.ft
            </div>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Mono PERC Tech</span>
          </div>
        </div>

        {/* Financial Results Matrix (Annual Savings & 25-Year Lifetime Savings) */}
        <div style={{
          background: 'rgba(68, 217, 68, 0.1)',
          borderRadius: '14px',
          padding: '1rem',
          border: '1px solid rgba(68, 217, 68, 0.35)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: 0
        }}>
          <div>
            <span style={{ fontSize: '0.65rem', color: '#1e293b', fontWeight: 700, textTransform: 'uppercase' }}>Est. Annual Savings</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0b131f', fontFamily: 'var(--font-outfit)' }}>
              ~ ₹{estAnnualSavings.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.65rem', color: '#166534', fontWeight: 600 }}>~ ₹{estMonthlySavings.toLocaleString('en-IN')} / mo</span>
          </div>

          <div>
            <span style={{ fontSize: '0.65rem', color: '#1e293b', fontWeight: 700, textTransform: 'uppercase' }}>25-Year Lifetime Savings</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0b131f', fontFamily: 'var(--font-outfit)' }}>
              ~ ₹{(est25YrSavings / 100000).toFixed(1)} Lakhs
            </div>
            <span style={{ fontSize: '0.65rem', color: '#166534', fontWeight: 600 }}>Full 25-Yr System Life</span>
          </div>
        </div>

        {/* Estimate Prediction Disclaimer */}
        <p style={{
          fontSize: '0.68rem',
          color: '#64748b',
          marginTop: '0.85rem',
          marginBottom: 0,
          lineHeight: 1.45,
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          * Values marked with ~ are estimated predictions and not to be taken as final figures.
        </p>

      </div>

    </section>
  );
}
