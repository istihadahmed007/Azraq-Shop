import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Phone, Lock, User, ArrowRight, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import GoogleSignInButton from './common/GoogleSignInButton';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthLoading, loginWithCredentials, registerUser } = useAuth();
  const { showToast, t } = useShop();

  const destination = location.state?.from || '/';
  const isRegisterPath = location.pathname.includes('register');
  const [isLogin, setIsLogin] = useState(!isRegisterPath);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to destination
  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate(destination, { replace: true });
    }
  }, [user, isAuthLoading, navigate, destination]);

  const handleGoogleSuccess = (customer) => {
    showToast(t(`Welcome, ${customer.name}!`, `স্বাগতম, ${customer.name}!`), 'success');
    navigate(destination, { replace: true });
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
          navigate(destination, { replace: true });
        } else {
          setError(res.error || 'Login failed. Please check your email and password.');
        }
      } else {
        const res = await registerUser({ name, identifier, password });
        if (res.success) {
          showToast(t(`Account created for ${res.user.name}!`, `অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!`), 'success');
          navigate(destination, { replace: true });
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

  if (isAuthLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#185ADB] animate-spin" />
          <span className="text-xs text-slate-500 font-medium">
            {t("Checking authentication session...", "লগইন সেশন যাচাই করা হচ্ছে...")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 relative overflow-hidden select-none">
      
      {/* Ambient glowing glass background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-azraq-cyan/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-azraq-ice/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-md rounded-3xl glass-panel border border-[rgba(130,170,205,0.35)] shadow-[0_24px_64px_rgba(25,59,91,0.22)] p-7 sm:p-9 relative">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-azraq-secondary hover:text-azraq-deep transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("Back to Storefront", "স্টোরফ্রন্টে ফিরে যান")}</span>
        </Link>

        {/* Branding & Header */}
        <div className="text-center space-y-2 mb-7">
          <div className="flex justify-center">
            <img src="/branding/azraq-logo.png" alt="AZRAQ Shop" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-azraq-deep tracking-tight">
            {isLogin ? t("Sign In to Your Account", "অ্যাকাউন্টে সাইন ইন করুন") : t("Create a Customer Account", "নতুন অ্যাকাউন্ট খুলুন")}
          </h2>
          <p className="text-xs text-azraq-secondary max-w-xs mx-auto">
            {isLogin
              ? t("Track your orders, view saved wishlist, and checkout effortlessly.", "আপনার অর্ডার ট্র্যাক করুন এবং দ্রুত কেনাকাটা সম্পন্ন করুন।")
              : t("Join verified shoppers across Bangladesh with genuine lifestyle goods.", "১,২০০+ আসল পণ্যের কালেকশন ব্রাউজ ও অর্ডার করুন।")}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Reusable Genuine Google GIS Authentication Button */}
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={(err) => setError(err)}
          buttonText="continue_with"
        />

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-[rgba(130,170,205,0.22)]" />
          <span className="absolute px-3 bg-[#F8FBFF] text-[11px] font-medium text-azraq-secondary">
            {t("or with email & password", "অথবা ইমেইল ও পাসওয়ার্ড দিয়ে")}
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-azraq-secondary">
          {isLogin ? (
            <p>
              {t("New to AZRAQ?", "নতুন ক্রেতা?")}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="font-bold text-azraq-deep hover:text-azraq-cyan underline ml-1 cursor-pointer"
              >
                {t("Create your account", "নতুন অ্যাকাউন্ট খুলুন")}
              </button>
            </p>
          ) : (
            <p>
              {t("Already have an account?", "ইতিমধ্যে অ্যাকাউন্ট আছে?")}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="font-bold text-azraq-deep hover:text-azraq-cyan underline ml-1 cursor-pointer"
              >
                {t("Sign in to your account", "লগইন করুন")}
              </button>
            </p>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-6 pt-4 border-t border-[rgba(130,170,205,0.22)] flex items-center justify-center gap-2 text-[11px] text-azraq-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t("Verified Bangladesh E-Commerce Encryption", "নিরাপদ ও সুরক্ষিত গ্রাহক তথ্য")}</span>
        </div>

      </div>
    </div>
  );
}
