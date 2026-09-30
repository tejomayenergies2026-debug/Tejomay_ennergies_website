import { useState } from 'react';

export default function CalculatorSection() {
  const [bill, setBill] = useState(220);
  const [propertyType, setPropertyType] = useState('Home');
  const [roofType, setRoofType] = useState('Sloped');

  const [score] = useState(88);
  const [savings] = useState(169);
  const [systemSize] = useState(6.9);
  const [payback] = useState(9.5);

  return (
    <section className="section-sand" id="calculator">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem', marginBottom: '3.5rem' }}>
          <div className="section-label section-label-dark">Try it now</div>
          <h2 className="headline-light">
            Measure your cost and save for future
          </h2>
        </div>

        <div className="grid-2">
          {/* Left Column Image */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', height: '480px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
            <img
              src="/house-solar.png"
              alt="House with solar roof and garden"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Right Column Form & Gauge */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(15,23,42,0.6)', marginBottom: '0.4rem' }}>
                Monthly electricity bill ($)
              </label>
              <input
                type="number"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: '#ffffff',
                  border: '1px solid rgba(15,23,42,0.15)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(15,23,42,0.6)', marginBottom: '0.4rem' }}>
                  Property type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: '#ffffff',
                    border: '1px solid rgba(15,23,42,0.15)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                >
                  <option value="Home">Home</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(15,23,42,0.6)', marginBottom: '0.4rem' }}>
                  Roof type
                </label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: '#ffffff',
                    border: '1px solid rgba(15,23,42,0.15)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                >
                  <option value="Sloped">Sloped</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>
            </div>

            <button className="btn-lime" style={{ width: '100%', justifyContent: 'center', marginBottom: '2rem' }}>
              Try AI Solar Planner
            </button>

            {/* Score Gauge Circle */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '3px solid #0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                  fontFamily: 'Outfit',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#0f172a',
                }}
              >
                {score} / 100
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(15,23,42,0.6)' }}>Roof suitability score</div>
            </div>

            {/* Results Table */}
            <div style={{ borderTop: '1px solid rgba(15,23,42,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid rgba(15,23,42,0.1)' }}>
                <span style={{ fontSize: '0.88rem', color: 'rgba(15,23,42,0.7)' }}>Estimated monthly savings</span>
                <strong style={{ fontFamily: 'Outfit', fontSize: '1.15rem', color: '#0f172a' }}>${savings}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid rgba(15,23,42,0.1)' }}>
                <span style={{ fontSize: '0.88rem', color: 'rgba(15,23,42,0.7)' }}>Recommended system size</span>
                <strong style={{ fontFamily: 'Outfit', fontSize: '1.15rem', color: '#0f172a' }}>{systemSize} kW</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0' }}>
                <span style={{ fontSize: '0.88rem', color: 'rgba(15,23,42,0.7)' }}>Payback timeline</span>
                <strong style={{ fontFamily: 'Outfit', fontSize: '1.15rem', color: '#0f172a' }}>{payback} yrs</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
