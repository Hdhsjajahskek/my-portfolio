import React from 'react';
import { Sparkles, Shield, Heart, ArrowUp, Cpu } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { soundFx } from '../../utils/audio';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();
  const { setIsAdminModalOpen, isAuthenticated } = useAuth();

  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 pointer-events-auto z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px]">
            <div className="w-full h-full bg-[#070a14] rounded-lg flex items-center justify-center font-heading font-black text-cyan-400 text-sm">
              A
            </div>
          </div>
          <div>
            <div className="font-bold text-white text-sm font-heading">{data.profile.name}</div>
            <p className="text-[11px] font-mono text-slate-500">
              3D Creative Engineering • Real-Time CMS Architecture
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-Time Sync Mesh: <strong>CONNECTED</strong></span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsAdminModalOpen(true);
            }}
            className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/40"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
          </button>

          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 flex items-center justify-center transition"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 text-center text-xs font-mono text-slate-600">
        © {new Date().getFullYear()} {data.profile.name}. All 3D shaders, systems, and content editable live without code.
      </div>
    </footer>
  );
};
