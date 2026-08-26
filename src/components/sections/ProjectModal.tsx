import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Play, 
  Calendar, 
  UserCheck 
} from 'lucide-react';
import { Project } from '../../types/portfolio';
import { soundFx } from '../../utils/audio';
import { GithubIcon } from '../common/SocialIcons';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const allMedia = [
    { type: project.mediaType, url: project.mediaUrl },
    ...(project.gallery || []).map(url => ({ type: 'image' as const, url }))
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#090e1a] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Hero Viewport */}
        <div className="relative w-full aspect-video bg-black max-h-[420px] overflow-hidden">
          {allMedia[activeMediaIndex]?.type === 'video' ? (
            <video
              src={allMedia[activeMediaIndex].url}
              controls
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={allMedia[activeMediaIndex]?.url || project.mediaUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Media Switcher Thumbnails */}
          {allMedia.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto p-2 bg-slate-950/70 backdrop-blur-md rounded-xl border border-slate-800">
              {allMedia.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveMediaIndex(idx);
                  }}
                  className={`relative w-16 h-10 rounded-lg overflow-hidden shrink-0 border transition ${
                    activeMediaIndex === idx
                      ? 'border-cyan-400 scale-105 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  {m.type === 'video' ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                      <Play className="w-4 h-4 text-cyan-400" />
                    </div>
                  ) : (
                    <img src={m.url} alt="thumbnail" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-semibold">
                {project.category}
              </span>
              {project.metrics && (
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-mono">
                  {project.metrics}
                </span>
              )}
              {project.completedDate && (
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.completedDate}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              {project.title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              {project.tagline}
            </p>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
              {project.description}
            </p>

            {project.client && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Client / Organization: <strong className="text-slate-200">{project.client}</strong></span>
              </div>
            )}

            {/* Tech Stack Pills */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono text-slate-400 uppercase">Core Stack & Libraries</div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <span>Live Interactive Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-400 text-xs font-semibold transition"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Source Code (GitHub)</span>
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
