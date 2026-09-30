export default function CtaBannerSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-sky" style={{ padding: 0 }}>
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <div
          style={{
            borderRadius: '28px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            alignItems: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
            backgroundImage: "linear-gradient(135deg, rgba(11, 19, 31, 0.95), rgba(11, 19, 31, 0.85)), url('/hero-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#ffffff',
          }}
        >
          {/* Left Column Image */}
          <div style={{ height: '380px', overflow: 'hidden' }}>
            <img
              src="/house-solar.png"
              alt="Solar engineers on rooftop"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Right Column Copy & Buttons */}
          <div style={{ padding: '3.5rem' }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.15, marginBottom: '1rem' }}>
              Ready to power your future with smarter solar?
            </h2>

            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Start with a free solar savings estimate and discover how clean energy can work for your home, budget, and future.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-lime" onClick={() => scrollTo('planner')}>
                Book Free Consultation
              </button>
              <button className="btn-outline-white" onClick={() => scrollTo('contact')}>
                Talk to an Expert →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
