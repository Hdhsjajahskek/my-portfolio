import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Video, 
  Image as ImageIcon, 
  ExternalLink, 
  Save, 
  X, 
  Check,
  Play
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/portfolio';
import { soundFx } from '../../utils/audio';

export const ProjectsEditor: React.FC = () => {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  const handleStartCreate = () => {
    soundFx.playClick();
    const blank: Project = {
      id: '',
      title: '',
      tagline: '',
      description: '',
      category: '3D & Creative',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-and-data-31913-large.mp4',
      videoEmbedUrl: '',
      gallery: [],
      tags: ['Three.js', 'React', 'TypeScript'],
      featured: true,
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      client: 'Stealth Startup',
      metrics: '100% 60 FPS',
      completedDate: 'Mar 2026'
    };
    setEditingProject(blank);
    setTagsInput(blank.tags.join(', '));
    setGalleryInput('');
    setIsCreatingNew(true);
  };

  const handleStartEdit = (proj: Project) => {
    soundFx.playClick();
    setEditingProject({ ...proj });
    setTagsInput(proj.tags.join(', '));
    setGalleryInput((proj.gallery || []).join('\n'));
    setIsCreatingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    const parsedTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const parsedGallery = galleryInput.split('\n').map(g => g.trim()).filter(Boolean);

    const projectToSave: Project = {
      ...editingProject,
      tags: parsedTags.length > 0 ? parsedTags : ['React'],
      gallery: parsedGallery
    };

    if (isCreatingNew) {
      addProject(projectToSave);
    } else {
      updateProject(projectToSave);
    }

    setEditingProject(null);
    setIsCreatingNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-white">Project Showcase CMS</h3>
          <p className="text-xs text-slate-400">Add and manage interactive 3D, Video, and Image projects live.</p>
        </div>
        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Edit / Create Form Modal */}
      {editingProject && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-5 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold font-heading text-cyan-400">
              {isCreatingNew ? 'Create New Showcase Project' : `Editing: ${editingProject.title}`}
            </h4>
            <button
              onClick={() => setEditingProject(null)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Category</label>
                <select
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="3D & Creative">3D & Creative</option>
                  <option value="AI & Agents">AI & Agents</option>
                  <option value="Fullstack">Fullstack</option>
                  <option value="Web3">Web3</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Short Catchy Tagline</label>
              <input
                type="text"
                value={editingProject.tagline}
                onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Full Description</label>
              <textarea
                rows={3}
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Media Settings (Video vs Image) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-mono text-cyan-400">Media Type (Video or Picture)</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject({ ...editingProject, mediaType: 'video' })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition ${
                      editingProject.mediaType === 'video' ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video (MP4/WebM)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProject({ ...editingProject, mediaType: 'image' })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition ${
                      editingProject.mediaType === 'image' ? 'bg-teal-500/20 border-teal-400 text-teal-300' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Picture / Image</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Primary Media URL (Video or Image URL)</label>
                <input
                  type="url"
                  required
                  value={editingProject.mediaUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, mediaUrl: e.target.value })}
                  placeholder="https://.../video.mp4 or https://.../image.jpg"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Gallery Images */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Additional Gallery Image URLs (one per line)</label>
              <textarea
                rows={2}
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            {/* Tags & Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Tech Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Three.js, React, GLSL"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Client Name</label>
                <input
                  type="text"
                  value={editingProject.client || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Highlight Metric / Badge</label>
                <input
                  type="text"
                  value={editingProject.metrics || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, metrics: e.target.value })}
                  placeholder="+140% Conversions"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Live Demo & GitHub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Live Demo URL</label>
                <input
                  type="url"
                  value={editingProject.liveUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">GitHub Repository URL</label>
                <input
                  type="url"
                  value={editingProject.githubUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-lg"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {data.projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800 relative">
                {project.mediaType === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-purple-950/40">
                    <Play className="w-4 h-4 text-purple-400" />
                  </div>
                ) : (
                  <img src={project.mediaUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm truncate">{project.title}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {project.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">{project.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(project)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                title="Edit Project"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
