import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Home, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  MessageCircle, 
  Trash2, 
  Download, 
  RefreshCw, 
  ChevronRight,
  ShieldCheck,
  Award,
  Users,
  Lock,
  LogOut
} from 'lucide-react';
import { Appointment, AppointmentStatus, PaymentStatus } from '../types';
import { 
  updateAppointmentInDatabase, 
  deleteAppointmentFromDatabase, 
  bookAppointmentInDatabase,
  getEstimatedPrice 
} from '../lib/firebase';
import { TIME_SLOTS, getWhatsAppUrl } from '../data/nailData';
import { ClientHistoryModal, ClientProfileSummary } from './ClientHistoryModal';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  appointments
}) => {
  const { user, isAdmin, loginAsAdminWithCredentials, toggleAdminMode } = useAuth();
  const [gateIdentifier, setGateIdentifier] = useState('rohit@rvnails.com');
  const [gatePasskey, setGatePasskey] = useState('');
  const [gateLoading, setGateLoading] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'today' | 'tomorrow' | 'month' | 'all' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [walkInDefaultClient, setWalkInDefaultClient] = useState<{
    fullName?: string;
    phone?: string;
    address?: string;
    service?: string;
    serviceType?: 'Studio Visit' | 'Home Service';
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'appointments' | 'schedule' | 'progress_report' | 'clients'>('appointments');
  const [selectedAptForNotes, setSelectedAptForNotes] = useState<Appointment | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Selected client for Individual History & Lifetime Spend modal
  const [selectedClientProfile, setSelectedClientProfile] = useState<ClientProfileSummary | null>(null);

  // Today string
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const currentYearMonth = todayStr.substring(0, 7); // '2026-09'

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // 1. Date Filter
      if (selectedDateFilter === 'today' && apt.date !== todayStr) return false;
      if (selectedDateFilter === 'tomorrow' && apt.date !== tomorrowStr) return false;
      if (selectedDateFilter === 'month' && !apt.date.startsWith(currentYearMonth)) return false;
      if (selectedDateFilter === 'custom' && apt.date !== customDate) return false;

      // 2. Status Filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

      // 3. Service Type Filter
      if (serviceTypeFilter !== 'all' && apt.serviceType !== serviceTypeFilter) return false;

      // 4. Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = apt.fullName.toLowerCase().includes(q);
        const matchesPhone = apt.phone.includes(q);
        const matchesCode = apt.bookingCode.toLowerCase().includes(q);
        const matchesService = apt.service.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesCode && !matchesService) return false;
      }

      return true;
    });
  }, [appointments, selectedDateFilter, customDate, statusFilter, serviceTypeFilter, searchQuery, todayStr, tomorrowStr, currentYearMonth]);

  // Clients Directory & Lifetime Spend Analytics
  const clientsDirectory = useMemo(() => {
    const map = new Map<string, {
      fullName: string;
      phone: string;
      email?: string;
      appointments: Appointment[];
    }>();

    appointments.forEach((apt) => {
      // Group by normalized 10-digit phone or client full name
      const key = apt.phone?.trim() || apt.fullName.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, {
          fullName: apt.fullName,
          phone: apt.phone,
          email: apt.email,
          appointments: []
        });
      }
      const record = map.get(key)!;
      // Prefer most complete name
      if (apt.fullName && apt.fullName.length >= record.fullName.length) {
        record.fullName = apt.fullName;
      }
      if (apt.email && !record.email) {
        record.email = apt.email;
      }
      record.appointments.push(apt);
    });

    return Array.from(map.entries()).map(([key, data]) => {
      // Sort appointments newest first
      const sortedApts = [...data.appointments].sort((a, b) => {
        const timeA = new Date(`${a.date}T${a.timeSlot?.split(' - ')[0] || '00:00'}`).getTime();
        const timeB = new Date(`${b.date}T${b.timeSlot?.split(' - ')[0] || '00:00'}`).getTime();
        return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      });

      const totalSpend = data.appointments.reduce((sum, a) => sum + (a.amount || 0), 0);
      const realizedSpend = data.appointments
        .filter((a) => a.paymentStatus === 'paid' || a.status === 'completed')
        .reduce((sum, a) => sum + (a.amount || 0), 0);
      const completedAppointments = data.appointments.filter((a) => a.status === 'completed').length;
      const cancelledAppointments = data.appointments.filter((a) => a.status === 'cancelled').length;

      // Preferred service & location counts
      const serviceCounts: Record<string, number> = {};
      let studioCount = 0;
      let homeCount = 0;
      const notesList: string[] = [];
      let latestAddress: string | undefined;

      data.appointments.forEach((a) => {
        serviceCounts[a.service] = (serviceCounts[a.service] || 0) + 1;
        if (a.serviceType === 'Studio Visit') studioCount++;
        if (a.serviceType === 'Home Service') {
          homeCount++;
          if (a.address && !latestAddress) latestAddress = a.address;
        }
        if (a.adminNotes?.trim()) notesList.push(`Rohit note: ${a.adminNotes.trim()}`);
        if (a.notes?.trim()) notesList.push(`Client preference: "${a.notes.trim()}"`);
      });

      let preferredService = Object.keys(serviceCounts)[0] || 'Nail Art & Design';
      let maxSrvCount = 0;
      Object.entries(serviceCounts).forEach(([srv, count]) => {
        if (count > maxSrvCount) {
          maxSrvCount = count;
          preferredService = srv;
        }
      });

      // VIP determination: total spend >= ₹4,000 or 3+ bookings
      const tier: 'VIP Client' | 'Regular' | 'New Client' = 
        totalSpend >= 4000 || data.appointments.length >= 3
          ? 'VIP Client'
          : data.appointments.length >= 2
          ? 'Regular'
          : 'New Client';

      const dates = data.appointments.map((a) => a.date).sort();
      const firstVisitDate = dates[0] || 'N/A';
      const lastVisitDate = dates[dates.length - 1] || 'N/A';

      const summary: ClientProfileSummary = {
        clientId: key,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        totalSpend,
        realizedSpend,
        totalAppointments: data.appointments.length,
        completedAppointments,
        cancelledAppointments,
        firstVisitDate,
        lastVisitDate,
        preferredService,
        preferredServiceType: homeCount > studioCount ? 'Home Service' : 'Studio Visit',
        appointments: sortedApts,
        tier,
        latestAddress,
        notesList: Array.from(new Set(notesList))
      };

      return summary;
    }).sort((a, b) => b.totalSpend - a.totalSpend); // Sorted by highest spend first
  }, [appointments]);

  // Filtered clients list for the Clients tab
  const filteredClients = useMemo(() => {
    if (!clientSearchQuery.trim()) return clientsDirectory;
    const q = clientSearchQuery.toLowerCase().trim();
    return clientsDirectory.filter(
      (c) => 
        c.fullName.toLowerCase().includes(q) || 
        c.phone.includes(q) || 
        (c.email && c.email.toLowerCase().includes(q)) ||
        c.preferredService.toLowerCase().includes(q)
    );
  }, [clientsDirectory, clientSearchQuery]);

  // Handler to open a client's profile from any appointment row or schedule slot
  const handleOpenClientProfile = (phoneOrKey: string, fullNameFallback?: string) => {
    const key = phoneOrKey?.trim() || fullNameFallback?.toLowerCase().trim() || '';
    const found = clientsDirectory.find((c) => c.phone === key || c.clientId === key || c.fullName.toLowerCase() === key.toLowerCase());
    if (found) {
      setSelectedClientProfile(found);
    } else {
      // Fallback if not grouped yet: filter appointments matching this person
      const matchingApts = appointments.filter((a) => 
        (phoneOrKey && a.phone === phoneOrKey) || 
        (fullNameFallback && a.fullName.toLowerCase() === fullNameFallback.toLowerCase())
      );
      if (matchingApts.length > 0) {
        const totalSpend = matchingApts.reduce((sum, a) => sum + (a.amount || 0), 0);
        setSelectedClientProfile({
          clientId: key,
          fullName: fullNameFallback || matchingApts[0].fullName,
          phone: phoneOrKey || matchingApts[0].phone,
          email: matchingApts[0].email,
          totalSpend,
          realizedSpend: totalSpend,
          totalAppointments: matchingApts.length,
          completedAppointments: matchingApts.filter(a => a.status === 'completed').length,
          cancelledAppointments: matchingApts.filter(a => a.status === 'cancelled').length,
          firstVisitDate: matchingApts[0].date,
          lastVisitDate: matchingApts[matchingApts.length - 1].date,
          preferredService: matchingApts[0].service,
          preferredServiceType: matchingApts[0].serviceType,
          appointments: matchingApts,
          tier: totalSpend >= 4000 ? 'VIP Client' : 'Regular',
          notesList: []
        });
      }
    }
  };

  // Keep selectedClientProfile in sync when appointments update
  useMemo(() => {
    if (selectedClientProfile) {
      const updated = clientsDirectory.find((c) => c.clientId === selectedClientProfile.clientId);
      if (updated) {
        setSelectedClientProfile(updated);
      }
    }
  }, [clientsDirectory]);

  // Overall Business Metrics (Progress Report & Monthly Totals)
  const metrics = useMemo(() => {
    const todayList = appointments.filter((a) => a.date === todayStr);
    const todayCompleted = todayList.filter((a) => a.status === 'completed').length;
    const todayPending = todayList.filter((a) => a.status === 'pending').length;

    const monthList = appointments.filter((a) => a.date.startsWith(currentYearMonth));
    const monthlyTotalCount = monthList.length;
    const monthlyRevenue = monthList.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const monthlyRealizedRevenue = monthList
      .filter((a) => a.paymentStatus === 'paid' || a.status === 'completed')
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const totalRevenue = appointments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const allPending = appointments.filter((a) => a.status === 'pending').length;
    const allConfirmed = appointments.filter((a) => a.status === 'confirmed').length;

    const studioCount = monthList.filter((a) => a.serviceType === 'Studio Visit').length;
    const homeCount = monthList.filter((a) => a.serviceType === 'Home Service').length;

    const vipClientsCount = clientsDirectory.filter((c) => c.tier === 'VIP Client').length;

    return {
      todayCount: todayList.length,
      todayCompleted,
      todayPending,
      todayCompletionRate: todayList.length ? Math.round((todayCompleted / todayList.length) * 100) : 0,
      monthlyTotalCount,
      monthlyRevenue,
      monthlyRealizedRevenue,
      totalRevenue,
      allPending,
      allConfirmed,
      studioCount,
      homeCount,
      homeRatio: monthlyTotalCount ? Math.round((homeCount / monthlyTotalCount) * 100) : 0,
      uniqueClientsCount: clientsDirectory.length,
      vipClientsCount
    };
  }, [appointments, todayStr, currentYearMonth, clientsDirectory]);

  // Handle status update in Firestore
  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    await updateAppointmentInDatabase(id, { status: newStatus });
  };

  // Handle payment status update in Firestore
  const handlePaymentStatusChange = async (id: string, newPaymentStatus: PaymentStatus) => {
    await updateAppointmentInDatabase(id, { paymentStatus: newPaymentStatus });
  };

  // Handle deleting appointment
  const handleDeleteAppointment = async (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to remove appointment ${code}?`)) {
      await deleteAppointmentFromDatabase(id);
    }
  };

  // Save internal salon note
  const handleSaveNote = async () => {
    if (!selectedAptForNotes) return;
    await updateAppointmentInDatabase(selectedAptForNotes.id, {
      adminNotes: noteInput
    });
    setSelectedAptForNotes(null);
    setNoteInput('');
  };

  // Export CSV of appointments
  const handleExportCSV = () => {
    const headers = ['Booking Code', 'Client Name', 'Phone', 'Date', 'Time Slot', 'Service', 'Nail Design', 'Location', 'Amount (INR)', 'Payment Status', 'Status', 'Notes'];
    const rows = filteredAppointments.map((a) => [
      a.bookingCode,
      `"${a.fullName}"`,
      a.phone,
      a.date,
      a.timeSlot,
      `"${a.service}"`,
      `"${a.nailDesign || ''}"`,
      `"${a.serviceType}"`,
      a.amount,
      a.paymentStatus,
      a.status,
      `"${a.notes || a.adminNotes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RV_Nails_Appointments_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // STRICT ACCESS CONTROL: If current user is not verified admin, block data and show security gate
  if (!isAdmin) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-[#FFFDFB] border border-[#E7DFD5] rounded-3xl shadow-2xl overflow-hidden text-[#1C1917]"
          >
            <div className="bg-[#1C1917] p-6 text-white text-center relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B45309] to-[#D4AF37] flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold">Salon Portal Restricted</h3>
              <p className="text-xs text-stone-300 mt-1">
                Rohit & Authorized Salon Management Access Only
              </p>
            </div>

            <div className="p-6">
              {user ? (
                <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Signed in as Client Account</p>
                    <p className="text-stone-700 truncate font-mono text-[11px]">{user.displayName || user.email || user.phoneNumber}</p>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Normal clients cannot view bookings or financial reports. Enter the salon administrator passkey to continue.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#78716C] mb-4">
                  This portal contains confidential client records, appointment schedules, and salon revenue analytics.
                </p>
              )}

              {gateError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{gateError}</span>
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setGateError(null);
                  if (!gatePasskey.trim()) {
                    setGateError('Please enter administrator passkey.');
                    return;
                  }
                  try {
                    setGateLoading(true);
                    await loginAsAdminWithCredentials(gateIdentifier, gatePasskey.trim());
                  } catch (err: any) {
                    setGateError(err.message || 'Access Denied: Invalid Administrator credentials.');
                  } finally {
                    setGateLoading(false);
                  }
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                    Manager Email / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={gateIdentifier}
                    onChange={(e) => setGateIdentifier(e.target.value)}
                    className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
                    placeholder="rohit@rvnails.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                    Administrator Passkey
                  </label>
                  <input
                    type="password"
                    required
                    value={gatePasskey}
                    onChange={(e) => setGatePasskey(e.target.value)}
                    className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
                    placeholder="Enter passkey (e.g. rvadmin)"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Master passkey: <code className="px-1 py-0.5 rounded bg-stone-100 font-mono text-[#B45309] font-bold">rvadmin</code>
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Return to Site
                  </button>
                  <button
                    type="submit"
                    disabled={gateLoading}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {gateLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>Unlock Suite</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-7xl h-[94vh] bg-[#FAF8F5] border border-[#E7DFD5] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1C1917]"
        >
          {/* Header */}
          <div className="bg-white border-b border-[#E7DFD5] px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B45309] to-[#D4AF37] flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                    Rohit Salon Manager & Admin Suite
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Cloud Sync
                  </span>
                </div>
                <p className="text-xs text-[#78716C]">
                  Real-time appointments, individual client history & lifetime spend, schedule runway, and revenue reports
                </p>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setWalkInDefaultClient(null);
                  setIsWalkInModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Walk-In Booking</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E7DFD5] bg-white hover:bg-stone-50 text-[#1C1917] text-xs font-semibold shadow-xs"
                title="Export appointments to CSV spreadsheet"
              >
                <Download className="w-4 h-4 text-[#78716C]" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => {
                  toggleAdminMode(false);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold shadow-2xs transition-colors"
                title="Lock portal and return to client site"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Portal</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl border border-[#E7DFD5] bg-white hover:bg-stone-50 text-[#78716C] hover:text-[#1C1917] transition-colors"
                aria-label="Close dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Appointments, Schedule, Progress Report, Clients & Lifetime Spend) */}
          <div className="bg-[#FAF5F0] border-b border-[#E7DFD5] px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'appointments'
                    ? 'bg-white text-[#B45309] shadow-xs border border-[#E7DFD5]'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Appointments List</span>
                <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-[10px] text-[#1C1917]">
                  {filteredAppointments.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'schedule'
                    ? 'bg-white text-[#B45309] shadow-xs border border-[#E7DFD5]'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Today's Time Slots</span>
                <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-[10px] text-[#1C1917]">
                  {metrics.todayCount}
                </span>
              </button>

              {/* NEW TAB: Clients & Lifetime Spend */}
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'clients'
                    ? 'bg-white text-[#B45309] shadow-xs border border-[#E7DFD5]'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Clients & Lifetime Spend</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] font-bold text-[10px]">
                  {clientsDirectory.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('progress_report')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'progress_report'
                    ? 'bg-white text-[#B45309] shadow-xs border border-[#E7DFD5]'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Monthly Progress & Totals</span>
              </button>
            </div>

            <div className="text-xs text-[#78716C] hidden lg:block shrink-0">
              Today: <strong className="text-[#1C1917]">{todayStr}</strong>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* KPI Overview Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Card 1: Today Appointments */}
              <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                  <span>Today's Bookings</span>
                  <Calendar className="w-4 h-4 text-[#B45309]" />
                </div>
                <div className="text-2xl font-bold text-[#1C1917] font-serif">
                  {metrics.todayCount}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                  <span>{metrics.todayCompleted} completed</span> • <span>{metrics.todayPending} pending</span>
                </div>
              </div>

              {/* Card 2: Pending Confirmations */}
              <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                  <span>Pending Action</span>
                  <AlertCircle className="w-4 h-4 text-[#EA580C]" />
                </div>
                <div className="text-2xl font-bold text-[#EA580C] font-serif">
                  {metrics.allPending}
                </div>
                <div className="text-[11px] text-[#78716C] mt-1">
                  Needs review or call
                </div>
              </div>

              {/* Card 3: Monthly Total Bookings */}
              <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                  <span>Monthly Volume ({currentYearMonth})</span>
                  <Sparkles className="w-4 h-4 text-[#B45309]" />
                </div>
                <div className="text-2xl font-bold text-[#1C1917] font-serif">
                  {metrics.monthlyTotalCount}
                </div>
                <div className="text-[11px] text-[#78716C] mt-1">
                  {metrics.studioCount} Studio • {metrics.homeCount} Home
                </div>
              </div>

              {/* Card 4: Monthly Realized Revenue */}
              <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                  <span>Monthly Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-700 font-serif">
                  ₹{metrics.monthlyRealizedRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#78716C] mt-1 truncate">
                  of ₹{metrics.monthlyRevenue.toLocaleString()} projected
                </div>
              </div>

              {/* Card 5: Unique Clients & VIPs */}
              <div 
                onClick={() => setActiveTab('clients')}
                className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs cursor-pointer hover:border-[#B45309] transition-all group"
                title="Click to view all clients & lifetime spend"
              >
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                  <span>Clients Directory</span>
                  <Award className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-bold text-[#1C1917] font-serif flex items-center justify-between">
                  <span>{metrics.uniqueClientsCount}</span>
                  <span className="text-xs text-amber-800 font-sans font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                    {metrics.vipClientsCount} VIP
                  </span>
                </div>
                <div className="text-[11px] text-[#B45309] mt-1 font-semibold group-hover:underline">
                  View Lifetime Spend →
                </div>
              </div>
            </div>

            {/* TAB 1: Appointments List */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs flex flex-wrap items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by client, phone, or code (e.g. RV-8192)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 pl-10 pr-4 text-xs text-[#1C1917] focus:outline-none"
                    />
                  </div>

                  {/* Date Filter Buttons */}
                  <div className="flex items-center gap-1 bg-[#FAF5F0] p-1 rounded-xl border border-[#E7DFD5] overflow-x-auto">
                    <button
                      onClick={() => setSelectedDateFilter('today')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedDateFilter === 'today' ? 'bg-white text-[#B45309] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setSelectedDateFilter('tomorrow')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedDateFilter === 'tomorrow' ? 'bg-white text-[#B45309] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'
                      }`}
                    >
                      Tomorrow
                    </button>
                    <button
                      onClick={() => setSelectedDateFilter('month')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedDateFilter === 'month' ? 'bg-white text-[#B45309] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'
                      }`}
                    >
                      This Month
                    </button>
                    <button
                      onClick={() => setSelectedDateFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedDateFilter === 'all' ? 'bg-white text-[#B45309] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'
                      }`}
                    >
                      All
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] font-semibold focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Service Location Dropdown */}
                  <select
                    value={serviceTypeFilter}
                    onChange={(e) => setServiceTypeFilter(e.target.value)}
                    className="bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] font-semibold focus:outline-none"
                  >
                    <option value="all">All Locations</option>
                    <option value="Studio Visit">Studio Visits Only</option>
                    <option value="Home Service">Doorstep Home Only</option>
                  </select>
                </div>

                {/* Table of Appointments */}
                {filteredAppointments.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E7DFD5] p-12 text-center shadow-xs">
                    <Calendar className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-60" />
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">No Appointments Found</h3>
                    <p className="text-xs text-[#78716C] mt-1 max-w-sm mx-auto">
                      No records match your active search or filters. You can add a new walk-in client or adjust the filter criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDateFilter('all');
                        setStatusFilter('all');
                        setServiceTypeFilter('all');
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#1C1917]"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#E7DFD5] shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF5F0] border-b border-[#E7DFD5] text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
                            <th className="py-3.5 px-4">Code / Time</th>
                            <th className="py-3.5 px-4">Client (Click for Spend & History)</th>
                            <th className="py-3.5 px-4">Service & Design</th>
                            <th className="py-3.5 px-4">Location</th>
                            <th className="py-3.5 px-4">Amount & Payment</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7DFD5]">
                          {filteredAppointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-[#FAF8F5] transition-colors">
                              {/* Code & Time */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-mono font-bold text-xs text-[#1C1917] px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
                                  {apt.bookingCode}
                                </span>
                                <div className="text-[#57534E] font-semibold mt-1 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                                  <span>{apt.timeSlot}</span>
                                </div>
                                <div className="text-[10px] text-[#A8A29E] mt-0.5">
                                  {apt.date}
                                </div>
                              </td>

                              {/* Client Details & Contact - CLICKABLE FOR CLIENT HISTORY & LIFETIME SPEND */}
                              <td className="py-3.5 px-4">
                                <button
                                  onClick={() => handleOpenClientProfile(apt.phone, apt.fullName)}
                                  className="text-left group/client focus:outline-none block"
                                  title="Click to view client appointment history & total lifetime spend"
                                >
                                  <div className="font-bold text-[#1C1917] group-hover/client:text-[#B45309] group-hover/client:underline flex items-center gap-1.5 transition-colors">
                                    <span>{apt.fullName}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-[#92400E] font-semibold border border-amber-200 flex items-center gap-0.5 opacity-80 group-hover/client:opacity-100 group-hover/client:scale-105 transition-all">
                                      <User className="w-2.5 h-2.5" />
                                      Spend & History
                                    </span>
                                  </div>
                                </button>

                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[#57534E] text-[11px]">+91 {apt.phone}</span>
                                  <a
                                    href={getWhatsAppUrl(`Hi ${apt.fullName}, this is Rohit from RV Nails Art regarding your appointment ${apt.bookingCode} on ${apt.date} at ${apt.timeSlot}.`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-md bg-[#25D366]/10 text-[#15803D] hover:bg-[#25D366]/20 transition-colors"
                                    title="Message client on WhatsApp"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 fill-current text-[#25D366]" />
                                  </a>
                                  <a
                                    href={`tel:${apt.phone}`}
                                    className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-[#57534E]"
                                    title="Call client"
                                  >
                                    <Phone className="w-3 h-3 text-[#B45309]" />
                                  </a>
                                </div>
                              </td>

                              {/* Service & Design Art */}
                              <td className="py-3.5 px-4 max-w-[220px]">
                                <div className="font-semibold text-[#1C1917] truncate">{apt.service}</div>
                                {apt.nailDesign && (
                                  <div className="text-[11px] text-[#B45309] font-medium truncate flex items-center gap-1 mt-0.5">
                                    <Sparkles className="w-3 h-3 text-[#B45309]" />
                                    <span>{apt.nailDesign}</span>
                                  </div>
                                )}
                                {apt.notes && (
                                  <div className="text-[10px] text-[#78716C] italic truncate mt-0.5">
                                    "{apt.notes}"
                                  </div>
                                )}
                              </td>

                              {/* Location */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    apt.serviceType === 'Studio Visit'
                                      ? 'bg-amber-50 text-[#92400E] border border-amber-200'
                                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                                  }`}
                                >
                                  {apt.serviceType === 'Studio Visit' ? <MapPin className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                                  {apt.serviceType}
                                </span>
                                {apt.address && (
                                  <div className="text-[10px] text-[#78716C] max-w-[150px] truncate mt-1" title={apt.address}>
                                    {apt.address}
                                  </div>
                                )}
                              </td>

                              {/* Amount & Payment Status */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-bold text-[#1C1917]">₹{apt.amount.toLocaleString()}</div>
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
                              </td>

                              {/* Status Dropdown */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <select
                                  value={apt.status}
                                  onChange={(e) => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                                  className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer shadow-2xs ${
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

                                {apt.adminNotes && (
                                  <div className="text-[10px] text-emerald-700 font-medium truncate max-w-[120px] mt-1" title={apt.adminNotes}>
                                    📝 {apt.adminNotes}
                                  </div>
                                )}
                              </td>

                              {/* Row Actions */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Quick Client Profile Button */}
                                  <button
                                    onClick={() => handleOpenClientProfile(apt.phone, apt.fullName)}
                                    className="p-1.5 rounded-lg text-xs text-[#B45309] bg-[#FEF3C7]/70 hover:bg-[#FEF3C7] border border-[#FDE68A] flex items-center gap-1 font-semibold transition-all hover:scale-105"
                                    title="View client's individual appointment history & lifetime spend"
                                  >
                                    <User className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Profile</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedAptForNotes(apt);
                                      setNoteInput(apt.adminNotes || '');
                                    }}
                                    className="p-1.5 rounded-lg text-xs text-[#78716C] hover:text-[#1C1917] hover:bg-stone-100"
                                    title="Add internal salon note"
                                  >
                                    📝
                                  </button>

                                  <button
                                    onClick={() => handleDeleteAppointment(apt.id, apt.bookingCode)}
                                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                    title="Delete appointment"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Today's Time Slots Runway */}
            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] shadow-xs flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                      Today's Chair & Doorstep Runway ({todayStr})
                    </h3>
                    <p className="text-xs text-[#78716C]">
                      Manage Rohit's hourly capacity, studio sessions, and travel slots. Click any booked client to review lifetime spend.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-[#B45309]">
                    {metrics.todayCount} Scheduled / {TIME_SLOTS.length} Slots
                  </div>
                </div>

                {/* Slots Runway */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TIME_SLOTS.map((slot) => {
                    const bookedApt = appointments.find((a) => a.date === todayStr && a.timeSlot === slot);

                    return (
                      <div
                        key={slot}
                        className={`p-4 rounded-2xl border transition-all ${
                          bookedApt
                            ? bookedApt.status === 'completed'
                              ? 'bg-purple-50/50 border-purple-200'
                              : bookedApt.status === 'in_progress'
                              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-400'
                              : 'bg-[#FAF8F5] border-[#D4AF37]/50 shadow-xs'
                            : 'bg-stone-50/50 border-dashed border-stone-200 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                            {slot}
                          </span>
                          {bookedApt ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border text-[#B45309]">
                              {bookedApt.status.replace('_', ' ')}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-stone-400 uppercase">
                              Available Slot
                            </span>
                          )}
                        </div>

                        {bookedApt ? (
                          <div className="space-y-1.5">
                            <div className="font-bold text-xs text-[#1C1917] flex items-center justify-between">
                              <button
                                onClick={() => handleOpenClientProfile(bookedApt.phone, bookedApt.fullName)}
                                className="font-bold text-xs text-[#1C1917] hover:text-[#B45309] hover:underline text-left flex items-center gap-1"
                                title="Click to view client profile & lifetime spend"
                              >
                                <span>{bookedApt.fullName}</span>
                                <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 text-[#92400E]">👤 Spend</span>
                              </button>
                              <span className="font-mono text-[10px] text-[#78716C]">{bookedApt.bookingCode}</span>
                            </div>
                            <div className="text-[11px] text-[#57534E] truncate">
                              {bookedApt.service}
                            </div>
                            <div className="text-[10px] text-[#78716C] flex items-center justify-between pt-1">
                              <span>{bookedApt.serviceType}</span>
                              <span className="font-bold text-[#1C1917]">₹{bookedApt.amount}</span>
                            </div>
                            {bookedApt.address && (
                              <div className="text-[10px] text-[#0284C7] truncate">
                                📍 {bookedApt.address}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-3 text-center">
                            <button
                              onClick={() => {
                                setWalkInDefaultClient(null);
                                setIsWalkInModalOpen(true);
                              }}
                              className="text-[11px] font-bold text-[#B45309] hover:underline"
                            >
                              + Book Walk-in for {slot}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: CLIENTS DIRECTORY & LIFETIME SPEND */}
            {activeTab === 'clients' && (
              <div className="space-y-4">
                {/* Search & Overview Header */}
                <div className="bg-white p-5 rounded-2xl border border-[#E7DFD5] shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917] flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#B45309]" />
                        <span>Client Loyalty, Spend & History Directory</span>
                      </h3>
                      <p className="text-xs text-[#78716C]">
                        Click on any client to view their individual appointment history, total lifetime spend, preferred services, and internal notes.
                      </p>
                    </div>

                    <div className="relative min-w-[260px]">
                      <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search client by name, phone, or service..."
                        value={clientSearchQuery}
                        onChange={(e) => setClientSearchQuery(e.target.value)}
                        className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 pl-10 pr-4 text-xs text-[#1C1917] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* High-Impact Stat Strip for Clients */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#FAF0E6]">
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7DFD5]">
                      <span className="text-[11px] text-[#78716C] block">Total Unique Clients</span>
                      <strong className="text-xl font-bold font-serif text-[#1C1917]">{clientsDirectory.length}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7DFD5]">
                      <span className="text-[11px] text-[#78716C] block">VIP High-Spend Clients</span>
                      <strong className="text-xl font-bold font-serif text-[#B45309]">{metrics.vipClientsCount}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7DFD5]">
                      <span className="text-[11px] text-[#78716C] block">All-Time Client Revenue</span>
                      <strong className="text-xl font-bold font-serif text-emerald-700">₹{metrics.totalRevenue.toLocaleString()}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7DFD5]">
                      <span className="text-[11px] text-[#78716C] block">Avg. Client Lifetime Spend</span>
                      <strong className="text-xl font-bold font-serif text-[#1C1917]">
                        ₹{clientsDirectory.length > 0 ? Math.round(metrics.totalRevenue / clientsDirectory.length).toLocaleString() : 0}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Clients Grid & Table */}
                {filteredClients.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E7DFD5] p-12 text-center shadow-xs">
                    <User className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-60" />
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">No Clients Found</h3>
                    <p className="text-xs text-[#78716C] mt-1">No client matches "{clientSearchQuery}".</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#E7DFD5] shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF5F0] border-b border-[#E7DFD5] text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
                            <th className="py-3.5 px-4">Client Name & Tier</th>
                            <th className="py-3.5 px-4">Contact</th>
                            <th className="py-3.5 px-4">Total Lifetime Spend</th>
                            <th className="py-3.5 px-4">Visits / Bookings</th>
                            <th className="py-3.5 px-4">Favorite Service</th>
                            <th className="py-3.5 px-4">Last Visit</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7DFD5]">
                          {filteredClients.map((c) => (
                            <tr 
                              key={c.clientId}
                              onClick={() => setSelectedClientProfile(c)}
                              className="hover:bg-[#FAF8F5] cursor-pointer transition-colors group"
                            >
                              {/* Avatar & Name */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-serif text-xs ${
                                    c.tier === 'VIP Client'
                                      ? 'bg-gradient-to-tr from-[#B45309] to-[#D4AF37] text-white ring-2 ring-amber-300'
                                      : c.tier === 'Regular'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                      : 'bg-stone-100 text-stone-700'
                                  }`}>
                                    {c.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#1C1917] group-hover:text-[#B45309] transition-colors flex items-center gap-1.5">
                                      <span>{c.fullName}</span>
                                    </div>
                                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded mt-0.5 ${
                                      c.tier === 'VIP Client'
                                        ? 'bg-amber-100 text-amber-900'
                                        : c.tier === 'Regular'
                                        ? 'bg-sky-50 text-sky-700'
                                        : 'bg-stone-100 text-stone-600'
                                    }`}>
                                      {c.tier}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Phone & WhatsApp */}
                              <td className="py-3.5 px-4">
                                <div className="font-medium text-[#1C1917]">+91 {c.phone}</div>
                                {c.email && (
                                  <div className="text-[10px] text-[#78716C] truncate max-w-[140px]">{c.email}</div>
                                )}
                              </td>

                              {/* Lifetime Spend */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-sm text-emerald-700 font-serif">
                                  ₹{c.totalSpend.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-emerald-600">
                                  ₹{c.realizedSpend.toLocaleString()} paid
                                </div>
                              </td>

                              {/* Visits */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#1C1917]">{c.totalAppointments} appointment(s)</div>
                                <div className="text-[10px] text-[#78716C]">
                                  {c.completedAppointments} completed
                                </div>
                              </td>

                              {/* Favorite Service */}
                              <td className="py-3.5 px-4 max-w-[180px]">
                                <div className="font-medium text-[#1C1917] truncate">{c.preferredService}</div>
                                <div className="text-[10px] text-[#78716C]">{c.preferredServiceType}</div>
                              </td>

                              {/* Last Visit */}
                              <td className="py-3.5 px-4 whitespace-nowrap text-[#57534E]">
                                {c.lastVisitDate}
                              </td>

                              {/* Action Button */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedClientProfile(c);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] group-hover:border-[#B45309] group-hover:bg-[#FAF5F0] text-xs font-bold text-[#B45309] shadow-xs flex items-center gap-1.5 ml-auto transition-all"
                                >
                                  <span>View History & Spend</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Progress Report & Monthly Totals */}
            {activeTab === 'progress_report' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Section 1: Financial & Volume Progress */}
                <div className="bg-white p-6 rounded-2xl border border-[#E7DFD5] shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917] flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      Monthly Financial Progress ({currentYearMonth})
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Realized Revenue (Collected)</span>
                        <span className="text-emerald-700 font-bold">
                          ₹{metrics.monthlyRealizedRevenue.toLocaleString()} / ₹{metrics.monthlyRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                          style={{
                            width: `${metrics.monthlyRevenue ? Math.min(100, Math.round((metrics.monthlyRealizedRevenue / metrics.monthlyRevenue) * 100)) : 0}%`
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[#78716C] mt-1 block">
                        Collection Rate:{' '}
                        <strong>
                          {metrics.monthlyRevenue ? Math.round((metrics.monthlyRealizedRevenue / metrics.monthlyRevenue) * 100) : 0}%
                        </strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100">
                      <div className="p-3 bg-[#FAF8F5] rounded-xl">
                        <span className="text-[11px] text-[#78716C] block">Average Ticket Size</span>
                        <strong className="text-lg font-bold text-[#1C1917]">
                          ₹{metrics.monthlyTotalCount ? Math.round(metrics.monthlyRevenue / metrics.monthlyTotalCount).toLocaleString() : 0}
                        </strong>
                      </div>

                      <div className="p-3 bg-[#FAF8F5] rounded-xl">
                        <span className="text-[11px] text-[#78716C] block">All-Time Gross Volume</span>
                        <strong className="text-lg font-bold text-[#B45309]">
                          ₹{metrics.totalRevenue.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Service Distribution & Home Ratio */}
                <div className="bg-white p-6 rounded-2xl border border-[#E7DFD5] shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917] flex items-center gap-2">
                      <Home className="w-5 h-5 text-[#B45309]" />
                      Studio vs Doorstep Ratio
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Doorstep Home Service Share</span>
                        <span className="text-[#B45309] font-bold">
                          {metrics.homeRatio}% ({metrics.homeCount} of {metrics.monthlyTotalCount})
                        </span>
                      </div>
                      <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
                        <div
                          className="h-full bg-gradient-to-r from-[#B45309] to-[#EA580C] transition-all duration-500"
                          style={{ width: `${metrics.homeRatio}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100">
                      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7DFD5]">
                        <div className="flex items-center gap-1.5 text-xs text-[#78716C] mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                          <span>Studio Sessions</span>
                        </div>
                        <strong className="text-xl font-bold text-[#1C1917]">{metrics.studioCount}</strong>
                      </div>

                      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7DFD5]">
                        <div className="flex items-center gap-1.5 text-xs text-[#78716C] mb-1">
                          <Home className="w-3.5 h-3.5 text-[#0284C7]" />
                          <span>Doorstep Visits</span>
                        </div>
                        <strong className="text-xl font-bold text-[#0284C7]">{metrics.homeCount}</strong>
                      </div>
                    </div>

                    {/* Operational Safety / Hygiene Status */}
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Autoclave medical-grade sterilization protocol active for all upcoming appointments.</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Individual Client History & Total Lifetime Spend Modal */}
          <ClientHistoryModal
            isOpen={!!selectedClientProfile}
            onClose={() => setSelectedClientProfile(null)}
            client={selectedClientProfile}
            onBookForClient={(clientSummary) => {
              setSelectedClientProfile(null);
              setWalkInDefaultClient({
                fullName: clientSummary.fullName,
                phone: clientSummary.phone,
                address: clientSummary.latestAddress,
                service: clientSummary.preferredService,
                serviceType: clientSummary.preferredServiceType
              });
              setIsWalkInModalOpen(true);
            }}
          />

          {/* Walk-in Booking Modal */}
          {isWalkInModalOpen && (
            <WalkInModal
              isOpen={isWalkInModalOpen}
              defaultClient={walkInDefaultClient}
              onClose={() => {
                setIsWalkInModalOpen(false);
                setWalkInDefaultClient(null);
              }}
            />
          )}

          {/* Internal Note Modal */}
          {selectedAptForNotes && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
              <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E7DFD5]">
                <h4 className="font-serif text-lg font-bold text-[#1C1917] mb-1">
                  Internal Salon Note
                </h4>
                <p className="text-xs text-[#78716C] mb-4">
                  For {selectedAptForNotes.fullName} ({selectedAptForNotes.bookingCode})
                </p>
                <textarea
                  rows={3}
                  placeholder="e.g. Requested coffin shape, prefers soft pink glaze, running 10 mins late..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl p-3 text-xs text-[#1C1917] focus:border-[#B45309] focus:outline-none"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setSelectedAptForNotes(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl bg-[#B45309] text-white text-xs font-bold hover:bg-[#92400E]"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Subcomponent: Add Walk-in Modal
const WalkInModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  defaultClient?: {
    fullName?: string;
    phone?: string;
    address?: string;
    service?: string;
    serviceType?: 'Studio Visit' | 'Home Service';
  } | null;
}> = ({ isOpen, onClose, defaultClient }) => {
  const [fullName, setFullName] = useState(defaultClient?.fullName || '');
  const [phone, setPhone] = useState(defaultClient?.phone || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [service, setService] = useState(defaultClient?.service || 'Nail Art & Design');
  const [serviceType, setServiceType] = useState<'Studio Visit' | 'Home Service'>(defaultClient?.serviceType || 'Studio Visit');
  const [address, setAddress] = useState(defaultClient?.address || '');
  const [nailDesign, setNailDesign] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please provide client name and phone number.');
      return;
    }
    setSubmitting(true);
    try {
      await bookAppointmentInDatabase({
        fullName,
        phone,
        date,
        timeSlot,
        service,
        serviceType,
        address: serviceType === 'Home Service' ? address : undefined,
        nailDesign: nailDesign || undefined,
        notes: notes || undefined
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save walk-in appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E7DFD5]">
        <div className="flex items-center justify-between mb-4 border-b border-[#E7DFD5] pb-3">
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            {defaultClient ? `+ Book Slot for ${defaultClient.fullName}` : '+ Add Client Walk-In Booking'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-100 text-[#78716C]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                placeholder="Priya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase mb-1">
                Phone Number (10 Digits) *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9820123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase mb-1">
                Time Slot *
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase mb-1">
                Service
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
              >
                <option value="Nail Art & Design">Nail Art & Design</option>
                <option value="Gel Extensions">Gel Extensions</option>
                <option value="Acrylic Sculpting">Acrylic Sculpting</option>
                <option value="Russian Manicure">Russian Manicure</option>
                <option value="Bridal Nail Suite">Bridal Nail Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase mb-1">
                Location
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as 'Studio Visit' | 'Home Service')}
                className="w-full bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
              >
                <option value="Studio Visit">Studio Visit</option>
                <option value="Home Service">Doorstep Home Service</option>
              </select>
            </div>
          </div>

          {serviceType === 'Home Service' && (
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase mb-1">
                Home Address
              </label>
              <input
                type="text"
                placeholder="Apartment, building, street, area..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#1C1917] uppercase mb-1">
              Design Preference or Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Chrome French Tips, Ombre, Almond shape..."
              value={nailDesign}
              onChange={(e) => setNailDesign(e.target.value)}
              className="w-full bg-[#FAF5F0] border border-[#E7DFD5] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E7DFD5]">
            <div className="text-xs text-[#78716C]">
              Est. Price: <strong className="text-[#B45309]">₹{getEstimatedPrice(service, serviceType)}</strong>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Walk-In'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
