export type UserRole = 'STUDENT' | 'ORGANIZER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  collegeId?: string; // Roll / Registration Number
  phone?: string;
  department?: string;
  createdAt: string;
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string; // e.g. "General Entry", "VIP Pass", "Early Bird", "Student Delegate"
  price: number; // 0 = Free
  capacity: number;
  available: number;
  description?: string;
  maxPerUser: number;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Culturals' | 'Symposium' | 'Hackathon' | 'Music & Concert' | 'Dance' | 'Sports' | 'Workshops' | 'Tech Expo';
  bannerUrl: string;
  venue: string;
  venueDetail?: string;
  startDate: string;
  endDate: string;
  organizerId: string;
  organizerName: string;
  totalCapacity: number;
  availableSeats: number;
  status: 'PUBLISHED' | 'DRAFT' | 'COMPLETED' | 'CANCELLED';
  isFeatured: boolean;
  rules?: string;
  ticketTiers: TicketTier[];
  createdAt: string;
}

export type HoldStatus = 'ACTIVE' | 'EXPIRED' | 'CONVERTED' | 'RELEASED';

export interface ReservationHold {
  id: string;
  userId: string;
  eventId: string;
  tierId: string;
  tierName: string;
  quantity: number;
  pricePerTicket: number;
  totalAmount: number;
  status: HoldStatus;
  expiresAt: string; // ISO string
  createdAt: string;
  eventTitle?: string;
  eventVenue?: string;
  eventStartDate?: string;
  eventBannerUrl?: string;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'ATTENDED';

export interface TicketItem {
  id: string;
  bookingId: string;
  tierId: string;
  tierName: string;
  ticketCode: string; // e.g. CT-TKT-782194
  attendeeName: string;
  attendeeEmail: string;
  collegeId?: string;
  price: number;
  checkedIn: boolean;
  checkedInAt?: string;
}

export interface PaymentDetails {
  id: string;
  transactionRef: string;
  amount: number;
  method: 'UPI' | 'CARD' | 'FREE_PASS';
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  upiVpa?: string;
  cardLastFour?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingNumber: string; // e.g. CT-2026-X89K2
  userId: string;
  userName: string;
  userEmail: string;
  userCollegeId?: string;
  eventId: string;
  eventTitle: string;
  eventBannerUrl: string;
  eventVenue: string;
  eventStartDate: string;
  tierId: string;
  tierName: string;
  quantity: number;
  totalAmount: number;
  status: BookingStatus;
  qrToken: string;
  createdAt: string;
  tickets: TicketItem[];
  payment?: PaymentDetails;
}

export interface AdminStats {
  totalRevenue: number;
  totalBookings: number;
  totalTicketsSold: number;
  activeEvents: number;
  totalUsers: number;
  averageOccupancy: number;
  categoryBreakdown: { category: string; count: number; revenue: number }[];
  revenueByDate: { date: string; amount: number; bookings: number }[];
  recentBookings: Booking[];
}
