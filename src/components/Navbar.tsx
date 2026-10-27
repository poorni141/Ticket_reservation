import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Ticket, Calendar, BookmarkCheck, ShieldCheck, QrCode, Menu, X, Sparkles } from 'lucide-react';
import type { UserRole } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, role, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'bookings', label: 'My Bookings', icon: BookmarkCheck }
  ];

  if (role === 'ORGANIZER' || role === 'ADMIN') {
    navLinks.push({ id: 'organizer', label: 'Organizer Portal', icon: QrCode });
  }

  if (role === 'ADMIN') {
    navLinks.push({ id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck });
  }

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const roles: { key: UserRole; label: string; color: string }[] = [
    { key: 'STUDENT', label: 'Student', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { key: 'ORGANIZER', label: 'Organizer', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { key: 'ADMIN', label: 'Admin', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30' }
  ];

  const currentRoleObj = roles.find(r => r.key === role) || roles[0];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div onClick={() => handleNav('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                CampusTix
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/40">
                Official
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${currentRoleObj.color} hover:brightness-110`}
                title="Switch role"
              >
                <span>Role: {currentRoleObj.label}</span>
                <span className="text-[10px] opacity-70">▼</span>
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-[#131B2E] border border-white/15 rounded-xl shadow-2xl p-1.5 z-50"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1">Role Preview</div>
                  {roles.map(r => (
                    <button
                      key={r.key}
                      onClick={() => {
                        switchRole(r.key);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between ${
                        role === r.key ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{r.label}</span>
                      {role === r.key && <span className="text-[10px] font-bold">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div 
              onClick={() => handleNav('login')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-200 cursor-pointer hover:bg-white/10"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-xs border border-indigo-400/30">
                {user.name.charAt(0)}
              </div>
              <span className="font-medium max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => switchRole(role === 'STUDENT' ? 'ORGANIZER' : role === 'ORGANIZER' ? 'ADMIN' : 'STUDENT')}
              className={`text-[10px] font-semibold px-2 py-1 rounded border ${currentRoleObj.color}`}
            >
              {currentRoleObj.label}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-white/10 px-4 pt-3 pb-5 space-y-2">
          <div className="text-xs font-semibold text-slate-400 px-2 pb-1 border-b border-white/5 flex items-center justify-between">
            <span>Signed in as {user.name}</span>
            <span className="text-[10px] text-indigo-400 uppercase font-bold">{role}</span>
          </div>
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-600/30 text-white border border-indigo-500/40' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
