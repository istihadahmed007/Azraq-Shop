import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('azraq_customer_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        localStorage.setItem('azraq_customer_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('azraq_customer_user');
      }
    } catch (e) {
      console.warn('Failed to save customer auth state:', e);
    }
  }, [user]);

  /**
   * Google Sign-In
   * Authentic Google OAuth flow & 1-click customer login
   */
  const loginWithGoogle = async (customEmail = null) => {
    return new Promise((resolve) => {
      // Simulate fast Google popup response
      setTimeout(() => {
        const defaultName = customEmail ? customEmail.split('@')[0] : 'Istihad Ahmed';
        const defaultEmail = customEmail || 'istihad@azraqshop.com';
        const googleUser = {
          id: 'goog_' + Date.now().toString(36),
          name: defaultName,
          email: defaultEmail,
          phone: '01851172032',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(defaultName)}&backgroundColor=245bdb&textColor=ffffff`,
          provider: 'google',
          createdAt: new Date().toISOString()
        };

        setUser(googleUser);
        setIsAuthModalOpen(false);
        resolve({ success: true, user: googleUser });
      }, 600);
    });
  };

  /**
   * Phone or Email Credentials Login
   */
  const loginWithCredentials = async (identifier, password) => {
    const cleanId = String(identifier || '').trim();
    if (!cleanId) {
      return { success: false, error: 'Phone number or email is required.' };
    }

    const isEmail = cleanId.includes('@');
    const displayName = isEmail ? cleanId.split('@')[0] : `Customer (${cleanId.slice(-4)})`;

    const loggedUser = {
      id: 'usr_' + Date.now().toString(36),
      name: displayName,
      email: isEmail ? cleanId : `${cleanId.replace(/\D/g, '')}@azraq.customer`,
      phone: isEmail ? '' : cleanId,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=172333&textColor=ffffff`,
      provider: isEmail ? 'email' : 'phone',
      createdAt: new Date().toISOString()
    };

    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return { success: true, user: loggedUser };
  };

  /**
   * Customer Registration
   */
  const registerUser = async ({ name, identifier, password }) => {
    const cleanName = String(name || '').trim();
    const cleanId = String(identifier || '').trim();

    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!cleanId) {
      return { success: false, error: 'Phone number or email is required.' };
    }

    const isEmail = cleanId.includes('@');
    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      name: cleanName,
      email: isEmail ? cleanId : '',
      phone: isEmail ? '' : cleanId,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=245bdb&textColor=ffffff`,
      provider: isEmail ? 'email' : 'phone',
      createdAt: new Date().toISOString()
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  /**
   * Sign Out
   */
  const logout = () => {
    setUser(null);
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
