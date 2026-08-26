import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import { DeveloperScene } from './components/3d/DeveloperScene';
import { Loader } from './components/common/Loader';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { ContactSection } from './components/sections/ContactSection';
import { ProjectModal } from './components/sections/ProjectModal';
import { AdminModal } from './components/admin/AdminModal';

const PortfolioApp: React.FC = () => {
  const { isLoading, activeProjectModal, setActiveProjectModal } = usePortfolio();

  return (
    <div className="relative min-h-screen bg-[#05060b] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Cyber Loader */}
      {isLoading && <Loader />}

      {/* 2. Interactive 3D Developer Workstation Canvas & Scroll Choreography */}
      <DeveloperScene />

      {/* 3. Header & Navigation */}
      <Navbar />

      {/* 4. Main Portfolio Storyline Sections */}
      <main className="relative z-10 space-y-12">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Modals */}
      {activeProjectModal && (
        <ProjectModal
          project={activeProjectModal}
          onClose={() => setActiveProjectModal(null)}
        />
      )}

      {/* 7. No-Code Live Admin Studio & Google Auth */}
      <AdminModal />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <AuthProvider>
        <PortfolioApp />
      </AuthProvider>
    </PortfolioProvider>
  );
}
