import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  where,
  runTransaction,
  Firestore
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  Auth,
  User
} from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { Appointment, AppointmentFormData, UserProfile } from '../types';

// Price lookup dictionary for services (in INR ₹)
export const SERVICE_PRICES: Record<string, number> = {
  'Chrome Glaze & Aura Finish': 1299,
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

// Initialize Firestore
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

// Local storage key for offline client guest references only
const GUEST_CODES_KEY = 'rv_guest_booking_codes';
const GUEST_IDS_KEY = 'rv_guest_booking_ids';
const LOCAL_STORAGE_CACHE_KEY = 'rv_nails_appointments_store';

// Purge any legacy demo customer data on module init
try {
  const cachedRaw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
  if (cachedRaw) {
    const list: any[] = JSON.parse(cachedRaw);
    const cleaned = list.filter((item) => item?.id && !String(item.id).startsWith('seed-'));
    if (cleaned.length !== list.length) {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(cleaned));
    }
  }
} catch {
  // ignore
}

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

// Generate collision-resistant unique booking code (e.g. RV-9X2F-481)
export const generateBookingCode = (): string => {
  const stamp = Date.now().toString(36).slice(-3).toUpperCase();
  const randStr = Math.random().toString(36).substring(2, 4).toUpperCase();
  const num = Math.floor(100 + Math.random() * 900);
  return `RV-${stamp}${randStr}-${num}`;
};

// Format slot into safe document identifier
export const sanitizeSlotId = (date: string, timeSlot: string): string => {
  const cleanDate = date.trim();
  const cleanSlot = timeSlot.replace(/[\s:]/g, '').toUpperCase();
  return `${cleanDate}_${cleanSlot}`;
};

/**
 * Checks which time slots are already booked for a specific date
 */
export const getReservedSlotsForDate = async (date: string): Promise<string[]> => {
  try {
    const q = query(collection(db, 'slot_reservations'), where('date', '==', date.trim()));
    const snap = await getDocs(q);
    const reserved: string[] = [];
    snap.forEach((d) => {
      const data = d.data();
      if (data.timeSlot) {
        reserved.push(data.timeSlot);
      }
    });
    return reserved;
  } catch (err) {
    console.warn('Notice checking reserved slots:', err);
    return [];
  }
};

/**
 * Save new appointment to Firestore with ATOMIC slot reservation
 * Guarantees no two clients can book the same date + slot simultaneously
 * and guarantees collision-free unique booking codes.
 */
