import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export default function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 10, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0d1829',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <span style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#6BAE23',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.2rem'
            }}>
              Tejomay Energies Legal & Compliance
            </span>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service & Solar Disclaimers'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div style={{
          padding: '1.75rem',
          overflowY: 'auto',
          color: 'rgba(255, 255, 255, 0.78)',
          fontSize: '0.88rem',
          lineHeight: 1.75
        }}>
          {isPrivacy ? (
            <div>
              <p style={{ marginTop: 0 }}>
                <strong>Effective Date:</strong> November 2026<br />
                Tejomay Energies Ltd. (“Tejomay”, “we”, “our”) is dedicated to protecting your personal data in compliance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and international data security standards.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Information We Collect</h4>
              <p>
                When you interact with our solar savings calculator or initiate a WhatsApp consultation, we collect information you voluntarily provide, including:
              </p>
              <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
                <li>Contact details: Name, phone/WhatsApp number, email address, and installation location/city.</li>
                <li>Solar requirements: Estimated monthly electricity bills, roof type, and proposed load capacities (kW).</li>
                <li>Technical metrics: Non-identifying browser telemetry and device parameters used to ensure website responsiveness.</li>
              </ul>

              <h4 style={{ color: '#ffffff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. How We Use Your Data</h4>
              <p>
                Your personal details are used exclusively to:
              </p>
              <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
                <li>Deliver tailored solar feasibility reports and financial ROI models.</li>
                <li>Coordinate certified engineer site surveys and DISCOM net-metering liaison.</li>
                <li>Process inquiries for state and central solar subsidies (e.g. PM Surya Ghar Muft Bijli Yojana).</li>
              </ul>

              <h4 style={{ color: '#ffffff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Data Protection & Zero Third-Party Selling</h4>
              <p>
                We do not sell, rent, or trade your contact details with external marketing brokers or advertisers. All transmission is encrypted via TLS 1.3 / HTTPS. Internal access is restricted to authorized Tejomay solar engineers and project managers.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Your Rights</h4>
              <p>
                Under the DPDP Act, you have the right to request access to your submitted data, request corrections, or ask for complete deletion of your records from our systems by emailing <strong>support@tejomay.com</strong>.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ marginTop: 0 }}>
                <strong>Last Updated:</strong> November 2026<br />
                By accessing the Tejomay Energies web application and using our solar assessment tools, you acknowledge and agree to the following terms and technical disclaimers.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Solar Generation & Yield Estimation Disclaimer</h4>
              <p>
                Figures generated by the interactive solar calculator (including annual units generated, payback period, and lifetime savings) are mathematical simulations based on standard solar irradiance benchmarks (approx. 4.5 to 5.5 peak sun hours per day) and prevailing DISCOM tariff structures. 
              </p>
              <p>
                Actual generation may vary based on exact geographical coordinates, seasonal solar irradiance, rooftop orientation/azimuth, shading obstructions, and DISCOM grid availability. An on-site technical survey is mandatory before finalizing system capacity.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Turnkey EPC Quotations & Contracts</h4>
              <p>
                Online figures do not constitute a binding legal contract. Formal procurement, engineering design, warranty coverage (25-year linear performance warranty on Tier-1 panels, 5–10 years on inverters), and payment schedules are governed strictly by the signed Engineering, Procurement & Construction (EPC) agreement between Tejomay Energies Ltd. and the client.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Grid Approvals & Net-Metering</h4>
              <p>
                Tejomay provides end-to-end liaison support for state electricity board (DISCOM) net-metering sanctions. However, the final timeline for meter replacement, transformer capacity allocation, and statutory inspection rests with the relevant state power distribution utility.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Intellectual Property</h4>
              <p>
                All brand marks, logos, imagery, and UI software architecture displayed on this website are the proprietary intellectual property of Tejomay Energies Ltd. Unauthorized scraping, replication, or distribution without prior written consent is strictly prohibited.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <button
            onClick={onClose}
            className="btn-lime"
            style={{
              padding: '0.5rem 1.4rem',
              fontSize: '0.85rem',
              borderRadius: '8px',
              fontWeight: 600
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

