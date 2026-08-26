import React, { useState } from 'react';
import { 
  Inbox, 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Download,
  Filter
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ContactMessage } from '../../types/portfolio';
import { soundFx } from '../../utils/audio';

export const LeadsInbox: React.FC = () => {
  const { data, updateLeadStatus, deleteLead } = usePortfolio();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const leads = data.leads || [];

  const filteredLeads = leads.filter(l => {
    if (filterStatus === 'all') return true;
    return l.status === filterStatus;
  });

  const exportCSV = () => {
    soundFx.playClick();
    const headers = ['ID', 'Date', 'Name', 'Email', 'Service', 'Budget', 'Status', 'Message'];
    const rows = leads.map(l => [
      l.id,
      new Date(l.createdAt).toLocaleString(),
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${(l.serviceInterest || '').replace(/"/g, '""')}"`,
      `"${l.budget || ''}"`,
      l.status,
      `"${l.message.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-heading text-white">Client Inquiries & Leads Inbox</h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
              {leads.length} TOTAL
            </span>
          </div>
          <p className="text-xs text-slate-400">Live stream of client inquiries received from the terminal form.</p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono self-start sm:self-auto border border-slate-700"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'new', 'in_review', 'contacted', 'archived'].map(st => (
          <button
            key={st}
            onClick={() => {
              soundFx.playClick();
              setFilterStatus(st);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition ${
              filterStatus === st
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400 font-medium">No messages found in this category.</p>
          <p className="text-xs text-slate-600 font-mono">Incoming messages will appear here instantly in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition"
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-sm">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                    <p className="text-xs font-mono text-cyan-400">{lead.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-300 focus:border-cyan-400"
                  >
                    <option value="new">🟢 New</option>
                    <option value="in_review">🟡 In Review</option>
                    <option value="contacted">🔵 Contacted</option>
                    <option value="archived">⚪ Archived</option>
                  </select>

                  <a
                    href={`mailto:${lead.email}?subject=Re: Inquiry on ${encodeURIComponent(lead.serviceInterest || 'Portfolio')}`}
                    onClick={() => soundFx.playClick()}
                    className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-300 transition"
                    title="Reply via Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Meta */}
              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                {lead.serviceInterest && (
                  <div className="flex items-center gap-1 text-slate-300">
                    <span className="text-slate-500">Service:</span>
                    <strong className="text-cyan-400">{lead.serviceInterest}</strong>
                  </div>
                )}

                {lead.budget && (
                  <div className="flex items-center gap-1 text-slate-300">
                    <span className="text-slate-500">Budget:</span>
                    <strong className="text-emerald-400">{lead.budget}</strong>
                  </div>
                )}

                <div className="text-slate-500 ml-auto">
                  {new Date(lead.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Message Content */}
              <p className="text-xs sm:text-sm text-slate-200 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 whitespace-pre-line leading-relaxed">
                {lead.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
