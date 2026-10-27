import type { User, EventItem, TicketTier, ReservationHold, Booking, TicketItem, AdminStats } from '../types';
import { INITIAL_USERS, INITIAL_EVENTS, INITIAL_BOOKINGS } from '../mockData';

const K = {
  U: 'campustix_users_v3',
  E: 'campustix_events_v3',
  H: 'campustix_holds_v3',
  B: 'campustix_bookings_v3',
  A: 'campustix_auth_v3'
};

function getStorage<T>(k: string, fallback: T): T {
  try {
    const val = localStorage.getItem(k);
    if (!val) {
      localStorage.setItem(k, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function setStorage<T>(k: string, v: T) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}

let users = getStorage<User[]>(K.U, INITIAL_USERS);
let events = getStorage<EventItem[]>(K.E, INITIAL_EVENTS);
let holds = getStorage<ReservationHold[]>(K.H, []);
let bookings = getStorage<Booking[]>(K.B, INITIAL_BOOKINGS);

function sweepHolds() {
  const now = Date.now();
  let changed = false;
  for (const h of holds) {
    if (h.status === 'ACTIVE' && new Date(h.expiresAt).getTime() <= now) {
      h.status = 'EXPIRED';
      changed = true;
      const ev = events.find(e => e.id === h.eventId);
      if (ev) {
        ev.availableSeats += h.quantity;
        const tr = ev.ticketTiers.find(t => t.id === h.tierId);
        if (tr) tr.available += h.quantity;
      }
    }
  }
  if (changed) {
    setStorage(K.H, holds);
    setStorage(K.E, events);
  }
}

if (typeof window !== 'undefined') {
  setInterval(sweepHolds, 4000);
}

export const api = {
  getCurrentUser(): User {
    return getStorage<User>(K.A, users[0]);
  },
  setCurrentUser(u: User) {
    setStorage(K.A, u);
  },
  async login(email: string): Promise<User> {
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u) throw new Error('User not found. Try student@campustix.edu');
    this.setCurrentUser(u);
    return u;
  },
  async register(data: { name: string; email: string; collegeId?: string; role?: any }): Promise<User> {
    const exists = users.find(x => x.email.toLowerCase() === data.email.toLowerCase());
    if (exists) throw new Error('Account already exists with this email');
    const newUser: User = {
      id: 'usr-' + Math.random().toString(36).slice(2, 8),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role || 'STUDENT',
      collegeId: data.collegeId?.trim() || '22BCE' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setStorage(K.U, users);
    this.setCurrentUser(newUser);
    return newUser;
  },
  async getEvents(f?: { search?: string; category?: string; price?: string }): Promise<EventItem[]> {
    sweepHolds();
    let res = [...events];
    if (f?.search) {
      const q = f.search.toLowerCase();
      res = res.filter(e => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    if (f?.category && f.category !== 'All') {
      res = res.filter(e => e.category.toLowerCase() === f.category!.toLowerCase());
    }
    if (f?.price === 'free') res = res.filter(e => e.ticketTiers.some(t => t.price === 0));
    if (f?.price === 'paid') res = res.filter(e => e.ticketTiers.some(t => t.price > 0));
    return res;
  },
  async getEventById(id: string): Promise<EventItem | null> {
    sweepHolds();
    return events.find(e => e.id === id || e.slug === id) || null;
  },
  async createEvent(ev: Partial<EventItem>, user: User): Promise<EventItem> {
    const id = 'evt-' + Math.random().toString(36).slice(2, 8);
    const tiers: TicketTier[] = (ev.ticketTiers || []).map((t, idx) => ({
      id: `tier-${id}-${idx + 1}`,
      eventId: id,
      name: t.name || 'General Entry',
      price: Number(t.price || 0),
      capacity: Number(t.capacity || 100),
      available: Number(t.capacity || 100),
      description: t.description || '',
      maxPerUser: Number(t.maxPerUser || 4)
    }));
    const totalCap = tiers.reduce((s, t) => s + t.capacity, 0);
    const item: EventItem = {
      id,
      title: ev.title || 'Untitled Event',
      slug: (ev.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000),
      description: ev.description || '',
      category: (ev.category as any) || 'Culturals',
      bannerUrl: ev.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      venue: ev.venue || 'University Auditorium',
      venueDetail: ev.venueDetail,
      startDate: ev.startDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      endDate: ev.endDate || new Date(Date.now() + 7 * 86400000 + 4 * 3600000).toISOString(),
      organizerId: user.id,
      organizerName: user.name,
      totalCapacity: totalCap,
      availableSeats: totalCap,
      status: 'PUBLISHED',
      isFeatured: Boolean(ev.isFeatured),
      rules: ev.rules,
      ticketTiers: tiers,
      createdAt: new Date().toISOString()
    };
    events.unshift(item);
    setStorage(K.E, events);
    return item;
  },
  async updateEvent(id: string, ev: Partial<EventItem>): Promise<EventItem> {
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Event not found');
    events[idx] = { ...events[idx], ...ev };
    setStorage(K.E, events);
    return events[idx];
  },
  async deleteEvent(id: string): Promise<void> {
    events = events.filter(e => e.id !== id);
    setStorage(K.E, events);
  },
  async createHold(eventId: string, tierId: string, quantity: number, user: User): Promise<ReservationHold> {
    sweepHolds();
    const ev = events.find(e => e.id === eventId);
    if (!ev) throw new Error('Event not found');
    const tr = ev.ticketTiers.find(t => t.id === tierId);
    if (!tr) throw new Error('Tier not found');
    if (quantity > tr.maxPerUser) throw new Error(`Max ${tr.maxPerUser} tickets allowed`);
    if (tr.available < quantity || ev.availableSeats < quantity) throw new Error(`Only ${tr.available} tickets available`);

    // release existing active hold
    const existing = holds.find(h => h.userId === user.id && h.eventId === eventId && h.status === 'ACTIVE' && new Date(h.expiresAt).getTime() > Date.now());
    if (existing) {
      existing.status = 'RELEASED';
      ev.availableSeats += existing.quantity;
      const oldTr = ev.ticketTiers.find(t => t.id === existing.tierId);
      if (oldTr) oldTr.available += existing.quantity;
    }

    // Atomic hold decrement
    tr.available -= quantity;
    ev.availableSeats -= quantity;

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const hold: ReservationHold = {
      id: 'hold-' + Math.random().toString(36).slice(2, 8),
      userId: user.id,
      eventId: ev.id,
      tierId: tr.id,
      tierName: tr.name,
      quantity,
      pricePerTicket: tr.price,
      totalAmount: tr.price * quantity,
      status: 'ACTIVE',
      expiresAt,
      createdAt: new Date().toISOString(),
      eventTitle: ev.title,
      eventVenue: ev.venue,
      eventStartDate: ev.startDate,
      eventBannerUrl: ev.bannerUrl
    };
    holds.push(hold);
    setStorage(K.H, holds);
    setStorage(K.E, events);
    return hold;
  },
  async getHold(id: string): Promise<{ hold: ReservationHold; remainingSeconds: number; isExpired: boolean }> {
    sweepHolds();
    const h = holds.find(x => x.id === id);
    if (!h) throw new Error('Hold not found');
    const remainingSeconds = Math.max(0, Math.floor((new Date(h.expiresAt).getTime() - Date.now()) / 1000));
    return { hold: h, remainingSeconds, isExpired: h.status !== 'ACTIVE' || remainingSeconds <= 0 };
  },
  async releaseHold(id: string) {
    const h = holds.find(x => x.id === id);
    if (h && h.status === 'ACTIVE') {
      h.status = 'RELEASED';
      const ev = events.find(e => e.id === h.eventId);
      if (ev) {
        ev.availableSeats += h.quantity;
        const tr = ev.ticketTiers.find(t => t.id === h.tierId);
        if (tr) tr.available += h.quantity;
      }
      setStorage(K.H, holds);
      setStorage(K.E, events);
    }
  },
  async confirmBooking(params: {
    holdId?: string;
    eventId: string;
    tierId: string;
    quantity: number;
    user: User;
    paymentMethod: 'UPI' | 'CARD' | 'FREE_PASS';
    upiVpa?: string;
    cardLastFour?: string;
    attendees?: { name: string; email: string; collegeId?: string }[];
  }): Promise<Booking> {
    sweepHolds();
    let hold: ReservationHold | undefined;
    if (params.holdId) {
      hold = holds.find(h => h.id === params.holdId);
      if (!hold || hold.status !== 'ACTIVE' || new Date(hold.expiresAt).getTime() <= Date.now()) {
        throw new Error('Hold expired. Please reselect tickets.');
      }
      hold.status = 'CONVERTED';
    }

    const ev = events.find(e => e.id === params.eventId);
    if (!ev) throw new Error('Event not found');
    const tr = ev.ticketTiers.find(t => t.id === params.tierId);
    if (!tr) throw new Error('Tier not found');

    if (!hold) {
      if (tr.available < params.quantity || ev.availableSeats < params.quantity) {
        throw new Error('Sold out or insufficient tickets.');
      }
      tr.available -= params.quantity;
      ev.availableSeats -= params.quantity;
    }

    const bkgId = 'bkg-' + Math.random().toString(36).slice(2, 8);
    const bookingNumber = 'CT-2026-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    const qrToken = `CAMPUS-TIX-${bookingNumber}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const tickets: TicketItem[] = [];
    for (let i = 0; i < params.quantity; i++) {
      const att = params.attendees?.[i];
      tickets.push({
        id: 'tkt-' + Math.random().toString(36).slice(2, 8),
        bookingId: bkgId,
        tierId: tr.id,
        tierName: tr.name,
        ticketCode: 'CT-TKT-' + Math.floor(100000 + Math.random() * 900000),
        attendeeName: att?.name?.trim() || (i === 0 ? params.user.name : `Guest ${i + 1}`),
        attendeeEmail: att?.email?.trim() || params.user.email,
        collegeId: att?.collegeId?.trim() || params.user.collegeId,
        price: tr.price,
        checkedIn: false
      });
    }

    const booking: Booking = {
      id: bkgId,
      bookingNumber,
      userId: params.user.id,
      userName: params.user.name,
      userEmail: params.user.email,
      userCollegeId: params.user.collegeId,
      eventId: ev.id,
      eventTitle: ev.title,
      eventBannerUrl: ev.bannerUrl,
      eventVenue: ev.venue,
      eventStartDate: ev.startDate,
      tierId: tr.id,
      tierName: tr.name,
      quantity: params.quantity,
      totalAmount: tr.price * params.quantity,
      status: 'CONFIRMED',
      qrToken,
      createdAt: new Date().toISOString(),
      tickets,
      payment: {
        id: 'pmt-' + Math.random().toString(36).slice(2, 8),
        transactionRef: `TXN-${params.paymentMethod}-${Math.floor(10000000 + Math.random() * 90000000)}`,
        amount: tr.price * params.quantity,
        method: tr.price === 0 ? 'FREE_PASS' : params.paymentMethod,
        status: 'SUCCESS',
        upiVpa: params.upiVpa || (params.paymentMethod === 'UPI' ? 'student@campusupl' : undefined),
        cardLastFour: params.cardLastFour || (params.paymentMethod === 'CARD' ? '4242' : undefined),
        createdAt: new Date().toISOString()
      }
    };

    bookings.unshift(booking);
    setStorage(K.B, bookings);
    setStorage(K.E, events);
    setStorage(K.H, holds);
    return booking;
  },
  async getBookings(u: User): Promise<Booking[]> {
    if (u.role === 'ADMIN') return bookings;
    return bookings.filter(b => b.userId === u.id);
  },
  async getBookingById(id: string): Promise<Booking | null> {
    return bookings.find(b => b.id === id || b.bookingNumber === id) || null;
  },
  async cancelBooking(id: string, u: User): Promise<Booking> {
    const b = bookings.find(x => x.id === id || x.bookingNumber === id);
    if (!b) throw new Error('Booking not found');
    if (u.role !== 'ADMIN' && b.userId !== u.id) throw new Error('Not authorized');
    if (b.status === 'CANCELLED') throw new Error('Already cancelled');

    b.status = 'CANCELLED';
    if (b.payment) b.payment.status = 'REFUNDED';

    const ev = events.find(e => e.id === b.eventId);
    if (ev) {
      ev.availableSeats += b.quantity;
      const tr = ev.ticketTiers.find(t => t.id === b.tierId);
      if (tr) tr.available += b.quantity;
    }

    setStorage(K.B, bookings);
    setStorage(K.E, events);
    return b;
  },
  async checkInTicket(query: string) {
    const q = query.trim();
    for (const b of bookings) {
      if (b.qrToken === q || b.bookingNumber === q) {
        if (b.status === 'CANCELLED') return { valid: false, message: 'Booking CANCELLED. Entry denied.' };
        return { valid: true, booking: b, ticket: b.tickets[0], message: 'Valid Pass Verified!' };
      }
      const t = b.tickets.find(tk => tk.ticketCode === q);
      if (t) {
        if (b.status === 'CANCELLED') return { valid: false, message: 'Ticket belongs to a cancelled booking.' };
        if (t.checkedIn) {
          return { valid: true, alreadyCheckedIn: true, ticket: t, booking: b, message: 'ALREADY SCANNED previously!' };
        }
        t.checkedIn = true;
        t.checkedInAt = new Date().toISOString();
        setStorage(K.B, bookings);
        return { valid: true, alreadyCheckedIn: false, ticket: t, booking: b, message: 'Attendee Verified & Checked-In.' };
      }
    }
    return { valid: false, message: 'No ticket found with this code/token.' };
  },
  async getAdminStats(): Promise<AdminStats> {
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
    const totalRev = confirmed.reduce((s, b) => s + b.totalAmount, 0);
    const totalSold = confirmed.reduce((s, b) => s + b.quantity, 0);
    const totalCap = events.reduce((s, e) => s + e.totalCapacity, 0);
    const totalBooked = events.reduce((s, e) => s + (e.totalCapacity - e.availableSeats), 0);
    const catMap: Record<string, { count: number; revenue: number }> = {};
    for (const b of confirmed) {
      const ev = events.find(e => e.id === b.eventId);
      const cat = ev ? ev.category : 'Other';
      if (!catMap[cat]) catMap[cat] = { count: 0, revenue: 0 };
      catMap[cat].count += b.quantity;
      catMap[cat].revenue += b.totalAmount;
    }
    return {
      totalRevenue: totalRev,
      totalBookings: confirmed.length,
      totalTicketsSold: totalSold,
      activeEvents: events.filter(e => e.status === 'PUBLISHED').length,
      totalUsers: users.length,
      averageOccupancy: totalCap ? Math.round((totalBooked / totalCap) * 100) : 0,
      categoryBreakdown: Object.entries(catMap).map(([category, d]) => ({ category, count: d.count, revenue: d.revenue })),
      revenueByDate: [
        { date: 'Oct 22', amount: 2450, bookings: 6 },
        { date: 'Oct 23', amount: 3990, bookings: 9 },
        { date: 'Oct 24', amount: 4800, bookings: 12 },
        { date: 'Oct 25', amount: 6200, bookings: 15 },
        { date: 'Oct 26', amount: 5100, bookings: 11 },
        { date: 'Oct 27', amount: totalRev, bookings: confirmed.length }
      ],
      recentBookings: bookings.slice(0, 10)
    };
  },
  async getUsers(): Promise<User[]> {
    return users;
  },
  exportAttendeesCsv(): string {
    const rows = [['Booking Number', 'Event', 'Attendee', 'Email', 'College ID', 'Tier', 'Price', 'Status', 'Date']];
    for (const b of bookings) {
      for (const t of b.tickets) {
        rows.push([
          `"${b.bookingNumber}"`,
          `"${b.eventTitle.replace(/"/g, '""')}"`,
          `"${t.attendeeName.replace(/"/g, '""')}"`,
          `"${t.attendeeEmail}"`,
          `"${t.collegeId || 'N/A'}"`,
          `"${t.tierName}"`,
          `${t.price}`,
          `"${b.status}"`,
          `"${new Date(b.createdAt).toLocaleDateString()}"`
        ]);
      }
    }
    return rows.map(r => r.join(',')).join('\n');
  }
};
