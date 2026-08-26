import React, { useEffect, useState } from 'react';
import { Sparkles, Terminal, Cpu } from 'lucide-react';

export const Loader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('BOOTING_NEURAL_KERNEL...');

  useEffect(() => {
    const statuses = [
      'BOOTING_NEURAL_KERNEL...',
      'ALLOCATING_VIRTUAL_VRAM...',
      'COMPILING_GLSL_SHADERS...',
      'CONNECTING_REALTIME_SYNC_MESH...',
      'INITIALIZING_3D_WORKSTATION...',
      'SYSTEM_ONLINE_100%'
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const bounded = Math.min(next, 100);
        
        const statusIdx = Math.min(
          Math.floor((bounded / 100) * statuses.length),
          statuses.length - 1
        );
        setStatusText(statuses[statusIdx]);
        
        return bounded;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05060b] text-slate-100 select-none">
      {/* Background Cyber Glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Animated Cyber Core Icon */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl border border-cyan-500/40 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-neon-pulse">
            <Cpu className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="absolute -inset-2 rounded-2xl border border-cyan-500/20 animate-ping pointer-events-none" />
        </div>

        {/* Brand Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-cyan-400">System Boot // v4.8</span>
          </div>
          <h1 className="text-3xl font-bold tracking-wider font-heading bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
            AURA PORTFOLIO
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900/90 rounded-full p-1 border border-slate-800 backdrop-blur-md shadow-inner mb-3">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500 transition-all duration-75 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Telemetry Status text */}
        <div className="flex items-center justify-between w-full font-mono text-xs text-slate-400 px-1">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>{statusText}</span>
          </div>
          <span className="font-bold text-slate-200">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
