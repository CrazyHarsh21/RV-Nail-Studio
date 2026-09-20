import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Sparkles, 
  DollarSign, 
  MessageCircle, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { Appointment, AppointmentStatus, PaymentStatus } from '../types';
import { updateAppointmentInDatabase } from '../lib/firebase';
import { getWhatsAppUrl } from '../data/nailData';

export interface ClientProfileSummary {
  clientId: string;
  fullName: string;
  phone: string;
  email?: string;
  totalSpend: number;
  realizedSpend: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  firstVisitDate: string;
  lastVisitDate: string;
  preferredService: string;
  preferredServiceType: 'Studio Visit' | 'Home Service';
  appointments: Appointment[];
  tier: 'VIP Client' | 'Regular' | 'New Client';
  latestAddress?: string;
  notesList: string[];
}

interface ClientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProfileSummary | null;
  onBookForClient: (client: ClientProfileSummary) => void;
}

export const ClientHistoryModal: React.FC<ClientHistoryModalProps> = ({
  isOpen,
  onClose,
  client,
  onBookForClient
}) => {
  if (!isOpen || !client) return null;

  const handleStatusChange = async (aptId: string, newStatus: AppointmentStatus) => {
    await updateAppointmentInDatabase(aptId, { status: newStatus });
  };

  const handlePaymentStatusChange = async (aptId: string, newPaymentStatus: PaymentStatus) => {
    await updateAppointmentInDatabase(aptId, { paymentStatus: newPaymentStatus });
  };

  const avgSpend = client.totalAppointments > 0 
    ? Math.round(client.totalSpend / client.totalAppointments) 
    : 0;

  const completionRate = client.totalAppointments > 0 
    ? Math.round((client.completedAppointments / client.totalAppointments) * 100) 
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-white border border-[#E7DFD5] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Amber-Gold Accent Line */}
          <div className="h-1.5 bg-gradient-to-r from-[#B45309] via-[#D4AF37] via-[#C2410C] to-[#BE185D]" />

          {/* Header Bar */}
          <div className="p-6 bg-[#FAF5F0] border-b border-[#E7DFD5] flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Client Avatar with VIP badge indicator */}
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold font-serif shadow-xs ${
                  client.tier === 'VIP Client'
                    ? 'bg-gradient-to-tr from-[#B45309] via-[#D4AF37] to-[#C2410C] text-white ring-2 ring-[#D4AF37]'
                    : client.tier === 'Regular'
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                    : 'bg-stone-100 text-stone-700 border border-stone-200'
                }`}>
                  {client.fullName.charAt(0).toUpperCase()}
                </div>
                {client.tier === 'VIP Client' && (
                  <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-full shadow-xs">
                    <Award className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                    {client.fullName}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    client.tier === 'VIP Client'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : client.tier === 'Regular'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}>
                    {client.tier}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#57534E] mt-1">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>+91 {client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-1 text-[#78716C]">
                      <Mail className="w-3.5 h-3.5 text-[#A8A29E]" />
                      <span>{client.email}</span>
                    </div>
                  )}
                  <span className="text-[11px] text-[#A8A29E]">
                    Client Since: <strong className="text-[#1C1917]">{client.firstVisitDate}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-2">
              <a
                href={getWhatsAppUrl(`Hi ${client.fullName}, this is Rohit from RV Nails Art! Reaching out regarding your salon appointments.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 text-[#15803D] text-xs font-bold hover:bg-[#25D366]/20 transition-all"
                title="Message on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <a
                href={`tel:${client.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7DFD5] bg-white text-[#1C1917] text-xs font-semibold hover:bg-stone-50 transition-all shadow-xs"
                title="Call Client"
              >
                <Phone className="w-3.5 h-3.5 text-[#B45309]" />
                <span className="hidden sm:inline">Call</span>
              </a>

              <button
                onClick={() => {
                  onBookForClient(client);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#B45309] to-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Slot</span>
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white border border-[#E7DFD5] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center transition-all shadow-xs ml-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAF8F5]">
            
            {/* Lifetime Spend & Loyalty Analytics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Metric 1: Total Lifetime Spend */}
              <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                  <span>Total Lifetime Spend</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-700 font-serif">
                  ₹{client.totalSpend.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 font-medium">
                  ₹{client.realizedSpend.toLocaleString()} realized revenue
                </div>
              </div>

              {/* Metric 2: Total Visits & Completed */}
              <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                  <span>Total Bookings</span>
                  <Calendar className="w-4 h-4 text-[#B45309]" />
                </div>
                <div className="text-2xl font-bold text-[#1C1917] font-serif">
                  {client.totalAppointments}
                </div>
                <div className="text-[11px] text-[#78716C] mt-1">
                  {client.completedAppointments} completed ({completionRate}%)
                </div>
              </div>

              {/* Metric 3: Average Spend per Visit */}
              <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                  <span>Average Ticket Spend</span>
                  <Sparkles className="w-4 h-4 text-[#EA580C]" />
                </div>
                <div className="text-2xl font-bold text-[#1C1917] font-serif">
                  ₹{avgSpend.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#78716C] mt-1">
                  Per appointment average
                </div>
              </div>

              {/* Metric 4: Preferred Service & Venue */}
              <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                  <span>Favorite Service</span>
                  {client.preferredServiceType === 'Home Service' ? (
                    <Home className="w-4 h-4 text-[#0284C7]" />
                  ) : (
                    <MapPin className="w-4 h-4 text-[#B45309]" />
                  )}
                </div>
                <div className="text-sm font-bold text-[#1C1917] truncate" title={client.preferredService}>
                  {client.preferredService}
                </div>
                <div className="text-[11px] text-[#78716C] mt-1 truncate">
                  Prefers: <strong className="text-[#1C1917]">{client.preferredServiceType}</strong>
                </div>
              </div>
            </div>

            {/* Address & Preferences Strip (if available) */}
            {(client.latestAddress || client.notesList.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {client.latestAddress && (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E7DFD5] shadow-xs text-xs space-y-1">
                    <div className="font-bold text-[#1C1917] flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Client Doorstep Address:</span>
                    </div>
                    <p className="text-[#57534E] leading-relaxed">
                      {client.latestAddress}
                    </p>
                  </div>
                )}

                {client.notesList.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs text-xs space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>Client Preferences & Notes ({client.notesList.length}):</span>
                    </div>
                    <ul className="text-amber-800 space-y-0.5 list-disc pl-4 text-[11px]">
                      {client.notesList.map((n, idx) => (
                        <li key={idx}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Individual Appointment History Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-[#1C1917] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B45309]" />
                  <span>Individual Appointment History</span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-[#1C1917]">
                    {client.appointments.length} Total
                  </span>
                </h4>
                <span className="text-xs text-[#78716C]">
                  Most recent bookings first
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-[#E7DFD5] shadow-xs overflow-hidden divide-y divide-[#E7DFD5]">
                {client.appointments.map((apt, index) => (
                  <div 
                    key={apt.id} 
                    className="p-4 hover:bg-[#FAF8F5] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#1C1917] px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
                          {apt.bookingCode}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#1C1917]">
                          <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
                          <span>{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#EA580C]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{apt.timeSlot}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          apt.serviceType === 'Studio Visit'
                            ? 'bg-amber-50 text-[#92400E] border border-amber-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}>
                          {apt.serviceType === 'Studio Visit' ? <MapPin className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                          {apt.serviceType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1917]">{apt.service}</span>
                        {apt.nailDesign && (
                          <span className="text-[11px] text-[#B45309] font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {apt.nailDesign}
                          </span>
                        )}
                      </div>

                      {apt.notes && (
                        <p className="text-[11px] text-[#78716C] italic">
                          "{apt.notes}"
                        </p>
                      )}

                      {apt.adminNotes && (
                        <p className="text-[11px] text-emerald-800 font-medium">
                          📝 Rohit's Note: {apt.adminNotes}
                        </p>
                      )}
                    </div>

                    {/* Right financial & status controls */}
                    <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#1C1917]">
                          ₹{apt.amount.toLocaleString()}
                        </div>
                        <select
                          value={apt.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(apt.id, e.target.value as PaymentStatus)}
                          className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border focus:outline-none cursor-pointer ${
                            apt.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : apt.paymentStatus === 'deposit_paid'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-stone-100 text-stone-600 border-stone-300'
                          }`}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="deposit_paid">Deposit Paid</option>
                          <option value="paid">Fully Paid</option>
                        </select>
                      </div>

                      <div>
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer shadow-2xs ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : apt.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-300 animate-pulse'
                              : apt.status === 'completed'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : apt.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-[#FAF5F0] border-t border-[#E7DFD5] flex items-center justify-between">
            <div className="text-xs text-[#78716C]">
              Total Lifetime Value: <strong className="text-emerald-700 font-bold">₹{client.totalSpend.toLocaleString()}</strong> across <strong className="text-[#1C1917]">{client.totalAppointments}</strong> appointment(s)
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E7DFD5] bg-white hover:bg-stone-50 text-xs font-semibold text-[#1C1917] shadow-xs"
            >
              Close Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
