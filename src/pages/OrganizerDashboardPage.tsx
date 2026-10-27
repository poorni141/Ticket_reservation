import React, { useState, useEffect } from 'react';
import type { EventItem, Booking, TicketItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  Users, 
  Search, 
  Sparkles,
  Ticket
} from 'lucide-react';

export const OrganizerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [scanInput, setScanInput] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    valid: boolean;
    alreadyCheckedIn?: boolean;
    message: string;
    ticket?: TicketItem;
    booking?: Booking;
  } | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [searchAttendee, setSearchAttendee] = useState<string>('');

  const loadData = async () => {
    const evts = await api.getEvents();
    const bkgs = await api.getBookings(user);
    setEvents(evts);
    setBookings(bkgs);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleScan = async (overrideQuery?: string) => {
    const q = overrideQuery || scanInput;
    if (!q.trim()) return;

    setScanning(true);
    setScanResult(null);

    try {
      const res = await api.checkInTicket(q);
      setScanResult(res);
      await loadData();
    } catch (err: any) {
      setScanResult({ valid: false, message: err.message || 'Verification error' });
    } finally {
      setScanning(false);
    }
  };

  // Compile full attendee list from confirmed bookings
  const allAttendees: { ticket: TicketItem; booking: Booking }[] = [];
  for (const b of bookings) {
    if (b.status === 'CONFIRMED') {
      for (const t of b.tickets) {
        allAttendees.push({ ticket: t, booking: b });
      }
    }
  }

  const filteredAttendees = allAttendees.filter(item => {
    const q = searchAttendee.toLowerCase();
    return item.ticket.attendeeName.toLowerCase().includes(q) ||
           item.ticket.ticketCode.toLowerCase().includes(q) ||
           item.ticket.attendeeEmail.toLowerCase().includes(q) ||
           (item.ticket.collegeId && item.ticket.collegeId.toLowerCase().includes(q));
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            Staff & Organizer Control Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Event Desk & QR Pass Verification
          </h1>
        </div>
        <div className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
          Logged in: <strong className="text-white">{user.name}</strong> ({user.role})
        </div>
      </div>

      {/* QR Ticket Verification Scanner Simulator */}
      <div className="bg-gradient-to-r from-[#131B2E] via-[#1E1B4B]/60 to-[#131B2E] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Live Gate Entry Scanner Simulator</h2>
            <p className="text-xs text-slate-300">
              Scan barcode or enter Ticket Code (e.g. <code>CT-TKT-884920</code>) to verify wristband admission.
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste QR verification token or Ticket Code..."
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            className="flex-1 bg-[#0B0F19] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={() => handleScan()}
            disabled={scanning || !scanInput.trim()}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{scanning ? 'Verifying...' : 'Verify Entry'}</span>
          </button>
        </div>

        {/* Quick Demo Pre-fills */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 pt-1">
          <span>Quick Test Codes:</span>
          <button
            onClick={() => { setScanInput('CT-TKT-884920'); handleScan('CT-TKT-884920'); }}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-indigo-300 font-mono text-[11px] border border-white/10"
          >
            CT-TKT-884920 (Aarav)
          </button>
          <button
            onClick={() => { setScanInput('CT-TKT-884921'); handleScan('CT-TKT-884921'); }}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-indigo-300 font-mono text-[11px] border border-white/10"
          >
            CT-TKT-884921 (Rohan)
          </button>
        </div>

        {/* Scan Result Card */}
        {scanResult && (
          <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
            !scanResult.valid 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
              : scanResult.alreadyCheckedIn 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {!scanResult.valid ? (
                <XCircle className="w-5 h-5 text-rose-400" />
              ) : scanResult.alreadyCheckedIn ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              <span>{scanResult.message}</span>
            </div>

            {scanResult.ticket && scanResult.booking && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-white">
                <div>
                  <span className="text-[10px] text-slate-400 block">Attendee</span>
                  <span className="font-semibold">{scanResult.ticket.attendeeName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">College ID</span>
                  <span>{scanResult.ticket.collegeId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Tier</span>
                  <span>{scanResult.ticket.tierName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Event</span>
                  <span className="truncate block">{scanResult.booking.eventTitle}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Managed Events Summary */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span>Active Events & Occupancy Breakdown</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(ev => {
            const booked = ev.totalCapacity - ev.availableSeats;
            const pct = Math.round((booked / ev.totalCapacity) * 100);

            return (
              <div key={ev.id} className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{ev.category}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{ev.title}</h3>
                    <p className="text-xs text-slate-400">{ev.venue}</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white/5 border border-white/10 px-2 py-1 rounded text-white">
                    {ev.availableSeats} Left
                  </span>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Occupancy: {booked} / {ev.totalCapacity} reserved</span>
                    <span>{pct}% Booked</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Tier details */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                  {ev.ticketTiers.map(tier => (
                    <div key={tier.id} className="p-2 bg-white/5 rounded-lg">
                      <span className="font-semibold text-white block truncate">{tier.name}</span>
                      <span className="text-slate-400">
                        {tier.available} / {tier.capacity} seats left (₹{tier.price})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendee Roster Table */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Attendee Gate Roster ({filteredAttendees.length})</span>
            </h3>
            <p className="text-xs text-slate-400">Real-time registered passes and check-in status.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search attendee or roll no..."
              value={searchAttendee}
              onChange={(e) => setSearchAttendee(e.target.value)}
              className="w-full bg-[#1A2234] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3">Attendee</th>
                <th className="p-3">Roll / College ID</th>
                <th className="p-3">Event & Tier</th>
                <th className="p-3">Ticket Code</th>
                <th className="p-3">Gate Status</th>
                <th className="p-3 text-right">Quick Scan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No attendees found.
                  </td>
                </tr>
              ) : (
                filteredAttendees.map(({ ticket, booking }) => (
                  <tr key={ticket.id} className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">
                      {ticket.attendeeName}
                      <span className="block text-[10px] text-slate-500 font-normal">{ticket.attendeeEmail}</span>
                    </td>
                    <td className="p-3 font-mono">{ticket.collegeId || 'N/A'}</td>
                    <td className="p-3">
                      <span className="font-medium text-white block max-w-[180px] truncate">{booking.eventTitle}</span>
                      <span className="text-[10px] text-indigo-400">{ticket.tierName}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-indigo-300">{ticket.ticketCode}</td>
                    <td className="p-3">
                      {ticket.checkedIn ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Checked-In
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active Pass
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {!ticket.checkedIn && (
                        <button
                          onClick={() => {
                            setScanInput(ticket.ticketCode);
                            handleScan(ticket.ticketCode);
                          }}
                          className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded border border-indigo-500/40 text-[10px] font-bold transition-all"
                        >
                          Check In
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
