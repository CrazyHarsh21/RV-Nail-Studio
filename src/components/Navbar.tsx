import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MessageCircle, 
  Calendar, 
  Menu, 
  X, 
  Sparkles, 
  Instagram, 
  User, 
  ShieldCheck, 
  LogOut,
  Clock
} from 'lucide-react';
import { BRAND_PHONE, getWhatsAppUrl, BRAND_INSTAGRAM_URL, BRAND_INSTAGRAM } from '../data/nailData';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenBooking: (service?: string, nailDesign?: string, isHomeService?: boolean) => void;
  onOpenAuth: () => void;
  onOpenAdminDashboard: () => void;
  onOpenMyBookings: () => void;
  onReplayIntro?: () => void;
  appointmentsCount?: number;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenBooking, 
  onOpenAuth,
  onOpenAdminDashboard,
  onOpenMyBookings,
  onReplayIntro,
  appointmentsCount = 0,
  pendingCount = 0
}) => {
  const { user, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Nail Styles', href: '#nail-showcase' },
    { label: 'Runway Swatches', href: '#nail-carousel' },
    { label: 'Services Menu', href: '#services' },
    { label: 'Home Service', href: '#home-service' },
    { label: 'Why Choose Us', href: '#why-choose-us' },
    { label: 'Meet Rohit', href: '#artist' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-[#EBE4DC] shadow-[0_4px_25px_rgba(0,0,0,0.06)] py-2.5'
            : 'bg-[#FAF8F5]/96 backdrop-blur-xl border-b border-[#EBE4DC]/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo: RV Monogram in Warm Aesthetic Gold */}
            <a
              href="#"
              className="flex items-center gap-3 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] via-[#E8A598] to-[#B45309] flex items-center justify-center shadow-md transition-transform group-hover:scale-105 overflow-hidden">
                <div className="w-full h-full rounded-full bg-[#FFFDFB] flex items-center justify-center border border-[#FAF0E6]">
                  <span className="font-serif text-base sm:text-lg font-bold text-[#B45309] tracking-wider">
                    RV
                  </span>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-base sm:text-lg font-bold tracking-widest text-[#1C1917] uppercase leading-none group-hover:text-[#B45309] transition-colors">
                  RV NAILS ART
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#92400E] tracking-[0.2em] uppercase font-semibold mt-0.5">
                  By Rohit • Studio & Doorstep
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-xs uppercase tracking-widest text-[#44403C] hover:text-[#B45309] transition-colors py-1 relative group font-medium"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#B45309] transition-all duration-300 group-hover:w-full rounded-full" />
                </a>
              ))}
            </nav>

            {/* Actions Bar */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* My Bookings link */}
              <button
                onClick={onOpenMyBookings}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7DFD5] bg-white hover:bg-stone-50 text-[#57534E] text-xs font-semibold shadow-2xs transition-all hover:text-[#1C1917]"
                title="View your booked appointments"
              >
                <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                <span>My Bookings</span>
                {appointmentsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold flex items-center justify-center">
                    {appointmentsCount}
                  </span>
                )}
              </button>

              {/* User Account / Login Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E7DFD5] bg-white hover:bg-stone-50 text-xs font-bold text-[#1C1917] shadow-2xs transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#B45309] text-white text-[10px] flex items-center justify-center font-bold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="max-w-[100px] truncate">{user.displayName || user.email?.split('@')[0]}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E7DFD5] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-1.5 border-b border-stone-100">
                        <p className="text-[10px] text-stone-500 uppercase font-bold">Logged In</p>
                        <p className="text-xs font-bold text-stone-800 truncate">{user.displayName || user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenMyBookings();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                        My Bookings
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAdminDashboard();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-[#92400E] bg-amber-50/70 hover:bg-amber-100/70 flex items-center gap-2 font-bold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-stone-100"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7DFD5] bg-white hover:bg-stone-50 text-xs font-bold text-[#1C1917] shadow-2xs transition-all"
                >
                  <User className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Book Appointment CTA */}
              <button
                onClick={() => onOpenBooking()}
                className="relative group overflow-hidden px-4 py-2 rounded-full bg-gradient-to-r from-[#B45309] via-[#C2410C] to-[#BE185D] text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_14px_rgba(180,83,9,0.25)] hover:shadow-[0_6px_20px_rgba(194,65,12,0.35)] active:scale-95 ml-1"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  BOOK NOW
                </span>
              </button>
            </div>

            {/* Mobile Actions Header */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#B45309] to-[#C2410C] text-white text-[11px] font-bold tracking-wider shadow-sm"
              >
                BOOK
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1C1917] hover:text-[#B45309] focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[60px] z-30 bg-[#FAF8F5]/98 backdrop-blur-2xl border-b border-[#E7DFD5] p-6 md:hidden shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5]">
                <span className="text-xs text-[#B45309] uppercase tracking-widest font-serif font-bold">
                  RV Nails Art by Rohit
                </span>
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-600 font-semibold"
                  >
                    Sign Out ({user.displayName || 'User'})
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="text-xs text-[#B45309] font-bold"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>

              {/* My Bookings shortcut on mobile */}
              <div className="flex flex-col gap-2 my-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMyBookings();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white border border-[#E7DFD5] text-[#1C1917] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Clock className="w-4 h-4 text-[#B45309]" />
                  <span>My Bookings</span>
                  {appointmentsCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold flex items-center justify-center ml-1">
                      {appointmentsCount}
                    </span>
                  )}
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminDashboard();
                    }}
                    className="py-2 px-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                    <span>Admin Dashboard (Staff Only)</span>
                  </button>
                )}
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm tracking-wider uppercase text-[#292524] hover:text-[#B45309] py-1.5 transition-colors font-medium border-b border-stone-100"
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-3 border-t border-[#E7DFD5] flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B45309] to-[#C2410C] text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  BOOK AN APPOINTMENT
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 text-[#16A34A] font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                    WHATSAPP
                  </a>
                  <a
                    href={`tel:${BRAND_PHONE}`}
                    className="py-2 rounded-xl border border-[#E7DFD5] bg-white text-[#292524] text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-[#B45309]" />
                    CALL
                  </a>
                </div>

                <a
                  href={BRAND_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-xs text-[#78716C] hover:text-[#B45309] flex items-center justify-center gap-1.5 pt-1 font-medium"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                  @{BRAND_INSTAGRAM}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
