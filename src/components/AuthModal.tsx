import React, { useState, useEffect, useRef } from 'react';
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
  Phone, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  RotateCw, 
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminDashboard?: () => void;
  defaultTab?: 'phone_otp' | 'signin' | 'signup' | 'admin';
}

type AuthTab = 'phone_otp' | 'signin' | 'signup' | 'forgot' | 'admin';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminDashboard,
  defaultTab = 'phone_otp'
}) => {
  const { 
    loginWithEmail, 
    signupWithEmail, 
    sendPasswordReset,
    sendPhoneOtp,
    loginWithPhoneOtp,
    resetPasswordWithOtp,
    loginAsAdminWithCredentials,
    loginWithGoogle 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
  
  // Form states
  const [phone, setPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Forgot Password Mode
  const [forgotMethod, setForgotMethod] = useState<'email' | 'phone'>('email');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Admin passkey / credential
  const [adminIdentifier, setAdminIdentifier] = useState('rohit@rvnails.com');
  const [adminPasskey, setAdminPasskey] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP Input refs
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setError(null);
      setSuccessMsg(null);
      setForgotSuccess(null);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleanVal;
    setOtpDigits(updated);

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || '';
    }
    setOtpDigits(updated);
    if (pasted.length >= 6) {
      otpInputRefs.current[5]?.focus();
    } else {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  // 1. Send Mobile OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      setLoading(true);
      const res = await sendPhoneOtp(cleanPhone);
      setOtpSent(true);
      setGeneratedDemoOtp(res.code);
      setResendTimer(30);
      setSuccessMsg(`OTP sent to +91 ${cleanPhone.slice(-10)}`);
      // Focus first OTP field
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please check your number.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP and Log In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification OTP.');
      return;
    }

    try {
      setLoading(true);
      await loginWithPhoneOtp(phone, code, clientName);
      setSuccessMsg('Phone verified successfully! Logged in as Client.');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Email & Password Sign In
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
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again or reset your password.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account exists with this email address. Please click Sign Up to register.');
      } else {
        setError(err.message || 'Sign in failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. Real-World Client Account Registration
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
      await signupWithEmail(email.trim(), password, name.trim(), signupPhone.trim());
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

  // 5. Forgot Password Recovery
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (forgotMethod === 'email') {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid registered email address.');
        return;
      }
      try {
        setLoading(true);
        await sendPasswordReset(email.trim());
        setForgotSuccess(`Password reset link has been dispatched to ${email}. Please check your email inbox.`);
      } catch (err: any) {
        setError(err.message || 'Failed to send reset email.');
      } finally {
        setLoading(false);
      }
    } else {
      // Via Phone OTP
      const code = otpDigits.join('');
      if (!phone || code.length !== 6 || !newPassword) {
        setError('Please enter mobile number, 6-digit OTP and new password.');
        return;
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      try {
        setLoading(true);
        await resetPasswordWithOtp(phone, code, newPassword);
        setForgotSuccess('Password reset successfully! You can now log in with your new password.');
      } catch (err: any) {
        setError(err.message || 'Failed to reset password.');
      } finally {
        setLoading(false);
      }
    }
  };

  // 6. Admin Authentication (Restricted to Salon Owner / Staff)
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminPasskey.trim()) {
      setError('Please enter the Salon Manager passkey.');
      return;
    }

    try {
      setLoading(true);
      await loginAsAdminWithCredentials(adminIdentifier, adminPasskey.trim());
      setSuccessMsg('Manager authenticated! Unlocking Salon Admin Suite...');
      setTimeout(() => {
        onClose();
        if (onOpenAdminDashboard) {
          onOpenAdminDashboard();
        }
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Access Denied: Invalid Administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-md bg-[#FFFDFB] border border-[#E7DFD5] rounded-3xl shadow-2xl overflow-hidden my-6 text-[#1C1917]"
        >
          {/* Top Decorative Header */}
          <div className="relative bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917] text-white p-6 pb-7">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B45309] p-[2px] flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-[#1C1917] flex items-center justify-center">
                  <span className="font-serif text-sm font-bold text-[#FBBF24]">RV</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FBBF24]">
                  RV Nails Art by Rohit
                </p>
                <h3 className="font-serif text-xl font-bold text-white">
                  {activeTab === 'admin'
                    ? 'Salon Manager Portal'
                    : activeTab === 'signup'
                    ? 'Create Client Account'
                    : activeTab === 'forgot'
                    ? 'Account Recovery'
                    : 'Client Sign In'}
                </h3>
              </div>
            </div>
            
            <p className="text-xs text-stone-300">
              {activeTab === 'admin'
                ? 'Authorized access for Rohit & Salon Managers only'
                : 'Book bespoke studio slots and luxury doorstep home services'}
            </p>
          </div>

          {/* Primary Navigation Tabs */}
          {activeTab !== 'admin' && (
            <div className="grid grid-cols-3 bg-[#FAF5F0] border-b border-[#E7DFD5] text-xs font-bold">
              <button
                type="button"
                onClick={() => { setActiveTab('phone_otp'); setError(null); }}
                className={`py-3 px-2 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  activeTab === 'phone_otp'
                    ? 'border-[#B45309] text-[#B45309] bg-white'
                    : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone OTP</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); setError(null); }}
                className={`py-3 px-2 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  activeTab === 'signin'
                    ? 'border-[#B45309] text-[#B45309] bg-white'
                    : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setError(null); }}
                className={`py-3 px-2 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  activeTab === 'signup'
                    ? 'border-[#B45309] text-[#B45309] bg-white'
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
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ================= TAB 1: PHONE OTP LOGIN ================= */}
            {activeTab === 'phone_otp' && (
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Indian Mobile Number
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2.5 bg-stone-100 border border-[#E7DFD5] rounded-xl text-xs font-bold text-stone-700 select-none">
                      🇮🇳 +91
                    </span>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        disabled={otpSent}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] font-semibold focus:outline-none disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {!otpSent && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
                      Your Full Name <span className="text-stone-400 font-normal">(Optional for bookings)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* OTP Digit Blocks when Sent */}
                {otpSent && (
                  <div className="space-y-2 pt-1 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                        Enter 6-Digit OTP Code
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpDigits(['', '', '', '', '', '']);
                        }}
                        className="text-[11px] text-[#B45309] hover:underline"
                      >
                        Change Number
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-bold bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] focus:bg-white rounded-xl text-[#1C1917] focus:outline-none transition-all shadow-2xs"
                        />
                      ))}
                    </div>

                    {generatedDemoOtp && (
                      <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center justify-between">
                        <span>Demo Verification Code: <strong className="font-mono text-sm tracking-widest">{generatedDemoOtp}</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            const digits = generatedDemoOtp.split('');
                            setOtpDigits(digits);
                          }}
                          className="px-2 py-1 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-[10px]"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-1">
                      <span>Didn't receive code?</span>
                      {resendTimer > 0 ? (
                        <span className="font-medium text-stone-500">Resend in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="font-bold text-[#B45309] hover:underline flex items-center gap-1"
                        >
                          <RotateCw className="w-3 h-3" /> Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 mt-4"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <span>{otpSent ? 'Verify & Continue' : 'Get Verification Code'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= TAB 2: EMAIL & PASSWORD SIGN IN ================= */}
            {activeTab === 'signin' && (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="client@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
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
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {/* ================= TAB 3: CLIENT REGISTRATION (SIGN UP) ================= */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Natasha Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                    Mobile Number (For Appointment SMS/WhatsApp)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="98201 12345"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
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
                      placeholder="natasha@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 mt-3"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Profile...</span>
                    </div>
                  ) : (
                    <>
                      <span>Register Client Account</span>
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
            )}

            {/* ================= TAB 4: FORGOT PASSWORD ================= */}
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
                    <h4 className="font-serif font-bold text-stone-900">Request Dispatched</h4>
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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

            {/* ================= TAB 5: SALON ADMIN PORTAL ================= */}
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
                      placeholder="rohit@rvnails.com"
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
                      placeholder="Enter passkey (e.g. rvadmin)"
                      value={adminPasskey}
                      onChange={(e) => setAdminPasskey(e.target.value)}
                      className="w-full bg-[#FAF5F0] border border-[#E7DFD5] focus:border-[#B45309] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1C1917] focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-1.5">
                    Authorized passkey: <code className="px-1.5 py-0.5 rounded bg-stone-100 font-mono text-[#B45309] font-bold">rvadmin</code>
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('phone_otp'); setError(null); }}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Back to Client
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

            {/* Bottom Subtle Admin Entry Link (Real World Pattern) */}
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
