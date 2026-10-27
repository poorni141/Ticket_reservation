import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Ticket, Lock, Mail, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onGoRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoRegister }) => {
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'STUDENT' | 'ORGANIZER' | 'ADMIN') => {
    switchRole(role);
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
          <Ticket className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Sign In to CampusTix</h1>
        <p className="text-xs text-slate-400">
          Access your digital fest passes, seat reservations, and collegiate event rosters.
        </p>
      </div>

      {/* 1-Click Fast Fill Demo Accounts */}
      <div className="bg-[#131B2E] border border-indigo-500/30 rounded-2xl p-4 space-y-2 shadow-xl">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
          ⚡ 1-Click Demo Profiles
        </span>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemo('STUDENT')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left border border-white/5 text-slate-200"
          >
            <div>
              <span className="font-semibold block text-white">Student (Aarav Sharma)</span>
              <span className="text-[10px] text-slate-400 font-mono">student@campustix.edu</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Student
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('ORGANIZER')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left border border-white/5 text-slate-200"
          >
            <div>
              <span className="font-semibold block text-white">Organizer (Prof. Sneha)</span>
              <span className="text-[10px] text-slate-400 font-mono">organizer@campustix.edu</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              Organizer
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('ADMIN')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left border border-white/5 text-slate-200"
          >
            <div>
              <span className="font-semibold block text-white">Dean / Admin (Full Access)</span>
              <span className="text-[10px] text-slate-400 font-mono">admin@campustix.edu</span>
            </div>
            <span className="text-[10px] font-bold text-fuchsia-400 px-2 py-0.5 rounded bg-fuchsia-500/10 border border-fuchsia-500/20">
              Admin
            </span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-400">Campus Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@campustix.edu"
              className="w-full bg-[#1A2234] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-400">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A2234] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onGoRegister}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Need an account? Register new student profile
          </button>
        </div>
      </form>
    </div>
  );
};
