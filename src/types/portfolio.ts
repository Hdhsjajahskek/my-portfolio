export type ProjectCategory = 'All' | 'Fullstack' | '3D & Creative' | 'AI & Agents' | 'Web3' | 'Mobile';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Fullstack' | '3D & Creative' | 'AI & Agents' | 'Web3' | 'Mobile';
  mediaType: 'image' | 'video';
  mediaUrl: string;
  videoEmbedUrl?: string;
  gallery?: string[];
  tags: string[];
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  client?: string;
  metrics?: string;
  completedDate?: string;
}

export type PriceType = 'fixed' | 'starting_at' | 'hourly' | 'monthly';

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  priceType: PriceType;
  badge?: string;
  features: string[];
  deliveryTime: string;
  icon: string;
  isPopular?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | '3D & Shader' | 'Cloud & DevOps' | 'AI & Tools';
  proficiency: number;
  icon: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  serviceInterest?: string;
  budget?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'in_review' | 'contacted' | 'archived';
}

export interface PortfolioProfile {
  name: string;
  title: string;
  badgeText: string;
  bio: string;
  secondaryBio: string;
  avatarUrl: string;
  location: string;
  availableForHire: boolean;
  yearsOfExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    email?: string;
    discord?: string;
  };
  resumeUrl?: string;
}

export type RoomTheme = 'cyber-neon' | 'matrix-green' | 'synthwave-sunset' | 'studio-minimal';

export interface ThemeSettings {
  roomTheme: RoomTheme;
  accentColor: string;
  secondaryColor: string;
  soundEnabled: boolean;
}

export interface SecuritySettings {
  authorizedEmails: string[];
  masterPin: string;
  hideAdminButton: boolean;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  projects: Project[];
  services: Service[];
  skills: Skill[];
  experience: Experience[];
  testimonials: Testimonial[];
  leads: ContactMessage[];
  theme: ThemeSettings;
  security: SecuritySettings;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
