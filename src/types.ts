export interface NailDesign {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  palette: string[];
  shape: string;
  finish: string;
  wearDuration: string;
  image: string;
  tags: string[];
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  priceStart: string;
  description: string;
  features: string[];
  icon: string;
  recommendedFor: string;
}

export interface AppointmentFormData {
  fullName: string;
  phone: string;
  date: string;
  timeSlot: string;
  service: string;
  nailDesign?: string;
  serviceType: 'Studio Visit' | 'Home Service';
  address?: string;
  notes?: string;
  email?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'paid';

export interface Appointment {
  id: string;
  bookingCode: string; // e.g. RV-4921
  fullName: string;
  phone: string;
  email?: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. '11:00 AM'
  service: string;
  serviceType: 'Studio Visit' | 'Home Service';
  address?: string;
  nailDesign?: string;
  notes?: string;
  status: AppointmentStatus;
  amount: number; // in INR (₹)
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO string
  updatedAt?: string;
  adminNotes?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phone?: string | null;
  role: 'client' | 'admin';
  createdAt: string;
}

export interface AppointmentMetrics {
  totalAppointments: number;
  todayAppointments: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  monthlyTotal: number;
  monthlyRevenue: number;
  totalRevenue: number;
  studioCount: number;
  homeCount: number;
}
