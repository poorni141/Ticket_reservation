import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Ticket, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import type { UserRole } from '../types';

interface RegisterPageProps {
  onSuccess: () => void;
  onGoLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onGoLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ name, email, collegeId, role });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
          <Ticket className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Create Campus Account</h1>
        <p className="text-xs text-slate-400">
          Register with your college credentials to reserve festival passes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block font-semibold text-slate-400">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full bg-[#1A2234] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block font-semibold text-slate-400">Campus Email *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@college.edu"
              className="w-full bg-[#1A2234] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block font-semibold text-slate-400">Roll / Registration Number *</label>
          <input
            type="text"
            required
            value={collegeId}
            onChange={(e) => setCollegeId(e.target.value)}
            placeholder="e.g. 22BCE1042"
            className="w-full bg-[#1A2234] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-semibold text-slate-400">Account Type</label>
          <select
            value={role}
            onChange={(e: any) => setRole(e.target.value)}
            className="w-full bg-[#1A2234] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="STUDENT">Student Delegate</option>
            <option value="ORGANIZER">Event Organizer / Faculty</option>
            <option value="ADMIN">Dean / Affairs Admin</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-semibold text-slate-400">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A2234] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{loading ? 'Registering...' : 'Register Account'}</span>
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onGoLogin}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Already registered? Back to Sign In
          </button>
        </div>
      </form>
    </div>
  );
};
