import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/portfolio';
import { soundFx } from '../utils/audio';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loginWithGoogle: (email?: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'aura_portfolio_admin_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const loginWithGoogle = async (email?: string, name?: string): Promise<boolean> => {
    soundFx.playClick();
    
    // Simulate instantaneous Google OAuth verification (or connect to Firebase / Google OAuth API)
    const adminEmail = email || 'admin.creator@gmail.com';
    const adminName = name || 'Admin Creator';
    
    const newUser: AdminUser = {
      uid: 'google-usr-' + Math.random().toString(36).substring(2, 9),
      email: adminEmail,
      displayName: adminName,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };

    setUser(newUser);
    soundFx.playSuccess();
    return true;
  };

  const logout = () => {
    soundFx.playClick();
    setUser(null);
    setIsAdminModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        isAdminModalOpen,
        setIsAdminModalOpen
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
