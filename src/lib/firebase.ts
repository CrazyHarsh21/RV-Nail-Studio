import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  Firestore
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  Auth,
  User
} from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { Appointment, AppointmentFormData, AppointmentStatus, PaymentStatus } from '../types';

// Price lookup dictionary for services (in INR ₹)
export const SERVICE_PRICES: Record<string, number> = {
  'Manicure & Pedicure': 899,
  'Nail Art & Design': 1499,
  'Nail Extensions (Gel / Acrylic)': 2299,
  'Bridal Nails & Special Occasions': 3499,
  'Nail Care & Treatments': 999,
  'Home Service Full Consultation': 1899,
};

export const getEstimatedPrice = (serviceName: string, serviceType: string): number => {
  const base = SERVICE_PRICES[serviceName] || 1299;
  const travelFee = serviceType === 'Home Service' ? 350 : 0;
  return base + travelFee;
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfigJson) : getApp();

// Initialize Firestore with fallback for custom databaseId
let dbInstance: Firestore;
try {
  if (firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)') {
    dbInstance = getFirestore(app, firebaseConfigJson.firestoreDatabaseId);
  } else {
    dbInstance = getFirestore(app);
  }
} catch {
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// LocalStorage Fallback Key
const LOCAL_STORAGE_KEY = 'rv_nails_appointments_store';

// Helper to sanitize data for Firestore (Firestore strictly rejects undefined values)
export const cleanObjectForFirestore = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
    } else {
      clean[key] = '';
    }
  }
  return clean;
};

// Helper to get local appointments
export const getLocalAppointments = (): Appointment[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read local appointments', e);
  }
  return [];
};

// Helper to save local appointments
export const saveLocalAppointments = (appointments: Appointment[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
  } catch (e) {
    console.error('Failed to write local appointments', e);
  }
};

// Generate realistic booking reference (e.g. RV-4821)
export const generateBookingCode = (): string => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `RV-${num}`;
};

// Initial Seed data for demonstration of real-world salon operations
const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'seed-1',
    bookingCode: 'RV-8192',
    fullName: 'Ananya Deshmukh',
    phone: '9820145678',
    email: 'ananya.d@gmail.com',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '11:00 AM',
    service: 'Nail Art & Design',
    serviceType: 'Studio Visit',
    nailDesign: 'Iridescent Pearl Glaze',
    notes: 'Square oval shape requested, soft chrome sheen.',
    status: 'in_progress',
    amount: 1499,
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    adminNotes: 'Client arrived at 10:55 AM. Rohit working on chrome glaze.'
  },
  {
    id: 'seed-2',
    bookingCode: 'RV-7451',
    fullName: 'Simran Kaur',
    phone: '9987213456',
    email: 'simran.k@yahoo.com',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '2:00 PM',
    service: 'Nail Extensions (Gel / Acrylic)',
    serviceType: 'Studio Visit',
    nailDesign: 'Rose Gold Shimmer Quartz',
    notes: 'Almond shape, medium length, neutral undertone.',
    status: 'confirmed',
    amount: 2299,
    paymentStatus: 'deposit_paid',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    adminNotes: 'Requested almond tips. Pre-sanitized tools prepared.'
  },
  {
    id: 'seed-3',
    bookingCode: 'RV-6329',
    fullName: 'Pooja Iyer',
    phone: '9769054321',
    email: 'pooja.iyer@outlook.com',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '5:00 PM',
    service: 'Home Service Full Consultation',
    serviceType: 'Home Service',
    address: 'B-402, Sea Green Heights, Worli Sea Face, Mumbai',
    nailDesign: 'Champagne Opal Aura',
    notes: 'Bridal sister preparation. Doorstep visit needed.',
    status: 'confirmed',
    amount: 2249,
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    adminNotes: 'Rohit traveling with portable UV LED lamp and kit.'
  },
  {
    id: 'seed-4',
    bookingCode: 'RV-5120',
    fullName: 'Rhea Kapoor',
    phone: '9819876543',
    email: 'rhea.k@gmail.com',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '12:30 PM',
    service: 'Bridal Nails & Special Occasions',
    serviceType: 'Studio Visit',
    nailDesign: 'Gold Flake Imperial Crimson',
    notes: 'Wedding reception look. 3D pearl embellishments.',
    status: 'pending',
    amount: 3499,
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    adminNotes: 'Awaiting phone confirmation call.'
  },
  {
    id: 'seed-5',
    bookingCode: 'RV-4089',
    fullName: 'Meera Nambiar',
    phone: '9833445566',
    email: 'meera.n@gmail.com',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    timeSlot: '3:30 PM',
    service: 'Manicure & Pedicure',
    serviceType: 'Studio Visit',
    notes: 'Russian dry manicure technique requested.',
    status: 'completed',
    amount: 899,
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    adminNotes: 'Completed smoothly. Left 5-star review.'
  },
  {
    id: 'seed-6',
    bookingCode: 'RV-3912',
    fullName: 'Tanvi Verma',
    phone: '9820011223',
    email: 'tanvi.v@gmail.com',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    timeSlot: '6:30 PM',
    service: 'Nail Art & Design',
    serviceType: 'Studio Visit',
    nailDesign: 'Multi-Color Holographic Chrome',
    notes: 'Coffin shape, chrome shift.',
    status: 'completed',
    amount: 1499,
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    adminNotes: 'Showcased on Instagram gallery.'
  }
];

