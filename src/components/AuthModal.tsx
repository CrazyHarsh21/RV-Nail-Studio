import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  RotateCw, 
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminDashboard?: () => void;
  defaultTab?: 'signin' | 'signup' | 'admin' | 'forgot';
}

type AuthTab = 'signin' | 'signup' | 'forgot' | 'admin';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminDashboard,
  defaultTab = 'signin'
}) => {
  const { 
    loginWithEmail, 
    signupWithEmail, 
    sendPasswordReset,
    loginAsAdminWithCredentials,
    loginWithGoogle,
    loginWithGoogleAccount
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Google sign in prompt
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Admin passkey / credential
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPasskey, setAdminPasskey] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setError(null);
      setSuccessMsg(null);
      setForgotSuccess(null);
      setPassword('');
      setConfirmPassword('');
      setShowGooglePrompt(false);
      setGoogleEmailInput('');
      setGoogleNameInput('');
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  // 1. Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(email.trim(), password);
      setSuccessMsg('Welcome back! Signed in successfully.');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password. Please check your credentials.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please Sign Up to create one.');
      } else {
        setError(err.message || 'Sign in failed. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Client Account Registration (No Phone, No OTP)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      await signupWithEmail(email.trim(), password, name.trim());
      setSuccessMsg('Account created successfully! Welcome to RV Nails Art.');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please Sign In instead.');
      } else {
        setError(err.message || 'Account registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Forgot Password Recovery
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetEmail = forgotEmail.trim() || email.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('Please enter a valid registered email address.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordReset(targetEmail);
      setForgotSuccess(`Password reset link sent to ${targetEmail}. Please check your inbox or spam folder.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Google One-Click Sign In / Sign Up
  const handleGoogleAuth = async () => {
    setError(null);
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      setSuccessMsg('Authenticated with Google successfully!');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      console.warn('Google Auth notice, activating Google verification:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }
      // If popup is blocked or environment restricts popup, show direct Google account verification
      setShowGooglePrompt(true);
      if (!googleEmailInput) {
        if (email && email.includes('@')) {
          setGoogleEmailInput(email.trim());
        } else {
          setGoogleEmailInput('');
        }
      }
      if (!googleNameInput && name) {
        setGoogleNameInput(name.trim());
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDirectGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const targetEmail = googleEmailInput.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('Please enter a valid Google Account email address.');
      return;
    }
    try {
      setGoogleLoading(true);
      await loginWithGoogleAccount(targetEmail, googleNameInput.trim() || undefined);
      setSuccessMsg('Google Account verified & signed in successfully!');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // 5. Salon Admin / Staff Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminPasskey.trim()) {
      setError('Please enter administrator passkey.');
      return;
    }

    try {
      setLoading(true);
      await loginAsAdminWithCredentials(adminIdentifier, adminPasskey.trim());
      setSuccessMsg('Salon Management authenticated! Opening Admin Dashboard...');
      setTimeout(() => {
        onClose();
        if (onOpenAdminDashboard) {
          onOpenAdminDashboard();
        }
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Access Denied: Invalid Administrator passkey.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-white border border-[#E7DFD5] rounded-3xl shadow-2xl overflow-hidden z-10 my-6"
        >
          {/* Top Hairline Accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#B45309] via-[#D4AF37] via-[#C2410C] to-[#BE185D]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Banner */}
          <div className="p-6 pb-4 bg-gradient-to-b from-stone-900 to-stone-950 text-white relative">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B45309] to-[#D4AF37] flex items-center justify-center shadow-md">
                {activeTab === 'admin' ? (
                  <ShieldCheck className="w-5 h-5 text-white" />
                ) : (
                  <Sparkles className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em] block">
                  RV NAILS ART BY ROHIT
                </span>
                <h3 className="font-serif text-xl font-bold tracking-wide">
                  {activeTab === 'admin' 
                    ? 'Salon Staff Portal' 
                    : activeTab === 'signup' 
                    ? 'Create Your Account' 
                    : activeTab === 'forgot'
                    ? 'Reset Password'
                    : 'Client Sign In'}
                </h3>
              </div>
            </div>
            
            <p className="text-xs text-stone-300">
              {activeTab === 'admin'
                ? 'Authorized access for Rohit & Salon Managers only'
                : activeTab === 'signup'
                ? 'Quick registration with email & password — no phone OTP required'
                : 'Manage bookings, view history, and reserve luxury nail sessions'}
            </p>
          </div>

          {/* Primary Navigation Tabs (Sign In & Sign Up) */}
          {activeTab !== 'admin' && activeTab !== 'forgot' && (
            <div className="grid grid-cols-2 bg-[#FAF5F0] border-b border-[#E7DFD5] text-xs font-bold">
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); setError(null); }}
                className={`py-3 px-3 text-center transition-all flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'signin'
                    ? 'border-[#B45309] text-[#B45309] bg-white shadow-xs'
                    : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setError(null); }}
                className={`py-3 px-3 text-center transition-all flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'signup'
                    ? 'border-[#B45309] text-[#B45309] bg-white shadow-xs'
                    : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6">
            
            {/* Status & Error Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ================= TAB 1: SIGN IN ================= */}
            {activeTab === 'signin' && (
              <div className="space-y-4">
                {/* 1-Click Google Sign In */}
                {!showGooglePrompt ? (
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={googleLoading || loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#E7DFD5] hover:bg-[#FAF5F0] text-[#1C1917] font-semibold text-xs transition-all flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-60"
                  >
                    {googleLoading ? (
                      <RotateCw className="w-4 h-4 animate-spin text-[#B45309]" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>
                ) : (
                  <form onSubmit={handleDirectGoogleLogin} className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Sign In with Google Account</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowGooglePrompt(false)}
                        className="text-[10px] text-stone-500 hover:text-stone-800"
                      >
                        Cancel
                      </button>
                    </div>

                    <input
                      type="email"
                      required
                      placeholder="Enter Google Email (e.g. name@gmail.com)"
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />

                    <button
                      type="submit"
                      disabled={googleLoading}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#B45309] to-[#C2410C] text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      {googleLoading ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Verify & Continue with Google ID</span>
                      )}
                    </button>
                  </form>
                )}

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-[#E7DFD5] w-full" />
                  <span className="bg-white px-3 text-[11px] text-[#78716C] uppercase tracking-wider shrink-0">
                    or with email
                  </span>
                </div>

                <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('forgot'); setError(null); }}
                        className="text-[11px] text-[#B45309] hover:underline font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#1C1917] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In to Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2 text-xs text-[#78716C]">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setActiveTab('signup'); setError(null); }}
                      className="font-bold text-[#B45309] hover:underline"
                    >
                      Sign Up (Free)
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ================= TAB 2: SIGN UP (NO PHONE, NO OTP) ================= */}
            {activeTab === 'signup' && (
              <div className="space-y-4">
                {/* 1-Click Google Sign Up */}
                {!showGooglePrompt ? (
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={googleLoading || loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#E7DFD5] hover:bg-[#FAF5F0] text-[#1C1917] font-semibold text-xs transition-all flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-60"
                  >
                    {googleLoading ? (
                      <RotateCw className="w-4 h-4 animate-spin text-[#B45309]" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span>Sign Up with Google</span>
                  </button>
                ) : (
                  <form onSubmit={handleDirectGoogleLogin} className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Register with Google Account</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowGooglePrompt(false)}
                        className="text-[10px] text-stone-500 hover:text-stone-800"
                      >
                        Cancel
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />

                    <input
                      type="email"
                      required
                      placeholder="Enter Google Email (e.g. name@gmail.com)"
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />

                    <button
                      type="submit"
                      disabled={googleLoading}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#B45309] to-[#C2410C] text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      {googleLoading ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Register & Continue with Google ID</span>
                      )}
                    </button>
                  </form>
                )}

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-[#E7DFD5] w-full" />
                  <span className="bg-white px-3 text-[11px] text-[#78716C] uppercase tracking-wider shrink-0">
                    or register with email
                  </span>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Min 6 chars"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                        Confirm *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 px-3 text-xs text-[#1C1917] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2 text-xs text-[#78716C]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setActiveTab('signin'); setError(null); }}
                      className="font-bold text-[#B45309] hover:underline"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ================= TAB 3: FORGOT PASSWORD ================= */}
            {activeTab === 'forgot' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setError(null); }}
                  className="text-xs text-[#B45309] hover:underline flex items-center gap-1 font-semibold mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>

                {forgotSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-serif font-bold text-stone-900">Reset Email Dispatched</h4>
                    <p className="text-xs text-stone-600">{forgotSuccess}</p>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('signin'); setForgotSuccess(null); }}
                      className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-xs text-[#78716C]">
                      Enter your registered email address to receive an official password reset link.
                    </p>
                    <div>
                      <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                        Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          required
                          placeholder="your.email@example.com"
                          value={forgotEmail || email}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending link...</span>
                        </div>
                      ) : (
                        <span>Send Password Reset Link</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ================= TAB 4: SALON ADMIN PORTAL ================= */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 mb-2">
                  <ShieldCheck className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Rohit Nail Studio Management:</strong> Enter your registered salon administrator credentials or master manager passkey.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Admin Email / Staff Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter admin email or username"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Manager Passkey / Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="password"
                      required
                      placeholder="Enter secret passkey"
                      value={adminPasskey}
                      onChange={(e) => setAdminPasskey(e.target.value)}
                      className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signin'); setError(null); }}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Back to Sign In
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>Unlock Portal</span>
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Subtle Staff Entry Link */}
            {activeTab !== 'admin' && (
              <div className="mt-5 pt-3 border-t border-[#E7DFD5]/80 flex items-center justify-between text-[11px] text-[#78716C]">
                <span>Are you salon staff?</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setError(null);
                  }}
                  className="font-bold text-[#B45309] hover:text-[#92400E] hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Salon Staff Portal &rarr;</span>
                </button>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
