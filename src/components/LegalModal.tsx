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
                Tejomay Energies (“Tejomay”, “we”, “our”) values your privacy. This website is an informational and engineering simulation portal designed to respect your data under India's <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>1. No Unsolicited Data Collection</h4>
              <p>
                We do not require user accounts, passwords, or personal profiles to browse our website or use the solar savings calculator. All calculations run client-side in your browser.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>2. Voluntary Inquiries (WhatsApp & Direct Calls)</h4>
              <p>
                When you choose to click <em>“Book a Call”</em>, <em>“WhatsApp Support”</em>, or phone us directly, you voluntarily transmit your contact number and inquiry details. This information is used strictly by our certified solar engineers to assess your rooftop feasibility and respond to your consultation request.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>3. Zero Third-Party Sharing or Selling</h4>
              <p>
                We maintain a strict zero-spam policy: we never sell, rent, trade, or distribute your contact details to third-party marketing brokers, advertisers, or lead aggregators. All communication is private and encrypted via standard TLS 1.3 / HTTPS protocols.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>4. Server Telemetry & Security</h4>
              <p>
                Standard, non-personally identifiable technical logs (such as IP addresses and browser types) are processed transiently by our cloud infrastructure (Vercel) purely to prevent malicious DDoS attacks, bot spam, and cybersecurity threats.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>5. Contact & Data Inquiries</h4>
              <p>
                For any data questions, corrections, or inquiries, contact our compliance desk directly at <strong>tejomayenergies@gmail.com</strong> or call <strong>+91 744 744 9534</strong>.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ marginTop: 0 }}>
                <strong>Effective Date:</strong> November 2026<br />
                By accessing <strong>tejomayenergies.com</strong> and using our solar evaluation tools, you agree to the following terms, protections, and engineering disclaimers.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>1. Calculator & Simulation Disclaimer (Estimates Only)</h4>
              <p>
                All calculations, energy outputs (kWh units), and financial returns displayed by our solar calculator are mathematical simulations based on regional irradiance benchmarks (approx. 4.5 to 5.5 peak sun hours/day) and standard DISCOM tariff schedules.
              </p>
              <p>
                These figures are provided for general planning purposes only and <strong>do not constitute a legally binding financial guarantee or warranty of electrical generation</strong>. Actual solar yields depend upon physical rooftop azimuth, shadow obstructions, tilt angles, seasonal weather variance, and grid availability. A certified on-site engineering survey is required before finalizing system design.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>2. Quotations, Warranties & Binding Contracts</h4>
              <p>
                Information presented on this website does not constitute an open commercial offer. Binding commitments—including equipment specifications (Tier-1 Monocrystalline modules, inverters), 25-year performance warranties, EPC pricing, and completion timelines—are strictly governed by a formal, written agreement signed by authorized representatives of Tejomay Energies and the client.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>3. DISCOM Net-Metering & Central Subsidies</h4>
              <p>
                While Tejomay provides end-to-end liaison support for state electricity board (DISCOM) bi-directional net-metering sanctions and PM Surya Ghar subsidy documentation, statutory approval timelines, transformer quota allocations, and grid synchronization remain under the exclusive jurisdiction of the respective state power distribution utility.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>4. Intellectual Property & Brand Protection</h4>
              <p>
                All trademarks, brand logos, technical calculator algorithms, imagery, and UI architecture on this website are the proprietary property of Tejomay Energies. Unauthorized copying, scraping, reverse-engineering, or commercial duplication is strictly prohibited under applicable intellectual property laws.
              </p>

              <h4 style={{ color: '#ffffff', marginTop: '1.25rem', marginBottom: '0.4rem' }}>5. Limitation of Liability & Governing Law</h4>
              <p>
                Tejomay Energies shall not be liable for any indirect, incidental, or consequential damages resulting from website use or reliance on preliminary online estimates. These terms shall be governed by and construed in accordance with the laws of India.
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

