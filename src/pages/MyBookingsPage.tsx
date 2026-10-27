import React, { useState, useEffect } from 'react';
import type { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  QrCode, 
  XCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight 
} from 'lucide-react';

interface MyBookingsPageProps {
  onViewTicket: (bookingId: string) => void;
  onExploreEvents: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ onViewTicket, onExploreEvents }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  
  // Cancel modal state
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadBookings = async () => {
    try {
      const data = await api.getBookings(user);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;
    setActionLoading(true);
    setActionMsg(null);

    try {
      await api.cancelBooking(cancellingBooking.id, user);
      setActionMsg({ text: 'Booking successfully cancelled and seats returned to inventory.', type: 'success' });
      setCancellingBooking(null);
      await loadBookings();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to cancel booking.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'CONFIRMED') return b.status === 'CONFIRMED';
    if (filter === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Reserved Passes</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your digital tickets, scan QR passes at entry gates, or cancel reservations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('CONFIRMED')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'CONFIRMED' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('CANCELLED')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'CANCELLED' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
          actionMsg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading your bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-[#111827]/60 rounded-3xl border border-white/10 p-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No passes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don't have any event reservations under this view. Browse upcoming college festivals to reserve passes.
          </p>
          <button
            onClick={onExploreEvents}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            Explore Events
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => {
            const isCancelled = booking.status === 'CANCELLED';
            const dateStr = new Date(booking.eventStartDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={booking.id}
                className={`bg-[#111827] border rounded-2xl p-5 sm:p-6 transition-all ${
                  isCancelled ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-indigo-500/40'
                } shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5`}
              >
                {/* Event Thumb & Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={booking.eventBannerUrl}
                      alt={booking.eventTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                        {booking.bookingNumber}
                      </span>
                      {isCancelled ? (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                          Cancelled & Released
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Active Pass
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-1">
                      {booking.eventTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {dateStr}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        {booking.eventVenue}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 pt-1">
                      <span className="font-semibold text-white">{booking.quantity}x {booking.tierName}</span>
                      <span className="text-slate-500 mx-1.5">•</span>
                      <span>Total: {booking.totalAmount === 0 ? 'Free' : `₹${booking.totalAmount}`}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                  <button
                    onClick={() => onViewTicket(booking.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View Pass</span>
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => setCancellingBooking(booking)}
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-white/15 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Cancel Event Booking?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cancelling will permanently void your digital QR ticket for <strong className="text-white">{cancellingBooking.eventTitle}</strong>. 
                The {cancellingBooking.quantity} seat(s) will be atomically released back to other students.
              </p>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-slate-300 flex justify-between">
              <span>Booking Number:</span>
              <span className="font-mono font-bold text-white">{cancellingBooking.bookingNumber}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10"
              >
                Keep Booking
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleCancelConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                <span>{actionLoading ? 'Releasing Seats...' : 'Confirm Cancellation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
