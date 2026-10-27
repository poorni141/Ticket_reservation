import React, { useState } from 'react';
import type { EventItem } from '../types';
import { EventCard } from '../components/EventCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface EventsPageProps {
  events: EventItem[];
  onSelectEvent: (id: string) => void;
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

export const EventsPage: React.FC<EventsPageProps> = ({ events, onSelectEvent }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price-asc' | 'price-desc' | 'availability'>('date');

  let filtered = events.filter(e => {
    const q = search.toLowerCase();
    const matchesSearch = e.title.toLowerCase().includes(q) ||
                          e.description.toLowerCase().includes(q) ||
                          e.venue.toLowerCase().includes(q);
    const matchesCat = category === 'All' || e.category.toLowerCase() === category.toLowerCase();
    
    let matchesPrice = true;
    if (priceFilter === 'free') {
      matchesPrice = e.ticketTiers.some(t => t.price === 0);
    } else if (priceFilter === 'paid') {
      matchesPrice = e.ticketTiers.some(t => t.price > 0);
    }

    return matchesSearch && matchesCat && matchesPrice;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    const aMin = Math.min(...a.ticketTiers.map(t => t.price));
    const bMin = Math.min(...b.ticketTiers.map(t => t.price));
    if (sortBy === 'price-asc') return aMin - bMin;
    if (sortBy === 'price-desc') return bMin - aMin;
    if (sortBy === 'availability') return b.availableSeats - a.availableSeats;
    return 0;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">College Events & Festivals</h1>
        <p className="text-sm text-slate-400 mt-1">
          Browse upcoming campus competitions, technical symposiums, hackathons, and cultural pro-nites.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event title, venue, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A2234] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#1A2234] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="date">Date: Upcoming First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="availability">Seats: Most Available</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Price Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Category:</span>
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  category === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price Selector (All, Free, Paid) */}
          <div className="flex items-center gap-1 self-start sm:self-auto bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                priceFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setPriceFilter('free')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                priceFilter === 'free' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setPriceFilter('paid')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                priceFilter === 'paid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Paid
            </button>
          </div>
        </div>
      </div>

      {/* Events Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Found {filtered.length} matching events</span>
        {(search || category !== 'All' || priceFilter !== 'all') && (
          <button
            onClick={() => { setSearch(''); setCategory('All'); setPriceFilter('all'); }}
            className="text-indigo-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#111827]/50 rounded-2xl border border-white/10">
          <p className="text-slate-300 text-sm font-semibold">No events match your current criteria.</p>
          <p className="text-slate-500 text-xs mt-1">Try broadening your search keyword or switching categories.</p>
          <button
            onClick={() => { setSearch(''); setCategory('All'); setPriceFilter('all'); }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(event => (
            <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
          ))}
        </div>
      )}
    </div>
  );
};
