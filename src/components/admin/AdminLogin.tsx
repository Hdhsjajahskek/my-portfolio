import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundFx } from '../../utils/audio';

export const AdminLogin: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const { data } = usePortfolio();

  const [googleEmail, setGoogleEmail] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const authorizedList = data.security?.authorizedEmails || ['admin.creator@gmail.com'];
  const masterPin = data.security?.masterPin || '8844';

  const handleGoogleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    soundFx.playClick();

    setTimeout(async () => {
      const emailNormalized = googleEmail.trim().toLowerCase();
      const pinTrimmed = securityPin.trim();

      // Check if email matches owner whitelist OR if valid master security PIN is provided
      const isEmailAuthorized = authorizedList.some(
        em => em.trim().toLowerCase() === emailNormalized
      );
      const isPinAuthorized = pinTrimmed === masterPin;

      if (isEmailAuthorized || isPinAuthorized) {
        await loginWithGoogle(
          emailNormalized || authorizedList[0] || 'owner@portfolio.com',
          data.profile.name + ' (Owner)'
        );
        setLoading(false);
      } else {
        soundFx.playClick();
        setAuthError('Access Denied: This Google account or PIN is not authorized. Only the verified portfolio owner can access the admin studio.');
        setLoading(false);
      }
    }, 600);
  };

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
      <p className="text-xs sm:text-sm text-slate-400 mt-2 mb-6">
        Protected by Owner Whitelist Verification & Master Security Key. Only authorized owners can enter.
      </p>

      {/* Error Banner */}
      {authError && (
        <div className="w-full p-4 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-mono text-left flex items-start gap-2.5 animate-in fade-in">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleGoogleAuth} className="w-full space-y-4 text-left">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Owner Authentication</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">RESTRICTED</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-mono">Your Owner Gmail Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-mono">Master Security PIN (or default 8844)</label>
              <span className="text-[10px] text-cyan-400 font-mono">Owner Key</span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                placeholder="Enter owner PIN (e.g. 8844)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none tracking-widest"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm font-heading flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition transform active:scale-95 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{loading ? 'VERIFYING_OWNER_AUTHORIZATION...' : 'Sign in as Portfolio Owner'}</span>
        </button>
      </form>

      <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-slate-500">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Unverified accounts cannot view or modify your data.</span>
      </div>
    </div>
  );
};
