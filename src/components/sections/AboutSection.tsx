import React, { useState } from 'react';
import { 
  Box, 
  Code, 
  Server, 
  Palette, 
  Cpu, 
  Database, 
  Cloud, 
  Shield, 
  Briefcase, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundFx } from '../../utils/audio';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('All');

  const skillCategories = ['All', '3D & Shader', 'Frontend', 'Backend', 'AI & Tools', 'Cloud & DevOps'];

  const filteredSkills = activeSkillCategory === 'All'
    ? data.skills
    : data.skills.filter(s => s.category === activeSkillCategory);

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Box': return <Box className="w-4 h-4 text-cyan-400" />;
      case 'Code': return <Code className="w-4 h-4 text-teal-400" />;
      case 'Server': return <Server className="w-4 h-4 text-purple-400" />;
      case 'Palette': return <Palette className="w-4 h-4 text-pink-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-yellow-400" />;
      case 'Database': return <Database className="w-4 h-4 text-emerald-400" />;
      case 'Cloud': return <Cloud className="w-4 h-4 text-blue-400" />;
      case 'Shield': return <Shield className="w-4 h-4 text-rose-400" />;
      default: return <Zap className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 lg:px-8 pointer-events-auto">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile & Capability Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Bridging Imagination & High-Scale Code.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            {data.profile.secondaryBio}
          </p>
        </div>

        {/* 2-Column Grid: Skills Matrix + Career Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Skills Matrix */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">Technical Arsenal</h3>
                  <p className="text-xs font-mono text-slate-400">Mastery & Engineering Stack</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {data.skills.length} TECHNOLOGIES
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {skillCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundFx.playClick();
                      setActiveSkillCategory(cat);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeSkillCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Skills Progress List */}
              <div className="space-y-4 pt-2">
                {filteredSkills.map(skill => (
                  <div key={skill.id} className="space-y-2 group">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-medium text-slate-200 group-hover:text-cyan-400 transition">
                        {getSkillIcon(skill.icon)}
                        <span>{skill.name}</span>
                      </div>
                      <span className="font-mono text-slate-400 group-hover:text-cyan-300">
                        {skill.proficiency}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.7)]"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Career Milestones & Experience Timeline */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">Experience & Leadership</h3>
                  <p className="text-xs font-mono text-slate-400">Track Record of Innovation</p>
                </div>
                <Briefcase className="w-5 h-5 text-purple-400" />
              </div>

              {/* Timeline Items */}
              <div className="space-y-6 relative border-l-2 border-slate-800 ml-3 pl-6">
                {data.experience.map(exp => (
                  <div key={exp.id} className="relative space-y-2 group">
                    {/* Glowing Node Dot */}
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.8)] transition" />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-white text-base font-heading">
                        {exp.role}
                      </h4>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {exp.period}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-cyan-400 font-semibold">
                      {exp.company}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-1 pt-1">
                      {exp.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
