import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { AlertCircle, Loader2 } from 'lucide-react';

/**
 * Reusable Google Sign-In Button Component
 * 
 * Embeds the official Google Identity Services (GIS) button using
 * `google.accounts.id.renderButton()`.
 * Validates configuration and handles credential callback securely.
 */
export default function GoogleSignInButton({ onSuccess, onError, buttonText = 'continue_with' }) {
  const { loginWithGoogle } = useAuth();
  const { t } = useShop();
  const buttonContainerRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    // If no client ID configured in environment, show clear understandable configuration notice
    if (!clientId || clientId === 'YOUR_WEB_CLIENT_ID') {
      setIsInitializing(false);
      setErrorMessage(t(
        "Google Sign-In is not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment.",
        "গুগল সাইন-ইন কনফিগার করা হয়নি। অনুগ্রহ করে VITE_GOOGLE_CLIENT_ID সেট করুন।"
      ));
      return;
    }

    // Ensure Google Identity Services script is injected if not already loaded
    if (typeof window !== 'undefined' && !window.google?.accounts?.id) {
      let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    let intervalId = null;
    let attempts = 0;
    const maxAttempts = 50; // Wait up to 5 seconds for GIS script to load

    const initGIS = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id && buttonContainerRef.current) {
        try {
          // Initialize GIS client once with credential response callback
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              if (!response?.credential) {
                const err = 'No credential returned from Google.';
                setErrorMessage(err);
                if (onError) onError(err);
                return;
              }

              setIsSubmitting(true);
              setErrorMessage('');

              try {
                const res = await loginWithGoogle(response.credential);
                if (res.success) {
                  if (onSuccess) onSuccess(res.user);
                } else {
                  const errText = res.error || 'Authentication with Google failed.';
                  setErrorMessage(errText);
                  if (onError) onError(errText);
                }
              } catch (err) {
                const errText = err.message || 'Network error during Google authentication.';
                setErrorMessage(errText);
                if (onError) onError(errText);
              } finally {
                setIsSubmitting(false);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });

          // Render official Google button
          buttonContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonContainerRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: buttonText,
            shape: 'rectangular',
            logo_alignment: 'left',
            width: buttonContainerRef.current.clientWidth || 320
          });

          setIsInitializing(false);
          if (intervalId) clearInterval(intervalId);
        } catch (err) {
          console.error('[Google GIS Init Error]:', err);
          setIsInitializing(false);
          setErrorMessage('Failed to initialize Google Sign-In widget.');
        }
        return true;
      }
      return false;
    };

    if (!initGIS()) {
      intervalId = setInterval(() => {
        attempts++;
        if (initGIS() || attempts >= maxAttempts) {
          clearInterval(intervalId);
          setIsInitializing(false);
          if (attempts >= maxAttempts && !window.google?.accounts?.id) {
            setErrorMessage('Google Identity Services script could not be loaded. Please check your internet connection.');
          }
        }
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [clientId, loginWithGoogle, buttonText, t, onSuccess, onError]);

  return (
    <div className="w-full flex flex-col items-center gap-2.5">
      {/* Error state */}
      {errorMessage && (
        <div className="w-full p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Loading state during server verification */}
      {isSubmitting && (
        <div className="w-full py-2.5 px-4 rounded-xl bg-[#185ADB]/10 border border-[#185ADB]/20 text-[#185ADB] text-xs font-semibold flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{t("Verifying Google account with AZRAQ server...", "গুগল অ্যাকাউন্ট যাচাই করা হচ্ছে...")}</span>
        </div>
      )}

      {/* Official GIS Button Container */}
      <div
        ref={buttonContainerRef}
        className={`w-full min-h-[44px] flex justify-center items-center rounded-xl overflow-hidden ${
          isSubmitting ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        {isInitializing && !errorMessage && (
          <div className="w-full py-3 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
            <span>{t("Loading Google Sign-In...", "গুগল সাইন-ইন লোড হচ্ছে...")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
