import React, { useState } from 'react';
import { 
  Send, 
  Terminal, 
  Mail, 
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundFx } from '../../utils/audio';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../common/SocialIcons';

export const ContactSection: React.FC = () => {
  const { data, submitContactLead } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceInterest: data.services[0]?.title || 'Interactive 3D Web & Immersive Experience',
    budget: '$5,000 - $10,000',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    soundFx.playClick();

    await submitContactLead(formData);

    setIsSubmitting(false);
    setIsSuccess(true);
    soundFx.playSuccess();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setFormData({
      name: '',
      email: '',
      serviceInterest: data.services[0]?.title || '',
      budget: '$5,000 - $10,000',
      message: ''
    });

    setTimeout(() => {
      setIsSuccess(false);
    }, 6000);
  };

  const handleCopyEmail = () => {
    if (data.profile.socials.email) {
      navigator.clipboard.writeText(data.profile.socials.email);
      setCopiedEmail(true);
      soundFx.playClick();
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 lg:px-8 pointer-events-auto">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5" />
            <span>Initiate Direct Transmission</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Let's Build Something Legendary.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Have a project in mind, an architectural challenge, or want to discuss a 3D experience? Send a message directly to the neural terminal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">Direct Connect</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">Available for worldwide contracts & consulting</p>
              </div>

              {/* Email Copier */}
              {data.profile.socials.email && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Primary Inquiries</div>
                      <div className="text-xs font-mono text-white font-semibold">{data.profile.socials.email}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Social Channels */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400 uppercase">Social & Network Channels</div>
                <div className="flex flex-wrap gap-2.5">
                  {data.profile.socials.github && (
                    <a
                      href={data.profile.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundFx.playClick()}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition flex items-center gap-2 text-xs font-mono"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {data.profile.socials.linkedin && (
                    <a
                      href={data.profile.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundFx.playClick()}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition flex items-center gap-2 text-xs font-mono"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {data.profile.socials.twitter && (
                    <a
                      href={data.profile.socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundFx.playClick()}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition flex items-center gap-2 text-xs font-mono"
                    >
                      <TwitterIcon className="w-4 h-4" />
                      <span>Twitter / X</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Availability Box */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div className="text-xs font-mono text-emerald-300">
                  Currently accepting 2 new client engagements for this quarter.
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="glass-panel-glow p-6 sm:p-8 rounded-2xl border border-cyan-500/30 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Terminal className="w-4 h-4" />
                  <span>TRANSMISSION_FORM.ts</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">256-BIT ENCRYPTED</span>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Your Name / Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Service Interest & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Interested Service Tier</label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {data.services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                    <option value="Custom Architecture">Other / Custom Architecture</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Target Budget Range</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="< $3,000">&lt; $3,000</option>
                    <option value="$3,000 - $6,000">$3,000 - $6,000</option>
                    <option value="$6,000 - $12,000">$6,000 - $12,000</option>
                    <option value="$12,000+">$12,000+ (Enterprise)</option>
                  </select>
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Project Goals & Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project timeline, vision, and key technical deliverables..."
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              {/* Success Message Banner */}
              {isSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>TRANSMISSION RECEIVED! Your inquiry is logged in the real-time neural inbox. Expect a response within 24 hours.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-slate-950 font-bold text-sm uppercase font-mono tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>SENDING_PACKETS...</span>
                ) : (
                  <>
                    <span>Transmit Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
