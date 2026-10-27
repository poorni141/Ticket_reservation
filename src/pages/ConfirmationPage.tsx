import React, { useEffect, useState } from 'react';
import type { Booking } from '../types';
import { api } from '../services/api';
import { 
  CheckCircle, 
  QrCode, 
  Calendar, 
  MapPin, 
  Ticket, 
  ArrowRight, 
  Download,
  Share2
} from 'lucide-react';

interface ConfirmationPageProps {
  bookingId: string;
  onViewTicket: (bookingId: string) => void;
  onGoHome: () => void;
  onGoBookings: () => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ 
  bookingId, 
  onViewTicket, 
  onGoHome, 
  onGoBookings 
}) => {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    api.getBookingById(bookingId).then(setBooking);
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-slate-400 text-sm">
        Loading confirmation details...
      </div>
    );
  }

  const dateStr = new Date(booking.eventStartDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      {/* Success Hero */}
      <div className="bg-[#111827] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
            Booking Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            You're Going to {booking.eventTitle}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Your seats have been permanently confirmed in the campus roster. Your digital QR pass is ready for check-in.
          </p>
        </div>

        {/* Booking Reference Pill */}
        <div className="inline-block bg-black/50 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Booking Ref: </span>
          <span className="font-bold text-white tracking-wider">{booking.bookingNumber}</span>
        </div>
      </div>

      {/* Booking Summary Card */}
      <div className="bg-[#131B2E] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-2">
          Pass Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 block">Event & Venue:</span>
            <span className="font-bold text-white text-sm block">{booking.eventTitle}</span>
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              {booking.eventVenue}
            </span>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-slate-400 block">Date:</span>
            <span className="font-bold text-white flex items-center sm:justify-end gap-1">
              <Calendar className="w-3 h-3 text-indigo-400" />
              {dateStr}
            </span>
            <span className="text-slate-400 block">
              {booking.quantity}x {booking.tierName}
            </span>
          </div>
        </div>

        {/* Individual Attendees */}
        <div className="pt-3 border-t border-white/5 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 block">Registered Passes:</span>
          <div className="space-y-1.5">
            {booking.tickets.map(t => (
              <div key={t.id} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-white">{t.attendeeName}</span>
                  {t.collegeId && <span className="text-[11px] text-slate-400">({t.collegeId})</span>}
                </div>
                <span className="font-mono text-indigo-300 font-bold">{t.ticketCode}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onViewTicket(booking.id)}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          <span>View Digital QR Pass</span>
        </button>

        <button
          onClick={onGoBookings}
          className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <span>My Bookings</span>
        </button>

        <button
          onClick={onGoHome}
          className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <span>Browse More</span>
        </button>
      </div>
    </div>
  );
};
