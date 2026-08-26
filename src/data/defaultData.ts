import { PortfolioData } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: "Alex Thorne",
    title: "Lead 3D Creative Engineer & Full-Stack Architect",
    badgeText: "✦ AVAILABLE FOR Q2/Q3 PROJECTS & CONTRACTS",
    bio: "Pioneering the intersection of immersive WebGL 3D graphics, generative AI agents, and high-performance cloud architectures. Crafting digital products that leave permanent impressions.",
    secondaryBio: "With 7+ years of experience engineering high-scale distributed systems and cinematic 3D web experiences, I help venture-backed startups and Fortune 500 brands translate ambitious visions into hyper-engaging digital realities.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    location: "San Francisco, CA (Open to Global Remote)",
    availableForHire: true,
    yearsOfExperience: 7,
    projectsCompleted: 48,
    clientSatisfaction: 99.4,
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      youtube: "https://youtube.com",
      email: "alex.thorne.dev@gmail.com",
      discord: "https://discord.com"
    },
    resumeUrl: "#resume"
  },
  theme: {
    roomTheme: 'cyber-neon',
    accentColor: '#06b6d4',
    secondaryColor: '#8b5cf6',
    soundEnabled: true
  },
  projects: [
    {
      id: 'proj-1',
      title: 'NeuroSphere // Autonomous AI Agent Mesh',
      tagline: 'Multi-agent orchestration platform with real-time neural 3D graph visualization',
      description: 'Engineered an enterprise-grade AI execution canvas featuring 3D real-time node choreography in WebGL, sub-millisecond streaming token responses, and end-to-end vector memory indexing.',
      category: 'AI & Agents',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-and-data-31913-large.mp4',
      videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      gallery: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80'
      ],
      tags: ['Three.js', 'React', 'Python', 'FastAPI', 'WebSockets', 'TailwindCSS'],
      featured: true,
      liveUrl: 'https://example.com/neurosphere',
      githubUrl: 'https://github.com/example/neurosphere',
      client: 'Vanguard AI Labs',
      metrics: '3.4M tokens/day throughput',
      completedDate: 'Feb 2026'
    },
    {
      id: 'proj-2',
      title: 'CyberVoxel // Spatial Web Metaverse',
      tagline: 'Procedural 3D virtual showroom with multiplayer spatial audio and physics',
      description: 'An in-browser spatial computing environment allowing virtual product launches, interactive physics simulations, and customizable avatar kinematics with zero downloads.',
      category: '3D & Creative',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-camera-flying-through-a-futuristic-abstract-tunnel-32986-large.mp4',
      gallery: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80'
      ],
      tags: ['WebGL', 'GLSL Shaders', 'Three.js', 'WebAudio API', 'Node.js'],
      featured: true,
      liveUrl: 'https://example.com/cybervoxel',
      githubUrl: 'https://github.com/example/cybervoxel',
      client: 'Apex Metaverse Inc',
      metrics: '60 FPS on 94% mobile devices',
      completedDate: 'Dec 2025'
    },
    {
      id: 'proj-3',
      title: 'Solstice DEX // Quantum Liquidity Protocol',
      tagline: 'High-frequency algorithmic trading terminal with glassmorphic depth UI',
      description: 'Decentralized exchange aggregator with real-time order-book depth charts, automated smart-contract rebalancing, and gasless atomic swaps.',
      category: 'Web3',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80'
      ],
      tags: ['Solidity', 'TypeScript', 'Ethers.js', 'Next.js', 'TailwindCSS'],
      featured: true,
      liveUrl: 'https://example.com/solstice',
      githubUrl: 'https://github.com/example/solstice-dex',
      client: 'Solstice Capital',
      metrics: '$180M+ total volume processed',
      completedDate: 'Nov 2025'
    },
    {
      id: 'proj-4',
      title: 'OmniStream // Global Real-Time Telemetry',
      tagline: 'IoT edge-to-cloud analytics engine with sub-10ms event processing',
      description: 'Distributed microservice pipeline monitoring 200,000+ edge industrial sensors with anomaly detection algorithms and interactive geospatial heatmaps.',
      category: 'Fullstack',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      tags: ['Go', 'Rust', 'Kafka', 'React', 'Docker', 'Kubernetes'],
      featured: false,
      liveUrl: 'https://example.com/omnistream',
      githubUrl: 'https://github.com/example/omnistream',
      client: 'Kinetics Global',
      metrics: '99.999% SLA Uptime',
      completedDate: 'Sep 2025'
    },
    {
      id: 'proj-5',
      title: 'PulseFit Pro // Haptic Bio-Tracking App',
      tagline: 'Cross-platform health optimization app with predictive AI coaching',
      description: 'Real-time biomechanics tracking and posture telemetry utilizing on-device machine learning vision models and dynamic sound feedback.',
      category: 'Mobile',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1510519138195-068d82f8d48d?auto=format&fit=crop&w=1200&q=80',
      tags: ['React Native', 'Swift', 'TensorFlow Lite', 'Node.js', 'GraphQL'],
      featured: false,
      liveUrl: 'https://example.com/pulsefit',
      githubUrl: 'https://github.com/example/pulsefit',
      client: 'Aura Health Tech',
      metrics: '45,000+ Active Subscribers',
      completedDate: 'Jul 2025'
    }
  ],
  services: [
    {
      id: 'srv-1',
      title: 'Interactive 3D Web & Immersive Experience',
      subtitle: 'WebGL, Three.js, GLSL Shaders & Interactive 3D Product Showrooms',
      description: 'Transform your brand into a jaw-dropping interactive 3D universe. Custom 3D character setups, spatial navigation, procedural shaders, and 60fps buttery smooth performance across all devices.',
      price: 2400,
      priceType: 'starting_at',
      badge: 'Most Popular',
      isPopular: true,
      features: [
        'Custom WebGL / Three.js 3D Interactive Scene',
        'Scroll-Driven Camera Choreography & Physics',
        'Mobile & GPU Optimized (60 FPS Performance)',
        'Custom GLSL Particle & Lighting Shaders',
        'Interactive 3D Product & Spatial Showroom',
        'Audio-reactive & Micro-Interaction FX'
      ],
      deliveryTime: '2 - 3 Weeks',
      icon: 'Sparkles'
    },
    {
      id: 'srv-2',
      title: 'Full-Stack Web App & SaaS Architecture',
      subtitle: 'End-to-end web apps with real-time sync, auth & scalable cloud backend',
      description: 'Complete production-ready web application development with responsive frontend, bulletproof databases, automated CI/CD pipelines, and multi-tenant security.',
      price: 3200,
      priceType: 'starting_at',
      badge: 'High Value',
      isPopular: false,
      features: [
        'Modern React / Next.js / TypeScript Stack',
        'Real-Time WebSockets / Live Database Sync',
        'Google OAuth, Magic Links & Role-Based Auth',
        'Stripe / Crypto Payment Gateway Integration',
        'Admin Dashboard & Content Management',
        'Comprehensive API & Database Architecture'
      ],
      deliveryTime: '3 - 4 Weeks',
      icon: 'Layers'
    },
    {
      id: 'srv-3',
      title: 'AI Agents & Intelligent System Integration',
      subtitle: 'Autonomous workflows, RAG Knowledge Graph & LLM fine-tuning',
      description: 'Supercharge your digital operations with autonomous agent pipelines, vector search memory indexing, and intelligent real-time conversational interfaces.',
      price: 3800,
      priceType: 'starting_at',
      badge: 'Trending',
      isPopular: false,
      features: [
        'Custom AI Agent Tooling & Function Calling',
        'Vector Embeddings & Semantic Search (Pinecone/Chroma)',
        'Multi-Modal LLM Pipelines (Vision, Voice, Code)',
        'Enterprise Security & Guardrails',
        'Real-time Token Streaming & Fallbacks',
        'Automated Workflow & CRM Integrations'
      ],
      deliveryTime: '2 - 4 Weeks',
      icon: 'Cpu'
    },
    {
      id: 'srv-4',
      title: 'Architecture Audit & Performance Engineering',
      subtitle: 'Performance tuning, Core Web Vitals & security hardening',
      description: 'Detailed diagnostic code audit, WebGL optimization, backend latency reduction, and architectural refactoring for high-traffic products.',
      price: 150,
      priceType: 'hourly',
      badge: 'Advisory',
      isPopular: false,
      features: [
        'Deep WebGL & CPU/GPU Bottleneck Profiling',
        'Database Query & Indexing Optimization',
        'Lighthouse 100/100 Core Web Vitals Tuning',
        'Security Penetration & Vulnerability Review',
        'Direct 1-on-1 Video Consulting Sessions',
        'Actionable 20+ Page Engineering Report'
      ],
      deliveryTime: 'Flexible / Hourly',
      icon: 'Activity'
    }
  ],
  skills: [
    { id: 'sk-1', name: 'Three.js / WebGL / GLSL', category: '3D & Shader', proficiency: 98, icon: 'Box' },
    { id: 'sk-2', name: 'React / Next.js / TypeScript', category: 'Frontend', proficiency: 99, icon: 'Code' },
    { id: 'sk-3', name: 'Node.js / Python / FastAPI', category: 'Backend', proficiency: 95, icon: 'Server' },
    { id: 'sk-4', name: 'Tailwind CSS / Framer Motion', category: 'Frontend', proficiency: 97, icon: 'Palette' },
    { id: 'sk-5', name: 'AI Agents / LangChain / RAG', category: 'AI & Tools', proficiency: 92, icon: 'Cpu' },
    { id: 'sk-6', name: 'PostgreSQL / Redis / Vector DB', category: 'Backend', proficiency: 93, icon: 'Database' },
    { id: 'sk-7', name: 'Docker / AWS / Cloudflare', category: 'Cloud & DevOps', proficiency: 90, icon: 'Cloud' },
    { id: 'sk-8', name: 'Solidity / Smart Contracts', category: 'Backend', proficiency: 86, icon: 'Shield' }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Principal 3D & Creative Systems Architect',
      company: 'Aetheria Interactive',
      period: '2023 - Present',
      description: 'Lead engineering team building next-generation browser-based 3D metaverse tools, WebGL shader pipelines, and real-time multiplayer spatial streaming architectures.',
      highlights: [
        'Pioneered proprietary WebGL asset compressor decreasing initial load time by 64%',
        'Scaled multiplayer concurrency to 50,000+ simultaneous connected room sessions',
        'Mentored 12 frontend and graphics engineers across global engineering hubs'
      ]
    },
    {
      id: 'exp-2',
      role: 'Senior Full-Stack & Graphics Engineer',
      company: 'Quantum Dynamics Labs',
      period: '2021 - 2023',
      description: 'Architected real-time AI telemetry dashboards, interactive 3D particle data graphs, and secure multi-tenant microservices.',
      highlights: [
        'Built dynamic shader visualizers processing 100k data points in real time',
        'Engineered Google OAuth & RBAC authentication infrastructure across 8 microservices',
        'Reduced cloud computing overhead by $120,000 annually via edge caching'
      ]
    },
    {
      id: 'exp-3',
      role: 'Frontend & Interactive Web Developer',
      company: 'HyperNova Studio',
      period: '2019 - 2021',
      description: 'Developed award-winning experiential websites, e-commerce 3D product visualizers, and interactive GSAP animations for global brands.',
      highlights: [
        'Won 4 Awwwards Site of the Day and FWA of the Day honors',
        'Delivered 30+ client web applications on time with 100% client satisfaction score'
      ]
    }
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Marcus Vance',
      role: 'Founder & CEO',
      company: 'NeuroSphere Technologies',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      content: 'Alex is in a league of his own. The 3D interactive portal he architected for our AI platform blew our investors away and doubled our user engagement within the first 48 hours.',
      rating: 5
    },
    {
      id: 'test-2',
      name: 'Elena Rostova',
      role: 'Head of Product',
      company: 'Solstice Capital',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      content: 'Extraordinary technical execution and aesthetic mastery. Alex delivered a flawless, real-time trading interface ahead of schedule. Truly the best engineer we have worked with.',
      rating: 5
    },
    {
      id: 'test-3',
      name: 'David Chen',
      role: 'VP of Engineering',
      company: 'Apex Spatial Labs',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      content: 'The 3D WebGL performance Alex achieved on mobile devices seemed mathematically impossible. Clean codebase, prompt communication, and unmatched attention to detail.',
      rating: 5
    }
  ],
  leads: [
    {
      id: 'lead-1',
      name: 'Sarah Jenkins',
      email: 'sarah@venturecapital.co',
      serviceInterest: 'Interactive 3D Web & Immersive Experience',
      budget: '$5,000 - $10,000',
      message: 'Looking to build an interactive 3D hero showcase for our new fintech platform launch next month. Would love to schedule a demo call!',
      createdAt: '2026-08-25T10:14:00.000Z',
      status: 'new'
    }
  ],
  security: {
    authorizedEmails: ['admin.creator@gmail.com'],
    masterPin: '8844',
    hideAdminButton: false
  }
};
