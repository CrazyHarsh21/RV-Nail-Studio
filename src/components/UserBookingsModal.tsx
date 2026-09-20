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
  HelpCircle
} from 'lucide-react';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { BRAND_PHONE, getWhatsAppUrl } from '../data/nailData';
import { getMyBookedIds, getMyBookedCodes, getMyLastPhone, recordManualBookingId } from '../lib/firebase';

interface UserBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onBookNew: () => void;
}

export const UserBookingsModal: React.FC<UserBookingsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onBookNew
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [lookupPhone, setLookupPhone] = useState('');

  // Retrieve device-cached booking memory
  const localBookedIds = getMyBookedIds();
  const localBookedCodes = getMyBookedCodes();
  const lastPhone = getMyLastPhone().replace(/\D/g, '');

  const userPhoneClean = (user as any)?.phoneNumber ? (user as any).phoneNumber.replace(/\D/g, '') : '';
  const userEmailClean = user?.email?.toLowerCase().trim() || '';

  // Filter bookings belonging to this user/device
  const userAppointments = useMemo(() => {
    const matched = appointments.filter((apt) => {
      // 1. Matched by device booking ID
      if (localBookedIds.includes(apt.id)) return true;

      // 2. Matched by device booking Code
      if (apt.bookingCode && localBookedCodes.includes(apt.bookingCode)) return true;

      // 3. Matched by authenticated user ID
      if (user && apt.userId && apt.userId === user.uid) return true;

      // 4. Matched by user email
      if (userEmailClean && apt.email && apt.email.toLowerCase().trim() === userEmailClean) return true;

      // 5. Matched by clean phone number
      const aptPhoneClean = apt.phone ? apt.phone.replace(/\D/g, '') : '';
      if (userPhoneClean && aptPhoneClean && (aptPhoneClean.endsWith(userPhoneClean) || userPhoneClean.endsWith(aptPhoneClean))) {
        return true;
      }
      if (lastPhone && aptPhoneClean && (aptPhoneClean.endsWith(lastPhone) || lastPhone.endsWith(aptPhoneClean))) {
        return true;
      }

      return false;
    });

    return matched;
  }, [appointments, localBookedIds, localBookedCodes, user, userEmailClean, userPhoneClean, lastPhone]);

  // Handle Search / Filter
  const filteredAppointments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return userAppointments;
    }

    const cleanQ = q.replace(/\D/g, '');

    // Search through all appointments if user is looking up their booking
    return appointments.filter((apt) => {
      const codeMatch = apt.bookingCode?.toLowerCase().includes(q);
      const nameMatch = apt.fullName?.toLowerCase().includes(q);
      const cleanPhone = apt.phone?.replace(/\D/g, '') || '';
      const phoneMatch = cleanQ.length >= 3 && cleanPhone.includes(cleanQ);
      const serviceMatch = apt.service?.toLowerCase().includes(q);
      return codeMatch || nameMatch || phoneMatch || serviceMatch;
    });
  }, [searchQuery, userAppointments, appointments]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone.trim()) return;
    setSearchQuery(lookupPhone.trim());
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
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>In Progress</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
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
        return 'Appointment completed. Thank you for visiting RV Nails Art!';
      case 'cancelled':
        return 'This appointment was cancelled. Please book another slot or message Rohit.';
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
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E7DFD5] bg-[#FAF5F0]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B45309]">
                  Live Appointments & Status
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] flex items-center gap-2">
                  <span>My Booking Details</span>
                  <span className="text-sm font-sans font-normal text-[#78716C]">(अपनी बुकिंग देखें)</span>
                </h3>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-[#E7DFD5] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center transition-all shadow-xs hover:scale-105"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search / Lookup Input */}
            <div className="mt-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
              <input
                type="text"
                placeholder="Search by 10-digit Mobile No. or Booking Code (e.g. RV-XXXX)..."
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
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#1C1917] mb-1">
                  {searchQuery ? 'No Matching Bookings Found' : 'No Bookings Found on this Device'}
                </h4>
                <p className="text-xs text-[#78716C] max-w-md mx-auto mb-5">
                  {searchQuery
                    ? `We could not find any appointment matching "${searchQuery}". Please verify your 10-digit mobile number or booking code.`
                    : 'Booked recently from another phone or browser? Track your appointment instantly using your 10-digit mobile number:'}
                </p>

                {/* Instant Track Form */}
                <form onSubmit={handleManualLookup} className="max-w-xs mx-auto flex gap-2 mb-5">
                  <input
                    type="tel"
                    placeholder="Enter 10-digit Mobile"
                    maxLength={10}
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#B45309]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#B45309] text-white text-xs font-bold rounded-xl hover:bg-[#92400E] transition-colors"
                  >
                    Track
                  </button>
                </form>

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
                        <span className="text-[10px] text-[#78716C] block uppercase font-bold">Phone Number</span>
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

                  {/* Consultation Pricing Note */}
                  <div className="text-[11px] text-[#78716C] pt-1">
                    * Pricing is finalized after consultation based on chosen nail extension length, custom chrome/glaze, and art complexity.
                  </div>

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
