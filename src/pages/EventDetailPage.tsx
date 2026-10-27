import React, { useState } from 'react';
import type { EventItem, TicketTier } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  FileText, 
  Info,
  Sparkles
} from 'lucide-react';

interface EventDetailPageProps {
  event: EventItem;
  onBack: () => void;
  onHoldCreated: (holdId: string) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onBack, onHoldCreated }) => {
  const { user } = useAuth();
  const [selectedTierId, setSelectedTierId] = useState<string>(() => {
    const availableTier = event.ticketTiers.find(t => t.available > 0);
    return availableTier ? availableTier.id : event.ticketTiers[0]?.id || '';
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [reserving, setReserving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedTier = event.ticketTiers.find(t => t.id === selectedTierId) || event.ticketTiers[0];
  const totalPrice = selectedTier ? selectedTier.price * quantity : 0;
  const isSoldOut = !selectedTier || selectedTier.available <= 0;

  const handleHoldReservation = async () => {
    if (!selectedTier) return;
    setErrorMsg(null);
    setReserving(true);

    try {
      const hold = await api.createHold(event.id, selectedTier.id, quantity, user);
      onHoldCreated(hold.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reserve tickets. Please try again.');
    } finally {
      setReserving(false);
    }
  };

  const startDateFormatted = new Date(event.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const startTimeFormatted = new Date(event.startDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      {/* Main Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-600 text-white shadow-md">
              {event.category}
            </span>
            {event.isFeatured && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Title & Metadata Strip */}
        <div className="p-6 sm:p-8 -mt-20 relative z-10 space-y-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="block font-semibold text-white">{startDateFormatted}</span>
                <span className="text-[11px] text-slate-400">{startTimeFormatted} onwards</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="block font-semibold text-white">{event.venue}</span>
                <span className="text-[11px] text-slate-400">{event.venueDetail || 'Campus Grounds'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="block font-semibold text-white">Organizer</span>
                <span className="text-[11px] text-slate-400">{event.organizerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details Left, Ticket Selector Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event Details & Rules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>About This Event</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {event.rules && (
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Guidelines & Rules of Entry</span>
              </h3>
              <div className="text-xs sm:text-sm text-slate-300 space-y-2 whitespace-pre-line bg-white/5 p-4 rounded-xl border border-white/5">
                {event.rules}
              </div>
            </div>
          )}

          <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white block">Official College Pass Guarantee</span>
              <p>
                All tickets issued on CampusTix contain a cryptographically verifiable QR token. Once reserved, your seat is guaranteed for 10 minutes to complete checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Reservation Box */}
        <div className="space-y-4">
          <div className="bg-[#131B2E] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl sticky top-24 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Select Tickets</h3>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Live Inventory
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Ticket Tier Cards */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 block">Choose Ticket Tier:</span>
              {event.ticketTiers.map(tier => {
                const isSelected = selectedTierId === tier.id;
                const soldOut = tier.available <= 0;

                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      if (!soldOut) {
                        setSelectedTierId(tier.id);
                        if (quantity > tier.available) setQuantity(tier.available);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      soldOut
                        ? 'opacity-50 bg-black/20 border-white/5 cursor-not-allowed'
                        : isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{tier.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>
                        {tier.description && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {tier.description}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-white">
                          {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {soldOut ? 'Sold Out' : `${tier.available} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            {selectedTier && !isSoldOut && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Number of Tickets:</span>
                  <span className="text-slate-500 text-[11px]">Max {selectedTier.maxPerUser} per user</span>
                </div>

                <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="font-bold text-base text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedTier.maxPerUser, selectedTier.available, quantity + 1))}
                    disabled={quantity >= Math.min(selectedTier.maxPerUser, selectedTier.available)}
                    className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Price Total */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-sm">
              <span className="text-slate-400 font-medium">Total Amount:</span>
              <span className="text-xl font-black text-white">
                {totalPrice === 0 ? 'Free Entry' : `₹${totalPrice}`}
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleHoldReservation}
              disabled={isSoldOut || reserving}
              className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                isSoldOut
                  ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:brightness-110 text-white shadow-indigo-500/25'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{reserving ? 'Locking Seats...' : isSoldOut ? 'Sold Out' : 'Reserve Tickets (10-Min Hold)'}</span>
            </button>

            <p className="text-[11px] text-center text-slate-500">
              ⚡ Seats will be held for exactly 10 minutes upon clicking reserve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
