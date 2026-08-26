import React, { useState } from 'react';
import { 
  Play, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowUpRight
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectCategory } from '../../types/portfolio';
import { soundFx } from '../../utils/audio';

export const ProjectsSection: React.FC = () => {
  const { data, setActiveProjectModal } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'image'>('all');

  const categories: ProjectCategory[] = ['All', 'AI & Agents', '3D & Creative', 'Web3', 'Fullstack', 'Mobile'];

  const filteredProjects = data.projects.filter(proj => {
    const matchesCategory = selectedCategory === 'All' || proj.category === selectedCategory;
    const matchesMedia = mediaFilter === 'all' || proj.mediaType === mediaFilter;
    return matchesCategory && matchesMedia;
  });

  return (
    <section id="projects" className="relative py-28 px-4 sm:px-6 lg:px-8 pointer-events-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Title & Tagline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered Artifacts & Works</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              Featured 3D, Web & AI Deployments.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Showcasing immersive 3D graphics, generative intelligence systems, and distributed web platforms with video previews and live interactions.
            </p>
          </div>

          {/* Media Format Toggle Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                setMediaFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                mediaFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Media
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setMediaFilter('video');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                mediaFilter === 'video' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Videos</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setMediaFilter('image');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                mediaFilter === 'image' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Images</span>
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                soundFx.playClick();
                setActiveProjectModal(project);
              }}
              className="glass-card group rounded-2xl overflow-hidden cursor-pointer flex flex-col border border-slate-800/90 hover:border-cyan-500/50 transition-all duration-300"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                {project.mediaType === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      src={project.mediaUrl}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                      onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-purple-500/90 text-white text-[11px] font-mono font-bold flex items-center gap-1 shadow-lg backdrop-blur-md">
                      <Play className="w-3 h-3 fill-current" />
                      <span>VIDEO DEMO</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={project.mediaUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-200 text-[11px] font-mono flex items-center gap-1 border border-slate-700 backdrop-blur-md">
                      <ImageIcon className="w-3 h-3 text-cyan-400" />
                      <span>GALLERY</span>
                    </div>
                  </div>
                )}

                {/* Metrics Overlay if available */}
                {project.metrics && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono backdrop-blur-md">
                    {project.metrics}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                      {project.category}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-cyan-300 transition">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  {project.tags.slice(0, 4).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