// Initialize seed data in localStorage if empty
if (getLocalAppointments().length === 0) {
  saveLocalAppointments(SEED_APPOINTMENTS);
}

/**
 * Save new appointment to Firestore & Local storage
 */
export const bookAppointmentInDatabase = async (
  formData: AppointmentFormData,
  user?: User | null
): Promise<Appointment> => {
  const bookingCode = generateBookingCode();
  const id = `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const estimatedAmount = getEstimatedPrice(formData.service, formData.serviceType);

  const newAppointment: Appointment = {
    id,
    bookingCode,
    fullName: formData.fullName.trim(),
    phone: formData.phone.trim(),
    email: formData.email?.trim() || user?.email || '',
    userId: user?.uid || '',
    date: formData.date,
    timeSlot: formData.timeSlot,
    service: formData.service,
    serviceType: formData.serviceType,
    address: formData.address?.trim() || '',
    nailDesign: formData.nailDesign?.trim() || '',
    notes: formData.notes?.trim() || '',
    status: 'pending',
    amount: estimatedAmount,
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 1. Immediately store to LocalStorage cache
  const localList = getLocalAppointments();
  const updatedList = [newAppointment, ...localList.filter((a) => a.id !== newAppointment.id)];
  saveLocalAppointments(updatedList);

  // 2. Remember this booking on this device so the user can always see "apni booking details"
  try {
    const existingIds = JSON.parse(localStorage.getItem('rv_my_booking_ids') || '[]');
    if (!existingIds.includes(newAppointment.id)) {
      existingIds.unshift(newAppointment.id);
      localStorage.setItem('rv_my_booking_ids', JSON.stringify(existingIds));
    }
    const existingCodes = JSON.parse(localStorage.getItem('rv_my_booking_codes') || '[]');
    if (!existingCodes.includes(newAppointment.bookingCode)) {
      existingCodes.unshift(newAppointment.bookingCode);
      localStorage.setItem('rv_my_booking_codes', JSON.stringify(existingCodes));
    }
    localStorage.setItem('rv_my_last_phone', newAppointment.phone);
    if (newAppointment.email) {
      localStorage.setItem('rv_my_last_email', newAppointment.email);
    }
  } catch {
    // ignore
  }

  // 3. Immediately notify active in-app subscribers so UI updates instantly
  notifySubscribers(updatedList);

  // 4. Persist to Firestore with sanitized payload (strictly no undefined)
  try {
    const docRef = doc(db, 'appointments', id);
    await setDoc(docRef, cleanObjectForFirestore(newAppointment));
    console.log('[Firestore] Successfully stored appointment:', id);
  } catch (err) {
    console.error('[Firestore] Write error (retained in offline store):', err);
  }

  return newAppointment;
};

// Global subscriber set for instantaneous in-memory updates
const activeSubscribers = new Set<(appointments: Appointment[]) => void>();

const notifySubscribers = (list: Appointment[]) => {
  activeSubscribers.forEach((cb) => {
    try {
      cb(list);
    } catch (err) {
      console.error('Subscriber callback error:', err);
    }
  });
};

export const getMyBookedIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('rv_my_booking_ids') || '[]');
  } catch {
    return [];
  }
};

export const getMyBookedCodes = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('rv_my_booking_codes') || '[]');
  } catch {
    return [];
  }
};

export const getMyLastPhone = (): string => {
  try {
    return localStorage.getItem('rv_my_last_phone') || '';
  } catch {
    return '';
  }
};

export const getMyLastEmail = (): string => {
  try {
    return localStorage.getItem('rv_my_last_email') || '';
  } catch {
    return '';
  }
};

export const recordManualBookingId = (id: string, code?: string) => {
  try {
    const existingIds = getMyBookedIds();
    if (!existingIds.includes(id)) {
      existingIds.unshift(id);
      localStorage.setItem('rv_my_booking_ids', JSON.stringify(existingIds));
    }
    if (code) {
      const existingCodes = getMyBookedCodes();
      if (!existingCodes.includes(code)) {
        existingCodes.unshift(code);
        localStorage.setItem('rv_my_booking_codes', JSON.stringify(existingCodes));
      }
    }
  } catch {
    // ignore
  }
};

/**
 * Automatically links unassigned device bookings to newly signed-in or signed-up user
 */
export const linkAppointmentsToUser = async (user: User | null): Promise<void> => {
  if (!user) return;
  try {
    const localList = getLocalAppointments();
    const myIds = getMyBookedIds();
    const myCodes = getMyBookedCodes();
    const myLastPhone = getMyLastPhone().replace(/\D/g, '');
    const userPhone = user.phoneNumber ? user.phoneNumber.replace(/\D/g, '') : '';
    const userEmail = user.email ? user.email.toLowerCase().trim() : '';

    let hasUpdates = false;
    const updatedList = localList.map((apt) => {
      const aptPhone = (apt.phone || '').replace(/\D/g, '');
      const aptEmail = (apt.email || '').toLowerCase().trim();

      const isBelongingToUser =
        myIds.includes(apt.id) ||
        (apt.bookingCode && myCodes.includes(apt.bookingCode)) ||
        (userEmail && aptEmail === userEmail) ||
        (userPhone && aptPhone && (aptPhone.endsWith(userPhone) || userPhone.endsWith(aptPhone))) ||
        (myLastPhone && aptPhone && (aptPhone.endsWith(myLastPhone) || myLastPhone.endsWith(aptPhone)));

      if (isBelongingToUser && (!apt.userId || apt.userId !== user.uid || !apt.email)) {
        hasUpdates = true;
        const linkedApt: Appointment = {
          ...apt,
          userId: user.uid,
          email: apt.email || user.email || '',
          updatedAt: new Date().toISOString()
        };

        // Sync update to Firestore
        setDoc(doc(db, 'appointments', apt.id), cleanObjectForFirestore(linkedApt), { merge: true }).catch((err) => {
          console.warn('[Firestore] Could not sync linked appointment:', err);
        });

        return linkedApt;
      }
      return apt;
    });

    if (hasUpdates) {
      saveLocalAppointments(updatedList);
      notifySubscribers(updatedList);
    }
  } catch (err) {
    console.error('Error in linkAppointmentsToUser:', err);
  }
};

/**
 * Real-time subscription to appointments from Firestore + local merge
 */
export const subscribeToAppointments = (
  callback: (appointments: Appointment[]) => void
): (() => void) => {
  activeSubscribers.add(callback);

  // Fire initial local cache first
  callback(getLocalAppointments());

  try {
    const aptCollection = collection(db, 'appointments');
    const aptQuery = query(aptCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      aptQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: Appointment[] = [];
          snapshot.forEach((docSnap) => {
            remoteList.push({ id: docSnap.id, ...(docSnap.data() as Omit<Appointment, 'id'>) });
          });
          // Merge remote with local to ensure zero data loss
          const localList = getLocalAppointments();
          const mergedMap = new Map<string, Appointment>();

          // Remote is source of truth
          remoteList.forEach((apt) => mergedMap.set(apt.id, apt));
          // Keep local if not yet synced, and push to Firestore
          localList.forEach((apt) => {
            if (!mergedMap.has(apt.id)) {
              mergedMap.set(apt.id, apt);
              setDoc(doc(db, 'appointments', apt.id), cleanObjectForFirestore(apt)).catch(() => {});
            }
          });

          const finalList = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          saveLocalAppointments(finalList);
          notifySubscribers(finalList);
        } else {
          // If Firestore collection is empty, write seed data to Firestore!
          const currentLocal = getLocalAppointments();
          if (currentLocal.length > 0) {
            currentLocal.forEach(async (item) => {
              try {
                await setDoc(doc(db, 'appointments', item.id), item);
              } catch {
                // ignore
              }
            });
            notifySubscribers(currentLocal);
          }
        }
      },
      (error) => {
        console.warn('Firestore snapshot error, serving local data:', error);
        callback(getLocalAppointments());
      }
    );

    return () => {
      activeSubscribers.delete(callback);
      unsubscribe();
    };
  } catch (error) {
    console.warn('Could not attach Firestore snapshot listener:', error);
    callback(getLocalAppointments());
    return () => {
      activeSubscribers.delete(callback);
    };
  }
};

/**
 * Update an appointment's status or details
 */
export const updateAppointmentInDatabase = async (
  id: string,
  updates: Partial<Appointment>
): Promise<void> => {
  const localList = getLocalAppointments();
  const index = localList.findIndex((a) => a.id === id);
  if (index !== -1) {
    localList[index] = {
      ...localList[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveLocalAppointments(localList);
    notifySubscribers(localList);
  }

  try {
    const docRef = doc(db, 'appointments', id);
    const cleanUpdates = cleanObjectForFirestore({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    await updateDoc(docRef, cleanUpdates);
  } catch (err) {
    console.warn('Firestore update warning (retained in offline store):', err);
  }
};

/**
 * Delete an appointment
 */
export const deleteAppointmentFromDatabase = async (id: string): Promise<void> => {
  const localList = getLocalAppointments().filter((a) => a.id !== id);
  saveLocalAppointments(localList);
  notifySubscribers(localList);

  try {
    const docRef = doc(db, 'appointments', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete error:', err);
  }
};

// Admin authentication helpers
const ADMIN_EMAILS = [
  'rohit@rvnails.com', 
  'admin@rvnails.com', 
  'harshksltc1221@gmail.com',
  'rvnailsart@gmail.com'
];
const ADMIN_STORAGE_KEY = 'rv_is_admin_mode';

export const isUserAdmin = (user: User | null): boolean => {
  if (!user) {
    // Unauthenticated visitors are strictly NEVER admins
    return false;
  }
  
  // 1. Check if authenticated email matches authorized admin emails
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim())) {
    return true;
  }

  // 2. Check if active session is an authorized Admin UID with valid local key
  if (user.uid.startsWith('admin-') && localStorage.getItem(ADMIN_STORAGE_KEY) === 'true') {
    return true;
  }

  // All other clients, anonymous users, and phone logins are NOT admin
  return false;
};

export const setAdminModeOverride = (enabled: boolean) => {
  if (enabled) {
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
};
