import React, { useState, useEffect } from 'react';
import type { Booking, TicketItem } from '../types';
import { api } from '../services/api';
import { 
  ArrowLeft, 
  Printer, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  User, 
  Ticket, 
  CheckCircle2
} from 'lucide-react';

interface DigitalTicketPageProps {
  bookingId: string;
  onBack: () => void;
}

export const DigitalTicketPage: React.FC<DigitalTicketPageProps> = ({ bookingId, onBack }) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState<number>(0);

  useEffect(() => {
    api.getBookingById(bookingId).then(data => {
      setBooking(data);
    });
  }, [bookingId]);

  const activeTicket: TicketItem | undefined = booking?.tickets[selectedTicketIndex] || booking?.tickets[0];

  if (!booking || !activeTicket) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-slate-400 text-sm">
        Loading digital event ticket...
      </div>
    );
  }

  const qrPayload = `CAMPUS-TIX:${booking.bookingNumber}:${activeTicket.ticketCode}:${encodeURIComponent(activeTicket.attendeeName)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&color=0F172A&data=${encodeURIComponent(qrPayload)}`;

  const dateStr = new Date(booking.eventStartDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const timeStr = new Date(booking.eventStartDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* Multiple Passes Tabs */}
      {booking.tickets.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 mr-1">Passes:</span>
          {booking.tickets.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setSelectedTicketIndex(idx)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                selectedTicketIndex === idx
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              #{idx + 1} {t.attendeeName.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Boarding Pass / Festival Pass */}
      <div className="bg-[#111827] border border-indigo-500/30 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-pink-500 to-indigo-500 animate-pulse" />

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                  Official Campus Entry Pass
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {booking.eventTitle}
                </h2>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ticket Tier</span>
              <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold mt-0.5">
                {activeTicket.tierName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Attendee Name</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    {activeTicket.attendeeName}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">College ID / Roll No</span>
                  <span className="text-sm font-bold text-white">
                    {activeTicket.collegeId || 'General Pass'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Date & Time</span>
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {dateStr} • {timeStr}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Venue</span>
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {booking.eventVenue}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Booking Number</span>
                  <span className="font-mono text-xs font-bold text-indigo-300">
                    {booking.bookingNumber}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Ticket Code</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {activeTicket.ticketCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {activeTicket.checkedIn ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Checked-In / Scanned
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active / Ready for Entry
                  </span>
                )}
                <span className="text-[11px] text-slate-400">
                  {booking.status === 'CONFIRMED' ? 'Paid & Verified' : booking.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-indigo-400/40 shadow-inner text-slate-900">
              <img 
                src={qrUrl} 
                alt="Entry QR Code" 
                className="w-44 h-44 object-contain"
              />
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-600 mt-1 uppercase">
                Scan for Wristband
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographic Token: {booking.qrToken.slice(0, 22)}...</span>
            </div>
            <div>
              Present at Gate Security with Valid College ID
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
