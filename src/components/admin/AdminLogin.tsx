import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundFx } from '../../utils/audio';

type Step = 'google' | 'pin' | 'error_email';

export const AdminLogin: React.FC = () => {
  const { startGoogleLogin, verifyPin, finalizeLogin, pendingFirebaseUser } = useAuth();
  const { data } = usePortfolio();

  const [step, setStep] = useState<Step>('google');
  const [pinInput, setPinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // ── Step 1: Trigger real Google sign-in popup ──────────────────
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setLoading(true);
    soundFx.playClick();

    const result = await startGoogleLogin();
    setLoading(false);

    if (result.status === 'email_ok') {
      // Google verified — move to PIN step
      setStep('pin');
    } else if (result.status === 'unauthorized_email') {
      setStep('error_email');
    } else {
      // Popup closed, domain not authorized, or network error
      setAuthError(result.errorMessage || 'Sign-in was cancelled or failed. Please try again.');
    }
  };

  // ── Step 2: Verify the owner PIN ──────────────────────────────
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(false);

    if (verifyPin(pinInput)) {
      finalizeLogin();
    } else {
      soundFx.playClick();
      setPinError(true);
      setPinInput('');
    }
  };

  // ── Wrong account screen ───────────────────────────────────────
  if (step === 'error_email') {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>
        <h2 className="text-2xl font-extrabold font-heading text-white">Access Denied</h2>
        <p className="text-sm text-slate-400 mt-2 mb-6 leading-relaxed">
          The Google account you signed in with is <span className="text-rose-400 font-semibold">not authorized</span> to access this admin panel.
          Only the verified portfolio owner's account can log in.
        </p>
        <div className="w-full p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono text-left">
          <p>↳ Wrong Google account selected.</p>
          <p className="mt-1 text-rose-400/70">You have been signed out of Google automatically.</p>
        </div>
        <button
          onClick={() => { setStep('google'); setAuthError(null); }}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-bold transition"
        >
          Try a different account
        </button>
      </div>
    );
  }

  // ── PIN verification screen ────────────────────────────────────
  if (step === 'pin') {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-lg mx-auto">
        {/* Verified Google badge */}
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] mb-4">
          {pendingFirebaseUser?.photoURL ? (
            <img src={pendingFirebaseUser.photoURL} alt="Your Google avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-emerald-900 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Google Identity Verified</span>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-6 truncate max-w-xs">{pendingFirebaseUser?.email}</p>

        <h2 className="text-2xl font-extrabold font-heading text-white">Enter Owner PIN</h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          One last step — enter your secret owner PIN to unlock the admin studio.
        </p>

        <form onSubmit={handlePinSubmit} className="w-full space-y-4">
          <div className="relative">
            <input
              id="admin-pin-input"
              type="password"
              required
              autoFocus
              maxLength={32}
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              placeholder="Enter your secret PIN"
              className={`w-full bg-slate-950 border rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-white tracking-widest focus:outline-none transition
                ${pinError
                  ? 'border-rose-500 focus:border-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                  : 'border-slate-700 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                }`}
            />
            <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          </div>

          {pinError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Incorrect PIN. Access blocked.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition transform active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>Unlock Admin Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // ── Step 1: Google sign-in screen ────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-lg mx-auto">
      {/* Shield Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-rose-500 p-[1px] mb-6 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
        Owner-Only Admin Portal
      </h2>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 mb-8 leading-relaxed">
        Protected by <span className="text-cyan-400 font-semibold">real Google OAuth</span> + a secret owner PIN.
        Only the verified portfolio owner can enter — no exceptions.
      </p>

      {/* Security badges */}
      <div className="w-full grid grid-cols-2 gap-3 mb-8">
        {[
          { icon: '🔐', label: 'Real Google OAuth', sub: 'Firebase verified' },
          { icon: '🔑', label: 'Secret Owner PIN', sub: 'Never stored publicly' },
        ].map((badge) => (
          <div key={badge.label} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="text-lg mb-1">{badge.icon}</div>
            <div className="text-xs font-bold text-white">{badge.label}</div>
            <div className="text-[10px] text-slate-500 font-mono">{badge.sub}</div>
          </div>
        ))}
      </div>

      {/* Error banner */}
      {authError && (
        <div className="w-full p-3 mb-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Real Google sign-in button */}
      <button
        id="admin-google-signin-btn"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition transform active:scale-95 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>
        )}
        <span>{loading ? 'Opening Google Sign-In…' : 'Continue with Google'}</span>
      </button>

      <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-slate-500">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>
          {data.profile.name}'s portfolio — unauthorized accounts are immediately blocked &amp; signed out.
        </span>
      </div>
    </div>
  );
};
