import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Phone, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginWithGoogle, loginWithCredentials, registerUser } = useAuth();
  const { showToast, t } = useShop();

  const isRegisterPath = location.pathname.includes('register');
  const [isLogin, setIsLogin] = useState(!isRegisterPath);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect home
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        showToast(t(`Welcome, ${res.user.name}!`, `স্বাগতম, ${res.user.name}!`), 'success');
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setIsLoading(false);
    }
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
          navigate('/');
        } else {
          setError(res.error || 'Login failed');
        }
      } else {
        const res = await registerUser({ name, identifier, password });
        if (res.success) {
          showToast(t(`Account created for ${res.user.name}!`, `অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!`), 'success');
          navigate('/');
        } else {
          setError(res.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Google Login Action */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-2xl glass-card hover:bg-white text-azraq-deep font-bold text-xs sm:text-sm border border-[rgba(130,170,205,0.3)] shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-98 disabled:opacity-50"
        >
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
          <span>{t("Continue with Google", "Google দিয়ে চালিয়ে যান")}</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-[rgba(130,170,205,0.22)]" />
          <span className="absolute px-3 bg-[#F8FBFF] text-[11px] font-medium text-azraq-secondary">
            {t("or with phone / email", "অথবা ফোন / ইমেইল দিয়ে")}
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
              {t("Phone Number or Email", "ফোন নম্বর বা ইমেইল")}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-azraq-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="01851-XXXXXX or you@example.com"
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
            className="w-full py-3.5 rounded-2xl btn-primary-icy text-azraq-deep font-bold text-xs sm:text-sm shadow-[0_8px_24px_rgba(112,200,237,0.35)] hover:shadow-[0_12px_32px_rgba(112,200,237,0.5)] transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
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
