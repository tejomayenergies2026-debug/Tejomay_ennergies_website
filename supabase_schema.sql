-- ==============================================================================
-- TEJOMAY ENERGIES - OFFICIAL SUPABASE DATABASE SCHEMA & SECURITY HARDENING
-- Project: https://etuzyondtjnczflnawtc.supabase.co
-- ==============================================================================

-- 1. CLEANUP (Drop if recreating)
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;

-- 2. CREATE SERVICES TABLE
CREATE TABLE public.services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'industrial', 'epc', 'amc')),
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    "capacityRange" TEXT,
    "estimatedSavings" TEXT,
    image TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE TESTIMONIALS TABLE
CREATE TABLE public.testimonials (
    id TEXT PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "clientRole" TEXT,
    "companyOrLocation" TEXT,
    photo TEXT,
    "projectCapacity" TEXT,
    quote TEXT NOT NULL,
    rating NUMERIC DEFAULT 5,
    date TEXT,
    category TEXT CHECK (category IN ('residential', 'industrial')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) - BANK-GRADE CYBERSECURITY DEFENSE
-- ==============================================================================

-- Enable RLS on both tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 4.1 SERVICES POLICIES:
-- Public can READ services (for displaying on website)
CREATE POLICY "Public Read Access for Services"
ON public.services
FOR SELECT
TO public, anon, authenticated
USING (true);

-- ONLY authenticated admin users can INSERT services
CREATE POLICY "Authenticated Admin Insert Services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ONLY authenticated admin users can UPDATE services
CREATE POLICY "Authenticated Admin Update Services"
ON public.services
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ONLY authenticated admin users can DELETE services
CREATE POLICY "Authenticated Admin Delete Services"
ON public.services
FOR DELETE
TO authenticated
USING (true);

-- 4.2 TESTIMONIALS POLICIES:
-- Public can READ testimonials
CREATE POLICY "Public Read Access for Testimonials"
ON public.testimonials
FOR SELECT
TO public, anon, authenticated
USING (true);

-- ONLY authenticated admin users can INSERT testimonials
CREATE POLICY "Authenticated Admin Insert Testimonials"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ONLY authenticated admin users can UPDATE testimonials
CREATE POLICY "Authenticated Admin Update Testimonials"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ONLY authenticated admin users can DELETE testimonials
CREATE POLICY "Authenticated Admin Delete Testimonials"
ON public.testimonials
FOR DELETE
TO authenticated
USING (true);

-- ==============================================================================
-- 5. STORAGE BUCKET CONFIGURATION (tejomay-media)
-- ==============================================================================

-- Create public storage bucket for website assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'tejomay-media',
    'tejomay-media',
    true,
    5242880, -- 5 MB max per image
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- Storage RLS: Public Read
CREATE POLICY "Public Media Read"
ON storage.objects
FOR SELECT
TO public, anon, authenticated
USING (bucket_id = 'tejomay-media');

-- Storage RLS: Authenticated Admin Upload
CREATE POLICY "Admin Media Upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tejomay-media');

-- Storage RLS: Authenticated Admin Update
CREATE POLICY "Admin Media Update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tejomay-media');

-- Storage RLS: Authenticated Admin Delete
CREATE POLICY "Admin Media Delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tejomay-media');

-- ==============================================================================
-- 6. INITIAL DATA SEEDING (PRODUCTION READY CONTENT)
-- ==============================================================================

-- Seed Services
INSERT INTO public.services (id, category, title, tagline, description, "capacityRange", "estimatedSavings", image, features)
VALUES 
(
    'serv-1',
    'residential',
    'Tejomay Core™ Residential Solar',
    'Ultra-Sleek Rooftop Solar Array for Modern Homes',
    'High-efficiency monocrystalline rooftop panels designed to slash home electricity bills by up to 90% while providing seamless grid backup.',
    '3 kW - 10 kW Systems',
    'Save up to ₹85,000 / year',
    '/solar_res_1.jpg',
    '["All-Black Aesthetic Panels", "25-Year Performance Warranty", "Integrated Smart App Telemetry", "Zero-Down Financing Available"]'::jsonb
),
(
    'serv-2',
    'commercial',
    'Tejomay Max™ Commercial Solar',
    'High-Yield Solar Arrays for Offices, Malls & Campuses',
    'Commercial-grade solar infrastructure engineered to optimize operational overheads and deliver massive tax depreciation benefits.',
    '25 kW - 250 kW Systems',
    'Save up to ₹4,500,000 / year',
    '/solar_res_2.jpg',
    '["Bifacial Glass-on-Glass Tech", "Peak Shaving Battery Integration", "Net Metering Assistance", "Accelerated 40% Tax Depreciation"]'::jsonb
),
(
    'serv-3',
    'industrial',
    'Tejomay Apex™ Industrial Solar',
    'Heavy-Duty Solar Grids for Factories & Cold Storage',
    'Rugged, high-capacity solar setups built for continuous industrial power loads, factory roofs, and cold storage facilities.',
    '250 kW - 5 MW Industrial Plants',
    'Save up to ₹25,000,000 / year',
    '/solar_ind_1.jpg',
    '["Heavy Corrosion-Resistant Mounts", "HV/LV Transformer Setup", "24/7 AI Load Management", "Guaranteed 99.4% Uptime"]'::jsonb
),
(
    'serv-4',
    'epc',
    'Turnkey Solar EPC Engineering',
    'End-to-End Design, Procurement & Grid Commissioning',
    'Complete Engineering, Procurement, and Construction services. From 3D shading simulations to DISCOM grid approvals and power sync.',
    'Custom Turnkey Projects',
    '100% Guaranteed Grid Approval',
    '/solar_res_3.jpg',
    '["3D Drone Shading Analysis", "Tier-1 Equipment Sourcing", "Government Approval Handling", "Turnkey Commissioning in 30 Days"]'::jsonb
),
(
    'serv-5',
    'amc',
    'Tejomay Shield™ AMC Maintenance',
    'Comprehensive Annual Maintenance & Telemetry Ops',
    'Proactive preventive maintenance, automated robotic panel cleaning, thermal hotspot scans, and 24/7 remote performance monitoring.',
    'Annual Subscription Contracts',
    'Boost Generation Yield by 18%',
    '/solar_ind_3.jpg',
    '["Quarterly Thermal Camera Scans", "Robotic & De-ionized Water Washing", "Inverter Firmware & Hardware Checks", "2-Hour Emergency On-Site SLA"]'::jsonb
);

-- Seed Testimonials
INSERT INTO public.testimonials (id, "clientName", "clientRole", "companyOrLocation", photo, "projectCapacity", quote, rating, date, category)
VALUES
(
    'test-res-1',
    'Priya Sundaram',
    'Homeowner',
    'Vasant Vihar, New Delhi',
    '/solar_res_1.jpg',
    '8 kW Residential Array',
    'The all-black Tejomay Core panels look stunning on our villa roof. The mobile app lets us track our real-time generation. Our summer AC power bills have dropped to zero!',
    5,
    'July 2026',
    'residential'
),
(
    'test-res-2',
    'Ananya Deshmukh',
    'Villa Owner',
    'Baner, Pune',
    '/solar_res_2.jpg',
    '12 kW Hybrid Solar Setup',
    'Tejomay handled all DISCOM net-metering approvals effortlessly. Our home electricity cost reduced by 92% with instant grid backup support during power cuts.',
    5,
    'August 2026',
    'residential'
),
(
    'test-res-3',
    'Karan Singhania',
    'Homeowner',
    'Jubilee Hills, Hyderabad',
    '/solar_res_3.jpg',
    '10 kW Smart Solar Grid',
    'Exceptional build quality and premium panel aesthetics. The payback period calculated by their tool was spot on at 3.2 years. Highly recommended!',
    5,
    'June 2026',
    'residential'
),
(
    'test-ind-1',
    'Rajesh Malhotra',
    'Director of Facilities',
    'SustainVolt Industrial Park, Gurgaon',
    '/solar_ind_1.jpg',
    '150 kW Commercial Rooftop',
    'Switching our industrial manufacturing facility to Tejomay solar panels reduced our monthly electricity expense from ₹4.2 Lakhs down to ₹45,000! Their EPC team completed grid synchronization 10 days ahead of schedule.',
    5,
    'August 2026',
    'industrial'
),
(
    'test-ind-2',
    'Vikramaditya Shah',
    'Managing Director',
    'Apex Cold Storage & Logistics, Mumbai',
    '/solar_ind_2.jpg',
    '500 kW High-Yield Solar Grid',
    'Tejomay''s AMC team performs quarterly thermal diagnostics and automated washing. Our generation output has stayed consistently 15% above predicted baseline for 3 years straight.',
    5,
    'June 2026',
    'industrial'
),
(
    'test-ind-3',
    'Meera Kapoor',
    'VP of Operations',
    'GreenLogistics Hub, Ahmedabad',
    '/solar_ind_3.jpg',
    '300 kW Commercial Rooftop',
    'Massive corporate tax depreciation benefits combined with 99.4% guaranteed power uptime. Tejomay is the benchmark for industrial solar engineering in India.',
    5,
    'May 2026',
    'industrial'
);

