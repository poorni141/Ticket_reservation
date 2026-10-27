import React from 'react';
import { Ticket, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
        <Ticket className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white">404</h1>
      <h2 className="text-xl font-bold text-slate-200">Event or Page Not Found</h2>
      <p className="text-xs text-slate-400 leading-relaxed">
        The requested festival schedule or ticket reservation link does not exist or may have been archived.
      </p>
      <button
        onClick={onGoHome}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Campus Events</span>
      </button>
    </div>
  );
};
