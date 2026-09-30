export default function MissionSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-dark">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem', marginBottom: '3.5rem' }}>
          <div className="section-label">Our mission</div>
          <h2 className="headline-dark">
            Built to make clean energy simple, smart, and accessible
          </h2>
        </div>

        {/* 3 Asymmetric Image Cards */}
        <div className="grid-3" style={{ marginBottom: '3.5rem' }}>
          {/* Card 1 */}
          <div style={{ background: '#0e1724', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ height: '220px', background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
              🛠️
            </div>
            <div style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📊</div>
              <h4 style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem' }}>Your savings matter</h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(15,23,42,0.7)', lineHeight: 1.5 }}>
                We design every system with your long-term energy savings in mind.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ background: '#0e1724', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ height: '220px', background: 'linear-gradient(135deg, #102436, #09121d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
              🤝
            </div>
            <div style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <h4 style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem' }}>Your trust comes first</h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(15,23,42,0.7)', lineHeight: 1.5 }}>
                We keep our pricing, process, and recommendations clear from day one.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div style={{ background: '#0e1724', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ height: '220px', background: 'linear-gradient(135deg, #1b3524, #09121d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
              ☀️
            </div>
            <div style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🌱</div>
              <h4 style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem' }}>Your future should be cleaner</h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(15,23,42,0.7)', lineHeight: 1.5 }}>
                Every solar system we install supports a more sustainable tomorrow.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Bottom Text & CTA */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            At Sonora AI, we believe solar energy should be easy to understand and simple to adopt. Our mission is to help families and businesses move toward cleaner energy with honest guidance, smart technology, and dependable installation.
          </p>
          <button className="btn-lime" onClick={() => scrollTo('planner')}>
            Book Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
