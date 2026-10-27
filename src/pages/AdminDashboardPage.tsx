import React, { useState, useEffect } from 'react';
import type { EventItem, Booking, User, AdminStats, TicketTier } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  ShieldCheck, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'attendees' | 'users'>('overview');
  
  // Event modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Culturals',
    venue: '',
    venueDetail: '',
    startDate: '',
    endDate: '',
    bannerUrl: '',
    description: '',
    rules: '',
    isFeatured: false,
    tiers: [
      { name: 'General Entry', price: 199, capacity: 200, maxPerUser: 4, description: 'Standard admission pass' }
    ]
  });

  const loadAll = async () => {
    const [st, evts, usrs] = await Promise.all([
      api.getAdminStats(),
      api.getEvents(),
      api.getUsers()
    ]);
    setStats(st);
    setEvents(evts);
    setUsersList(usrs);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleOpenCreate = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      category: 'Culturals',
      venue: '',
      venueDetail: '',
      startDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 86400000 + 4 * 3600000).toISOString().slice(0, 16),
      bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      description: '',
      rules: 'Valid college ID required for campus entry.',
      isFeatured: false,
      tiers: [
        { name: 'General Entry', price: 199, capacity: 200, maxPerUser: 4, description: 'Standard admission pass' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: EventItem) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      category: ev.category,
      venue: ev.venue,
      venueDetail: ev.venueDetail || '',
      startDate: new Date(ev.startDate).toISOString().slice(0, 16),
      endDate: new Date(ev.endDate).toISOString().slice(0, 16),
      bannerUrl: ev.bannerUrl,
      description: ev.description,
      rules: ev.rules || '',
      isFeatured: ev.isFeatured,
      tiers: ev.ticketTiers.map(t => ({
        name: t.name,
        price: t.price,
        capacity: t.capacity,
        maxPerUser: t.maxPerUser,
        description: t.description || ''
      }))
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        await api.updateEvent(editingEventId, {
          title: eventForm.title,
          category: eventForm.category as any,
          venue: eventForm.venue,
          venueDetail: eventForm.venueDetail,
          startDate: new Date(eventForm.startDate).toISOString(),
          endDate: new Date(eventForm.endDate).toISOString(),
          bannerUrl: eventForm.bannerUrl,
          description: eventForm.description,
          rules: eventForm.rules,
          isFeatured: eventForm.isFeatured
        });
      } else {
        await api.createEvent({
          title: eventForm.title,
          category: eventForm.category as any,
          venue: eventForm.venue,
          venueDetail: eventForm.venueDetail,
          startDate: new Date(eventForm.startDate).toISOString(),
          endDate: new Date(eventForm.endDate).toISOString(),
          bannerUrl: eventForm.bannerUrl,
          description: eventForm.description,
          rules: eventForm.rules,
          isFeatured: eventForm.isFeatured,
          ticketTiers: eventForm.tiers as any
        }, user);
      }
      setIsModalOpen(false);
      await loadAll();
    } catch (err: any) {
      alert(err.message || 'Error saving event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      await api.deleteEvent(id);
      await loadAll();
    }
  };

  const handleExportCsv = () => {
    const csvContent = api.exportAttendeesCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'campustix-attendees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-fuchsia-400">
            Dean & Student Affairs Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            CampusTix Admin Console
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview & Analytics
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'events' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Manage Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('attendees')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'attendees' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Bookings & Transactions ({stats?.totalBookings || 0})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Campus Users ({usersList.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block">Total Revenue</span>
              <div className="text-2xl font-black text-white">₹{stats.totalRevenue.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-400 font-semibold">+18% this fest cycle</span>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block">Tickets Reserved</span>
              <div className="text-2xl font-black text-indigo-400">{stats.totalTicketsSold}</div>
              <span className="text-[10px] text-slate-400 font-semibold">{stats.totalBookings} orders</span>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block">Average Occupancy</span>
              <div className="text-2xl font-black text-fuchsia-400">{stats.averageOccupancy}%</div>
              <span className="text-[10px] text-slate-400 font-semibold">Across all active tiers</span>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block">Active Campus Events</span>
              <div className="text-2xl font-black text-emerald-400">{stats.activeEvents}</div>
              <span className="text-[10px] text-slate-400 font-semibold">{stats.totalUsers} registered students</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend SVG Chart */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">7-Day Ticket Revenue (INR)</h3>
                  <p className="text-[11px] text-slate-400">Daily ticket booking inflow</p>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Visual SVG Bar Graph */}
              <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2">
                {stats.revenueByDate.map((item, idx) => {
                  const maxAmt = Math.max(...stats.revenueByDate.map(d => d.amount), 6000);
                  const heightPercent = Math.max(15, Math.round((item.amount / maxAmt) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        ₹{item.amount}
                      </div>
                      <div 
                        className="w-full bg-indigo-600/60 hover:bg-indigo-500 rounded-t-lg transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Sales Distribution */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Event Category Breakdown</h3>
                  <p className="text-[11px] text-slate-400">Passes reserved by festival category</p>
                </div>
                <BarChart3 className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="space-y-3 pt-2">
                {stats.categoryBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No categories recorded yet.</p>
                ) : (
                  stats.categoryBreakdown.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">{cat.category}</span>
                        <span className="text-slate-400 font-mono">
                          {cat.count} tickets • ₹{cat.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full"
                          style={{ width: `${Math.min(100, cat.count * 20)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE EVENTS */}
      {activeTab === 'events' && (
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">All Scheduled Events</h3>
            <span className="text-xs text-slate-400">{events.length} total events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="p-3">Event</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Venue</th>
                  <th className="p-3">Capacity & Availability</th>
                  <th className="p-3">Starting Price</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {events.map(ev => {
                  const minPrice = Math.min(...ev.ticketTiers.map(t => t.price));
                  return (
                    <tr key={ev.id} className="hover:bg-white/5">
                      <td className="p-3 font-semibold text-white">
                        {ev.title}
                        {ev.isFeatured && (
                          <span className="ml-2 px-1.5 py-0.5 text-[9px] bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {ev.category}
                        </span>
                      </td>
                      <td className="p-3 max-w-[150px] truncate">{ev.venue}</td>
                      <td className="p-3 font-mono">
                        {ev.availableSeats} / {ev.totalCapacity} left
                      </td>
                      <td className="p-3 font-bold text-white">
                        {minPrice === 0 ? 'Free' : `₹${minPrice}`}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-slate-300 hover:text-white"
                          title="Edit Event"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded text-rose-400 hover:text-rose-300"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS & TRANSACTIONS */}
      {activeTab === 'attendees' && stats && (
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white">Bookings & Ticket Orders</h3>
              <p className="text-xs text-slate-400">Atomic inventory audit trail</p>
            </div>
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="p-3">Booking #</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">Qty & Tier</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {stats.recentBookings.map(b => (
                  <tr key={b.id} className="hover:bg-white/5">
                    <td className="p-3 font-mono font-bold text-indigo-400">{b.bookingNumber}</td>
                    <td className="p-3 font-semibold text-white">
                      {b.userName}
                      <span className="block text-[10px] text-slate-500 font-normal">{b.userEmail}</span>
                    </td>
                    <td className="p-3 max-w-[160px] truncate">{b.eventTitle}</td>
                    <td className="p-3">
                      {b.quantity}x {b.tierName}
                    </td>
                    <td className="p-3 font-bold text-white">
                      {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}
                    </td>
                    <td className="p-3">
                      {b.status === 'CONFIRMED' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Confirmed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Registered Campus Accounts</h3>
            <span className="text-xs text-slate-400">{usersList.length} accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Roll / College ID</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">{u.name}</td>
                    <td className="p-3 font-mono">{u.email}</td>
                    <td className="p-3 font-mono">{u.collegeId || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        u.role === 'ADMIN' ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40' :
                        u.role === 'ORGANIZER' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{u.department || 'General'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#131B2E] border border-white/15 rounded-3xl p-6 max-w-2xl w-full my-8 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingEventId ? 'Edit Event Details' : 'Create New College Event'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Riviera 2026 Cultural Fest"
                    className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Category *</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Culturals">Culturals</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Music & Concert">Music & Concert</option>
                    <option value="Dance">Dance</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshops">Workshops</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    placeholder="e.g. Main Amphitheatre"
                    className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                    className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                    className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={eventForm.bannerUrl}
                    onChange={(e) => setEventForm({ ...eventForm, bannerUrl: e.target.value })}
                    className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full bg-[#1A2234] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Tiers Configuration */}
              {!editingEventId && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Ticket Tiers & Capacity</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEventForm({
                          ...eventForm,
                          tiers: [
                            ...eventForm.tiers,
                            { name: 'VIP Pass', price: 499, capacity: 50, maxPerUser: 2, description: 'VIP front stage access' }
                          ]
                        });
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      + Add Another Tier
                    </button>
                  </div>

                  {eventForm.tiers.map((tier, idx) => (
                    <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400">Tier Name</label>
                        <input
                          type="text"
                          required
                          value={tier.name}
                          onChange={(e) => {
                            const updated = [...eventForm.tiers];
                            updated[idx].name = e.target.value;
                            setEventForm({ ...eventForm, tiers: updated });
                          }}
                          className="w-full bg-[#1A2234] border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400">Price (INR)</label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={tier.price}
                          onChange={(e) => {
                            const updated = [...eventForm.tiers];
                            updated[idx].price = Number(e.target.value);
                            setEventForm({ ...eventForm, tiers: updated });
                          }}
                          className="w-full bg-[#1A2234] border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400">Capacity</label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={tier.capacity}
                          onChange={(e) => {
                            const updated = [...eventForm.tiers];
                            updated[idx].capacity = Number(e.target.value);
                            setEventForm({ ...eventForm, tiers: updated });
                          }}
                          className="w-full bg-[#1A2234] border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400">Max Per User</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={tier.maxPerUser}
                          onChange={(e) => {
                            const updated = [...eventForm.tiers];
                            updated[idx].maxPerUser = Number(e.target.value);
                            setEventForm({ ...eventForm, tiers: updated });
                          }}
                          className="w-full bg-[#1A2234] border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
