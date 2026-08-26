import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Eye, 
  EyeOff, 
  Save, 
  Check, 
  Lock,
  Sparkles,
  Command
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundFx } from '../../utils/audio';

export const SecuritySettingsEditor: React.FC = () => {
  const { data, updateSecuritySettings } = usePortfolio();

  const [emailsInput, setEmailsInput] = useState(
    (data.security?.authorizedEmails || ['admin.creator@gmail.com']).join('\n')
  );
  const [pinInput, setPinInput] = useState(data.security?.masterPin || '8844');
  const [hideButton, setHideButton] = useState(data.security?.hideAdminButton || false);
  const [showPin, setShowPin] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = emailsInput
      .split('\n')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    updateSecuritySettings({
      authorizedEmails: emails.length > 0 ? emails : ['admin.creator@gmail.com'],
      masterPin: pinInput.trim() || '8844',
      hideAdminButton: hideButton
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-white">Owner Security & Access Whitelist</h3>
          <p className="text-xs text-slate-400">Lock down the admin panel so only you and your authorized Google account can enter.</p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <Save className="w-4 h-4" />
          <span>Save Security Rules</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>OWNER SECURITY RULES UPDATED LIVE!</span>
        </div>
      )}

      {/* Authorized Emails */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>Authorized Owner Gmail Address(es)</span>
        </div>
        <p className="text-xs text-slate-400">
          Only these specific Gmail addresses will be permitted to log in to the admin panel (one email per line).
        </p>

        <textarea
          rows={3}
          value={emailsInput}
          onChange={(e) => setEmailsInput(e.target.value)}
          placeholder="your.real.email@gmail.com"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
        />
      </div>

      {/* Master Key PIN */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <KeyRound className="w-4 h-4" />
            <span>Master Security Key / Owner PIN</span>
          </div>
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1"
          >
            {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPin ? 'Hide' : 'Reveal'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Secret backup passkey to authenticate or override access from any browser.
        </p>

        <div className="relative max-w-sm">
          <input
            type={showPin ? 'text' : 'password'}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white tracking-widest focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Stealth / Hidden Mode */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-white">Stealth Admin Mode</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Hide the "Admin Login" button from the public website header so visitors cannot see it.
            </p>
          </div>

          <input
            type="checkbox"
            id="hideAdminButton"
            checked={hideButton}
            onChange={(e) => setHideButton(e.target.checked)}
            className="w-5 h-5 rounded text-cyan-500 bg-slate-950 border-slate-700 cursor-pointer"
          />
        </div>

        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center gap-2">
          <Command className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Tip: You can always press <strong>Ctrl + Shift + A</strong> anywhere on the webpage to open the Admin Portal!</span>
        </div>
      </div>
    </form>
  );
};
