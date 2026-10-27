import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, XCircle } from 'lucide-react';
import type { ReservationHold } from '../types';
import { api } from '../services/api';

interface HoldCountdownProps {
  hold: ReservationHold | null;
  onProceedToCheckout: (holdId: string) => void;
  onHoldExpired: () => void;
}

export const HoldCountdown: React.FC<HoldCountdownProps> = ({ hold, onProceedToCheckout, onHoldExpired }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!hold) return;

    const updateTime = () => {
      const now = Date.now();
      const expires = new Date(hold.expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expires - now) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        onHoldExpired();
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [hold, onHoldExpired]);

  if (!hold || secondsLeft <= 0) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = secondsLeft < 120; // under 2 minutes

  const handleRelease = async () => {
    await api.releaseHold(hold.id);
    onHoldExpired();
  };

  return (
    <div className={`sticky top-16 z-40 border-b backdrop-blur-md px-4 py-2.5 transition-colors ${
      isUrgent 
        ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 animate-pulse' 
        : 'bg-indigo-950/90 border-indigo-500/30 text-indigo-100'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400' : 'text-indigo-400'}`} />
          <span>
            <strong>10-Minute Hold Active:</strong> {hold.quantity}x {hold.tierName} for <span className="underline">{hold.eventTitle}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono font-bold text-sm bg-black/40 px-2.5 py-0.5 rounded border border-white/10">
            <span>{timeFormatted}</span>
          </div>

          <button
            onClick={() => onProceedToCheckout(hold.id)}
            className="flex items-center gap-1 px-3 py-1 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
          >
            <span>Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRelease}
            title="Cancel hold and release seats"
            className="text-slate-400 hover:text-white p-1"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
