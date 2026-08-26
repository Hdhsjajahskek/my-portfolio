import React, { useState } from 'react';
import { Save, Check, Globe, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PortfolioProfile } from '../../types/portfolio';

export const ProfileEditor: React.FC = () => {
  const { data, updateProfile } = usePortfolio();
  const [profile, setProfile] = useState<PortfolioProfile>({ ...data.profile });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-white">Profile & Bio Identity</h3>
          <p className="text-xs text-slate-400">Edit your public information, credentials, and hero copy without code.</p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>PROFILE UPDATED LIVE & SYNCED TO ALL VIEWERS!</span>
        </div>
      )}

      {/* Core Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">Professional Title / Headline</label>
          <input
            type="text"
            value={profile.title}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Availability Status Badge & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">Hero Badge Callout Text</label>
          <input
            type="text"
            value={profile.badgeText}
            onChange={(e) => setProfile({ ...profile, badgeText: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">Location / Availability Zone</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Bio Copy */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono text-slate-300">Hero Primary Bio</label>
        <textarea
          rows={2}
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono text-slate-300">About Section Extended Narrative</label>
        <textarea
          rows={3}
          value={profile.secondaryBio}
          onChange={(e) => setProfile({ ...profile, secondaryBio: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>

      {/* Avatar URL & Hire Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">Avatar / Profile Image URL</label>
          <input
            type="url"
            value={profile.avatarUrl}
            onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <input
            type="checkbox"
            id="availableForHire"
            checked={profile.availableForHire}
            onChange={(e) => setProfile({ ...profile, availableForHire: e.target.checked })}
            className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
          />
          <label htmlFor="availableForHire" className="text-xs font-mono text-slate-200 cursor-pointer">
            Available For Hire / Accepting New Contracts
          </label>
        </div>
      </div>

      {/* Numeric Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">Years Experience</label>
          <input
            type="number"
            value={profile.yearsOfExperience}
            onChange={(e) => setProfile({ ...profile, yearsOfExperience: Number(e.target.value) })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">Projects Shipped</label>
          <input
            type="number"
            value={profile.projectsCompleted}
            onChange={(e) => setProfile({ ...profile, projectsCompleted: Number(e.target.value) })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">Satisfaction %</label>
          <input
            type="number"
            step="0.1"
            value={profile.clientSatisfaction}
            onChange={(e) => setProfile({ ...profile, clientSatisfaction: Number(e.target.value) })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Social URLs */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-mono text-cyan-400 uppercase">Social & Network Links</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Email Address</label>
            <input
              type="text"
              value={profile.socials.email || ''}
              onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, email: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">GitHub Profile URL</label>
            <input
              type="text"
              value={profile.socials.github || ''}
              onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, github: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">LinkedIn URL</label>
            <input
              type="text"
              value={profile.socials.linkedin || ''}
              onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Twitter / X URL</label>
            <input
              type="text"
              value={profile.socials.twitter || ''}
              onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, twitter: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
