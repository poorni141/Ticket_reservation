import React, { useState } from 'react';
import type { EventItem } from '../types';
import { EventCard } from '../components/EventCard';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  QrCode, 
  ArrowRight, 
  TrendingUp,
  Award
} from 'lucide-react';

interface HomePageProps {
  events: EventItem[];
  onSelectEvent: (id: string) => void;
  onNavigate: (page: string, param?: string) => void;
}

const CATEGORIES = [
  'All',
  'Culturals',
  'Symposium',
  'Hackathon',
  'Music & Concert',
  'Dance',
  'Sports',
  'Workshops'
];

export const HomePage: React.FC<HomePageProps> = ({ events, onSelectEvent, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const featuredEvents = events.filter(e => e.isFeatured);
  
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E1B4B]/60 via-[#0F172A] to-[#0B0F19] border border-white/10 mt-4 shadow-2xl">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Campus Event Pass Management Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Reserve College Fest & Tech Passes{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
              Without The Chaos.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Instant ticket holds with 10-minute anti-overselling lock, demo UPI checkout, and tamper-proof digital QR passes for student festivals, symposiums, and hackathons.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto bg-[#131B2E]/90 border border-white/15 p-2 rounded-2xl shadow-xl backdrop-blur-md flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Search cultural fests, hackathons, music pro-nites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none py-2"
              />
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Live Metrics Ticker */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10 text-center">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-white">12,400+</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Campus Attendees</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-indigo-400">10-Min</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Guaranteed Hold Lock</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-fuchsia-400">100%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Scannable QR Entry</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">0 Over-Sale</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Atomic Inventory</div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Handpicked Campus Highlights</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">Featured Flagship Events</h2>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 3).map(event => (
              <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
            ))}
          </div>
        </section>
      )}

      {/* All Events Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Upcoming On Campus</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">Explore All College Events</h2>
          </div>

          <div className="text-xs text-slate-400">
            Showing {filteredEvents.length} events
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-[#111827]/60 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">No events found matching your filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 px-4 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
            ))}
          </div>
        )}
      </section>

      {/* How CampusTix Works */}
      <section className="bg-gradient-to-r from-[#131B2E] to-[#1E1B4B]/50 border border-white/10 rounded-3xl p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Streamlined College Ticketing</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">How CampusTix Protects Your Seat</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#0B0F19]/80 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Select Your Tier</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick from General Entry, VIP passes, or Free Student delegate badges based on event availability.
            </p>
          </div>

          <div className="bg-[#0B0F19]/80 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">10-Min Hold Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your seats are atomically reserved for 10 minutes. No one else can claim them while you enter details.
            </p>
          </div>

          <div className="bg-[#0B0F19]/80 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Demo Checkout</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate instant payment via Demo UPI or Card test sandbox. Zero actual credit card data is ever collected.
            </p>
          </div>

          <div className="bg-[#0B0F19]/80 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Digital QR Ticket</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive a verifiable QR pass with unique booking ID. Show at the festival gate for wristband check-in.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