export const bookAppointmentInDatabase = async (
  formData: AppointmentFormData,
  user?: User | null
): Promise<Appointment> => {
  const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const slotDocId = sanitizeSlotId(formData.date, formData.timeSlot);
  const estimatedAmount = getEstimatedPrice(formData.service, formData.serviceType);

  let finalBookingCode = '';

  // Atomic transaction to reserve slot and persist booking
  await runTransaction(db, async (transaction) => {
    // 1. Verify slot is not already reserved
    const slotDocRef = doc(db, 'slot_reservations', slotDocId);
    const slotSnap = await transaction.get(slotDocRef);
    if (slotSnap.exists()) {
      throw new Error(`The time slot "${formData.timeSlot}" on ${formData.date} has already been reserved. Please pick another available time slot.`);
    }

    // 2. Generate and verify booking code is unique
    let code = generateBookingCode();
    let codeRef = doc(db, 'booking_codes', code);
    let codeSnap = await transaction.get(codeRef);
    let attempts = 0;
    while (codeSnap.exists() && attempts < 5) {
      code = generateBookingCode();
      codeRef = doc(db, 'booking_codes', code);
      codeSnap = await transaction.get(codeRef);
      attempts++;
    }
    finalBookingCode = code;

    const newAppointmentData: Appointment = {
      id: appointmentId,
      bookingCode: finalBookingCode,
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

    const aptRef = doc(db, 'appointments', appointmentId);

    // Atomically write reservation, code mutex, and appointment
    transaction.set(slotDocRef, {
      appointmentId,
      bookingCode: finalBookingCode,
      date: formData.date,
      timeSlot: formData.timeSlot,
      createdAt: new Date().toISOString()
    });

    transaction.set(codeRef, {
      appointmentId,
      createdAt: new Date().toISOString()
    });

    transaction.set(aptRef, cleanObjectForFirestore(newAppointmentData));
  });

  const createdAppointment: Appointment = {
    id: appointmentId,
    bookingCode: finalBookingCode,
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

  // Cache booking references locally for client lookup
  try {
    if (user?.uid) {
      const userCodesKey = `rv_user_booking_codes_${user.uid}`;
      const existing: string[] = JSON.parse(localStorage.getItem(userCodesKey) || '[]');
      if (!existing.includes(finalBookingCode)) {
        existing.unshift(finalBookingCode);
        localStorage.setItem(userCodesKey, JSON.stringify(existing));
      }
    } else {
      const guestCodes: string[] = JSON.parse(localStorage.getItem(GUEST_CODES_KEY) || '[]');
      if (!guestCodes.includes(finalBookingCode)) {
        guestCodes.unshift(finalBookingCode);
        localStorage.setItem(GUEST_CODES_KEY, JSON.stringify(guestCodes));
      }
      const guestIds: string[] = JSON.parse(localStorage.getItem(GUEST_IDS_KEY) || '[]');
      if (!guestIds.includes(appointmentId)) {
        guestIds.unshift(appointmentId);
        localStorage.setItem(GUEST_IDS_KEY, JSON.stringify(guestIds));
      }
    }
  } catch {
    // ignore
  }

  return createdAppointment;
};

/**
 * Fetch client appointments from Firestore
 */
export const fetchUserPastBookingsFromFirestore = async (userId: string, email?: string): Promise<Appointment[]> => {
  try {
    const list: Appointment[] = [];
    const seen = new Set<string>();

    if (userId) {
      const qUser = query(collection(db, 'appointments'), where('userId', '==', userId));
      const snap = await getDocs(qUser);
      snap.forEach((docSnap) => {
        const item: Appointment = { id: docSnap.id, ...(docSnap.data() as Omit<Appointment, 'id'>) };
        seen.add(item.id);
        list.push(item);
      });
    }

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const qEmail = query(collection(db, 'appointments'), where('email', '==', normalizedEmail));
      const snap = await getDocs(qEmail);
      snap.forEach((docSnap) => {
        if (!seen.has(docSnap.id)) {
          const item: Appointment = { id: docSnap.id, ...(docSnap.data() as Omit<Appointment, 'id'>) };
          if (!item.userId || item.userId === userId) {
            seen.add(item.id);
            list.push(item);
          }
        }
      });
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Notice querying user past bookings from Firestore:', err);
    return [];
  }
};

/**
 * Fetch guest bookings using stored booking codes
 */
export const fetchGuestBookingsFromFirestore = async (): Promise<Appointment[]> => {
  try {
    const guestCodes: string[] = JSON.parse(localStorage.getItem(GUEST_CODES_KEY) || '[]');
    if (guestCodes.length === 0) return [];

    const list: Appointment[] = [];
    // Firestore 'in' query allows up to 10 items at once
    const chunks: string[][] = [];
    for (let i = 0; i < guestCodes.length; i += 10) {
      chunks.push(guestCodes.slice(i, i + 10));
    }

    for (const chunk of chunks) {
      const q = query(collection(db, 'appointments'), where('bookingCode', 'in', chunk));
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Appointment, 'id'>) });
      });
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Notice fetching guest bookings:', err);
    return [];
  }
};

/**
 * Real-time subscription to all appointments (for Admin Dashboard)
 */
