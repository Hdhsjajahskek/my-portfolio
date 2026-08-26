import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  Layers, 
  Cpu, 
  Download, 
  ExternalLink,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundFx } from '../../utils/audio';

export const HeroSection: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pointer-events-auto">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-8 space-y-6 text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-medium text-cyan-300 tracking-wide uppercase">
              {data.profile.badgeText}
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight font-heading leading-[1.08] text-white">
              Architecting <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                Next-Gen 3D
              </span> & AI Experiences.
            </h1>
            <p className="text-lg sm:text-xl font-medium text-slate-300 font-heading">
              {data.profile.title}
            </p>
          </div>

          {/* Bio Description */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            {data.profile.bio}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              onClick={() => soundFx.playWarp()}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] hover:scale-[1.02] active:scale-[0.98] transition transform"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#services"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 font-semibold text-sm backdrop-blur-xl transition"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Services & Calculator</span>
            </a>

            <a
              href="#contact"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/40 text-slate-400 hover:text-white border border-transparent hover:border-slate-700 font-mono text-xs transition"
            >
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Direct Terminal</span>
            </a>
          </div>

          {/* Key Metrics / Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 max-w-2xl">
            <div className="bg-slate-900/40 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                {data.profile.yearsOfExperience}+
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mt-0.5">Years Experience</div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-cyan-400">
                {data.profile.projectsCompleted}+
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mt-0.5">Shipped Products</div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-purple-400">
                {data.profile.clientSatisfaction}%
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mt-0.5">Satisfaction Rate</div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-400 flex items-center gap-1">
                <span>60</span>
                <span className="text-xs font-mono text-emerald-400">FPS</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mt-0.5">3D WebGL Smooth</div>
            </div>
          </div>
        </div>

        {/* Right Floating Hologram Card / HUD Panel */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className="glass-panel-glow p-6 rounded-2xl space-y-5 border border-cyan-500/30 animate-float shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-cyan-500/40">
                  <img 
                    src={data.profile.avatarUrl} 
                    alt={data.profile.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm font-heading">{data.profile.name}</h3>
                  <p className="text-[11px] font-mono text-slate-400">{data.profile.location}</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                LIVE
              </span>
            </div>

            {/* Live Telemetry Chips */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 p-2 rounded-lg bg-slate-900/60">
                <span className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Primary Engine
                </span>
                <span className="text-slate-200">Three.js / React 19</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 p-2 rounded-lg bg-slate-900/60">
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Live CMS Sync
                </span>
                <span className="text-emerald-400 font-bold">Broadcast Realtime</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 p-2 rounded-lg bg-slate-900/60">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Active Mood
                </span>
                <span className="text-cyan-300 capitalize">{data.theme.roomTheme.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Interactive Scroll Hint */}
            <div className="pt-2 border-t border-slate-800 text-center">
              <p className="text-[11px] font-mono text-cyan-400 flex items-center justify-center gap-1.5">
                <span>↓ Scroll down to control 3D Camera</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
