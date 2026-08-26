import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  ExternalLink,
  Sliders,
  LogOut,
  Palette
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { soundFx } from '../../utils/audio';

export const Navbar: React.FC = () => {
  const { data, toggleSound, setRoomTheme } = usePortfolio();
  const { user, isAuthenticated, setIsAdminModalOpen, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '#hero' },
    { name: 'About & Skills', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Services & Pricing', href: '#services' },
    { name: 'Contact', href: '#contact' }
  ];

  const themes = [
    { id: 'cyber-neon', label: 'Cyber Neon', color: 'bg-cyan-500' },
    { id: 'matrix-green', label: 'Matrix Green', color: 'bg-emerald-500' },
    { id: 'synthwave-sunset', label: 'Synthwave', color: 'bg-rose-500' },
    { id: 'studio-minimal', label: 'Minimal Studio', color: 'bg-sky-400' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#hero" 
          onClick={() => soundFx.playClick()} 
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition transform">
            <div className="w-full h-full bg-[#070a14] rounded-xl flex items-center justify-center font-heading font-black text-cyan-400 text-lg">
              A
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#070a14] animate-pulse" />
          </div>
          <div>
            <div className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
              <span>{data.profile.name}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PRO 3D
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
              {data.profile.availableForHire ? '🟢 AVAILABLE FOR HIRE' : '🔴 BUSY ON CONTRACT'}
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800/80 shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="text-xs font-medium text-slate-300 hover:text-cyan-400 px-3.5 py-1.5 rounded-full hover:bg-slate-800/60 transition"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls & Admin Button */}
        <div className="flex items-center gap-2.5">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={data.theme.soundEnabled ? 'Mute Sound FX' : 'Enable Futuristic Sound FX'}
            className="w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition"
          >
            {data.theme.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Theme Palette Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playClick();
                setThemeDropdownOpen(!themeDropdownOpen);
              }}
              title="3D Room Lighting Theme"
              className="w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition"
            >
              <Palette className="w-4 h-4" />
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-150">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  3D Lighting Mood
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setRoomTheme(t.id as any);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition ${
                      data.theme.roomTheme === t.id ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                      <span>{t.label}</span>
                    </div>
                    {data.theme.roomTheme === t.id && <Sparkles className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Studio Button (with Google Auth Indicator & Stealth Support) */}
          {(!data.security?.hideAdminButton || isAuthenticated) && (
            <button
              onClick={() => {
                soundFx.playClick();
                setIsAdminModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/30 transition text-xs font-mono font-medium shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              {isAuthenticated ? (
                <>
                  <Sliders className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="hidden sm:inline">Owner Studio</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Owner Login</span>
                </>
              )}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-cyan-500/20 px-6 py-4 space-y-3 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-medium text-slate-300 hover:text-cyan-400 py-1.5"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">Real-Time CMS Engine</span>
            <button
              onClick={() => {
                setIsAdminModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-cyan-400 font-mono underline"
            >
              Open Studio
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
