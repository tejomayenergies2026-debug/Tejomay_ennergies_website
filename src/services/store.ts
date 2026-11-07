export interface ServiceItem {
  id: string;
  category: 'residential' | 'commercial' | 'industrial' | 'epc' | 'amc';
  title: string;
  tagline: string;
  description: string;
  capacityRange: string;
  estimatedSavings: string;
  image: string;
  features: string[];
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  companyOrLocation: string;
  photo: string;
  projectCapacity: string;
  quote: string;
  rating: number;
  date: string;
  category: 'residential' | 'industrial';
}

export interface FounderItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "serv-1",
    category: "residential",
    title: "Tejomay Core™ Residential Solar",
    tagline: "Ultra-Sleek Rooftop Solar Array for Modern Homes",
    description: "High-efficiency monocrystalline rooftop panels designed to slash home electricity bills by up to 90% while providing seamless grid backup.",
    capacityRange: "3 kW - 10 kW Systems",
    estimatedSavings: "Save up to ₹85,000 / year",
    image: "/solar_res_1.jpg",
    features: ["All-Black Aesthetic Panels", "25-Year Performance Warranty", "Integrated Smart App Telemetry", "Zero-Down Financing Available"]
  },
  {
    id: "serv-2",
    category: "commercial",
    title: "Tejomay Max™ Commercial Solar",
    tagline: "High-Yield Solar Arrays for Offices, Malls & Campuses",
    description: "Commercial-grade solar infrastructure engineered to optimize operational overheads and deliver massive tax depreciation benefits.",
    capacityRange: "25 kW - 250 kW Systems",
    estimatedSavings: "Save up to ₹4,500,000 / year",
    image: "/solar_res_2.jpg",
    features: ["Bifacial Glass-on-Glass Tech", "Peak Shaving Battery Integration", "Net Metering Assistance", "Accelerated 40% Tax Depreciation"]
  },
  {
    id: "serv-3",
    category: "industrial",
    title: "Tejomay Apex™ Industrial Solar",
    tagline: "Heavy-Duty Solar Grids for Factories & Cold Storage",
    description: "Rugged, high-capacity solar setups built for continuous industrial power loads, factory roofs, and cold storage facilities.",
    capacityRange: "250 kW - 5 MW Industrial Plants",
    estimatedSavings: "Save up to ₹25,000,000 / year",
    image: "/solar_ind_1.jpg",
    features: ["Heavy Corrosion-Resistant Mounts", "HV/LV Transformer Setup", "24/7 AI Load Management", "Guaranteed 99.4% Uptime"]
  },
  {
    id: "serv-4",
    category: "epc",
    title: "Turnkey Solar EPC Engineering",
    tagline: "End-to-End Design, Procurement & Grid Commissioning",
    description: "Complete Engineering, Procurement, and Construction services. From 3D shading simulations to DISCOM grid approvals and power sync.",
    capacityRange: "Custom Turnkey Projects",
    estimatedSavings: "100% Guaranteed Grid Approval",
    image: "/solar_res_3.jpg",
    features: ["3D Drone Shading Analysis", "Tier-1 Equipment Sourcing", "Government Approval Handling", "Turnkey Commissioning in 30 Days"]
  },
  {
    id: "serv-5",
    category: "amc",
    title: "Tejomay Shield™ AMC Maintenance",
    tagline: "Comprehensive Annual Maintenance & Telemetry Ops",
    description: "Proactive preventive maintenance, automated robotic panel cleaning, thermal hotspot scans, and 24/7 remote performance monitoring.",
    capacityRange: "Annual Subscription Contracts",
    estimatedSavings: "Boost Generation Yield by 18%",
    image: "/solar_ind_3.jpg",
    features: ["Quarterly Thermal Camera Scans", "Robotic & De-ionized Water Washing", "Inverter Firmware & Hardware Checks", "2-Hour Emergency On-Site SLA"]
  }
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  // 3 RESIDENTIAL SAMPLE CARDS
  {
    id: "test-res-1",
    clientName: "Priya Sundaram",
    clientRole: "Homeowner",
    companyOrLocation: "Vasant Vihar, New Delhi",
    photo: "/solar_res_1.jpg",
    projectCapacity: "8 kW Residential Array",
    quote: "The all-black Tejomay Core panels look stunning on our villa roof. The mobile app lets us track our real-time generation. Our summer AC power bills have dropped to zero!",
    rating: 5,
    date: "July 2026",
    category: "residential"
  },
  {
    id: "test-res-2",
    clientName: "Ananya Deshmukh",
    clientRole: "Villa Owner",
    companyOrLocation: "Baner, Pune",
    photo: "/solar_res_2.jpg",
    projectCapacity: "12 kW Hybrid Solar Setup",
    quote: "Tejomay handled all DISCOM net-metering approvals effortlessly. Our home electricity cost reduced by 92% with instant grid backup support during power cuts.",
    rating: 5,
    date: "August 2026",
    category: "residential"
  },
  {
    id: "test-res-3",
    clientName: "Karan Singhania",
    clientRole: "Homeowner",
    companyOrLocation: "Jubilee Hills, Hyderabad",
    photo: "/solar_res_3.jpg",
    projectCapacity: "10 kW Smart Solar Grid",
    quote: "Exceptional build quality and premium panel aesthetics. The payback period calculated by their tool was spot on at 3.2 years. Highly recommended!",
    rating: 5,
    date: "June 2026",
    category: "residential"
  },

  // 3 INDUSTRIAL SAMPLE CARDS
  {
    id: "test-ind-1",
    clientName: "Rajesh Malhotra",
    clientRole: "Director of Facilities",
    companyOrLocation: "SustainVolt Industrial Park, Gurgaon",
    photo: "/solar_ind_1.jpg",
    projectCapacity: "150 kW Commercial Rooftop",
    quote: "Switching our industrial manufacturing facility to Tejomay solar panels reduced our monthly electricity expense from ₹4.2 Lakhs down to ₹45,000! Their EPC team completed grid synchronization 10 days ahead of schedule.",
    rating: 5,
    date: "August 2026",
    category: "industrial"
  },
  {
    id: "test-ind-2",
    clientName: "Vikramaditya Shah",
    clientRole: "Managing Director",
    companyOrLocation: "Apex Cold Storage & Logistics, Mumbai",
    photo: "/solar_ind_2.jpg",
    projectCapacity: "500 kW High-Yield Solar Grid",
    quote: "Tejomay's AMC team performs quarterly thermal diagnostics and automated washing. Our generation output has stayed consistently 15% above predicted baseline for 3 years straight.",
    rating: 5,
    date: "June 2026",
    category: "industrial"
  },
  {
    id: "test-ind-3",
    clientName: "Meera Kapoor",
    clientRole: "VP of Operations",
    companyOrLocation: "GreenLogistics Hub, Ahmedabad",
    photo: "/solar_ind_3.jpg",
    projectCapacity: "300 kW Commercial Rooftop",
    quote: "Massive corporate tax depreciation benefits combined with 99.4% guaranteed power uptime. Tejomay is the benchmark for industrial solar engineering in India.",
    rating: 5,
    date: "May 2026",
    category: "industrial"
  }
];

