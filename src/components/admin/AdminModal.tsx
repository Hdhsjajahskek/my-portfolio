import React, { useState, useEffect } from 'react';
import { 
  X, 
  LayoutDashboard, 
  User, 
  FolderKanban, 
  DollarSign, 
  Cpu, 
  Inbox, 
  Palette, 
  LogOut, 
  ShieldCheck,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundFx } from '../../utils/audio';
import { AdminLogin } from './AdminLogin';
import { ProfileEditor } from './ProfileEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { ServicesEditor } from './ServicesEditor';
import { SkillsEditor } from './SkillsEditor';
import { LeadsInbox } from './LeadsInbox';
import { ThemeSettingsEditor } from './ThemeSettingsEditor';
import { SecuritySettingsEditor } from './SecuritySettingsEditor';

export const AdminModal: React.FC = () => {
  const { user, isAuthenticated, logout, isAdminModalOpen, setIsAdminModalOpen } = useAuth();
  const { data } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'projects' | 'services' | 'skills' | 'leads' | 'theme' | 'security'
  >('projects');

  // Listen for Ctrl+Shift+A global shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        soundFx.playClick();
        setIsAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminModalOpen]);

  if (!isAdminModalOpen) return null;

  const newLeadsCount = (data.leads || []).filter(l => l.status === 'new').length;

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Bio', icon: User },
    { id: 'projects', label: 'Projects (Video & Images)', icon: FolderKanban, badge: `${data.projects.length}` },
    { id: 'services', label: 'Services & Pricing', icon: DollarSign, badge: `${data.services.length}` },
    { id: 'skills', label: 'Skills & Stack', icon: Cpu },
    { id: 'leads', label: 'Client Inquiries', icon: Inbox, badge: newLeadsCount > 0 ? `${newLeadsCount} NEW` : undefined, badgeColor: 'bg-emerald-500 text-slate-950 font-bold' },
    { id: 'theme', label: '3D Scene & Theme', icon: Palette },
    { id: 'security', label: 'Owner Security', icon: Lock }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#070b16] border border-cyan-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        
        {/* Top Navigation Bar */}
        <div className="h-16 px-6 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm font-heading flex items-center gap-2">
                <span>AURA STUDIO // OWNER CMS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REAL-TIME SYNC
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <img src={user.photoURL || data.profile.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs font-mono text-slate-300">{user.email}</span>
                <button
                  onClick={logout}
                  className="ml-2 text-slate-400 hover:text-rose-400"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                setIsAdminModalOpen(false);
              }}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <AdminLogin />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/40 p-4 space-y-1 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab(tab.id as any);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition shrink-0 ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{tab.label}</span>
                    </div>

                    {tab.badge && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${tab.badgeColor || 'bg-slate-800 text-slate-400'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Editor Viewport */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              
              {/* Dashboard Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-bold font-heading text-white">Platform Health & Quick Telemetry</h3>
                    <p className="text-xs text-slate-400">Live analytics and instantaneous synchronization status.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="text-xs font-mono text-slate-400 uppercase">Live Projects</div>
                      <div className="text-3xl font-extrabold font-heading text-cyan-400">{data.projects.length}</div>
                      <p className="text-[11px] text-slate-500 font-mono">Videos & interactive showrooms</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="text-xs font-mono text-slate-400 uppercase">Service Tiers</div>
                      <div className="text-3xl font-extrabold font-heading text-purple-400">{data.services.length}</div>
                      <p className="text-[11px] text-slate-500 font-mono">Pricing packages configured</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="text-xs font-mono text-slate-400 uppercase">Incoming Inquiries</div>
                      <div className="text-3xl font-extrabold font-heading text-emerald-400">{(data.leads || []).length}</div>
                      <p className="text-[11px] text-slate-500 font-mono">{newLeadsCount} unread transmissions</p>
                    </div>
                  </div>

                  {/* Sync status card */}
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-emerald-300">Owner-Locked Real-Time Sync Active</h4>
                      <p className="text-xs text-emerald-400/80 leading-relaxed">
                        Whenever you edit a project, price, or bio in this studio, changes are instantly transmitted across all open browser tabs and visitors without requiring page refreshes or code builds.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && <ProfileEditor />}
              {activeTab === 'projects' && <ProjectsEditor />}
              {activeTab === 'services' && <ServicesEditor />}
              {activeTab === 'skills' && <SkillsEditor />}
              {activeTab === 'leads' && <LeadsInbox />}
              {activeTab === 'theme' && <ThemeSettingsEditor />}
              {activeTab === 'security' && <SecuritySettingsEditor />}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
