import React from 'react';
import type { EventItem } from '../types';
import { Calendar, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onSelect: (eventId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Culturals: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Symposium: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Hackathon: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'Music & Concert': 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  Dance: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Sports: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  Workshops: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
};

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const minPrice = Math.min(...event.ticketTiers.map(t => t.price));
  const isFree = minPrice === 0;
  const bookedCount = event.totalCapacity - event.availableSeats;
  const occupancyPercent = Math.min(100, Math.round((bookedCount / event.totalCapacity) * 100));
  const isAlmostFull = event.availableSeats <= 30 && event.availableSeats > 0;
  const isSoldOut = event.availableSeats <= 0;

  const dateStr = new Date(event.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const catBadge = CATEGORY_COLORS[event.category] || 'bg-slate-500/20 text-slate-300 border-slate-500/40';

  return (
    <div 
      onClick={() => onSelect(event.id)}
      className="group bg-[#111827]/80 hover:bg-[#161F33] border border-white/10 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img 
          src={event.bannerUrl} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/30" />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${catBadge}`}>
            {event.category}
          </span>
        </div>

        {/* Featured Tag */}
        {event.isFeatured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Featured</span>
          </div>
        )}

        {/* Date Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 font-medium bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          <p className="mt-2.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-white/5 space-y-3">
          {/* Inventory / Seat Meter */}
          <div>
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-500" />
                <span>{isSoldOut ? 'Sold Out' : `${event.availableSeats} seats left`}</span>
              </span>
              {isAlmostFull && (
                <span className="text-amber-400 font-semibold animate-pulse">Selling Fast!</span>
              )}
              {!isAlmostFull && !isSoldOut && (
                <span className="text-slate-500">{occupancyPercent}% Booked</span>
              )}
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isSoldOut 
                    ? 'bg-rose-500' 
                    : isAlmostFull 
                    ? 'bg-amber-500' 
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Entry</span>
              <span className="text-sm font-extrabold text-white">
                {isFree ? (
                  <span className="text-emerald-400">Free Pass</span>
                ) : (
                  <span>From ₹{minPrice}</span>
                )}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(event.id);
              }}
              disabled={isSoldOut}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSoldOut
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              <span>{isSoldOut ? 'Sold Out' : 'Book Tickets'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
