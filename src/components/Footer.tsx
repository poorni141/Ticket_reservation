import React from 'react';
import { Ticket, ShieldCheck } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#070A12] border-t border-white/10 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Ticket className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">CampusTix</span>
          </div>
          <p className="text-xs text-slate-400">
            Unified college event ticketing platform with atomic inventory and 10-minute hold reservation.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Anti-Overselling Engine</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('events')} className="hover:text-indigo-400">Culturals & Pro-Nites</button></li>
            <li><button onClick={() => onNavigate('events')} className="hover:text-indigo-400">Tech Symposiums</button></li>
            <li><button onClick={() => onNavigate('events')} className="hover:text-indigo-400">Hackathons</button></li>
            <li><button onClick={() => onNavigate('events')} className="hover:text-indigo-400">Dance & Sports Meets</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Student Portal</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('bookings')} className="hover:text-indigo-400">My Bookings</button></li>
            <li><button onClick={() => onNavigate('events')} className="hover:text-indigo-400">Browse Events</button></li>
            <li><button onClick={() => onNavigate('login')} className="hover:text-indigo-400">Credentials & Roles</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Demo Sandbox</h4>
          <p className="text-[11px] text-slate-400 leading-normal bg-white/5 p-3 rounded-lg border border-white/10">
            CampusTix operates in demonstration mode for college festivals. No actual card or banking information is collected.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 text-xs text-slate-500 text-center">
        © {new Date().getFullYear()} CampusTix. Engineered for collegiate festivals and student clubs.
      </div>
    </footer>
  );
};
