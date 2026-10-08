/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NailShowcase } from './components/NailShowcase';
import { NailCarousel } from './components/NailCarousel';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ArtistSection } from './components/ArtistSection';
import { HomeServiceSection } from './components/HomeServiceSection';
import { InstagramGallery } from './components/InstagramGallery';
import { Footer } from './components/Footer';
import { NailDetailModal } from './components/NailDetailModal';
import { AppointmentModal } from './components/AppointmentModal';
import { StickyContactBar } from './components/StickyContactBar';
import { CinematicLoader } from './components/CinematicLoader';
import { NailCursor } from './components/NailCursor';
import { NailScrollBar } from './components/NailScrollBar';
import { NailThemeBackground } from './components/NailThemeBackground';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { UserBookingsModal } from './components/UserBookingsModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  subscribeToAppointments, 
  getUserBookedIds, 
  getUserBookedCodes,
  getGuestBookedIds, 
  getGuestBookedCodes,
  getAllLocalStoredAppointments,
  linkAppointmentsToUser,
  fetchUserPastBookingsFromFirestore 
} from './lib/firebase';
import { Appointment, NailDesign } from './types';
import { ShieldCheck } from 'lucide-react';

function SalonAppContent() {
  const { user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string>('');
  const [bookingDesign, setBookingDesign] = useState<string>('');
  const [isHomeService, setIsHomeService] = useState<boolean>(false);

  // Modals for Auth, Admin Dashboard & My Bookings
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);

  // Persistent real-time appointment store (guaranteed immediate local restoration)
  const [appointments, setAppointments] = useState<Appointment[]>(() => getAllLocalStoredAppointments());

  // Detail modal state
  const [selectedDetailDesign, setSelectedDetailDesign] = useState<NailDesign | null>(null);

  // Subscribe to real-time appointments from Firestore & local changes
  useEffect(() => {
    const unsubscribe = subscribeToAppointments((latestAppointments) => {
      setAppointments(latestAppointments);
    });

    const handleAppointmentsChanged = () => {
      setAppointments(getAllLocalStoredAppointments());
    };
    window.addEventListener('rv_appointments_changed', handleAppointmentsChanged);

    return () => {
      unsubscribe();
      window.removeEventListener('rv_appointments_changed', handleAppointmentsChanged);
    };
  }, []);

  // When user logs in or out, automatically link and fetch their past cloud bookings
  useEffect(() => {
    if (user?.uid) {
      linkAppointmentsToUser(user).then((claimed) => {
        if (claimed.length > 0) {
          setAppointments(getAllLocalStoredAppointments());
        }
      }).catch(() => {});

      fetchUserPastBookingsFromFirestore(
        user.uid,
        user.email || undefined,
        (user as any).phoneNumber || localStorage.getItem('rv_client_last_phone') || undefined
      ).then((remote) => {
        if (remote.length > 0) {
          setAppointments(getAllLocalStoredAppointments());
        }
      }).catch(() => {});
    } else {
      setAppointments(getAllLocalStoredAppointments());
    }
  }, [user]);

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  // Strict user isolation: user only sees their own appointment count
  const userBookedIds = useMemo(() => (user?.uid ? getUserBookedIds(user.uid) : []), [user?.uid]);
  const userBookedCodes = useMemo(() => {
    if (!user?.uid) return [];
    try {
      const byUid: string[] = getUserBookedCodes(user.uid);
      const byEmail: string[] = user.email ? getUserBookedCodes(user.email) : [];
      return Array.from(new Set([...byUid, ...byEmail]));
    } catch {
      return [];
    }
  }, [user?.uid, user?.email]);
  const guestBookedIds = useMemo(() => getGuestBookedIds(), [user]);
  const guestBookedCodes = useMemo(() => getGuestBookedCodes(), [user]);
  const userEmailClean = user?.email?.toLowerCase().trim() || '';
  const userPhoneClean = (user as any)?.phoneNumber ? (user as any).phoneNumber.replace(/\D/g, '').slice(-10) : '';

  // Unified resilient appointment count (guaranteed never erased on logout / login)
  const userAppointmentsCount = useMemo(() => {
    const lastPhone = (localStorage.getItem('rv_client_last_phone') || '').replace(/\D/g, '').slice(-10);
    const lastEmail = (localStorage.getItem('rv_client_last_email') || '').toLowerCase().trim();

    const allKnownIds = new Set<string>([...userBookedIds, ...guestBookedIds]);
    const allKnownCodes = new Set<string>([...userBookedCodes, ...guestBookedCodes]);

    const localStore = getAllLocalStoredAppointments();
    const map = new Map<string, Appointment>();
    for (const a of localStore) map.set(a.id, a);
    for (const a of appointments) map.set(a.id, a);
    const combined = Array.from(map.values());

    return combined.filter((apt) => {
      if (user?.uid && apt.userId && apt.userId === user.uid) return true;
      const aptEmailClean = apt.email ? apt.email.toLowerCase().trim() : '';
      if (userEmailClean && aptEmailClean && aptEmailClean === userEmailClean) return true;
      if (lastEmail && aptEmailClean && aptEmailClean === lastEmail) return true;
      const aptPhoneClean = apt.phone ? apt.phone.replace(/\D/g, '').slice(-10) : '';
      if (userPhoneClean && aptPhoneClean && (aptPhoneClean.endsWith(userPhoneClean) || userPhoneClean.endsWith(aptPhoneClean))) return true;
      if (lastPhone && aptPhoneClean && (aptPhoneClean.endsWith(lastPhone) || lastPhone.endsWith(aptPhoneClean))) return true;
      if (allKnownIds.has(apt.id) || (apt.bookingCode && allKnownCodes.has(apt.bookingCode))) return true;
      return false;
    }).length;
  }, [appointments, user, userEmailClean, userPhoneClean, userBookedIds, userBookedCodes, guestBookedIds, guestBookedCodes]);

  const handleOpenBooking = (
    service?: string,
    nailDesign?: string,
    homeService?: boolean
  ) => {
    setBookingService(service || '');
    setBookingDesign(nailDesign || '');
    setIsHomeService(homeService || false);
    setBookingModalOpen(true);
  };

  const handleSelectDesign = (design: NailDesign) => {
    setSelectedDetailDesign(design);
  };

  const handleBookDesign = () => {
    const designTitle = selectedDetailDesign?.name || 'Custom Nail Art';
    handleOpenBooking('Nail Art & Design', designTitle, false);
  };

  const handleBookService = (serviceName: string) => {
    handleOpenBooking(serviceName, '', false);
  };

  const handleBookHomeService = () => {
    handleOpenBooking('Home Service Full Consultation', '', true);
  };

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] relative selection:bg-[#FDE68A] selection:text-[#78350F]">
      {/* Aesthetic Multi-Color Nail Art Pattern & Shimmering Auroras Background */}
      <NailThemeBackground />

      {/* Animated Nail Cursor */}
      <NailCursor />

      {/* Animated Nail Scroll Bar with Scroll Tracker */}
      <NailScrollBar />

      {/* Full-Screen Premium Cinematic Nail-Art Loader */}
      {isLoading && (
        <CinematicLoader onComplete={() => setIsLoading(false)} />
      )}

      {/* Top Navbar - Only rendered after cinematic loading completes */}
      {!isLoading && (
        <Navbar
          onOpenBooking={() => handleOpenBooking()}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
          onOpenMyBookings={() => setMyBookingsOpen(true)}
          onReplayIntro={handleReplayIntro}
          appointmentsCount={userAppointmentsCount}
          pendingCount={pendingCount}
        />
      )}

      {/* Main Content Sections */}
      <main>
        {/* Full-Screen Cinematic Hero */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* Choose Your Nail Style - 5 Signature Nail Tip Designs with Interactive 1-by-1 Focus */}
        <NailShowcase
          onSelectDesign={handleSelectDesign}
          onBookDesign={handleBookDesign}
        />

        {/* Horizontal Nail Swatch Carousel Display */}
        <NailCarousel
          onSelectDesign={handleSelectDesign}
          onBookDesign={handleBookDesign}
        />

        {/* Nail Care, Your Way - 5 Luxury Polish Container Shaped Services */}
        <ServicesSection onBookService={handleBookService} />

        {/* Can't Visit The Studio? We Can Come To You - Doorstep Home Service */}
        <HomeServiceSection onBookHomeService={handleBookHomeService} />

        {/* Why Choose RV Nail Studio - 4 Pillars */}
        <WhyChooseUs />

        {/* Meet Rohit - About The Artist */}
        <ArtistSection onOpenBooking={() => handleOpenBooking()} />

        {/* Follow The Nail Journey - Instagram Curved Nail Gallery */}
        <InstagramGallery />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onReplayIntro={handleReplayIntro}
        onOpenAdmin={() => setAdminDashboardOpen(true)}
      />

      {/* Floating Sticky Contact Bar & Admin Pill - Only after loading */}
      {!isLoading && (
        <>
          <StickyContactBar onOpenBooking={() => handleOpenBooking()} />

          {/* Quick Floating Admin Launcher Pill on Bottom Left - strictly for authorized staff */}
          {isAdmin && (
            <div className="fixed bottom-24 left-4 z-40 hidden sm:block">
              <button
                onClick={() => setAdminDashboardOpen(true)}
                className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#FDE68A] hover:border-[#B45309] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
                title="Open Salon Manager Admin Dashboard"
              >
                <div className="w-7 h-7 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col pr-1">
                  <span className="text-[10px] font-bold text-[#92400E] uppercase tracking-wider flex items-center gap-1">
                    Admin Active
                    {pendingCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </span>
                  <span className="text-[11px] font-semibold text-[#1C1917]">
                    {appointments.length} Bookings Synced
                  </span>
                </div>
              </button>
            </div>
          )}
        </>
      )}

      {/* Nail Design Detail Modal */}
      <NailDetailModal
        design={selectedDetailDesign}
        onClose={() => setSelectedDetailDesign(null)}
        onBookDesign={handleBookDesign}
      />

      {/* Appointment Booking Modal (Persists to Firestore Database) */}
      <AppointmentModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialService={bookingService}
        initialDesign={bookingDesign}
        initialIsHomeService={isHomeService}
        onViewMyBookings={() => {
          setBookingModalOpen(false);
          setMyBookingsOpen(true);
        }}
        onBookingCreated={(newBooking) => {
          setAppointments((prev) => [newBooking, ...prev.filter((a) => a.id !== newBooking.id)]);
        }}
      />

      {/* Admin Dashboard (Daily appointments, progress report, monthly total, manage bookings) */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        appointments={appointments}
      />

      {/* User / Client Bookings Drawer */}
      <UserBookingsModal
        isOpen={myBookingsOpen}
        onClose={() => setMyBookingsOpen(false)}
        appointments={appointments}
        onBookNew={() => handleOpenBooking()}
        onOpenAuth={() => setAuthModalOpen(true)}
        onUpdateAppointments={setAppointments}
      />

      {/* User Login / Register & Admin Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SalonAppContent />
    </AuthProvider>
  );
}
