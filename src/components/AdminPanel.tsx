import React, { useState, useEffect } from 'react';
import {
  getStoredServices,
  saveStoredServices,
  getStoredTestimonials,
  saveStoredTestimonials,
  ServiceItem,
  TestimonialItem
} from '../services/store';

interface AdminPanelProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminPanel({ onClose, onLogout }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'workDone'>('services');



  // =========================================================================
  // SECTION 1: SERVICES & SUB-SERVICES STATE
  // =========================================================================
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedPillarCategory, setSelectedPillarCategory] = useState<'all' | 'commercial' | 'residential' | 'industrial' | 'epc' | 'amc'>('all');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem> & { featuresText?: string }>({
    category: 'residential',
    title: '',
    tagline: '',
    description: '',
    capacityRange: '5 kW - 15 kW Systems',
    estimatedSavings: 'Save up to ₹85,000 / year',
    image: '/solar_res_1.jpg',
    featuresText: 'Monocrystalline Panels, 25-Year Performance Warranty, App Telemetry, Zero-Down Financing'
  });

  // =========================================================================
  // SECTION 2: WORK DONE & TESTIMONIALS STATE
  // =========================================================================
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [selectedWorkCategory, setSelectedWorkCategory] = useState<'all' | 'residential' | 'industrial'>('all');
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Partial<TestimonialItem>>({
    clientName: '',
    clientRole: 'Homeowner',
    companyOrLocation: 'New Delhi',
    photo: '/solar_res_1.jpg',
    projectCapacity: '8 kW Residential Array',
    quote: '',
    rating: 5,
    date: 'August 2026',
    category: 'residential'
  });

  useEffect(() => {
    setServices(getStoredServices());
    setTestimonials(getStoredTestimonials());
  }, []);

  // Handle Local Image Upload for Services
  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setServiceForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Local Image Upload for Testimonials / Work Done
  const handleTestimonialImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTestimonialForm(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- SERVICE CRUD HANDLERS ---
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedFeatures = serviceForm.featuresText
      ? serviceForm.featuresText.split(',').map(f => f.trim()).filter(Boolean)
      : ['Tier-1 Solar Tech', 'Grid Sync', 'Telemetry'];

    let updated: ServiceItem[];
    if (editingService) {
      updated = services.map((s) => (s.id === editingService.id ? ({ 
        ...s, 
        ...serviceForm,
        features: parsedFeatures
      } as ServiceItem) : s));
    } else {
      const newService: ServiceItem = {
        id: `serv-${Date.now()}`,
        category: (serviceForm.category || (selectedPillarCategory !== 'all' ? selectedPillarCategory : 'residential')) as any,
        title: serviceForm.title || 'New Solar Service Card',
        tagline: serviceForm.tagline || 'High-Efficiency Rooftop Array',
        description: serviceForm.description || 'Comprehensive solar engineering and installation.',
        capacityRange: serviceForm.capacityRange || '10 kW System',
        estimatedSavings: serviceForm.estimatedSavings || 'Save up to ₹90,000 / year',
        image: serviceForm.image || '/solar2.avif',
        features: parsedFeatures
      };
      updated = [...services, newService];
    }
    
    setServices(updated);
    saveStoredServices(updated);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('tejomay_data_update'));
    setIsAddingService(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service card?')) {
      const updated = services.filter((s) => s.id !== id);
      setServices(updated);
      saveStoredServices(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('tejomay_data_update'));
    }
  };

  const startEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServiceForm({
      ...service,
      featuresText: service.features ? service.features.join(', ') : ''
    });
    setIsAddingService(true);
  };

  // --- TESTIMONIAL / WORK DONE CRUD HANDLERS ---
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: TestimonialItem[];
    if (editingTestimonial) {
      updated = testimonials.map((t) => (t.id === editingTestimonial.id ? ({ ...t, ...testimonialForm } as TestimonialItem) : t));
    } else {
      const newTestimonial: TestimonialItem = {
        id: `test-${Date.now()}`,
        clientName: testimonialForm.clientName || 'Valued Partner',
        clientRole: testimonialForm.clientRole || 'Client',
        companyOrLocation: testimonialForm.companyOrLocation || 'India',
        photo: testimonialForm.photo || '/solar1_custom.jpeg',
        projectCapacity: testimonialForm.projectCapacity || '50 kW Rooftop',
        quote: testimonialForm.quote || '',
        rating: Number(testimonialForm.rating || 5),
        date: testimonialForm.date || 'August 2026',
        category: (testimonialForm.category || 'residential') as any
      };
      updated = [...testimonials, newTestimonial];
    }
    setTestimonials(updated);
    saveStoredTestimonials(updated);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('tejomay_data_update'));
    setIsAddingTestimonial(false);
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project review card?')) {
      const updated = testimonials.filter((t) => t.id !== id);
      setTestimonials(updated);
      saveStoredTestimonials(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('tejomay_data_update'));
    }
  };

  const startEditTestimonial = (testimonial: TestimonialItem) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm(testimonial);
    setIsAddingTestimonial(true);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all website data back to factory default state?')) {
      localStorage.removeItem('tejomay_services_v2');
      localStorage.removeItem('tejomay_testimonials_v2');
      setServices(getStoredServices());
      setTestimonials(getStoredTestimonials());
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('tejomay_data_update'));
    }
  };

  const filteredServices = selectedPillarCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedPillarCategory);

  const filteredTestimonials = selectedWorkCategory === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === selectedWorkCategory);

  // Permanent Night Mode Theme Palette Values (isDay is permanently false)
  const isDay = false;
  const pageBg = '#0b131f';
  const headerTextColor = '#ffffff';
  
  // Cards background (Crisp White Cards on Dark Page)
  const cardBg = '#ffffff';
  const cardTextColor = '#0b131f';
  const cardSubTextColor = '#475569';
  const borderStyle = '1.5px solid rgba(11, 19, 31, 0.12)';
  
  // Modal dialog theme in Night Mode
  const modalBoxBg = '#1e293b';
  const modalTextColor = '#ffffff';
  const modalInputBg = '#0b131f';
  const modalInputBorder = '1.5px solid rgba(255, 255, 255, 0.2)';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: pageBg,
      overflowY: 'auto',
      padding: '2rem 1.5rem',
      fontFamily: 'var(--font-inter)',
      color: headerTextColor,
      transition: 'background 0.35s ease, color 0.35s ease'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* TOP ADMIN ACTION BAR: LEFT ONLY "Tejomay Admin Panel", FAR RIGHT ALL BUTTONS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.25rem',
          borderBottom: '1.5px solid rgba(255, 255, 255, 0.12)',
          marginBottom: '2rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* LEFT: ONLY "Tejomay Admin Panel" */}
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: headerTextColor, fontFamily: 'var(--font-outfit)', margin: 0, letterSpacing: '-0.02em', whiteSpace: 'nowrap', marginRight: 'auto' }}>
            Tejomay Admin Panel
          </h2>

          {/* FAR RIGHT: ALL TOP ACTION BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, marginLeft: '2rem' }}>
            <button 
              onClick={handleResetData} 
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: headerTextColor, padding: '0.6rem 1.1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              🔄 Reset Defaults
            </button>

            <button 
              onClick={onClose} 
              style={{ background: '#44D944', border: 'none', color: '#0b131f', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(68, 217, 68, 0.3)' }}
            >
              View Live Website ↗
            </button>

            <button 
              onClick={onLogout} 
              style={{ background: '#fee2e2', border: '1.5px solid #dc2626', color: '#dc2626', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Log Out 🔒
            </button>
          </div>
        </div>

        {/* MAIN TWO SECTIONS SWITCHER TABS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          {/* SECTION 1 TAB BUTTON */}
          <button
            onClick={() => setActiveSection('services')}
            style={{
              padding: '1.35rem 1.6rem',
              borderRadius: '20px',
              border: activeSection === 'services' ? '2.5px solid #44D944' : '1.5px solid rgba(255, 255, 255, 0.15)',
              background: '#121c2b',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.05rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: activeSection === 'services' ? '0 12px 30px rgba(68, 217, 68, 0.25)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>📦 SECTION 1: Services & Sub-Services</span>
              <span style={{ fontSize: '0.8rem', background: '#44D944', color: '#0b131f', padding: '0.25rem 0.7rem', borderRadius: '8px', fontWeight: 800 }}>
                {services.length} Cards
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.4rem', fontWeight: 500, margin: 0 }}>
              Alter Commercial, Residential, Industrial, Turnkey EPC, and AMC Shield sub-services data & images.
            </p>
          </button>

          {/* SECTION 2 TAB BUTTON */}
          <button
            onClick={() => setActiveSection('workDone')}
            style={{
              padding: '1.35rem 1.6rem',
              borderRadius: '20px',
              border: activeSection === 'workDone' ? '2.5px solid #44D944' : '1.5px solid rgba(255, 255, 255, 0.15)',
              background: '#121c2b',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.05rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: activeSection === 'workDone' ? '0 12px 30px rgba(68, 217, 68, 0.25)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🏆 SECTION 2: Work Done & Testimonials</span>
              <span style={{ fontSize: '0.8rem', background: '#44D944', color: '#0b131f', padding: '0.25rem 0.7rem', borderRadius: '8px', fontWeight: 800 }}>
                {testimonials.length} Cards
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.4rem', fontWeight: 500, margin: 0 }}>
              Alter Residential & Industrial/Commercial completed project review cards and client photos.
            </p>
          </button>

        </div>

        {/* =========================================================================
           SECTION 1: SERVICES & SUB-SERVICES MANAGEMENT
           ========================================================================= */}
        {activeSection === 'services' && (
          <div>
            
            {/* Header & Create Button Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: headerTextColor, fontFamily: 'var(--font-outfit)' }}>
                  Manage Services & Sub-Services
                </h3>
                <p style={{ fontSize: '0.85rem', color: isDay ? '#475569' : 'rgba(255,255,255,0.7)', marginTop: '0.15rem' }}>
                  Filter by pillar or sub-service category below to create and alter cards:
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingService(null);
                  const targetCat = selectedPillarCategory !== 'all' ? selectedPillarCategory : 'residential';
                  setServiceForm({
                    category: targetCat,
                    title: '',
                    tagline: '',
                    description: '',
                    capacityRange: '5 kW - 15 kW Systems',
                    estimatedSavings: 'Save up to ₹85,000 / year',
                    image: targetCat === 'epc' ? '/solar2.avif' : targetCat === 'amc' ? '/solar3.avif' : '/solar4.avif',
                    featuresText: 'Monocrystalline Panels, 25-Year Performance Warranty, App Telemetry, Zero-Down Financing'
                  });
                  setIsAddingService(true);
                }}
                className="btn-lime"
                style={{ padding: '0.7rem 1.4rem', fontSize: '0.85rem', boxShadow: '0 4px 15px rgba(68, 217, 68, 0.4)' }}
              >
                + Create New Service Card
              </button>
            </div>

            {/* ONE SINGLE HORIZONTAL LINE FILTER BAR */}
            <div style={{
              display: 'flex',
              gap: '0.6rem',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              marginBottom: '2rem',
              background: '#121c2b',
              padding: '0.6rem 0.8rem',
              borderRadius: '16px',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap'
            }}>
              {[
                { key: 'all', label: 'All Pillars & Sub-Services' },
                { key: 'residential', label: 'Pillar 1 — Residential' },
                { key: 'commercial', label: 'Pillar 1 — Commercial' },
                { key: 'industrial', label: 'Pillar 1 — Industrial' },
                { key: 'epc', label: 'Pillar 2 — Turnkey EPC' },
                { key: 'amc', label: 'Pillar 3 — AMC Shield' }
              ].map(cat => {
                const isActive = selectedPillarCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedPillarCategory(cat.key as any)}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: '10px',
                      border: isActive ? '2px solid #44D944' : '1px solid rgba(255, 255, 255, 0.22)',
                      background: isActive ? '#44D944' : 'rgba(255, 255, 255, 0.12)',
                      color: isActive ? '#0b131f' : '#ffffff',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      flexShrink: 0,
                      boxShadow: isActive ? '0 4px 14px rgba(68, 217, 68, 0.3)' : 'none'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* List of Existing Services */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {filteredServices.map((service) => (
                <div key={service.id} style={{
                  background: cardBg,
                  borderRadius: '18px',
                  padding: '1.25rem',
                  border: borderStyle,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                }}>
                  <div style={{ position: 'relative', height: '150px', borderRadius: '12px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                    <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', background: '#0b131f', color: '#ffffff', padding: '0.25rem 0.7rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {service.category}
                    </span>
                  </div>

                  <h5 className="truncate-1 card-text-safe" style={{ color: cardTextColor, fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>
                    {service.title}
                  </h5>
                  <p className="clamp-3 card-text-safe" style={{ color: cardSubTextColor, fontSize: '0.82rem', marginTop: '0.25rem', lineHeight: 1.4, fontWeight: 500 }}>
                    {service.tagline}
                  </p>
                  
                  <div className="truncate-1 card-text-safe" style={{ marginTop: '0.65rem', padding: '0.45rem 0.7rem', background: 'rgba(68,217,68,0.18)', borderRadius: '8px', fontSize: '0.78rem', color: '#15803d', fontWeight: 800, border: '1px solid #44D944' }}>
                    Savings: {service.estimatedSavings}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.1rem' }}>
                    <button onClick={() => startEditService(service)} style={{ flex: 1, background: '#0b131f', color: '#ffffff', border: 'none', padding: '0.55rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteService(service.id)} style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: '1.5px solid #dc2626', padding: '0.55rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =========================================================================
           SECTION 2: WORK DONE & TESTIMONIALS MANAGEMENT
           ========================================================================= */}
        {activeSection === 'workDone' && (
          <div>
            
            {/* Header & Create Button Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: headerTextColor, fontFamily: 'var(--font-outfit)' }}>
                  Manage Work Done & Project Reviews
                </h3>
                <p style={{ fontSize: '0.85rem', color: isDay ? '#475569' : 'rgba(255,255,255,0.7)', marginTop: '0.15rem' }}>
                  Filter by sector below to create or alter completed installation cards:
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTestimonial(null);
                  setTestimonialForm({
                    clientName: '',
                    clientRole: 'Homeowner',
                    companyOrLocation: 'Delhi NCR',
                    photo: '/solar1_custom.jpeg',
                    projectCapacity: '10 kW Residential Solar',
                    quote: 'Outstanding installation experience with zero hassle.',
                    rating: 5,
                    date: 'August 2026',
                    category: selectedWorkCategory !== 'all' ? selectedWorkCategory : 'residential'
                  });
                  setIsAddingTestimonial(true);
                }}
                className="btn-lime"
                style={{ padding: '0.7rem 1.4rem', fontSize: '0.85rem', boxShadow: '0 4px 15px rgba(68, 217, 68, 0.4)' }}
              >
                + Create New Project Card
              </button>
            </div>

            {/* ONE SINGLE HORIZONTAL LINE FILTER BAR */}
            <div style={{
              display: 'flex',
              gap: '0.6rem',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              marginBottom: '2rem',
              background: '#121c2b',
              padding: '0.6rem 0.8rem',
              borderRadius: '16px',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap'
            }}>
              {[
                { key: 'all', label: 'All Completed Projects' },
                { key: 'residential', label: 'Residential Solar Sector' },
                { key: 'industrial', label: 'Industrial & Commercial Sector' }
              ].map(cat => {
                const isActive = selectedWorkCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedWorkCategory(cat.key as any)}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: '10px',
                      border: isActive ? '2px solid #44D944' : '1px solid rgba(255, 255, 255, 0.22)',
                      background: isActive ? '#44D944' : 'rgba(255, 255, 255, 0.12)',
                      color: isActive ? '#0b131f' : '#ffffff',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      flexShrink: 0,
                      boxShadow: isActive ? '0 4px 14px rgba(68, 217, 68, 0.3)' : 'none'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* List of Existing Project Testimonials */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {filteredTestimonials.map((t) => (
                <div key={t.id} style={{
                  background: cardBg,
                  borderRadius: '18px',
                  padding: '1.25rem',
                  border: borderStyle,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                }}>
                  <div style={{ position: 'relative', height: '150px', borderRadius: '12px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                    <img src={t.photo} alt={t.clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', background: '#0b131f', color: '#ffffff', padding: '0.25rem 0.7rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {t.category}
                    </span>
                  </div>

                  <h5 className="truncate-1 card-text-safe" style={{ color: cardTextColor, fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>
                    {t.clientName}
                  </h5>
                  <p className="truncate-1 card-text-safe" style={{ color: '#16a34a', fontSize: '0.82rem', fontWeight: 800, marginTop: '0.15rem' }}>
                    {t.projectCapacity} • {t.companyOrLocation}
                  </p>
                  <p className="clamp-3 card-text-safe" style={{ color: cardSubTextColor, fontSize: '0.82rem', marginTop: '0.35rem', fontStyle: 'italic', lineHeight: 1.45, fontWeight: 500 }}>
                    "{t.quote}"
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.1rem' }}>
                    <button onClick={() => startEditTestimonial(t)} style={{ flex: 1, background: '#0b131f', color: '#ffffff', border: 'none', padding: '0.55rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteTestimonial(t.id)} style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: '1.5px solid #dc2626', padding: '0.55rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
         GLOBAL ROOT LEVEL MODALS FOR 100% PERFECT VIEWPORT DEAD-CENTER ALIGNMENT
         ========================================================================= */}

      {/* CREATE / EDIT SERVICE MODAL */}
      {isAddingService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999999,
          background: 'rgba(11, 19, 31, 0.85)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0
        }}>
          <form 
            onSubmit={handleSaveService} 
            style={{
              background: modalBoxBg,
              color: modalTextColor,
              borderRadius: '22px',
              padding: '1.5rem 2rem',
              width: '90vw',
              maxWidth: '720px',
              overflow: 'hidden',
              border: '2.5px solid #44D944',
              boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
              margin: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ color: modalTextColor, fontSize: '1.3rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-outfit)' }}>
                {editingService ? '✏️ Update Existing Service Card' : '➕ Create New Service Card'}
              </h4>
              <button 
                type="button" 
                onClick={() => setIsAddingService(false)}
                style={{ background: 'transparent', border: 'none', color: modalTextColor, fontSize: '1.4rem', cursor: 'pointer', padding: '0 0.5rem' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Service Category / Sub-Service</label>
                <select
                  value={serviceForm.category || 'residential'}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                >
                  <option value="residential" style={{ background: modalInputBg, color: modalTextColor }}>Pillar 1: Residential Solar</option>
                  <option value="commercial" style={{ background: modalInputBg, color: modalTextColor }}>Pillar 1: Commercial Solar</option>
                  <option value="industrial" style={{ background: modalInputBg, color: modalTextColor }}>Pillar 1: Industrial Solar</option>
                  <option value="epc" style={{ background: modalInputBg, color: modalTextColor }}>Pillar 2: Turnkey Solar EPC</option>
                  <option value="amc" style={{ background: modalInputBg, color: modalTextColor }}>Pillar 3: Tejomay Shield AMC</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Service Title</label>
                <input
                  type="text"
                  value={serviceForm.title || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  required
                  placeholder="e.g. Tejomay Core™ Residential Solar"
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Subtitle / Tagline</label>
                <input
                  type="text"
                  value={serviceForm.tagline || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                  placeholder="e.g. Ultra-Sleek Rooftop Solar Array"
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Capacity / System Spec</label>
                <input
                  type="text"
                  value={serviceForm.capacityRange || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, capacityRange: e.target.value })}
                  placeholder="e.g. 3 kW - 10 kW Systems"
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Service Description</label>
                <textarea
                  value={serviceForm.description || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  rows={2}
                  placeholder="Enter service details..."
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none', resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Features (Comma Separated)</label>
                <textarea
                  value={serviceForm.featuresText || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, featuresText: e.target.value })}
                  rows={2}
                  placeholder="Monocrystalline Panels, 25-Yr Warranty, App Telemetry"
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none', resize: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Estimated Annual Savings / SLA</label>
                <input
                  type="text"
                  value={serviceForm.estimatedSavings || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, estimatedSavings: e.target.value })}
                  placeholder="e.g. Save up to ₹85,000 / year"
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Upload Local Photo or Image URL</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    value={serviceForm.image || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    placeholder="/solar2.avif or URL"
                    style={{ flex: 1, background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                  />
                  <label style={{ background: '#44D944', color: '#0b131f', fontWeight: 800, fontSize: '0.78rem', padding: '0.55rem 0.85rem', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                    📁 Upload
                    <input type="file" accept="image/*" onChange={handleServiceImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>

            {/* LIVE IMAGE PREVIEW CARD */}
            <div style={{
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: modalInputBg,
              padding: '0.55rem 0.85rem',
              borderRadius: '12px',
              border: '1.5px solid #44D944'
            }}>
              {serviceForm.image ? (
                <img src={serviceForm.image} alt="Live Card Preview" style={{ width: '90px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
              ) : (
                <div style={{ width: '90px', height: '60px', borderRadius: '8px', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#475569', fontWeight: 700 }}>No Image</div>
              )}
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: modalTextColor, display: 'block' }}>🖼️ Live Photo Preview</span>
                <span style={{ fontSize: '0.72rem', color: isDay ? 'rgba(255,255,255,0.7)' : '#64748b', wordBreak: 'break-all' }}>
                  {serviceForm.image ? (serviceForm.image.length > 50 ? serviceForm.image.substring(0, 50) + '...' : serviceForm.image) : 'No photo uploaded yet'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: modalInputBorder }}>
              <button type="button" onClick={() => setIsAddingService(false)} style={{ background: '#cbd5e1', color: '#0b131f', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn-lime" style={{ padding: '0.55rem 1.5rem', fontSize: '0.82rem' }}>
                Save & Publish Card ⚡
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE / EDIT PROJECT TESTIMONIAL MODAL */}
      {isAddingTestimonial && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999999,
          background: 'rgba(11, 19, 31, 0.85)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0
        }}>
          <form 
            onSubmit={handleSaveTestimonial} 
            style={{
              background: modalBoxBg,
              color: modalTextColor,
              borderRadius: '22px',
              padding: '1.5rem 2rem',
              width: '90vw',
              maxWidth: '720px',
              overflow: 'hidden',
              border: '2.5px solid #44D944',
              boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
              margin: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ color: modalTextColor, fontSize: '1.3rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-outfit)' }}>
                {editingTestimonial ? '✏️ Edit Project Review Card' : '➕ Create New Project Card'}
              </h4>
              <button 
                type="button" 
                onClick={() => setIsAddingTestimonial(false)}
                style={{ background: 'transparent', border: 'none', color: modalTextColor, fontSize: '1.4rem', cursor: 'pointer', padding: '0 0.5rem' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Project Category</label>
                <select
                  value={testimonialForm.category || 'residential'}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, category: e.target.value as any })}
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                >
                  <option value="residential" style={{ background: modalInputBg, color: modalTextColor }}>Residential Solar Project</option>
                  <option value="industrial" style={{ background: modalInputBg, color: modalTextColor }}>Industrial & Commercial Solar Project</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Client / Business Name</label>
                <input
                  type="text"
                  value={testimonialForm.clientName || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                  required
                  placeholder="e.g. Sunita Sharma or Apex Manufacturing"
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Client Designation / Role</label>
                <input
                  type="text"
                  value={testimonialForm.clientRole || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientRole: e.target.value })}
                  placeholder="e.g. Homeowner or VP Operations"
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Location / Company</label>
                <input
                  type="text"
                  value={testimonialForm.companyOrLocation || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, companyOrLocation: e.target.value })}
                  placeholder="e.g. Greater Noida, UP"
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Project Capacity Installed</label>
                <input
                  type="text"
                  value={testimonialForm.projectCapacity || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, projectCapacity: e.target.value })}
                  placeholder="e.g. 12 kW Rooftop Solar"
                  style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Upload Local Photo or Image URL</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    value={testimonialForm.photo || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, photo: e.target.value })}
                    placeholder="/solar1_custom.jpeg or URL"
                    style={{ flex: 1, background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                  />
                  <label style={{ background: '#44D944', color: '#0b131f', fontWeight: 800, fontSize: '0.78rem', padding: '0.55rem 0.85rem', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                    📁 Upload
                    <input type="file" accept="image/*" onChange={handleTestimonialImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', color: modalTextColor, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.25rem' }}>Client Review / Testimonial Quote</label>
              <textarea
                value={testimonialForm.quote || ''}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                rows={2}
                placeholder="Enter client review feedback..."
                style={{ width: '100%', background: modalInputBg, border: modalInputBorder, borderRadius: '8px', padding: '0.55rem 0.85rem', color: modalTextColor, fontSize: '0.82rem', fontWeight: 600, outline: 'none', resize: 'none' }}
              />
            </div>

            {/* LIVE IMAGE PREVIEW CARD */}
            <div style={{
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: modalInputBg,
              padding: '0.55rem 0.85rem',
              borderRadius: '12px',
              border: '1.5px solid #44D944'
            }}>
              {testimonialForm.photo ? (
                <img src={testimonialForm.photo} alt="Live Card Preview" style={{ width: '90px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
              ) : (
                <div style={{ width: '90px', height: '60px', borderRadius: '8px', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#475569', fontWeight: 700 }}>No Image</div>
              )}
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: modalTextColor, display: 'block' }}>🖼️ Live Photo Preview</span>
                <span style={{ fontSize: '0.72rem', color: isDay ? 'rgba(255,255,255,0.7)' : '#64748b', wordBreak: 'break-all' }}>
                  {testimonialForm.photo ? (testimonialForm.photo.length > 50 ? testimonialForm.photo.substring(0, 50) + '...' : testimonialForm.photo) : 'No photo uploaded yet'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: modalInputBorder }}>
              <button type="button" onClick={() => setIsAddingTestimonial(false)} style={{ background: '#cbd5e1', color: '#0b131f', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn-lime" style={{ padding: '0.55rem 1.5rem', fontSize: '0.82rem' }}>
                Save & Publish Review ⚡
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
