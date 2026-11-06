import React, { useEffect } from 'react';

interface EpcDetailsPageProps {
  onBack: () => void;
}

export default function EpcDetailsPage({ onBack }: EpcDetailsPageProps) {
  // Ensure page opens cleanly from the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleWhatsApp = () => {
    window.open("https://wa.me/918468903255?text=Hi%20Tejomay%2C%20I%20want%20to%20inquire%20about%20Turnkey%20EPC%20Solutions%20(Engineering%2C%20Procurement%20%26%20Construction)", "_blank");
  };

  return (
    <div style={{ minHeight: '100vh', background: '#44D944', color: '#0b131f', paddingTop: '7.5rem', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '1140px' }}>
        
        {/* Back Button (Dark Navy Pill) */}
        <button
          onClick={onBack}
          style={{
            background: '#0b131f',
            color: '#ffffff',
            border: 'none',
            padding: '0.65rem 1.6rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '2.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 25px rgba(11, 19, 31, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>← Back to Tejomay Main Site</span>
        </button>

        {/* Page Hero Tag */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{
            color: '#0b131f',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            background: 'rgba(11, 19, 31, 0.14)',
            padding: '0.45rem 1.3rem',
            borderRadius: '9999px',
            display: 'inline-block',
            textTransform: 'uppercase'
          }}>
            ⚡ VERTICAL PILLAR 02 — TURNKEY EPC DEEP DIVE
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          color: '#0b131f',
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          Turnkey EPC Solutions: Engineering, Procurement & Construction.
        </h1>

        <p style={{ color: '#0b131f', opacity: 0.9, fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '820px', marginBottom: '3.5rem', fontWeight: 500 }}>
          Tejomay delivers end-to-end industrial and residential EPC solar execution. From 3D LiDAR drone shading analysis to DISCOM net-metering synchronization, we handle every technical milestone under one roof.
        </p>

        {/* Hero Photo Banner Card */}
        <div style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', height: '420px', marginBottom: '4rem', boxShadow: '0 25px 60px rgba(11, 19, 31, 0.2)' }}>
          <img src="/solar2.avif" alt="Turnkey EPC Solar Project" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11, 19, 31, 0.85) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0b131f', background: '#44D944', padding: '0.35rem 0.85rem', borderRadius: '6px' }}>
              Grade-A Utility Engineering
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.4rem', color: '#ffffff', fontFamily: 'var(--font-outfit)' }}>
              High-Yield Solar Grid Synchronization & Commissioning
            </h3>
          </div>
        </div>

        {/* 4 Technical Core Engineering Modules (White Cards Theme) */}
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '2.2rem', fontWeight: 700, color: '#0b131f', marginBottom: '2rem' }}>
          The 4 Pillars of Tejomay EPC Execution
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* Module 1 */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.25rem', border: '1px solid rgba(11, 19, 31, 0.08)', boxShadow: '0 20px 45px rgba(11, 19, 31, 0.12)' }}>
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '1rem' }}>📐</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0b131f', marginBottom: '0.5rem', fontFamily: 'var(--font-outfit)' }}>
              1. 3D Drone & Structural Analysis
            </h3>
            <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6 }}>
              LiDAR 3D drone mapping to calculate sun trajectories, seasonal shadow angles, wind load stability (up to 170 km/h), and optimal panel tilt angle.
            </p>
          </div>

          {/* Module 2 */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.25rem', border: '1px solid rgba(11, 19, 31, 0.08)', boxShadow: '0 20px 45px rgba(11, 19, 31, 0.12)' }}>
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '1rem' }}>🏭</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0b131f', marginBottom: '0.5rem', fontFamily: 'var(--font-outfit)' }}>
              2. Tier-1 Hardware Procurement
            </h3>
            <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Direct procurement of Tier-1 N-Type TOPCon bifacial modules, smart MPPT string inverters, hot-dip galvanized mounting structures, and fire-resistant DC cabling.
            </p>
          </div>

          {/* Module 3 */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.25rem', border: '1px solid rgba(11, 19, 31, 0.08)', boxShadow: '0 20px 45px rgba(11, 19, 31, 0.12)' }}>
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '1rem' }}>⚡</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0b131f', marginBottom: '0.5rem', fontFamily: 'var(--font-outfit)' }}>
              3. DISCOM Net-Metering Approval
            </h3>
            <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Complete liaison and paperwork management for DISCOM bi-directional net-meter installation, CEIG electrical safety inspection, and grid sync.
            </p>
          </div>

          {/* Module 4 */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.25rem', border: '1px solid rgba(11, 19, 31, 0.08)', boxShadow: '0 20px 45px rgba(11, 19, 31, 0.12)' }}>
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '1rem' }}>📊</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0b131f', marginBottom: '0.5rem', fontFamily: 'var(--font-outfit)' }}>
              4. 24/7 AI Telemetry Integration
            </h3>
            <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6 }}>
              IoT smart gateway connection for real-time solar generation tracking, automatic fault notifications, string-level diagnostics, and mobile app reporting.
            </p>
          </div>

        </div>

        {/* Turnkey Project Execution Milestones Timeline (White Card Theme) */}
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '2.2rem', fontWeight: 700, color: '#0b131f', marginBottom: '2rem' }}>
          Turnkey 14-Day Execution Timeline
        </h2>

        <div style={{ background: '#ffffff', borderRadius: '28px', padding: '2.5rem', border: '1px solid rgba(11, 19, 31, 0.08)', boxShadow: '0 20px 50px rgba(11, 19, 31, 0.12)', marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0b131f', background: 'rgba(68, 217, 68, 0.25)', padding: '0.3rem 0.7rem', borderRadius: '6px' }}>DAY 01 - 02</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b131f', marginTop: '0.6rem', fontFamily: 'var(--font-outfit)' }}>Site Survey & 3D Design</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.4rem', lineHeight: 1.5 }}>Drone shading scan & CAD electrical single-line diagram (SLD).</p>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0b131f', background: 'rgba(68, 217, 68, 0.25)', padding: '0.3rem 0.7rem', borderRadius: '6px' }}>DAY 03 - 05</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b131f', marginTop: '0.6rem', fontFamily: 'var(--font-outfit)' }}>DISCOM Approval</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.4rem', lineHeight: 1.5 }}>Formal net-metering application & feeder capacity verification.</p>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0b131f', background: 'rgba(68, 217, 68, 0.25)', padding: '0.3rem 0.7rem', borderRadius: '6px' }}>DAY 06 - 10</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b131f', marginTop: '0.6rem', fontFamily: 'var(--font-outfit)' }}>Mechanical Assembly</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.4rem', lineHeight: 1.5 }}>Galvanized structure anchoring, module mounting & DC cabling.</p>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0b131f', background: 'rgba(68, 217, 68, 0.25)', padding: '0.3rem 0.7rem', borderRadius: '6px' }}>DAY 11 - 14</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b131f', marginTop: '0.6rem', fontFamily: 'var(--font-outfit)' }}>Net-Metering Sync</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.4rem', lineHeight: 1.5 }}>Bi-directional net-meter installation, grid test & telemetry handoff.</p>
            </div>
          </div>
        </div>

        {/* Direct WhatsApp Call to Action Banner (Dark Navy Card) */}
        <div style={{
          background: '#0b131f',
          borderRadius: '28px',
          padding: '3.5rem 2.5rem',
          boxShadow: '0 25px 60px rgba(11, 19, 31, 0.35)',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '2.4rem', fontWeight: 700, marginBottom: '0.8rem', color: '#ffffff' }}>
            Ready to Architect Your Turnkey Solar Facility?
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto 2rem' }}>
            Contact Tejomay's senior EPC project engineers on WhatsApp for a custom 3D shading analysis and structural feasibility report.
          </p>

          <button
            onClick={handleWhatsApp}
            className="btn-lime"
            style={{ padding: '0.9rem 2.4rem', fontSize: '1rem', borderRadius: '10px' }}
          >
            <span>Book Full Turnkey EPC Consultation ↗</span>
          </button>
        </div>

      </div>
    </div>
  );
}
