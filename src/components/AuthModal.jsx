import React, { useState } from 'react';
import { X, Mail, Phone, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import GoogleSignInButton from './common/GoogleSignInButton';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, loginWithCredentials, registerUser } = useAuth();
  const { showToast, t } = useShop();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleGoogleSuccess = (customer) => {
    showToast(t(`Welcome, ${customer.name}!`, `স্বাগতম, ${customer.name}!`), 'success');
    closeAuthModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await loginWithCredentials(identifier, password);
        if (res.success) {
          showToast(t(`Welcome back, ${res.user.name}!`, `পুনরায় স্বাগতম, ${res.user.name}!`), 'success');
          closeAuthModal();
        } else {
          setError(res.error || 'Login failed. Please check your email and password.');
        }
      } else {
        const res = await registerUser({ name, identifier, password });
        if (res.success) {
          showToast(t(`Account created for ${res.user.name}!`, `অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!`), 'success');
          closeAuthModal();
        } else {
          setError(res.error || 'Registration failed.');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-azraq-deep/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 select-none">
      
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      {/* Glassmorphism Modal Panel */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl glass-panel border border-[rgba(130,170,205,0.35)] shadow-[0_24px_64px_rgba(25,59,91,0.22)] p-6 sm:p-8 overflow-hidden z-10"
      >
        {/* Subtle Ambient Light Orbs inside modal */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-azraq-cyan/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-azraq-ice/30 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass-card hover:bg-white text-azraq-secondary hover:text-azraq-deep border border-[rgba(130,170,205,0.3)] shadow-xs transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center">
            <img src="/branding/azraq-logo.png" alt="AZRAQ Shop" className="h-9 w-auto object-contain" />
          </div>
          <h3 className="text-xl font-bold text-azraq-deep tracking-tight">
            {isLogin ? t("Sign In to AZRAQ", "AZRAQ-এ লগইন করুন") : t("Create Customer Account", "নতুন অ্যাকাউন্ট তৈরি করুন")}
          </h3>
          <p className="text-xs text-azraq-secondary max-w-xs mx-auto">
            {isLogin 
              ? t("Access your orders, saved wishlist, and faster checkout.", "আপনার অর্ডার ট্র্যাক করুন এবং দ্রুত চেকআউট করুন।")
              : t("Join verified shoppers across Bangladesh with genuine lifestyle goods.", "নিরাপদ ও আসল কেনাকাটায় আমাদের সাথে যুক্ত হোন।")}
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* 1. Reusable Genuine Google GIS Authentication Button */}
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={(err) => setError(err)}
          buttonText="continue_with"
        />

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-[rgba(130,170,205,0.22)]" />
          <span className="absolute px-3 bg-[#F8FBFF] text-[11px] font-medium text-azraq-secondary">
            {t("or with email & password", "অথবা ইমেইল ও পাসওয়ার্ড দিয়ে")}
          </span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-bold text-azraq-deep mb-1">
                {t("Full Name", "আপনার নাম")}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-azraq-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Istihad Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/80 border border-[rgba(130,170,205,0.3)] text-xs sm:text-sm text-azraq-deep focus:outline-none focus:border-azraq-cyan focus:ring-2 focus:ring-azraq-cyan/30 transition-all shadow-inner"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-azraq-deep mb-1">
              {t("Email Address", "ইমেইল এড্রেস")}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-azraq-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/80 border border-[rgba(130,170,205,0.3)] text-xs sm:text-sm text-azraq-deep focus:outline-none focus:border-azraq-cyan focus:ring-2 focus:ring-azraq-cyan/30 transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-azraq-deep mb-1">
              {t("Password", "পাসওয়ার্ড")}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-azraq-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/80 border border-[rgba(130,170,205,0.3)] text-xs sm:text-sm text-azraq-deep focus:outline-none focus:border-azraq-cyan focus:ring-2 focus:ring-azraq-cyan/30 transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl btn-primary-icy text-azraq-deep font-bold text-xs sm:text-sm shadow-[0_8px_24px_rgba(112,200,237,0.35)] hover:shadow-[0_12px_32px_rgba(112,200,237,0.5)] transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <span>{isLogin ? t("Sign In", "লগইন করুন") : t("Create Account", "অ্যাকাউন্ট খুলুন")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-5 text-center text-xs text-azraq-secondary">
          {isLogin ? (
            <p>
              {t("Don't have an account?", "অ্যাকাউন্ট নেই?")}{' '}
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="font-bold text-azraq-deep hover:text-azraq-cyan underline ml-1 cursor-pointer"
              >
                {t("Register now", "এখনই রেজিস্ট্রেশন করুন")}
              </button>
            </p>
          ) : (
            <p>
              {t("Already have an account?", "ইতিমধ্যে অ্যাকাউন্ট আছে?")}{' '}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="font-bold text-azraq-deep hover:text-azraq-cyan underline ml-1 cursor-pointer"
              >
                {t("Sign In", "লগইন করুন")}
              </button>
            </p>
          )}
        </div>

        {/* Trust Badge */}
        <div className="mt-5 pt-3 border-t border-[rgba(130,170,205,0.22)] flex items-center justify-center gap-1.5 text-[11px] text-azraq-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t("Verified Bangladesh E-Commerce Encryption", "নিরাপদ ও সুরক্ষিত গ্রাহক তথ্য")}</span>
        </div>

      </div>
    </div>
  );
}
