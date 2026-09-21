import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  Search, 
  Copy, 
  Check, 
  Home, 
  User as UserIcon,
  RefreshCw,
  History,
  LogIn
} from 'lucide-react';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { getWhatsAppUrl } from '../data/nailData';
import { 
  getGuestBookedIds, 
  getGuestBookedCodes, 
  getUserBookedIds, 
  fetchUserPastBookingsFromFirestore 
} from '../lib/firebase';

interface UserBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onBookNew: () => void;
  onOpenAuth?: () => void;
}

export const UserBookingsModal: React.FC<UserBookingsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onBookNew,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'history'>('all');
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const userEmailClean = user?.email?.toLowerCase().trim() || '';
  const userPhoneClean = (user as any)?.phoneNumber ? (user as any).phoneNumber.replace(/\D/g, '') : '';

  // Retrieve user-specific or guest-specific booking keys
  const userBookedIds = useMemo(() => {
    return user?.uid ? getUserBookedIds(user.uid) : [];
  }, [user?.uid]);

  const guestBookedIds = useMemo(() => {
    return !user ? getGuestBookedIds() : [];
  }, [user]);

  const guestBookedCodes = useMemo(() => {
    return !user ? getGuestBookedCodes() : [];
  }, [user]);

  /**
   * STRICT DATA PRIVACY FILTER:
   * - If a user is logged in: ONLY their own bookings are returned (never other users' bookings).
   * - If no user is logged in (guest): ONLY bookings created during this guest session are returned.
   */
  const userAppointments = useMemo(() => {
    if (user?.uid) {
      return appointments.filter((apt) => {
        // STRICT RULE 1: Never show an appointment explicitly owned by another user ID
        if (apt.userId && apt.userId !== user.uid) {
          return false;
        }

        // STRICT RULE 2: Show if matching current user ID
        if (apt.userId === user.uid) {
          return true;
        }

        // STRICT RULE 3: Show if matching verified account email
        if (userEmailClean && apt.email && apt.email.toLowerCase().trim() === userEmailClean) {
          return true;
        }

        // STRICT RULE 4: Show if matching user's phone
        const aptPhoneClean = apt.phone ? apt.phone.replace(/\D/g, '') : '';
        if (userPhoneClean && aptPhoneClean && (aptPhoneClean.endsWith(userPhoneClean) || userPhoneClean.endsWith(aptPhoneClean))) {
          return true;
        }

        // STRICT RULE 5: Show if in this user's isolated local list
        if (userBookedIds.includes(apt.id)) {
          return true;
        }

        return false;
      });
    } else {
      // Guest session: only unassigned bookings made on this device
      return appointments.filter((apt) => {
        // Never show any registered user's appointments to a guest!
        if (apt.userId) {
          return false;
        }
        return guestBookedIds.includes(apt.id) || (apt.bookingCode && guestBookedCodes.includes(apt.bookingCode));
      });
    }
  }, [appointments, user, userEmailClean, userPhoneClean, userBookedIds, guestBookedIds, guestBookedCodes]);

  // Sync from Cloud Database on request
  const handleCloudSync = async () => {
    if (!user?.uid) {
      setSyncNotice('Sign in to sync your cloud booking history across devices.');
      setTimeout(() => setSyncNotice(null), 3500);
      return;
    }
    try {
      setIsSyncing(true);
      const results = await fetchUserPastBookingsFromFirestore(user.uid, user.email || undefined);
      setSyncNotice(`Synced ${results.length} bookings successfully from Studio Database.`);
      setTimeout(() => setSyncNotice(null), 3500);
    } catch {
      setSyncNotice('Could not connect to Cloud. Offline history displayed.');
      setTimeout(() => setSyncNotice(null), 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter based on Active vs History tabs
  const tabAppointments = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return userAppointments.filter((apt) => {
      const isPastDate = apt.date < todayStr;
      const isInactive = apt.status === 'completed' || apt.status === 'cancelled';

      if (activeTab === 'active') {
        return !isInactive && !isPastDate;
      }
      if (activeTab === 'history') {
        return isInactive || isPastDate;
      }
      return true; // 'all'
    });
  }, [userAppointments, activeTab]);

  // Handle Search / Filter strictly within user's own data
  const filteredAppointments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return tabAppointments;
    }

    return tabAppointments.filter((apt) => {
      const codeMatch = apt.bookingCode?.toLowerCase().includes(q);
      const nameMatch = apt.fullName?.toLowerCase().includes(q);
      const serviceMatch = apt.service?.toLowerCase().includes(q);
      const dateMatch = apt.date?.includes(q);
      const statusMatch = apt.status?.toLowerCase().includes(q);
      return codeMatch || nameMatch || serviceMatch || dateMatch || statusMatch;
    });
  }, [searchQuery, tabAppointments]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed with Rohit</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3 animate-spin" />
            <span>In Progress</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-300 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-stone-600" />
            <span>Completed (History)</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>Pending Studio Review</span>
          </div>
        );
    }
  };

  const getStatusDescription = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'आपकी बुकिंग कन्फर्म हो चुकी है! Rohit scheduled time par available rahenge.';
      case 'in_progress':
        return 'Nail art session is currently ongoing.';
      case 'completed':
        return 'Appointment completed. Past booking stored in your account history.';
      case 'cancelled':
        return 'This appointment was cancelled. You can book another session anytime.';
      default:
        return 'रोहित जल्द ही आपके स्लॉट की समीक्षा करके WhatsApp पर पुष्टि करेंगे.';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white border border-[#E7DFD5] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] my-auto"
        >
          {/* Top Hairline Accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#B45309] via-[#D4AF37] via-[#C2410C] to-[#BE185D]" />

          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E7DFD5] bg-[#FAF5F0]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B45309] block">
                  Studio Client Portal
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] flex items-center gap-2">
                  <span>My Booking Details</span>
                  <span className="text-sm font-sans font-normal text-[#78716C]">(अपनी बुकिंग और हिस्ट्री देखें)</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {user && (
                  <button
                    onClick={handleCloudSync}
                    disabled={isSyncing}
                    className="p-2 rounded-xl bg-white border border-[#E7DFD5] text-[#78716C] hover:text-[#B45309] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
                    title="Refresh from Studio Cloud Database"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#B45309]' : ''}`} />
                    <span className="hidden sm:inline">Sync Cloud</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white border border-[#E7DFD5] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center transition-all shadow-xs hover:scale-105"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Account Status Strip */}
            <div className="mt-3.5 p-2.5 rounded-2xl bg-white border border-[#E7DFD5] flex items-center justify-between text-xs">
              {user ? (
                <div className="flex items-center gap-2 text-stone-800">
                  <div className="w-6 h-6 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center font-bold text-[11px]">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="leading-tight">
                    <span className="font-bold text-[#1C1917] block">
                      {user.displayName || 'Customer Account'}
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      {user.email || 'Logged in'} • Data isolated & saved to your account
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="text-[11px] text-[#78716C]">
                    Guest Session: Bookings on this device are shown. Sign in to sync across devices.
                  </div>
                  {onOpenAuth && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF5F0] border border-[#E7DFD5] text-[#B45309] hover:bg-[#B45309] hover:text-white transition-colors font-bold text-[10px] flex items-center gap-1 shrink-0"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Sign In / Sign Up</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cloud Sync Notice */}
            {syncNotice && (
              <div className="mt-2 text-[11px] text-[#B45309] font-medium bg-[#FEF3C7]/60 px-3 py-1.5 rounded-xl border border-[#FDE68A]">
                {syncNotice}
              </div>
            )}

            {/* Navigation Filter Tabs: Active, History, All */}
            <div className="mt-4 flex items-center justify-between gap-2 border-b border-[#E7DFD5] pb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#B45309] text-white shadow-xs font-bold'
                      : 'text-[#78716C] hover:text-[#1C1917] hover:bg-white'
                  }`}
                >
                  All ({userAppointments.length})
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === 'active'
                      ? 'bg-[#B45309] text-white shadow-xs font-bold'
                      : 'text-[#78716C] hover:text-[#1C1917] hover:bg-white'
                  }`}
                >
                  Active & Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                    activeTab === 'history'
                      ? 'bg-[#B45309] text-white shadow-xs font-bold'
                      : 'text-[#78716C] hover:text-[#1C1917] hover:bg-white'
                  }`}
                >
                  <History className="w-3 h-3" />
                  <span>Past History (पुरानी बुकिंग)</span>
                </button>
              </div>
            </div>

            {/* Quick Search Bar within User's Bookings */}
            <div className="mt-3 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
              <input
                type="text"
                placeholder="Search your bookings by service, booking code (RV-XXXX), or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 pl-10 pr-9 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917]"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#FAF8F5]">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white rounded-2xl border border-[#E7DFD5] p-6 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] flex items-center justify-center mx-auto mb-3 shadow-xs">
                  {activeTab === 'history' ? <History className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                </div>
                <h4 className="font-serif text-lg font-bold text-[#1C1917] mb-1">
                  {searchQuery
                    ? 'No Matching Bookings Found'
                    : activeTab === 'history'
                    ? 'No Past Booking History'
                    : 'No Active Bookings in Your Account'}
                </h4>
                <p className="text-xs text-[#78716C] max-w-md mx-auto mb-5">
                  {searchQuery
                    ? `No booking found matching "${searchQuery}".`
                    : activeTab === 'history'
                    ? 'Completed or cancelled appointments will automatically appear here in your account history.'
                    : 'You do not have any active appointments reserved right now.'}
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onBookNew();
                    }}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B45309] to-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    Book New Appointment
                  </button>
                </div>
              </div>
            ) : (
              filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-2xl border border-[#E7DFD5] bg-white shadow-xs hover:shadow-md transition-all space-y-3.5"
                >
                  {/* Top Bar: Booking Code + Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5ECE4] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg bg-[#FAF5F0] border border-[#E7DFD5] text-[#B45309] flex items-center gap-1.5">
                        <span>{apt.bookingCode}</span>
                        <button
                          onClick={() => handleCopyCode(apt.bookingCode)}
                          className="text-[#78716C] hover:text-[#1C1917] transition-colors"
                          title="Copy Booking Code"
                        >
                          {copiedCode === apt.bookingCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </span>

                      <span className="text-xs font-bold text-[#1C1917]">
                        {apt.service}
                      </span>
                    </div>

                    {getStatusBadge(apt.status)}
                  </div>

                  {/* Status Explanation Banner */}
                  <div className="p-2.5 rounded-xl bg-[#FAF5F0] border border-[#E7DFD5] flex items-start gap-2 text-[11px] text-[#78716C]">
                    <Sparkles className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5" />
                    <span>{getStatusDescription(apt.status)}</span>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-[#B45309] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#78716C] block uppercase font-bold">Client Name</span>
                        <span className="font-semibold text-[#1C1917]">{apt.fullName}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#B45309] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#78716C] block uppercase font-bold">Contact Phone</span>
                        <span className="font-semibold text-[#1C1917]">+91 {apt.phone}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#B45309] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#78716C] block uppercase font-bold">Reserved Date</span>
                        <span className="font-bold text-[#1C1917]">{apt.date}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#EA580C] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#78716C] block uppercase font-bold">Time Slot</span>
                        <span className="font-bold text-[#EA580C]">{apt.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Mode & Address */}
                  <div className="p-3 rounded-xl bg-[#FAF5F0] border border-[#E7DFD5] space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
                      {apt.serviceType === 'Home Service' ? (
                        <Home className="w-4 h-4 text-[#0284C7]" />
                      ) : (
                        <MapPin className="w-4 h-4 text-[#B45309]" />
                      )}
                      <span>Mode: {apt.serviceType}</span>
                    </div>

                    {apt.address ? (
                      <p className="text-[#57534E] text-[11px] pl-5">
                        <strong className="text-[#1C1917]">Doorstep Address:</strong> {apt.address}
                      </p>
                    ) : (
                      <p className="text-[#78716C] text-[11px] pl-5">
                        Studio Location: Sector 18, Commercial Belt, Noida, UP (Studio visit with Rohit)
                      </p>
                    )}
                  </div>

                  {/* Design Preferences if any */}
                  {apt.notes && (
                    <div className="text-xs text-[#57534E] bg-stone-50 p-2.5 rounded-xl border border-[#E7DFD5]">
                      <strong className="text-[#1C1917]">Client Notes:</strong> {apt.notes}
                    </div>
                  )}

                  {/* Rohit's Note if any */}
                  {apt.adminNotes && (
                    <div className="text-xs text-[#065F46] bg-[#ECFDF5] p-2.5 rounded-xl border border-[#A7F3D0]">
                      <strong>Rohit's Note:</strong> {apt.adminNotes}
                    </div>
                  )}

                  {/* Actions: WhatsApp Rohit & Call */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F5ECE4]">
                    <div className="text-[11px] text-[#A8A29E]">
                      Booked on: {new Date(apt.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppUrl(`Hi Rohit, inquiring about my booking ${apt.bookingCode} for ${apt.date} at ${apt.timeSlot}. Name: ${apt.fullName}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20bd5a] transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#E7DFD5] bg-[#FAF5F0] flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onBookNew();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B45309] to-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all"
            >
              + Book Another Slot
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#78716C] hover:text-[#1C1917]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
