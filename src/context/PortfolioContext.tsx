import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  PortfolioData, 
  Project, 
  Service, 
  Skill, 
  Testimonial, 
  ContactMessage, 
  PortfolioProfile, 
  ThemeSettings, 
  RoomTheme,
  SecuritySettings
} from '../types/portfolio';
import { initialPortfolioData } from '../data/defaultData';
import { soundFx } from '../utils/audio';

const STORAGE_KEY = 'aura_portfolio_data_v1';
const SYNC_CHANNEL_NAME = 'aura_portfolio_sync_channel';

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeProjectModal: Project | null;
  setActiveProjectModal: (proj: Project | null) => void;
  // CMS Mutators
  updateProfile: (profile: Partial<PortfolioProfile>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  addTestimonial: (test: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  submitContactLead: (lead: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateLeadStatus: (id: string, status: ContactMessage['status']) => void;
  deleteLead: (id: string) => void;
  setRoomTheme: (theme: RoomTheme) => void;
  updateThemeSettings: (theme: Partial<ThemeSettings>) => void;
  updateSecuritySettings: (security: Partial<SecuritySettings>) => void;
  toggleSound: () => void;
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (json: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialPortfolioData,
          ...parsed,
          security: parsed.security || initialPortfolioData.security
        };
      }
    } catch {
      // fallback
    }
    return initialPortfolioData;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  // Broadcast channel for instantaneous cross-tab live synchronization
  const broadcastSync = useCallback((newData: PortfolioData) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.postMessage({ type: 'PORTFOLIO_UPDATE', payload: newData });
        channel.close();
      }
    } catch {
      // Ignore broadcast errors
    }
  }, []);

  // Save to localStorage & broadcast whenever data changes
  const persistAndBroadcast = useCallback((newData: PortfolioData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      // quota handling
    }
    broadcastSync(newData);
  }, [broadcastSync]);

  // Listen to external changes from other tabs / windows
  useEffect(() => {
    let channel: BroadcastChannel | null = null;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'PORTFOLIO_UPDATE' && event.data.payload) {
          setData(event.data.payload);
        }
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    // Initial loader timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timer);
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Sync sound engine preference
  useEffect(() => {
    soundFx.setEnabled(data.theme.soundEnabled);
  }, [data.theme.soundEnabled]);

  // --- Mutators ---

  const updateProfile = (profileUpdate: Partial<PortfolioProfile>) => {
    const updated: PortfolioData = {
      ...data,
      profile: { ...data.profile, ...profileUpdate }
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...project,
      id: 'proj-' + Date.now()
    };
    const updated: PortfolioData = {
      ...data,
      projects: [newProj, ...data.projects]
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
  };

  const updateProject = (project: Project) => {
    const updated: PortfolioData = {
      ...data,
      projects: data.projects.map(p => p.id === project.id ? project : p)
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
  };

  const deleteProject = (id: string) => {
    const updated: PortfolioData = {
      ...data,
      projects: data.projects.filter(p => p.id !== id)
    };
    persistAndBroadcast(updated);
    soundFx.playClick();
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: 'srv-' + Date.now()
    };
    const updated: PortfolioData = {
      ...data,
      services: [...data.services, newService]
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
  };

  const updateService = (service: Service) => {
    const updated: PortfolioData = {
      ...data,
      services: data.services.map(s => s.id === service.id ? service : s)
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
  };

  const deleteService = (id: string) => {
    const updated: PortfolioData = {
      ...data,
      services: data.services.filter(s => s.id !== id)
    };
    persistAndBroadcast(updated);
    soundFx.playClick();
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: 'sk-' + Date.now()
    };
    const updated: PortfolioData = {
      ...data,
      skills: [...data.skills, newSkill]
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
  };

  const updateSkill = (skill: Skill) => {
    const updated: PortfolioData = {
      ...data,
      skills: data.skills.map(s => s.id === skill.id ? skill : s)
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
  };

  const deleteSkill = (id: string) => {
    const updated: PortfolioData = {
      ...data,
      skills: data.skills.filter(s => s.id !== id)
    };
    persistAndBroadcast(updated);
    soundFx.playClick();
  };

  const addTestimonial = (test: Omit<Testimonial, 'id'>) => {
    const newTest: Testimonial = {
      ...test,
      id: 'test-' + Date.now()
    };
    const updated: PortfolioData = {
      ...data,
      testimonials: [...data.testimonials, newTest]
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
  };

  const deleteTestimonial = (id: string) => {
    const updated: PortfolioData = {
      ...data,
      testimonials: data.testimonials.filter(t => t.id !== id)
    };
    persistAndBroadcast(updated);
    soundFx.playClick();
  };

  const submitContactLead = async (leadData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    const newLead: ContactMessage = {
      ...leadData,
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    const updated: PortfolioData = {
      ...data,
      leads: [newLead, ...(data.leads || [])]
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
    return true;
  };

  const updateLeadStatus = (id: string, status: ContactMessage['status']) => {
    const updated: PortfolioData = {
      ...data,
      leads: (data.leads || []).map(l => l.id === id ? { ...l, status } : l)
    };
    persistAndBroadcast(updated);
  };

  const deleteLead = (id: string) => {
    const updated: PortfolioData = {
      ...data,
      leads: (data.leads || []).filter(l => l.id !== id)
    };
    persistAndBroadcast(updated);
    soundFx.playClick();
  };

  const setRoomTheme = (roomTheme: RoomTheme) => {
    const updated: PortfolioData = {
      ...data,
      theme: { ...data.theme, roomTheme }
    };
    persistAndBroadcast(updated);
    soundFx.playWarp();
  };

  const updateThemeSettings = (themeUpdate: Partial<ThemeSettings>) => {
    const updated: PortfolioData = {
      ...data,
      theme: { ...data.theme, ...themeUpdate }
    };
    persistAndBroadcast(updated);
    soundFx.playClick();
  };

  const updateSecuritySettings = (secUpdate: Partial<SecuritySettings>) => {
    const updated: PortfolioData = {
      ...data,
      security: {
        // Only persist non-sensitive setting (hideAdminButton).
        // Email and PIN are env vars — never stored here.
        hideAdminButton: secUpdate.hideAdminButton ?? data.security?.hideAdminButton ?? false
      }
    };
    persistAndBroadcast(updated);
    soundFx.playSuccess();
  };

  const toggleSound = () => {
    const newEnabled = !data.theme.soundEnabled;
    updateThemeSettings({ soundEnabled: newEnabled });
    if (newEnabled) {
      soundFx.setEnabled(true);
      soundFx.playClick();
    }
  };

  const resetToDefaults = () => {
    persistAndBroadcast(initialPortfolioData);
    soundFx.playSuccess();
  };

  const exportDataJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.profile && parsed.projects && parsed.services) {
        persistAndBroadcast(parsed);
        soundFx.playSuccess();
        return true;
      }
    } catch {
      // error
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        activeCategory,
        setActiveCategory,
        activeProjectModal,
        setActiveProjectModal,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        addService,
        updateService,
        deleteService,
        addSkill,
        updateSkill,
        deleteSkill,
        addTestimonial,
        deleteTestimonial,
        submitContactLead,
        updateLeadStatus,
        deleteLead,
        setRoomTheme,
        updateThemeSettings,
        updateSecuritySettings,
        toggleSound,
        resetToDefaults,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