const DEFAULT_FOUNDERS: FounderItem[] = [
  {
    id: "found-1",
    name: "Aarav Malhotra",
    role: "Founder & Chief Executive Officer",
    bio: "“We believe the next era of growth will be powered by clean energy, intelligent technology, and sustainable thinking—and we are committed to being part of that transformation.”",
    photo: "/founder1.jpeg",
    linkedin: "https://www.linkedin.com/company/tejomay-energies",
    twitter: "https://twitter.com",
    email: "aarav@tejomay.com"
  }
];

export const getStoredServices = (): ServiceItem[] => {
  if (typeof window === "undefined") return DEFAULT_SERVICES;
  const saved = localStorage.getItem("tejomay_services");
  if (!saved) {
    localStorage.setItem("tejomay_services", JSON.stringify(DEFAULT_SERVICES));
    return DEFAULT_SERVICES;
  }
  try {
    const items: ServiceItem[] = JSON.parse(saved);
    // Upgrade any old low-res image references to crisp HD versions
    const upgraded = items.map(item => {
      if (!item.image || item.image.includes('.avif') || item.image.includes('solar1_custom.jpeg')) {
        const matchingDefault = DEFAULT_SERVICES.find(d => d.id === item.id);
        return { ...item, image: matchingDefault ? matchingDefault.image : '/solar_res_1.jpg' };
      }
      return item;
    });
    localStorage.setItem("tejomay_services", JSON.stringify(upgraded));
    return upgraded;
  } catch {
    return DEFAULT_SERVICES;
  }
};

export const saveStoredServices = (items: ServiceItem[]): void => {
  localStorage.setItem("tejomay_services", JSON.stringify(items));
};

export const getStoredTestimonials = (): TestimonialItem[] => {
  if (typeof window === "undefined") return DEFAULT_TESTIMONIALS;
  const saved = localStorage.getItem("tejomay_testimonials");
  if (!saved) {
    localStorage.setItem("tejomay_testimonials", JSON.stringify(DEFAULT_TESTIMONIALS));
    return DEFAULT_TESTIMONIALS;
  }
  try {
    const items: TestimonialItem[] = JSON.parse(saved);
    // Upgrade any old low-res photo references to crisp HD versions
    const upgraded = items.map(item => {
      if (!item.photo || item.photo.includes('.avif') || item.photo.includes('solar1_custom.jpeg')) {
        const matchingDefault = DEFAULT_TESTIMONIALS.find(d => d.id === item.id);
        return { ...item, photo: matchingDefault ? matchingDefault.photo : '/solar_res_1.jpg' };
      }
      return item;
    });
    localStorage.setItem("tejomay_testimonials", JSON.stringify(upgraded));
    return upgraded;
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
};

export const saveStoredTestimonials = (items: TestimonialItem[]): void => {
  localStorage.setItem("tejomay_testimonials", JSON.stringify(items));
};

export const getStoredFounders = (): FounderItem[] => {
  return DEFAULT_FOUNDERS;
};

