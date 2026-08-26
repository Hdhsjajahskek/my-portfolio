import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Calculator, 
  Clock, 
  Zap, 
  Layers, 
  ShieldCheck,
  Cpu,
  Activity
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Service } from '../../types/portfolio';
import { soundFx } from '../../utils/audio';

export const ServicesSection: React.FC = () => {
  const { data } = usePortfolio();

  // Calculator State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(data.services[0]?.id || '');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['custom_3d']);
  const [timelineSpeed, setTimelineSpeed] = useState<'standard' | 'express'>('standard');

  const addonsList = [
    { id: 'custom_3d', name: 'Custom Stylized 3D Avatar/Mesh', price: 650, desc: 'Tailored 3D geometry & texturing' },
    { id: 'realtime_sync', name: 'Real-Time Sync Engine & CMS', price: 800, desc: 'Instant live data & multi-tab sync' },
    { id: 'audio_fx', name: 'Synthesizer Audio & Haptic FX', price: 350, desc: 'Custom Web Audio sound interactions' },
    { id: 'seo_speed', name: 'Lighthouse 100/100 Core Vitals', price: 450, desc: 'Maximum speed & search ranking' }
  ];

  const currentService = data.services.find(s => s.id === selectedServiceId) || data.services[0];

  const basePrice = currentService ? currentService.price : 2000;
  const addonsTotal = selectedAddons.reduce((sum, addId) => {
    const item = addonsList.find(a => a.id === addId);
    return sum + (item ? item.price : 0);
  }, 0);
  const speedMultiplier = timelineSpeed === 'express' ? 1.25 : 1.0;
  const totalCalculated = Math.round((basePrice + addonsTotal) * speedMultiplier);

  const toggleAddon = (id: string) => {
    soundFx.playClick();
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-yellow-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-400" />;
      default: return <Zap className="w-5 h-5 text-cyan-400" />;
    }
  };

  const formatPriceType = (type: string) => {
    switch (type) {
      case 'starting_at': return 'Starting at';
      case 'hourly': return '/ hour';
      case 'monthly': return '/ month';
      default: return 'Fixed price';
    }
  };

  return (
    <section id="services" className="relative py-28 px-4 sm:px-6 lg:px-8 pointer-events-auto">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineering Packages & Rates</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Transparent Services & Pricing.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            High-caliber creative engineering services tailored to your technical and business milestones. Fully editable without code.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.services.map((service) => (
            <div
              key={service.id}
              className={`glass-panel p-6 rounded-2xl flex flex-col justify-between relative transition-all duration-300 ${
                service.isPopular
                  ? 'border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.2)] bg-slate-900/90 scale-[1.02]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badge */}
              {service.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-bold text-[10px] uppercase font-mono tracking-wider shadow-md">
                  {service.badge}
                </div>
              )}

              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{service.deliveryTime}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-heading text-white">{service.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{service.subtitle}</p>
                </div>

                {/* Price Display */}
                <div className="py-2 border-y border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-400">{formatPriceType(service.priceType)}</div>
                  <div className="text-3xl font-black font-heading text-white flex items-baseline gap-1">
                    <span>${service.price.toLocaleString()}</span>
                    {service.priceType === 'hourly' && <span className="text-xs text-slate-400 font-mono">/ hr</span>}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 pt-1">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book CTA */}
              <div className="pt-6">
                <a
                  href="#contact"
                  onClick={() => soundFx.playClick()}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    service.isPopular
                      ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-400'
                  }`}
                >
                  <span>Select Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Live Scope & Budget Calculator */}
        <div className="glass-panel-glow p-6 sm:p-10 rounded-3xl border border-cyan-500/30 max-w-4xl mx-auto shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-6 mb-8">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-heading text-white">
                Live Interactive Project Cost Estimator
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Configure your architecture stack and add-ons for an instantaneous budget calculation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Options Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Base Package Select */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  1. Select Core Service Tier
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => {
                    soundFx.playClick();
                    setSelectedServiceId(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-cyan-400 focus:outline-none"
                >
                  {data.services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} — ${s.price} ({s.deliveryTime})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Add-on Scope Features */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  2. Optional Add-ons & Architectural Enhancements
                </label>
                <div className="space-y-2">
                  {addonsList.map(addon => (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        selectedAddons.includes(addon.id)
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedAddons.includes(addon.id) ? 'bg-cyan-400 border-cyan-400' : 'border-slate-600'
                        }`}>
                          {selectedAddons.includes(addon.id) && <Check className="w-3 h-3 text-slate-950 font-bold" />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{addon.name}</div>
                          <div className="text-[11px] text-slate-400">{addon.desc}</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-cyan-400 font-bold">
                        +${addon.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Delivery Speed */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  3. Turnaround Priority
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setTimelineSpeed('standard');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                      timelineSpeed === 'standard'
                        ? 'bg-slate-800 border-cyan-400 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Standard Pace (Regular)
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setTimelineSpeed('express');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                      timelineSpeed === 'express'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Express Sprint (+25%)
                  </button>
                </div>
              </div>
            </div>

            {/* Live Calculation Summary Card */}
            <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-6 border border-cyan-500/40 space-y-6 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="text-xs font-mono text-cyan-400 uppercase flex items-center justify-between">
                  <span>Investment Summary</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                    REALTIME CALC
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 font-mono border-b border-slate-800 pb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Package:</span>
                    <span>${basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Add-ons ({selectedAddons.length}):</span>
                    <span>+${addonsTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Priority Multiplier:</span>
                    <span>{speedMultiplier}x</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Estimated Budget</div>
                  <div className="text-4xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
                    ${totalCalculated.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    Estimated Time: {timelineSpeed === 'express' ? '1 - 2 Weeks' : (currentService?.deliveryTime || '2 - 3 Weeks')}
                  </p>
                </div>
              </div>

              <a
                href="#contact"
                onClick={() => soundFx.playSuccess()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition"
              >
                <span>Lock In Estimate & Inquire</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
