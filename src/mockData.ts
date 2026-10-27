import type { User, EventItem, Booking } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-student-1',
    email: 'student@campustix.edu',
    name: 'Aarav Sharma',
    role: 'STUDENT',
    collegeId: '22BCE1042',
    phone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-organizer-1',
    email: 'organizer@campustix.edu',
    name: 'Prof. Sneha Deshmukh',
    role: 'ORGANIZER',
    collegeId: 'FAC-8921',
    phone: '+91 98765 11223',
    department: 'Student Cultural Council',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-admin-1',
    email: 'admin@campustix.edu',
    name: 'Dean of Student Affairs',
    role: 'ADMIN',
    collegeId: 'ADMIN-001',
    phone: '+91 98765 99999',
    department: 'Office of Campus Life & Events',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-culturals-2026',
    title: 'Riviera Grand Cultural Fest 2026',
    slug: 'riviera-cultural-fest-2026',
    description: 'The flagship annual 3-day inter-collegiate cultural extravaganza featuring celebrity concert pro-nites, battle of the bands, fashion runway, and carnival stalls. Over 15,000 students attend from 120+ colleges nationwide.',
    category: 'Culturals',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    venue: 'Main University Amphitheatre & Central Lawns',
    venueDetail: 'Gates open at 4:30 PM. College ID or Student Pass mandatory along with valid QR ticket for wristband exchange.',
    startDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 13 * 86400000).toISOString(),
    organizerId: 'usr-organizer-1',
    organizerName: 'Prof. Sneha Deshmukh (Cultural Council)',
    totalCapacity: 1200,
    availableSeats: 340,
    status: 'PUBLISHED',
    isFeatured: true,
    rules: '1. Valid College ID Card is mandatory for entry.\n2. Outside food, beverages, and metallic items are strictly prohibited.\n3. Wristband will be issued upon scanning the QR code at Gate 2.\n4. Tickets are non-transferable.',
    ticketTiers: [
      {
        id: 'tier-cult-gen',
        eventId: 'evt-culturals-2026',
        name: 'General Entry (3-Day Pass)',
        price: 299,
        capacity: 800,
        available: 210,
        description: 'Access to all cultural competitions, flea market, and general standing arena for pro-nites.',
        maxPerUser: 4
      },
      {
        id: 'tier-cult-vip',
        eventId: 'evt-culturals-2026',
        name: 'VIP Front-Row Stage Pass',
        price: 699,
        capacity: 300,
        available: 60,
        description: 'Front stage viewing zone for celebrity concert, complimentary fest merchandise kit and food voucher.',
        maxPerUser: 2
      },
      {
        id: 'tier-cult-day',
        eventId: 'evt-culturals-2026',
        name: 'Day 1 Opening Pass',
        price: 149,
        capacity: 100,
        available: 70,
        description: 'Access exclusively to Day 1 inauguration, battle of bands, and musical comedy night.',
        maxPerUser: 4
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-symposium-2026',
    title: 'TechnoVision 2026: National AI & Quantum Symposium',
    slug: 'technovision-ai-quantum-symposium',
    description: 'Premier academic and industrial conference featuring keynotes by researchers from top tech labs, peer-reviewed paper presentations, poster sessions, and deep-dive technical panels on LLMs and Quantum Cryptography.',
    category: 'Symposium',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    venue: 'Sir C.V. Raman Auditorium, Block 4',
    venueDetail: 'Registration desk opens at 8:30 AM. Delegate kit provided at entrance.',
    startDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    organizerId: 'usr-organizer-1',
    organizerName: 'School of Advanced Computing',
    totalCapacity: 450,
    availableSeats: 120,
    status: 'PUBLISHED',
    isFeatured: true,
    rules: '1. Includes delegate conference kit, lunch buffet, and high tea.\n2. Certificates of participation will be issued digitally within 48 hours.\n3. Bring your own laptop for afternoon hands-on breakout sessions.',
    ticketTiers: [
      {
        id: 'tier-symp-student',
        eventId: 'evt-symposium-2026',
        name: 'Student Delegate Pass',
        price: 199,
        capacity: 350,
        available: 90,
        description: 'Access to keynotes, technical tracks, conference lunch, and IEEE digital certificate.',
        maxPerUser: 3
      },
      {
        id: 'tier-symp-faculty',
        eventId: 'evt-symposium-2026',
        name: 'Faculty & Scholar Pass',
        price: 399,
        capacity: 100,
        available: 30,
        description: 'Full proceedings access, VIP lounge lunch, and reviewer panel networking session.',
        maxPerUser: 2
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-hackathon-2026',
    title: 'HackCampus: 36-Hour National Hackathon',
    slug: 'hackcampus-36hr-hackathon',
    description: 'Build solutions tackling Healthcare, FinTech, Autonomous Mobility, and Sustainable Energy. ₹3,00,000 prize pool, sponsor bounty challenges, 24/7 Red Bull & midnight pizza, and direct interview opportunities with top tech recruiters.',
    category: 'Hackathon',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    venue: 'Innovation & Incubation Hub, 3rd Floor',
    venueDetail: 'High-speed gigabit Wi-Fi and power strips at every workstation. Rest cabins available.',
    startDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 17 * 86400000).toISOString(),
    organizerId: 'usr-organizer-1',
    organizerName: 'Developer Student Club & ACM Chapter',
    totalCapacity: 300,
    availableSeats: 45,
    status: 'PUBLISHED',
    isFeatured: true,
    rules: '1. Teams of 2 to 4 members.\n2. All code must be freshly committed to GitHub after opening hack horn.\n3. Meals, beverages, and sleeping zones provided 24x7.',
    ticketTiers: [
      {
        id: 'tier-hack-free',
        eventId: 'evt-hackathon-2026',
        name: 'Hacker Team Entry (Free)',
        price: 0,
        capacity: 250,
        available: 35,
        description: 'Free entry for accepted applicants. Includes 36hr stay, food, snacks, swags and mentor support.',
        maxPerUser: 4
      },
      {
        id: 'tier-hack-supporter',
        eventId: 'evt-hackathon-2026',
        name: 'Hacker Pro Kit Pass',
        price: 249,
        capacity: 50,
        available: 10,
        description: 'Includes official HackCampus embroidered hoodie, hardware component starter kit, and sponsor goodies.',
        maxPerUser: 2
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-music-2026',
    title: 'Campus Beats: Sunburn Club EDM & Indie Rock Pro-Nite',
    slug: 'campus-beats-edm-indie-rock',
    description: 'An electrifying music spectacle headlined by top DJ duos and India’s breakthrough indie rock sensations. Spectacular laser light show, immersive surround sound, food trucks, and pulsating energy under the campus night sky.',
    category: 'Music & Concert',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    venue: 'University Sports Stadium Ground',
    venueDetail: 'Gates open at 5:00 PM. Concert starts sharply at 6:30 PM.',
    startDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 20 * 86400000 + 6 * 3600000).toISOString(),
    organizerId: 'usr-organizer-1',
    organizerName: 'Music & Fine Arts Society',
    totalCapacity: 2000,
    availableSeats: 580,
    status: 'PUBLISHED',
    isFeatured: true,
    rules: '1. Strict physical and bag inspection at entry turnstiles.\n2. Audio/video professional recording equipment is not permitted without press pass.\n3. Re-entry is not allowed after wristband checkout.',
    ticketTiers: [
      {
        id: 'tier-music-early',
        eventId: 'evt-music-2026',
        name: 'Early Bird Student Pass',
        price: 349,
        capacity: 1000,
        available: 220,
        description: 'Special early bird discount for enrolled college students.',
        maxPerUser: 4
      },
      {
        id: 'tier-music-fan',
        eventId: 'evt-music-2026',
        name: 'Fan Pit Pass (Near Stage)',
        price: 799,
        capacity: 800,
        available: 310,
        description: 'Exclusive barricaded enclosure right in front of the performance stage.',
        maxPerUser: 4
      },
      {
        id: 'tier-music-lounge',
        eventId: 'evt-music-2026',
        name: 'VIP Hospitality Deck',
        price: 1499,
        capacity: 200,
        available: 50,
        description: 'Elevated platform view, complimentary finger food, soft beverage bar, and meet & greet access.',
        maxPerUser: 2
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-dance-2026',
    title: 'Step Up 2026: Inter-Collegiate Western & Hip-Hop Faceoff',
    slug: 'step-up-intercollegiate-dance',
    description: 'The ultimate dance showdown! Witness 30+ collegiate crews clash in Mega Crew Hip-Hop, Solo Freestyle, Contemporary, and Street 1v1 Cyphers judged by celebrity choreographers.',
    category: 'Dance',
    bannerUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    venue: 'Open Air Theatre (OAT)',
    venueDetail: 'Open seating on a first-come, first-served basis.',
    startDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 12 * 86400000 + 5 * 3600000).toISOString(),
    organizerId: 'usr-organizer-1',
    organizerName: 'Campus Dance Crew "GroovePulse"',
    totalCapacity: 800,
    availableSeats: 260,
    status: 'PUBLISHED',
    isFeatured: false,
    rules: '1. Keep aisles clear during dance crew transitions.\n2. Cheer responsibly and respect all visiting collegiate teams.',
    ticketTiers: [
      {
        id: 'tier-dance-gen',
        eventId: 'evt-dance-2026',
        name: 'Audience Gallery Pass',
        price: 99,
        capacity: 700,
        available: 220,
        description: 'Full access to cheer in the open air theatre gallery.',
        maxPerUser: 4
      },
      {
        id: 'tier-dance-cypher',
        eventId: 'evt-dance-2026',
        name: 'Cypher Circle Ringside',
        price: 249,
        capacity: 100,
        available: 40,
        description: 'Direct ringside floor access around the freestyle battle ring.',
        maxPerUser: 2
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-sports-2026',
    title: 'All-India Inter-University Athletics & Basketball Meet',
    slug: 'inter-university-sports-meet',
    description: '5 action-packed days of track and field, 3x3 basketball, volleyball finals, and badminton. Support your university squad as athletes from across the country compete for the Championship Gold Trophy.',
    category: 'Sports',
    bannerUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    venue: 'University Indoor Stadium & Synthetic Track',
    venueDetail: 'Visitor badge provided at entry.',
    startDate: new Date(Date.now() + 25 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    organizerId: 'usr-organizer-1',
    organizerName: 'Department of Physical Education & Athletics',
    totalCapacity: 1500,
    availableSeats: 620,
    status: 'PUBLISHED',
    isFeatured: false,
    rules: '1. Sports footwear required if entering player warm-up concourse.\n2. Free hydration stations available in all spectator stands.',
    ticketTiers: [
      {
        id: 'tier-sports-free',
        eventId: 'evt-sports-2026',
        name: 'Campus Student Pass (Free)',
        price: 0,
        capacity: 1200,
        available: 500,
        description: 'Free entry for all university students with valid student ID.',
        maxPerUser: 2
      },
      {
        id: 'tier-sports-finals',
        eventId: 'evt-sports-2026',
        name: 'Championship Finals Reserved Chair',
        price: 150,
        capacity: 300,
        available: 120,
        description: 'Reserved cushioned seat for basketball and track finals + tournament souvenir pin.',
        maxPerUser: 4
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-workshop-2026',
    title: 'Full-Stack Generative AI & Cloud-Native Systems Masterclass',
    slug: 'fullstack-genai-cloud-workshop',
    description: 'Hands-on intensive masterclass led by industry staff engineers. Build production RAG pipelines, fine-tune open models, orchestrate microservices on Kubernetes, and deploy real-time scalable AI architectures.',
    category: 'Workshops',
    bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    venue: 'Turing Computer Center Lab 12',
    venueDetail: 'Cloud sandbox credits worth $100 and sample repo provided to every attendee.',
    startDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000 + 7 * 3600000).toISOString(),
    organizerId: 'usr-organizer-1',
    organizerName: 'ACM Student Chapter & GDG On Campus',
    totalCapacity: 120,
    availableSeats: 22,
    status: 'PUBLISHED',
    isFeatured: false,
    rules: '1. Bring a laptop with Docker and VS Code pre-installed.\n2. Cloud credits will be distributed at 9:00 AM sharp.',
    ticketTiers: [
      {
        id: 'tier-work-student',
        eventId: 'evt-workshop-2026',
        name: 'Lab Seat Pass',
        price: 199,
        capacity: 90,
        available: 14,
        description: 'Physical seat in Turing Lab with dual monitor setup, cloud GPU access, and lunch.',
        maxPerUser: 2
      },
      {
        id: 'tier-work-online',
        eventId: 'evt-workshop-2026',
        name: 'Virtual Live Stream Pass',
        price: 99,
        capacity: 30,
        available: 8,
        description: 'Interactive HD live stream link, Discord mentor channel access, and recorded session replay.',
        maxPerUser: 1
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-demo-1',
    bookingNumber: 'CT-2026-X89K2',
    userId: 'usr-student-1',
    userName: 'Aarav Sharma',
    userEmail: 'student@campustix.edu',
    userCollegeId: '22BCE1042',
    eventId: 'evt-culturals-2026',
    eventTitle: 'Riviera Grand Cultural Fest 2026',
    eventBannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    eventVenue: 'Main University Amphitheatre & Central Lawns',
    eventStartDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    tierId: 'tier-cult-gen',
    tierName: 'General Entry (3-Day Pass)',
    quantity: 2,
    totalAmount: 598,
    status: 'CONFIRMED',
    qrToken: 'CAMPUS-TIX-CT-2026-X89K2-VERIFIED-AUTH',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    tickets: [
      {
        id: 'tkt-101',
        bookingId: 'bkg-demo-1',
        tierId: 'tier-cult-gen',
        tierName: 'General Entry (3-Day Pass)',
        ticketCode: 'CT-TKT-884920',
        attendeeName: 'Aarav Sharma',
        attendeeEmail: 'student@campustix.edu',
        collegeId: '22BCE1042',
        price: 299,
        checkedIn: false
      },
      {
        id: 'tkt-102',
        bookingId: 'bkg-demo-1',
        tierId: 'tier-cult-gen',
        tierName: 'General Entry (3-Day Pass)',
        ticketCode: 'CT-TKT-884921',
        attendeeName: 'Rohan Mehra',
        attendeeEmail: 'rohan.m@campustix.edu',
        collegeId: '22BCE1098',
        price: 299,
        checkedIn: false
      }
    ],
    payment: {
      id: 'pmt-101',
      transactionRef: 'TXN-UPI-98234123',
      amount: 598,
      method: 'UPI',
      status: 'SUCCESS',
      upiVpa: 'aarav@oksbi',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  }
];
