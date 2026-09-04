import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
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
  SecuritySettings,
} from '../types/portfolio';
import { initialPortfolioData } from '../data/defaultData';
import { soundFx } from '../utils/audio';

// ─────────────────────────────────────────────────────────────────
// Firestore document paths
// portfolio/data        → main portfolio document (profile, projects, services, etc.)
// leads/{leadId}        → individual contact messages (subcollection for easy security rules)
// ─────────────────────────────────────────────────────────────────
const PORTFOLIO_DOC = 'portfolio/data';
const LEADS_COLLECTION = 'leads';

// Local cache key — used only for the initial paint before Firestore responds
const CACHE_KEY = 'aura_portfolio_cache_v2';

// ─── Helpers ─────────────────────────────────────────────────────
const readCache = (): PortfolioData | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...initialPortfolioData, ...parsed, security: parsed.security ?? initialPortfolioData.security };
  } catch {
    return null;
  }
};

const writeCache = (data: PortfolioData) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // quota — not critical
  }
};

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isSyncing: boolean;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeProjectModal: Project | null;
  setActiveProjectModal: (proj: Project | null) => void;
  // CMS Mutators
  updateProfile: (profile: Partial<PortfolioProfile>) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  updateSkill: (skill: Skill) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  addTestimonial: (test: Omit<Testimonial, 'id'>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  submitContactLead: (lead: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateLeadStatus: (id: string, status: ContactMessage['status']) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  setRoomTheme: (theme: RoomTheme) => Promise<void>;
  updateThemeSettings: (theme: Partial<ThemeSettings>) => Promise<void>;
  updateSecuritySettings: (security: Partial<SecuritySettings>) => Promise<void>;
  toggleSound: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportDataJSON: () => string;
  importDataJSON: (json: string) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialise from local cache for instant paint; Firestore will override within ~200ms
  const [data, setData] = useState<PortfolioData>(() => readCache() ?? initialPortfolioData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const dataRef = useRef(data); // kept up-to-date to avoid stale closures in mutators
  dataRef.current = data;

  // ─── 1. Subscribe to Firestore real-time updates ──────────────
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Running without Firebase env vars — keep initial/cached data and unblock loading
      setIsLoading(false);
      return;
    }

    const portfolioDocRef = doc(db, PORTFOLIO_DOC);
    let loaderTimer: ReturnType<typeof setTimeout>;

    const unsub: Unsubscribe = onSnapshot(
      portfolioDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remote = snapshot.data() as PortfolioData;
          const merged: PortfolioData = {
            ...initialPortfolioData,
            ...remote,
            security: remote.security ?? initialPortfolioData.security,
          };
          setData(merged);
          writeCache(merged);
        } else {
          // First ever launch — no data in Firestore yet. Seed it.
          setDoc(portfolioDocRef, initialPortfolioData).catch(console.error);
        }
        // Stop the loader as soon as we have a Firestore response
        clearTimeout(loaderTimer);
        setIsLoading(false);
      },
      (err) => {
        // Permission denied or offline — fall back to cache / default
        console.warn('[Firestore] onSnapshot error:', err.code, err.message);
        clearTimeout(loaderTimer);
        setIsLoading(false);
      }
    );

    // Safety fallback: if Firestore takes > 4s (e.g., offline), stop showing the loader
    loaderTimer = setTimeout(() => setIsLoading(false), 4000);

    return () => {
      unsub();
      clearTimeout(loaderTimer);
    };
  }, []);

  // ─── 2. Sync sound engine preference ────────────────────────
  useEffect(() => {
    soundFx.setEnabled(data.theme.soundEnabled);
  }, [data.theme.soundEnabled]);

  // ─── 3. Core write helper ─────────────────────────────────────
  // All admin mutations call this single function which writes to Firestore.
  // Firestore's onSnapshot will then push the update back to ALL connected clients.
  const saveToFirestore = useCallback(async (newData: PortfolioData) => {
    setIsSyncing(true);
    if (!isFirebaseConfigured) {
      setData(newData);
      writeCache(newData);
      setIsSyncing(false);
      return;
    }
    try {
      await setDoc(doc(db, PORTFOLIO_DOC), newData);
      // setData is intentionally NOT called here — the onSnapshot listener above
      // will receive the update from Firestore and call setData for us.
    } catch (err) {
      console.error('[Firestore] Write failed:', err);
      // Optimistic local update so the UI doesn't feel broken
      setData(newData);
      writeCache(newData);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // ─── 4. Mutators ─────────────────────────────────────────────

  const updateProfile = async (profileUpdate: Partial<PortfolioProfile>) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      profile: { ...dataRef.current.profile, ...profileUpdate },
    };
    await saveToFirestore(updated);
    soundFx.playSuccess();
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    const newProj: Project = { ...project, id: 'proj-' + Date.now() };
    const updated: PortfolioData = {
      ...dataRef.current,
      projects: [newProj, ...dataRef.current.projects],
    };
    await saveToFirestore(updated);
    soundFx.playSuccess();
  };

  const updateProject = async (project: Project) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      projects: dataRef.current.projects.map(p => p.id === project.id ? project : p),
    };
    await saveToFirestore(updated);
    soundFx.playSuccess();
  };

  const deleteProject = async (id: string) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      projects: dataRef.current.projects.filter(p => p.id !== id),
    };
    await saveToFirestore(updated);
    soundFx.playClick();
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    const newService: Service = { ...service, id: 'srv-' + Date.now() };
    const updated: PortfolioData = {
      ...dataRef.current,
      services: [...dataRef.current.services, newService],
    };
    await saveToFirestore(updated);
    soundFx.playSuccess();
  };

  const updateService = async (service: Service) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      services: dataRef.current.services.map(s => s.id === service.id ? service : s),
    };
    await saveToFirestore(updated);
    soundFx.playSuccess();
  };

  const deleteService = async (id: string) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      services: dataRef.current.services.filter(s => s.id !== id),
    };
    await saveToFirestore(updated);
    soundFx.playClick();
  };

  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = { ...skill, id: 'sk-' + Date.now() };
    const updated: PortfolioData = {
      ...dataRef.current,
      skills: [...dataRef.current.skills, newSkill],
    };
    await saveToFirestore(updated);
    soundFx.playSuccess();
  };

  const updateSkill = async (skill: Skill) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      skills: dataRef.current.skills.map(s => s.id === skill.id ? skill : s),
    };
    await saveToFirestore(updated);
    soundFx.playSuccess();
  };

  const deleteSkill = async (id: string) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      skills: dataRef.current.skills.filter(s => s.id !== id),
    };
    await saveToFirestore(updated);
    soundFx.playClick();
  };

  const addTestimonial = async (test: Omit<Testimonial, 'id'>) => {
    const newTest: Testimonial = { ...test, id: 'test-' + Date.now() };
    const updated: PortfolioData = {
      ...dataRef.current,
      testimonials: [...dataRef.current.testimonials, newTest],
    };
    await saveToFirestore(updated);
    soundFx.playSuccess();
  };

  const deleteTestimonial = async (id: string) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      testimonials: dataRef.current.testimonials.filter(t => t.id !== id),
    };
    await saveToFirestore(updated);
    soundFx.playClick();
  };

  // ─── Contact Leads — stored in separate Firestore collection ──
  // Visitors can add leads (Firestore rules: create only, no read/delete)
  // Admin can read and manage all leads
  const submitContactLead = async (
    leadData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
  ): Promise<boolean> => {
    if (!isFirebaseConfigured) {
      console.warn('[Contact] Firebase is not configured — message accepted in demo mode.');
      soundFx.playSuccess();
      return true;
    }
    try {
      await addDoc(collection(db, LEADS_COLLECTION), {
        ...leadData,
        createdAt: serverTimestamp(),
        status: 'new',
      });
      soundFx.playSuccess();
      return true;
    } catch (err) {
      console.error('[Firestore] Failed to submit lead:', err);
      return false;
    }
  };

  const updateLeadStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await updateDoc(doc(db, LEADS_COLLECTION, id), { status });
    } catch (err) {
      console.error('[Firestore] Failed to update lead status:', err);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, LEADS_COLLECTION, id));
      soundFx.playClick();
    } catch (err) {
      console.error('[Firestore] Failed to delete lead:', err);
    }
  };

  const setRoomTheme = async (roomTheme: RoomTheme) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      theme: { ...dataRef.current.theme, roomTheme },
    };
    await saveToFirestore(updated);
    soundFx.playWarp();
  };

  const updateThemeSettings = async (themeUpdate: Partial<ThemeSettings>) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      theme: { ...dataRef.current.theme, ...themeUpdate },
    };
    await saveToFirestore(updated);
    soundFx.playClick();
  };

  const updateSecuritySettings = async (secUpdate: Partial<SecuritySettings>) => {
    const updated: PortfolioData = {
      ...dataRef.current,
      security: {
        hideAdminButton: secUpdate.hideAdminButton ?? dataRef.current.security?.hideAdminButton ?? false,
      },
    };
    await saveToFirestore(updated);
    soundFx.playSuccess();
  };

  const toggleSound = async () => {
    const newEnabled = !dataRef.current.theme.soundEnabled;
    const updated: PortfolioData = {
      ...dataRef.current,
      theme: { ...dataRef.current.theme, soundEnabled: newEnabled },
    };
    await saveToFirestore(updated);
    if (newEnabled) {
      soundFx.setEnabled(true);
      soundFx.playClick();
    }
  };

  const resetToDefaults = async () => {
    await saveToFirestore(initialPortfolioData);
    soundFx.playSuccess();
  };

  const exportDataJSON = () => JSON.stringify(dataRef.current, null, 2);

  const importDataJSON = async (json: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.profile && parsed.projects && parsed.services) {
        await saveToFirestore(parsed);
        soundFx.playSuccess();
        return true;
      }
    } catch {
      // invalid json
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSyncing,
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
        importDataJSON,
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
