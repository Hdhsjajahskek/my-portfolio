import React, { useState } from 'react';
import { 
  Palette, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { RoomTheme } from '../../types/portfolio';
import { soundFx } from '../../utils/audio';

export const ThemeSettingsEditor: React.FC = () => {
  const { 
    data, 
    setRoomTheme, 
    toggleSound, 
    resetToDefaults, 
    exportDataJSON, 
    importDataJSON 
  } = usePortfolio();

  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const themeOptions: { id: RoomTheme; name: string; desc: string; preview: string }[] = [
    { 
      id: 'cyber-neon', 
      name: 'Cyber Neon (Default)', 
      desc: 'High-contrast cyan & magenta neon glows with volumetric desk lighting',
      preview: 'from-cyan-500 to-fuchsia-600'
    },
    { 
      id: 'matrix-green', 
      name: 'Matrix Green', 
      desc: 'Cyberpunk emerald terminal with lime desk edge underglow',
      preview: 'from-emerald-500 to-lime-500'
    },
    { 
      id: 'synthwave-sunset', 
      name: 'Synthwave Sunset', 
      desc: 'Vibrant hot pink, neon orange, and warm dusk atmospheric glow',
      preview: 'from-rose-500 to-amber-500'
    },
    { 
      id: 'studio-minimal', 
      name: 'Minimalist Studio', 
      desc: 'Clean ice blue and sky tones with soft neutral ambient lighting',
      preview: 'from-sky-400 to-violet-500'
    }
  ];

  const handleExport = () => {
    soundFx.playClick();
    const json = exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJsonText) return;
    void importDataJSON(importJsonText).then((ok) => {
      if (ok) {
        setImportStatus('success');
        setImportJsonText('');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('error');
      }
    });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all portfolio data back to default presets? Custom edits will be overwritten.')) {
      void resetToDefaults();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold font-heading text-white">3D Scene & System Customizer</h3>
        <p className="text-xs text-slate-400">Configure real-time 3D lighting moods, audio interactions, and full database backups.</p>
      </div>

      {/* 3D Lighting Themes */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <span>Active 3D Lighting Ambience</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themeOptions.map((t) => (
            <div
              key={t.id}
              onClick={() => void setRoomTheme(t.id)}
              className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3.5 transition ${
                data.theme.roomTheme === t.id
                  ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${t.preview} shrink-0 mt-0.5 shadow-md`} />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">{t.name}</h4>
                  {data.theme.roomTheme === t.id && (
                    <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-500/20">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sound Toggle */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            {data.theme.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>Futuristic Web Audio FX Engine</span>
          </div>
          <p className="text-xs text-slate-400">Generates zero-latency harmonic clicks, transitions, and chords via Web Audio API.</p>
        </div>

        <button
          onClick={() => void toggleSound()}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition ${
            data.theme.soundEnabled
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {data.theme.soundEnabled ? 'ENABLED' : 'MUTED'}
        </button>
      </div>

      {/* Backup & Restore */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div>
          <h4 className="font-bold text-sm text-white">Portfolio Data Backup & Transfer</h4>
          <p className="text-xs text-slate-400">Download your entire portfolio configuration as a JSON file or import saved data.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Backup JSON</span>
          </button>
        </div>

        {/* Import JSON textarea */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-mono text-slate-400">Import Portfolio JSON Data</label>
          <textarea
            rows={2}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Paste exported portfolio JSON content here to restore..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
          />

          {importStatus === 'success' && (
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Data imported and synced successfully!</span>
            </div>
          )}

          {importStatus === 'error' && (
            <div className="text-xs font-mono text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Invalid JSON structure. Please check the format.</span>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!importJsonText}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase disabled:opacity-50"
          >
            Apply Imported Data
          </button>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-rose-300">Reset to Default Data</h4>
          <p className="text-xs text-rose-400/80">Reverts all projects, services, and profile settings to factory defaults.</p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-xs font-mono self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>
    </div>
  );
};
