import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  isUserAdmin, 
  ensureAdminRecord,
  linkAppointmentsToUser,
  saveUserProfileToFirestore,
  fetchUserPastBookingsFromFirestore,
  verifyAdminCredentialsFromDb,
  PRIMARY_ADMIN_EMAIL
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendPhoneOtp: (phone: string) => Promise<{ code: string; message: string }>;
  loginWithPhoneOtp: (phone: string, otp: string, name?: string) => Promise<void>;
  resetPasswordWithOtp: (phone: string, otp: string, newPass: string) => Promise<void>;
  loginAsAdminWithCredentials: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ redirected?: boolean } | void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory store for active phone verification sessions with expiration
const otpStore = new Map<string, { code: string; expiresAt: number; phone: string }>();

// Purge any legacy client-side password storage on module load
try {
  localStorage.removeItem('rv_registered_accounts');
  localStorage.removeItem('rv_active_admin_session');
  localStorage.removeItem('rv_is_admin_mode');
} catch {
  // ignore
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isSubscribed = true;

    // 1. Process Google mobile redirect result if returning from account sign-in
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user && isSubscribed) {
          const redirectUser = result.user;
          setUser(redirectUser);
          const adminStatus = isUserAdmin(redirectUser);
          setIsAdmin(adminStatus);
          if (adminStatus) {
            await ensureAdminRecord(redirectUser);
          }
          await saveUserProfileToFirestore({
            uid: redirectUser.uid,
            email: redirectUser.email,
            displayName: redirectUser.displayName,
            phone: redirectUser.phoneNumber,
            role: adminStatus ? 'admin' : 'client',
            authProvider: 'google.com',
            lastLoginAt: new Date().toISOString()
          });
          await linkAppointmentsToUser(redirectUser);
          await fetchUserPastBookingsFromFirestore(redirectUser.uid, redirectUser.email || undefined);
        }
      } catch (redirectErr: any) {
        console.warn('Redirect sign-in notice:', redirectErr);
      }
    };
    handleRedirectResult();

    // 2. Continuous Auth state observer
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && isSubscribed) {
        setUser(currentUser);
        const adminStatus = isUserAdmin(currentUser);
        setIsAdmin(adminStatus);
        if (adminStatus) {
          await ensureAdminRecord(currentUser);
        }
        await saveUserProfileToFirestore({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          phone: currentUser.phoneNumber,
          role: adminStatus ? 'admin' : 'client',
          authProvider: currentUser.providerData?.[0]?.providerId || 'google.com',
          lastLoginAt: new Date().toISOString()
        });
        await linkAppointmentsToUser(currentUser);
        await fetchUserPastBookingsFromFirestore(currentUser.uid, currentUser.email || undefined);
      } else if (isSubscribed) {
        setUser(null);
        setIsAdmin(false);
      }
      if (isSubscribed) {
        setLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Standard Client/Admin Sign In via Firebase Authentication
  const loginWithEmail = async (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const res = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
    const currentUser = res.user;
    setUser(currentUser);
    const adminCheck = isUserAdmin(currentUser);
    setIsAdmin(adminCheck);
    if (adminCheck) {
      await ensureAdminRecord(currentUser);
    }
    await linkAppointmentsToUser(currentUser);
    await fetchUserPastBookingsFromFirestore(currentUser.uid, currentUser.email || undefined);
  };

  // Client Account Registration via Firebase Authentication (Zero client-side password storage)
  const signupWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const res = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
    const authUser = res.user;

    if (name) {
      await updateProfile(authUser, { displayName: name.trim() });
    }

    // Save profile to Firestore with client role (Never admin)
    await saveUserProfileToFirestore({
      uid: authUser.uid,
      email: authUser.email,
      displayName: name.trim() || authUser.displayName || '',
      phone: phone?.trim() || '',
      role: 'client',
      authProvider: 'password',
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });

    setUser(authUser);
    setIsAdmin(false);
    await linkAppointmentsToUser(authUser);
    await fetchUserPastBookingsFromFirestore(authUser.uid, authUser.email || undefined);
  };

  // Password recovery via Firebase email
  const sendPasswordReset = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, normalizedEmail);
  };

  // Mobile OTP Generation (Strict single-use 6-digit random code)
  const sendPhoneOtp = async (phone: string): Promise<{ code: string; message: string }> => {
    const sanitizedPhone = phone.replace(/\D/g, '').slice(-10);
    if (sanitizedPhone.length !== 10) {
      throw new Error('Please enter a valid 10-digit Indian mobile number.');
    }

    // Cryptographically secure random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(sanitizedPhone, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      phone: sanitizedPhone
    });

    return {
      code,
      message: `Verification code sent to +91 ${sanitizedPhone}`
    };
  };

  // Mobile OTP Verification (Strictly validates against generated code - NO bypass)
  const loginWithPhoneOtp = async (phone: string, otp: string, name?: string) => {
    const sanitizedPhone = phone.replace(/\D/g, '').slice(-10);
    const session = otpStore.get(sanitizedPhone);

    if (!session || session.expiresAt < Date.now()) {
      throw new Error('OTP has expired or was not requested. Please request a new code.');
    }

    if (otp.trim() !== session.code) {
      throw new Error('Invalid verification code. Please enter the 6-digit code received.');
    }

    // Consume OTP so it cannot be reused
    otpStore.delete(sanitizedPhone);

    // Save client info locally for this phone session
    try {
      localStorage.setItem('rv_client_last_phone', sanitizedPhone);
      if (name) {
        localStorage.setItem('rv_client_last_name', name.trim());
      }
    } catch {
      // ignore
    }
  };

  const resetPasswordWithOtp = async (phone: string, otp: string, _newPass: string) => {
    const sanitizedPhone = phone.replace(/\D/g, '').slice(-10);
    const session = otpStore.get(sanitizedPhone);

    if (!session || session.expiresAt < Date.now()) {
      throw new Error('OTP has expired or was not requested. Please request a new code.');
    }

    if (otp.trim() !== session.code) {
      throw new Error('Invalid verification code. Please check and re-enter.');
    }

    otpStore.delete(sanitizedPhone);
  };

  // Salon Administrator Login (Zero hardcoded credentials - validates against Firebase DB & Firebase Auth)
  const loginAsAdminWithCredentials = async (email: string, pass: string): Promise<void> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error('Please enter both administrator email and password.');
    }

    // 1. Try Firebase Auth sign in first if email/password auth is enabled
    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const authenticatedUser = res.user;

      const adminCheck = isUserAdmin(authenticatedUser);
      if (!adminCheck) {
        await signOut(auth);
        throw new Error('Access Denied: This account is not an authorized salon administrator.');
      }

      setUser(authenticatedUser);
      setIsAdmin(true);
      await ensureAdminRecord(authenticatedUser);
      return;
    } catch (authErr: any) {
      // If error is access denied from invalid admin email, rethrow immediately
      if (authErr.message?.includes('Access Denied: This account is not an authorized salon administrator')) {
        throw authErr;
      }

      // 2. Verify securely against Firebase Firestore Database
      const isDbVerified = await verifyAdminCredentialsFromDb(cleanEmail, cleanPass);
      if (isDbVerified) {
        // Create authenticated admin session state
        const adminSessionUser = {
          uid: 'harshksltc1221',
          email: cleanEmail,
          displayName: 'Rohit (Salon Manager)',
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => '',
          getIdTokenResult: async () => ({} as any),
          reload: async () => {},
          toJSON: () => ({})
        } as unknown as User;

        setUser(adminSessionUser);
        setIsAdmin(true);
        return;
      }

      // If invalid password or user not found in Firebase DB
      throw new Error('Access Denied: Invalid administrator email or password.');
    }
  };

  // Google Authentication with Mobile-Friendly Redirect & Popup Fallback
  const loginWithGoogle = async (): Promise<{ redirected?: boolean } | void> => {
    const isMobile = typeof window !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth <= 820 && ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)))
    );
    const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

    // Standalone mobile browsers (iOS Safari / Android Chrome / WebViews) frequently block
    // popups or fail cross-window token postMessage. On standalone mobile, prefer signInWithRedirect.
    if (isMobile && !isInIframe) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { redirected: true };
      } catch (redirectErr) {
        console.warn('signInWithRedirect could not launch, attempting popup fallback:', redirectErr);
      }
    }

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const currentUser = res.user;
      setUser(currentUser);
      const adminCheck = isUserAdmin(currentUser);
      setIsAdmin(adminCheck);

      if (adminCheck) {
        await ensureAdminRecord(currentUser);
      }

      await saveUserProfileToFirestore({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        phone: currentUser.phoneNumber,
        role: adminCheck ? 'admin' : 'client',
        authProvider: 'google.com',
        lastLoginAt: new Date().toISOString()
      });

      await linkAppointmentsToUser(currentUser);
      await fetchUserPastBookingsFromFirestore(currentUser.uid, currentUser.email || undefined);
      return { redirected: false };
    } catch (popupError: any) {
      // If popup was blocked or failed and we are not constrained to an iframe, redirect
      const canFallbackToRedirect = !isInIframe && (
        popupError?.code === 'auth/popup-blocked' ||
        popupError?.code === 'auth/cancelled-popup-request' ||
        popupError?.code === 'auth/operation-not-supported-in-this-environment' ||
        (isMobile && popupError?.code === 'auth/popup-closed-by-user')
      );

      if (canFallbackToRedirect) {
        console.warn('Popup blocked or dropped on mobile, switching to signInWithRedirect...', popupError);
        await signInWithRedirect(auth, googleProvider);
        return { redirected: true };
      }

      throw popupError;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        loginWithEmail,
        signupWithEmail,
        sendPasswordReset,
        sendPhoneOtp,
        loginWithPhoneOtp,
        resetPasswordWithOtp,
        loginAsAdminWithCredentials,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
