import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { AdminUser } from '../types/portfolio';
import { soundFx } from '../utils/audio';

// ─────────────────────────────────────────────────────────────────
// Environment-variable based security config.
// These are set in .env.local and are NEVER stored in localStorage.
// ─────────────────────────────────────────────────────────────────
const AUTHORIZED_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim().toLowerCase() ?? '';
const ADMIN_PIN = (import.meta.env.VITE_ADMIN_PIN as string | undefined)?.trim() ?? '';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  /** Step 1: Opens the real Google sign-in popup and checks email.
   *  Returns 'email_ok' if Google auth passed and email is authorized,
   *  'unauthorized_email' if wrong account, or 'error' on failure. */
  startGoogleLogin: () => Promise<'email_ok' | 'unauthorized_email' | 'error'>;
  /** Step 2: Called after Google auth succeeds — validates the owner PIN.
   *  Returns true if PIN matches the env var, false otherwise. */
  verifyPin: (pin: string) => boolean;
  /** Finalizes login after both Google + PIN checks pass. */
  finalizeLogin: () => void;
  logout: () => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  // Internal: the Firebase user verified by Google but pending PIN
  pendingFirebaseUser: FirebaseUser | null;
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

  const [pendingFirebaseUser, setPendingFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Persist session (no sensitive credentials — only display info)
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Listen for Firebase auth state changes (handles page refresh)
  // If Firebase loses the session, clear our admin user too.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser && user) {
        // Firebase session ended — clear admin state
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // ─── Step 1: Real Google sign-in popup ──────────────────────────
  const startGoogleLogin = async (): Promise<'email_ok' | 'unauthorized_email' | 'error'> => {
    soundFx.playClick();

    if (!AUTHORIZED_EMAIL) {
      console.error('[Auth] VITE_ADMIN_EMAIL is not set. Check your .env.local file.');
      return 'error';
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const signedInEmail = firebaseUser.email?.trim().toLowerCase() ?? '';

      if (signedInEmail !== AUTHORIZED_EMAIL) {
        // Wrong Google account — sign them out immediately
        await signOut(auth);
        soundFx.playClick();
        return 'unauthorized_email';
      }

      // Email matches — hold the Firebase user and wait for PIN
      setPendingFirebaseUser(firebaseUser);
      return 'email_ok';
    } catch (err: unknown) {
      // User closed popup or network error — not a security failure
      const code = (err as { code?: string })?.code;
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        console.error('[Auth] Google sign-in error:', err);
      }
      return 'error';
    }
  };

  // ─── Step 2: Verify the owner PIN ───────────────────────────────
  const verifyPin = (pin: string): boolean => {
    if (!ADMIN_PIN) {
      console.error('[Auth] VITE_ADMIN_PIN is not set. Check your .env.local file.');
      return false;
    }
    return pin.trim() === ADMIN_PIN;
  };

  // ─── Step 3: Finalize — set the authenticated admin user ────────
  const finalizeLogin = () => {
    if (!pendingFirebaseUser) return;

    const adminUser: AdminUser = {
      uid: pendingFirebaseUser.uid,
      email: pendingFirebaseUser.email ?? '',
      displayName: pendingFirebaseUser.displayName ?? 'Owner',
      photoURL: pendingFirebaseUser.photoURL ?? undefined,
    };

    setUser(adminUser);
    setPendingFirebaseUser(null);
    soundFx.playSuccess();
  };

  // ─── Logout ─────────────────────────────────────────────────────
  const logout = async () => {
    soundFx.playClick();
    await signOut(auth).catch(() => {/* ignore */});
    setUser(null);
    setPendingFirebaseUser(null);
    setIsAdminModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        startGoogleLogin,
        verifyPin,
        finalizeLogin,
        logout,
        pendingFirebaseUser,
        isAdminModalOpen,
        setIsAdminModalOpen,
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
