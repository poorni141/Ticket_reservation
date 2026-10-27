import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HoldCountdown } from './components/HoldCountdown';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { DigitalTicketPage } from './pages/DigitalTicketPage';
import { OrganizerDashboardPage } from './pages/OrganizerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { api } from './services/api';
import type { EventItem, ReservationHold } from './types';

function MainLayout() {
  const { user, role } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeHoldId, setActiveHoldId] = useState<string | null>(null);
  const [activeHold, setActiveHold] = useState<ReservationHold | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [viewTicketBookingId, setViewTicketBookingId] = useState<string | null>(null);

  // Load events
  const refreshEvents = async () => {
    const list = await api.getEvents();
    setEvents(list);
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  // Poll for active hold details if activeHoldId is set
  useEffect(() => {
    if (!activeHoldId) {
      setActiveHold(null);
      return;
    }

    const checkHold = async () => {
      try {
        const data = await api.getHold(activeHoldId);
        if (data.isExpired) {
          setActiveHold(null);
          setActiveHoldId(null);
          refreshEvents();
        } else {
          setActiveHold(data.hold);
        }
      } catch {
        setActiveHold(null);
        setActiveHoldId(null);
      }
    };

    checkHold();
    const interval = setInterval(checkHold, 4000);
    return () => clearInterval(interval);
  }, [activeHoldId]);

  // Navigation handlers
  const handleNavigate = (page: string, param?: string) => {
    if (page === 'event-detail' && param) {
      setSelectedEventId(param);
    } else if (page === 'ticket' && param) {
      setViewTicketBookingId(param);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    setCurrentPage('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHoldCreated = (holdId: string) => {
    setActiveHoldId(holdId);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshEvents();
  };

  const handleBookingComplete = (bookingId: string) => {
    setActiveHold(null);
    setActiveHoldId(null);
    setConfirmedBookingId(bookingId);
    setCurrentPage('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshEvents();
  };

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Global 10-Minute Hold Countdown Bar */}
      {activeHold && currentPage !== 'checkout' && (
        <HoldCountdown
          hold={activeHold}
          onProceedToCheckout={(hId) => {
            setActiveHoldId(hId);
            setCurrentPage('checkout');
          }}
          onHoldExpired={() => {
            setActiveHold(null);
            setActiveHoldId(null);
            refreshEvents();
          }}
        />
      )}

      {/* Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HomePage 
              events={events} 
              onSelectEvent={handleSelectEvent} 
              onNavigate={handleNavigate} 
            />
          </div>
        )}

        {currentPage === 'events' && (
          <EventsPage 
            events={events} 
            onSelectEvent={handleSelectEvent} 
          />
        )}

        {currentPage === 'event-detail' && selectedEvent && (
          <EventDetailPage
            event={selectedEvent}
            onBack={() => handleNavigate('events')}
            onHoldCreated={handleHoldCreated}
          />
        )}

        {currentPage === 'checkout' && activeHoldId && (
          <CheckoutPage
            holdId={activeHoldId}
            onBookingComplete={handleBookingComplete}
            onBack={() => handleNavigate('event-detail', selectedEventId || undefined)}
          />
        )}

        {currentPage === 'confirmation' && confirmedBookingId && (
          <ConfirmationPage
            bookingId={confirmedBookingId}
            onViewTicket={(bId) => handleNavigate('ticket', bId)}
            onGoHome={() => handleNavigate('home')}
            onGoBookings={() => handleNavigate('bookings')}
          />
        )}

        {currentPage === 'bookings' && (
          <MyBookingsPage
            onViewTicket={(bId) => handleNavigate('ticket', bId)}
            onExploreEvents={() => handleNavigate('events')}
          />
        )}

        {currentPage === 'ticket' && viewTicketBookingId && (
          <DigitalTicketPage
            bookingId={viewTicketBookingId}
            onBack={() => handleNavigate('bookings')}
          />
        )}

        {currentPage === 'organizer' && (
          <OrganizerDashboardPage />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onSuccess={() => handleNavigate('home')}
            onGoRegister={() => handleNavigate('register')}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            onSuccess={() => handleNavigate('home')}
            onGoLogin={() => handleNavigate('login')}
          />
        )}

        {currentPage === '404' && (
          <NotFoundPage onGoHome={() => handleNavigate('home')} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
