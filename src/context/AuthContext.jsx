import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * AZRAQ Shop — Genuine Customer Authentication Provider
 * 
 * Secure session-based authentication backed by Google Identity Services
 * and PostgreSQL database sessions. No fake user generation or localStorage tokens.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // Initialize and verify customer session from server cookie on startup and browser refresh
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.authenticated && data?.customer) {
          setUser(data.customer);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('[Customer Auth Check Notice]:', err.message);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  /**
   * Genuine Google Sign-In
   * Submits real Google ID token to /api/auth/google for verification and session establishment
   */
  const loginWithGoogle = async (credential) => {
    if (!credential) {
      return { success: false, error: 'Google credential is required.' };
    }

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ credential })
      });

      const data = await res.json();

      if (res.ok && data.success && data.customer) {
        setUser(data.customer);
        setIsAuthModalOpen(false);
        return { success: true, user: data.customer };
      } else {
        return {
          success: false,
          error: data.error || 'Google authentication was rejected by the server.'
        };
      }
    } catch (err) {
      console.error('[Google Login Network Error]:', err);
      return { success: false, error: 'Unable to connect to authentication server.' };
    }
  };

  /**
   * Server-Verified Credentials Login
   */
  const loginWithCredentials = async (identifier, password) => {
    const cleanId = String(identifier || '').trim();
    const cleanPass = String(password || '');

    if (!cleanId) {
      return { success: false, error: 'Email is required.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Password is required.' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ identifier: cleanId, password: cleanPass })
      });

      const data = await res.json();

      if (res.ok && data.success && data.customer) {
        setUser(data.customer);
        setIsAuthModalOpen(false);
        return { success: true, user: data.customer };
      } else {
        return { success: false, error: data.error || 'Invalid credentials.' };
      }
    } catch (err) {
      return { success: false, error: 'Network error connecting to authentication service.' };
    }
  };

  /**
   * Server-Verified Customer Registration
   */
  const registerUser = async ({ name, identifier, password }) => {
    const cleanName = String(name || '').trim();
    const cleanId = String(identifier || '').trim();
    const cleanPass = String(password || '');

    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!cleanId) {
      return { success: false, error: 'Email address is required.' };
    }
    if (cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name: cleanName, identifier: cleanId, password: cleanPass })
      });

      const data = await res.json();

      if (res.ok && data.success && data.customer) {
        setUser(data.customer);
        setIsAuthModalOpen(false);
        return { success: true, user: data.customer };
      } else {
        return { success: false, error: data.error || 'Failed to create customer account.' };
      }
    } catch (err) {
      return { success: false, error: 'Network error registering customer account.' };
    }
  };

  /**
   * Revoke Server Session & Clear Client State
   */
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.warn('[Logout API Warning]:', e.message);
    } finally {
      setUser(null);
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAuthLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithCredentials,
        registerUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
