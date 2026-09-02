import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  Check,
  Command,
  Lock,
  Info
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundFx } from '../../utils/audio';

export const SecuritySettingsEditor: React.FC = () => {
  const { data, updateSecuritySettings } = usePortfolio();

  const [hideButton, setHideButton] = useState(data.security?.hideAdminButton || false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    void updateSecuritySettings({ hideAdminButton: hideButton });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-white">Owner Security &amp; Access</h3>
          <p className="text-xs text-slate-400 mt-0.5">Admin access is now secured by real Google OAuth + a secret PIN.</p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>SETTINGS UPDATED!</span>
        </div>
      )}

      {/* Security model info panel */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/30 border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Security Model</span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-base">🔐</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Real Google OAuth (Firebase)</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Only the exact Gmail configured as <code className="text-cyan-400">VITE_ADMIN_EMAIL</code> in your environment can log in. Wrong accounts are blocked and signed out automatically.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-base">🔑</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Secret Owner PIN (Environment Variable)</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                The PIN is stored in <code className="text-cyan-400">VITE_ADMIN_PIN</code> in your <code className="text-cyan-400">.env.local</code> file. It is <span className="text-emerald-400 font-semibold">never</span> saved in localStorage, the database, or the browser — invisible to visitors and DevTools.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-mono">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            To change your authorized email or PIN, edit <strong>.env.local</strong> on your machine and update the environment variables in your Vercel/Netlify project settings. Then redeploy.
          </span>
        </div>
      </div>

      {/* Stealth / Hidden Mode */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-slate-400" />
              Stealth Admin Mode
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Hide the "Admin" button from the public website header so visitors can't even see the login entry point.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              id="stealth-toggle"
              type="checkbox"
              checked={hideButton}
              onChange={(e) => setHideButton(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center gap-2">
          <Command className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Tip: Even with stealth mode on, press <strong>Ctrl + Shift + A</strong> anywhere on the page to open the Admin Portal.
          </span>
        </div>
      </div>

      {/* How to update credentials */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>How to Update Your Credentials</span>
        </div>
        <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>1. Open <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">.env.local</code> in the project root.</p>
          <p>2. Change <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">VITE_ADMIN_EMAIL</code> or <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">VITE_ADMIN_PIN</code> to your new values.</p>
          <p>3. Restart the dev server (<code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">npm run dev</code>).</p>
          <p>4. For production: update the environment variables in <strong>Vercel / Netlify</strong> project settings and redeploy.</p>
        </div>
      </div>
    </form>
  );
};
