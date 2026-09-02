import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Cpu, Briefcase } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Skill, Experience } from '../../types/portfolio';
import { soundFx } from '../../utils/audio';

export const SkillsEditor: React.FC = () => {
  const { data, addSkill, updateSkill, deleteSkill } = usePortfolio();

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Frontend');
  const [newSkillProficiency, setNewSkillProficiency] = useState(90);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName) return;

    void addSkill({
      name: newSkillName,
      category: newSkillCategory,
      proficiency: newSkillProficiency,
      icon: 'Code'
    });

    setNewSkillName('');
    setNewSkillProficiency(90);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold font-heading text-white">Technical Arsenal & Stack CMS</h3>
        <p className="text-xs text-slate-400">Manage your skills, categories, and proficiency bars live.</p>
      </div>

      {/* Quick Add Skill Bar */}
      <form onSubmit={handleAddSkill} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="text-xs font-mono text-cyan-400 uppercase">Quick Add New Skill</div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Skill Name (e.g. Next.js 15, WebGPU)"
            className="sm:col-span-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />

          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="3D & Shader">3D & Shader</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="AI & Tools">AI & Tools</option>
            <option value="Cloud & DevOps">Cloud & DevOps</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={newSkillProficiency}
              onChange={(e) => setNewSkillProficiency(Number(e.target.value))}
              className="w-16 bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white font-mono"
            />
            <span className="text-xs font-mono text-slate-400">%</span>

            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase"
            >
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.skills.map((skill) => (
          <div
            key={skill.id}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white truncate">{skill.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-cyan-400">
                  {skill.category}
                </span>
              </div>
              <div className="w-36 bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">{skill.proficiency}%</span>
              <button
                onClick={() => void deleteSkill(skill.id)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
