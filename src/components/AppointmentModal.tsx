import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  Home, 
  MapPin, 
  AlertCircle, 
  DollarSign,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TIME_SLOTS, SERVICES, getWhatsAppUrl } from '../data/nailData';
import { Appointment, AppointmentFormData } from '../types';
import { bookAppointmentInDatabase } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialDesign?: string;
  initialIsHomeService?: boolean;
  onViewMyBookings?: () => void;
  onBookingCreated?: (booking: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialService = '',
  initialDesign = '',
  initialIsHomeService = false,
  onViewMyBookings,
  onBookingCreated,
}) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: user?.displayName || '',
    phone: (user as any)?.phoneNumber || '',
    email: user?.email || '',
    date: '',
    timeSlot: '',
    service: initialService || 'Nail Art & Design',
    nailDesign: initialDesign || '',
    serviceType: initialIsHomeService ? 'Home Service' : 'Studio Visit',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Appointment | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Sync initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user?.displayName || '',
        phone: prev.phone || (user as any)?.phoneNumber || '',
        email: prev.email || user?.email || '',
        service: initialService || prev.service || 'Nail Art & Design',
        nailDesign: initialDesign || prev.nailDesign || '',
        serviceType: initialIsHomeService ? 'Home Service' : prev.serviceType || 'Studio Visit',
      }));
      setErrors({});
      setIsSubmitted(false);
      setCreatedBooking(null);
    }
  }, [isOpen, initialService, initialDesign, initialIsHomeService, user]);

  if (!isOpen) return null;

  // Indian phone number validator (10 digits, starting with 6, 7, 8, or 9)
  const validateIndianPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-+]/g, '');
    const phoneRegex = /^(?:91)?[6-9]\d{9}$/;
    return phoneRegex.test(cleaned);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please provide your full name.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!validateIndianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a preferred date.';
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select a time slot.';
    }

    if (!formData.service) {
      newErrors.service = 'Please choose a service.';
    }

    if (formData.serviceType === 'Home Service' && !formData.address?.trim()) {
      newErrors.address = 'Please provide your doorstep address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const savedBooking = await bookAppointmentInDatabase(formData, user);
      setCreatedBooking(savedBooking);
      setIsSubmitted(true);
      if (onBookingCreated) {
        onBookingCreated(savedBooking);
      }

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.warn('Notice while booking appointment:', err);
      setBookingError(err?.message || 'Could not complete booking. Please verify details or contact via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfirmationWhatsAppMessage = (): string => {
    const code = createdBooking?.bookingCode || 'NEW';
    return `Hi Rohit, I have booked appointment ${code} through your website for ${formData.date} at ${formData.timeSlot}. Name: ${formData.fullName}. Service: ${formData.service} (${formData.serviceType}).`;
  };

  // Min date is today
  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-white border border-[#E7DFD5] rounded-3xl shadow-2xl overflow-hidden z-10 my-6"
        >
          {/* Top Amber-Rose Hairline Accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#B45309] via-[#D4AF37] via-[#C2410C] to-[#BE185D]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-[#FAF5F0] border border-[#E7DFD5] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center transition-all hover:scale-105"
            aria-label="Close booking modal"
          >
            <X className="w-4 h-4" />
          </button>

          {!isSubmitted ? (
            /* Form View */
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <span className="text-[10px] text-[#B45309] font-bold tracking-[0.25em] uppercase">
                  SALON & DOORSTEP RESERVATIONS
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] uppercase mt-1">
                  Book Your <span className="text-[#B45309]">Nail Art Session</span>
                </h3>
                <p className="text-xs text-[#78716C] mt-1">
                  Private studio appointments or doorstep luxury home service with Rohit.
                </p>
              </div>

              {/* Service Type Toggle (Studio vs Home) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF5F0] rounded-2xl border border-[#E7DFD5] mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, serviceType: 'Studio Visit' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    formData.serviceType === 'Studio Visit'
                      ? 'bg-white text-[#B45309] shadow-xs border border-[#E7DFD5]'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                  Studio Visit
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, serviceType: 'Home Service' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    formData.serviceType === 'Home Service'
                      ? 'bg-white text-[#0284C7] shadow-xs border border-[#E7DFD5]'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-[#0284C7]" />
                  Doorstep Home Visit
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name & Phone Number in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full bg-[#FAF5F0] border ${
                          errors.fullName ? 'border-rose-500' : 'border-[#E7DFD5] focus:border-[#B45309]'
                        } rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none transition-colors`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                      Phone Number (India) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#78716C] text-xs">
                        <Phone className="w-3.5 h-3.5" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, phone: val });
                        }}
                        className={`w-full bg-[#FAF5F0] border ${
                          errors.phone ? 'border-rose-500' : 'border-[#E7DFD5] focus:border-[#B45309]'
                        } rounded-xl py-2.5 pl-16 pr-3 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none transition-colors`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email (Optional for receipt) */}
                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                    <input
                      type="email"
                      placeholder="priya@example.com (for booking confirmation)"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Doorstep Address Field (if Home Service) */}
                {formData.serviceType === 'Home Service' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                      Doorstep Address in City <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-4 h-4 text-[#A8A29E]" />
                      <textarea
                        rows={2}
                        placeholder="Apartment/Villa, Street, Landmark, Area, Pin Code"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full bg-[#FAF5F0] border ${
                          errors.address ? 'border-rose-500' : 'border-[#E7DFD5] focus:border-[#0284C7]'
                        } rounded-xl py-2 pl-9 pr-3 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none transition-colors`}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.address}
                      </p>
                    )}
                  </div>
                )}

                {/* Date & Time Slot Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Select Date */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                      Select Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full bg-[#FAF5F0] border ${
                        errors.date ? 'border-rose-500' : 'border-[#E7DFD5] focus:border-[#B45309]'
                      } rounded-xl py-2.5 px-3 text-xs text-[#1C1917] focus:outline-none transition-colors`}
                    />
                    {errors.date && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.date}
                      </p>
                    )}
                  </div>

                  {/* Select Time Slot */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                      Select Time Slot <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className={`w-full bg-[#FAF5F0] border ${
                          errors.timeSlot ? 'border-rose-500' : 'border-[#E7DFD5] focus:border-[#B45309]'
                        } rounded-xl py-2.5 px-3 text-xs text-[#1C1917] focus:outline-none transition-colors appearance-none`}
                      >
                        <option value="" disabled>
                          Select preferred slot
                        </option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] pointer-events-none" />
                    </div>
                    {errors.timeSlot && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.timeSlot}
                      </p>
                    )}
                  </div>
                </div>

                {/* Select Service */}
                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                    Service Choice <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 px-3 text-xs text-[#1C1917] font-medium focus:outline-none transition-colors"
                  >
                    <option value="Nail Art & Design">Nail Art & Design (Chrome, Aura, Glaze, Bespoke)</option>
                    <option value="Manicure & Pedicure">Manicure & Pedicure (Russian Dry & Spa Manicure)</option>
                    <option value="Nail Extensions (Gel / Acrylic)">Nail Extensions (Gel / Acrylic Tips)</option>
                    <option value="Bridal Nails & Special Occasions">Bridal Nails & Special Occasions</option>
                    <option value="Nail Care & Treatments">Nail Care, IBX Strengthening & Treatments</option>
                    <option value="Home Service Full Consultation">Home Service Full Consultation & Styling</option>
                  </select>
                </div>

                {/* Nail Shape / Art Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                    Design Preferences or Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Almond shape, chrome glaze, reference photo on WhatsApp"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 px-3 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none transition-colors"
                  />
                </div>

                {/* Consultation & Booking Assurance Notice */}
                <div className="p-3.5 bg-[#FAF5F0] rounded-xl border border-[#E7DFD5] flex items-center gap-2.5 text-xs text-[#78716C]">
                  <Sparkles className="w-4 h-4 text-[#B45309] shrink-0" />
                  <span>Personalized consultation with Rohit. Slot reserved immediately upon confirmation.</span>
                </div>

                {bookingError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {bookingError}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs sm:text-sm tracking-[0.16em] uppercase shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isSubmitting ? 'SAVING TO DATABASE...' : 'CONFIRM & SUBMIT APPOINTMENT'}</span>
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* Confirmation Success View */
            <div className="p-6 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto mb-3"
              >
                <CheckCircle2 className="w-7 h-7" />
              </motion.div>

              <span className="text-[11px] text-emerald-700 font-bold tracking-[0.2em] uppercase">
                Appointment Synced to Database
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] uppercase mt-1 mb-1.5">
                Booking Confirmed!
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto mb-3">
                Thank you, <strong className="text-[#1C1917]">{formData.fullName}</strong>. Your appointment request has been recorded into the studio database.
              </p>

              {/* Booking Reference Code Highlight */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5F0] border border-[#E7DFD5] mb-4">
                <span className="text-[11px] text-[#78716C]">Booking Code:</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#B45309]">
                  {createdBooking?.bookingCode || 'RV-CONFIRMED'}
                </span>
              </div>

              {/* Apni Booking Full Details Card */}
              <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7DFD5] p-4 sm:p-5 text-left mb-5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-[#F5ECE4] pb-2 font-bold">
                  <span className="text-[#92400E] uppercase tracking-wider text-[10px]">Your Booking Details</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase">
                    Pending Review
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#F5ECE4] pb-1.5">
                  <span className="text-[#78716C]">Client Name:</span>
                  <span className="font-bold text-[#1C1917]">{formData.fullName}</span>
                </div>

                <div className="flex justify-between border-b border-[#F5ECE4] pb-1.5">
                  <span className="text-[#78716C]">Phone Number:</span>
                  <span className="font-semibold text-[#1C1917]">+91 {formData.phone}</span>
                </div>

                <div className="flex justify-between border-b border-[#F5ECE4] pb-1.5">
                  <span className="text-[#78716C]">Date & Time:</span>
                  <span className="font-bold text-[#B45309]">{formData.date} at {formData.timeSlot}</span>
                </div>

                <div className="flex justify-between border-b border-[#F5ECE4] pb-1.5">
                  <span className="text-[#78716C]">Service:</span>
                  <span className="font-semibold text-[#1C1917]">{formData.service}</span>
                </div>

                <div className="flex justify-between border-b border-[#F5ECE4] pb-1.5">
                  <span className="text-[#78716C]">Service Type:</span>
                  <span className="font-semibold text-[#1C1917]">{formData.serviceType}</span>
                </div>

                {formData.address && (
                  <div className="flex justify-between border-b border-[#F5ECE4] pb-1.5">
                    <span className="text-[#78716C]">Doorstep Address:</span>
                    <span className="font-medium text-[#1C1917] text-right max-w-[220px]">{formData.address}</span>
                  </div>
                )}

                {formData.notes && (
                  <div className="flex justify-between pt-0.5">
                    <span className="text-[#78716C]">Design Notes:</span>
                    <span className="font-medium text-[#57534E] text-right max-w-[220px]">{formData.notes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onViewMyBookings) onViewMyBookings();
                  }}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-95"
                >
                  <Clock className="w-4 h-4" />
                  <span>View My Booking Details (अपनी बुकिंग देखें)</span>
                </button>

                <a
                  href={getWhatsAppUrl(getConfirmationWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 rounded-xl bg-[#25D366] text-white font-bold text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Confirm on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 px-6 rounded-xl border border-[#E7DFD5] text-[#78716C] hover:text-[#1C1917] hover:bg-stone-50 text-xs font-semibold tracking-wider uppercase transition-all"
                >
                  Back to Salon Home
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
