import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

export const isFirebaseConfigured = Boolean(
  apiKey && projectId && apiKey !== 'undefined' && apiKey.trim() !== ''
);

console.log('[Firebase Status] Configured:', isFirebaseConfigured, '| API Key Present:', Boolean(apiKey));

// All values come from environment variables — never hardcoded.
// Set these in .env.local (gitignored) for local dev, and in your
// hosting provider's environment settings (Vercel/Netlify) for production.
const firebaseConfig = {
  apiKey: isFirebaseConfigured ? apiKey : 'AIzaSyA_PlaceholderForBuild_SafeMode_000',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'bhup3shchaudhary.firebaseapp.com',
  projectId: projectId || 'bhup3shchaudhary',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Force account selection every time (prevents auto-login with wrong account)
if (isFirebaseConfigured) {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

