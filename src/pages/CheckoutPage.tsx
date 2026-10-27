import React, { useState, useEffect } from 'react';
import type { ReservationHold, Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Clock, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

interface CheckoutPageProps {
  holdId: string;
  onBookingComplete: (bookingId: string) => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ holdId, onBookingComplete, onBack }) => {
  const { user } = useAuth();
  const [hold, setHold] = useState<ReservationHold | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(600);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Attendees list state
  const [attendees, setAttendees] = useState<{ name: string; email: string; collegeId: string }[]>([]);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'FREE_PASS'>('UPI');
  const [upiVpa, setUpiVpa] = useState<string>(`${user.email.split('@')[0]}@okaxis`);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvv: '888',
    cardName: user.name
  });

  // Load Hold & Start Countdown
  useEffect(() => {
    let timer: any;

    const fetchHold = async () => {
      try {
        const data = await api.getHold(holdId);
        setHold(data.hold);
        setSecondsLeft(data.remainingSeconds);
        setIsExpired(data.isExpired);

        // Pre-fill attendee 1 with user details
        const attList = [];
        for (let i = 0; i < data.hold.quantity; i++) {
          attList.push({
            name: i === 0 ? user.name : '',
            email: i === 0 ? user.email : '',
            collegeId: i === 0 ? (user.collegeId || '') : ''
          });
        }
        setAttendees(attList);

        if (data.hold.pricePerTicket === 0) {
          setPaymentMethod('FREE_PASS');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Hold not found or expired.');
        setIsExpired(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHold();

    timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [holdId, user]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hold || isExpired) return;

    setErrorMsg(null);
    setProcessing(true);

    try {
      const booking = await api.confirmBooking({
        holdId: hold.id,
        eventId: hold.eventId,
        tierId: hold.tierId,
        quantity: hold.quantity,
        user,
        paymentMethod,
        upiVpa: paymentMethod === 'UPI' ? upiVpa : undefined,
        cardLastFour: paymentMethod === 'CARD' ? '4242' : undefined,
        attendees
      });

      onBookingComplete(booking.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment simulation failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Securing your reservation hold...</p>
      </div>
    );
  }

  if (isExpired || !hold) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Reservation Hold Expired</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Your 10-minute hold window for these seats has passed. Seats have been automatically released back to the event pool.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all"
        >
          Return & Select Tickets
        </button>
      </div>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = secondsLeft < 120;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Event</span>
      </button>

      {/* 10-Minute Hold Live Countdown Header */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl ${
        isUrgent ? 'bg-rose-950/50 border-rose-500/40' : 'bg-indigo-950/40 border-indigo-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Seats Held For Checkout</h3>
            <p className="text-xs text-slate-400">
              Reserved: {hold.quantity}x {hold.tierName} for <span className="text-slate-200 font-medium">{hold.eventTitle}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10 font-mono">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-indigo-400'}`} />
          <span className={`text-base font-bold ${isUrgent ? 'text-rose-300' : 'text-indigo-200'}`}>
            {timeFormatted}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Attendee Details + Payment Selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendees Details */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Attendee Information ({hold.quantity} Pass{hold.quantity > 1 ? 'es' : ''})</span>
            </h3>

            <div className="space-y-4">
              {attendees.map((att, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-indigo-300 block">
                    Attendee #{idx + 1} {idx === 0 && '(Primary Contact)'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={att.name}
                        onChange={(e) => {
                          const updated = [...attendees];
                          updated[idx].name = e.target.value;
                          setAttendees(updated);
                        }}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">College Email *</label>
                      <input
                        type="email"
                        required
                        value={att.email}
                        onChange={(e) => {
                          const updated = [...attendees];
                          updated[idx].email = e.target.value;
                          setAttendees(updated);
                        }}
                        placeholder="e.g. student@college.edu"
                        className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1">Roll / Registration Number (Optional)</label>
                      <input
                        type="text"
                        value={att.collegeId}
                        onChange={(e) => {
                          const updated = [...attendees];
                          updated[idx].collegeId = e.target.value;
                          setAttendees(updated);
                        }}
                        placeholder="e.g. 22BCE1042"
                        className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector (Only if paid event) */}
          {hold.totalAmount > 0 ? (
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span>Demo Payment Method</span>
                </h3>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Sandbox Simulation
                </span>
              </div>

              {/* Method Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'UPI' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / QR Simulation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'CARD' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Demo Card</span>
                </button>
              </div>

              {/* UPI Tab */}
              {paymentMethod === 'UPI' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Demo Virtual Payment Address</span>
                      <span className="font-mono font-bold text-white">{upiVpa}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setUpiVpa('student@okhdfcbank')}
                        className="text-[10px] px-2 py-1 bg-white/10 rounded text-slate-300 hover:text-white"
                      >
                        GPay
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiVpa('campus@ybl')}
                        className="text-[10px] px-2 py-1 bg-white/10 rounded text-slate-300 hover:text-white"
                      >
                        PhonePe
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {paymentMethod === 'CARD' && (
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Demo Card Number (Auto-filled)</label>
                    <input
                      type="text"
                      readOnly
                      value={cardDetails.cardNumber}
                      className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 font-mono text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Expiry</label>
                      <input
                        type="text"
                        readOnly
                        value={cardDetails.cardExpiry}
                        className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">CVV</label>
                      <input
                        type="text"
                        readOnly
                        value={cardDetails.cardCvv}
                        className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 italic">
                * Zero real card details are collected. Transactions complete inside a demo simulation sandbox.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>This is a Free Campus Pass. No payment required.</span>
            </div>
          )}
        </div>

        {/* Right: Order Summary Box */}
        <div className="space-y-4">
          <div className="bg-[#131B2E] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Event:</span>
                <span className="font-semibold text-white text-right max-w-[160px] truncate">{hold.eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>Tier:</span>
                <span className="font-semibold text-white">{hold.tierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-semibold text-white">{hold.quantity} ticket{hold.quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per ticket:</span>
                <span>{hold.pricePerTicket === 0 ? 'Free' : `₹${hold.pricePerTicket}`}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Campus Tech Fee:</span>
                <span>₹0 (Waived)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm font-bold text-white">Grand Total:</span>
              <span className="text-xl font-black text-white">
                {hold.totalAmount === 0 ? 'Free' : `₹${hold.totalAmount}`}
              </span>
            </div>

            <button
              type="submit"
              disabled={processing || isExpired}
              className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                processing
                  ? 'bg-white/10 text-slate-400 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:brightness-110 text-white shadow-emerald-600/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{processing ? 'Generating Passes...' : hold.totalAmount === 0 ? 'Confirm Free Reservation' : `Pay ₹${hold.totalAmount} & Confirm`}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant Atomic Booking Confirmation</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
