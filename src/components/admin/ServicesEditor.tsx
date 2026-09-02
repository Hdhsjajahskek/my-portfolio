import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Check, 
  X, 
  Save,
  Layers,
  Cpu,
  Activity
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Service, PriceType } from '../../types/portfolio';
import { soundFx } from '../../utils/audio';

export const ServicesEditor: React.FC = () => {
  const { data, addService, updateService, deleteService } = usePortfolio();

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('');

  const handleStartCreate = () => {
    soundFx.playClick();
    const blank: Service = {
      id: '',
      title: '',
      subtitle: '',
      description: '',
      price: 2500,
      priceType: 'starting_at',
      badge: 'New Package',
      features: [
        'Custom Architecture Planning',
        'End-to-End Implementation',
        '60 FPS Performance Optimization'
      ],
      deliveryTime: '2 - 3 Weeks',
      icon: 'Sparkles',
      isPopular: false
    };
    setEditingService(blank);
    setFeaturesInput(blank.features.join('\n'));
    setIsCreatingNew(true);
  };

  const handleStartEdit = (service: Service) => {
    soundFx.playClick();
    setEditingService({ ...service });
    setFeaturesInput(service.features.join('\n'));
    setIsCreatingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    const parsedFeatures = featuresInput.split('\n').map(f => f.trim()).filter(Boolean);

    const serviceToSave: Service = {
      ...editingService,
      features: parsedFeatures.length > 0 ? parsedFeatures : ['High Performance Delivery']
    };

    if (isCreatingNew) {
      void addService(serviceToSave);
    } else {
      void updateService(serviceToSave);
    }

    setEditingService(null);
    setIsCreatingNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service tier?')) {
      void deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-white">Services & Pricing CMS</h3>
          <p className="text-xs text-slate-400">Configure your rates, service packages, and deliverable scopes with instant sync.</p>
        </div>
        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Edit / Create Form */}
      {editingService && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-5 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold font-heading text-cyan-400">
              {isCreatingNew ? 'Create New Service Package' : `Editing: ${editingService.title}`}
            </h4>
            <button
              onClick={() => setEditingService(null)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. 3D WebGL Web Experience"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Subtitle / Tech Summary</label>
                <input
                  type="text"
                  value={editingService.subtitle}
                  onChange={(e) => setEditingService({ ...editingService, subtitle: e.target.value })}
                  placeholder="Three.js, GLSL Shaders & 3D Showroom"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Pricing Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-mono text-cyan-400">Price Amount ($ USD) *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white font-mono font-bold"
                  />
                  <DollarSign className="w-4 h-4 text-cyan-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Price Model</label>
                <select
                  value={editingService.priceType}
                  onChange={(e) => setEditingService({ ...editingService, priceType: e.target.value as PriceType })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="starting_at">Starting at ($)</option>
                  <option value="fixed">Fixed Flat Rate ($)</option>
                  <option value="hourly">Hourly Rate ($/hr)</option>
                  <option value="monthly">Monthly Retainer ($/mo)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Turnaround / Delivery Time</label>
                <input
                  type="text"
                  value={editingService.deliveryTime}
                  onChange={(e) => setEditingService({ ...editingService, deliveryTime: e.target.value })}
                  placeholder="2 - 3 Weeks"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Badge & Popular Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Promotional Badge (optional)</label>
                <input
                  type="text"
                  value={editingService.badge || ''}
                  onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                  placeholder="e.g. Most Popular, High Value, Trending"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={editingService.isPopular || false}
                  onChange={(e) => setEditingService({ ...editingService, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="isPopular" className="text-xs font-mono text-slate-200 cursor-pointer">
                  Highlight as Featured / Popular Package
                </label>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Included Features Checklist (one per line)</label>
              <textarea
                rows={4}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="Custom Three.js 3D Scene&#10;Scroll-driven camera animation&#10;Mobile & GPU 60 FPS optimization"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-lg"
              >
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.services.map((service) => (
          <div
            key={service.id}
            className={`p-5 rounded-2xl bg-slate-900/70 border flex flex-col justify-between space-y-4 transition ${
              service.isPopular ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-slate-800'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {service.badge || 'Standard Tier'}
                </span>
                <div className="text-xl font-extrabold font-heading text-white">
                  ${service.price.toLocaleString()}
                  <span className="text-xs font-mono text-slate-400 font-normal ml-1">
                    {service.priceType === 'hourly' ? '/hr' : ''}
                  </span>
                </div>
              </div>

              <h4 className="font-bold text-white text-base font-heading">{service.title}</h4>
              <p className="text-xs text-slate-400">{service.subtitle}</p>

              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{service.deliveryTime}</span>
                <span>• {service.features.length} Features</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleStartEdit(service)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                title="Edit Service"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                title="Delete Service"
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