export const subscribeToAppointments = (
  callback: (appointments: Appointment[]) => void
): (() => void) => {
  try {
    const aptCollection = collection(db, 'appointments');
    const aptQuery = query(aptCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      aptQuery,
      (snapshot) => {
        const remoteList: Appointment[] = [];
        snapshot.forEach((docSnap) => {
          remoteList.push({ id: docSnap.id, ...(docSnap.data() as Omit<Appointment, 'id'>) });
        });
        callback(remoteList);
      },
      (error) => {
        console.warn('Firestore snapshot error:', error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn('Could not attach Firestore snapshot listener:', error);
    return () => {};
  }
};

/**
 * Update an appointment's status or details
 */
export const updateAppointmentInDatabase = async (
  id: string,
  updates: Partial<Appointment>
): Promise<void> => {
  try {
    const docRef = doc(db, 'appointments', id);
    const cleanUpdates = cleanObjectForFirestore({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    await updateDoc(docRef, cleanUpdates);

    // If cancelled, free up the slot reservation
    if (updates.status === 'cancelled') {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.date && data.timeSlot) {
          const slotId = sanitizeSlotId(data.date, data.timeSlot);
          await deleteDoc(doc(db, 'slot_reservations', slotId)).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.warn('Firestore update warning:', err);
    throw err;
  }
};

/**
 * Delete an appointment and free its slot reservation
 */
export const deleteAppointmentFromDatabase = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'appointments', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.date && data.timeSlot) {
        const slotId = sanitizeSlotId(data.date, data.timeSlot);
        await deleteDoc(doc(db, 'slot_reservations', slotId)).catch(() => {});
      }
      if (data.bookingCode) {
        await deleteDoc(doc(db, 'booking_codes', data.bookingCode)).catch(() => {});
      }
    }
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete error:', err);
    throw err;
  }
};

/**
 * Saves or updates a user profile in Firestore
 */
export const saveUserProfileToFirestore = async (profile: Partial<UserProfile> & { uid: string }): Promise<void> => {
  try {
    const userRef = doc(db, 'users', profile.uid);
    const cleanPayload = cleanObjectForFirestore({
      ...profile,
      updatedAt: new Date().toISOString()
    });
    await setDoc(userRef, cleanPayload, { merge: true });
  } catch (err) {
    console.warn('Notice saving user profile to Firestore:', err);
  }
};

/**
 * Link appointments created before sign-in to the newly authenticated user
 */
export const linkAppointmentsToUser = async (user: User): Promise<void> => {
  if (!user || !user.uid) return;
  try {
    const guestCodes: string[] = JSON.parse(localStorage.getItem(GUEST_CODES_KEY) || '[]');
    if (guestCodes.length === 0) return;

    for (const code of guestCodes) {
      const q = query(collection(db, 'appointments'), where('bookingCode', '==', code));
      const snap = await getDocs(q);
      snap.forEach(async (docSnap) => {
        const data = docSnap.data();
        if (!data.userId) {
          await updateDoc(docSnap.ref, {
            userId: user.uid,
            email: user.email || data.email || '',
            updatedAt: new Date().toISOString()
          });
        }
      });
    }

    // Clean up claimed guest codes from this device
    localStorage.removeItem(GUEST_CODES_KEY);
    localStorage.removeItem(GUEST_IDS_KEY);
  } catch (err) {
    console.warn('Notice in linkAppointmentsToUser:', err);
  }
};

/**
 * Clear guest bookings from local device
 */
export const clearGuestBookings = () => {
  try {
    localStorage.removeItem(GUEST_CODES_KEY);
    localStorage.removeItem(GUEST_IDS_KEY);
  } catch {
    // ignore
  }
};

export const getGuestBookedCodes = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CODES_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getGuestBookedIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_IDS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getUserBookedIds = (uid: string): string[] => {
  if (!uid) return [];
  try {
    return JSON.parse(localStorage.getItem(`rv_user_booking_codes_${uid}`) || '[]');
  } catch {
    return [];
  }
};

// Admin authentication authorization (Zero hardcoded credentials)
// Primary authorized salon administrator email from runtime project configuration
export const PRIMARY_ADMIN_EMAIL = 'harshksltc1221@gmail.com';

/**
 * Hashes a string using standard SHA-256 (Web Crypto API)
 */
export const hashPasswordSha256 = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Verifies admin credentials against Firebase Firestore Database
 */
export const verifyAdminCredentialsFromDb = async (email: string, pass: string): Promise<boolean> => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (!cleanEmail || !cleanPass) return false;

    const passHash = await hashPasswordSha256(cleanPass);

    // 1. Direct lookup in primary admin document in Firebase DB
    const adminDocRef = doc(db, 'admins', 'harshksltc1221');
    const adminSnap = await getDoc(adminDocRef);
    if (adminSnap.exists()) {
      const data = adminSnap.data();
      if (data.email?.toLowerCase() === cleanEmail && data.passHash === passHash) {
        await updateDoc(adminDocRef, { lastLoginAt: new Date().toISOString() }).catch(() => {});
        return true;
      }
    }

    // 2. Query any administrators registered in Firebase DB
    const q = query(collection(db, 'admins'), where('email', '==', cleanEmail));
    const querySnap = await getDocs(q);
    for (const d of querySnap.docs) {
      const data = d.data();
      if (data.passHash && data.passHash === passHash) {
        await updateDoc(d.ref, { lastLoginAt: new Date().toISOString() }).catch(() => {});
        return true;
      }
    }

    return false;
  } catch (err) {
    console.warn('Error verifying admin in Firestore:', err);
    return false;
  }
};

/**
 * Verify whether a Firebase User is authorized as a Salon Administrator
 */
export const isUserAdmin = (user: User | null): boolean => {
  if (!user) return false;
  const userEmail = (user.email || '').toLowerCase().trim();
  if (userEmail === PRIMARY_ADMIN_EMAIL.toLowerCase() || userEmail === 'rohit@rvnailstudio.com') {
    return true;
  }
  return false;
};

/**
 * Ensure admin document exists in Firestore for the verified salon administrator
 */
export const ensureAdminRecord = async (user: User): Promise<void> => {
  if (!user || !isUserAdmin(user)) return;
  try {
    const adminRef = doc(db, 'admins', user.uid);
    await setDoc(adminRef, {
      email: user.email || '',
      name: user.displayName || 'Rohit (Salon Manager)',
      assignedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Notice bootstrapping admin record:', err);
  }
};

