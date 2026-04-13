import React, { useState } from 'react';

interface ClubQuerySectionProps {
  clubName: string;
  leadName?: string;
  accentBgClass?: string;
  clubLeads?: any[];
}

export const ClubQuerySection: React.FC<ClubQuerySectionProps> = ({ clubName, leadName, accentBgClass = "bg-white", clubLeads }) => {
  const [formData, setFormData] = useState(() => {
    const profile = localStorage.getItem('tribe_user_profile');
    if(profile) {
      try {
        const parsed = JSON.parse(profile);
        return { name: parsed.name || '', email: parsed.email || '', message: '' };
      } catch (e) {}
    }
    return { name: '', email: '', message: '' };
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  const leads = clubLeads || [
    {
      role: 'President',
      name: leadName || 'Alex Chen',
      phone: '+1 (555) 019-2041',
      email: 'lead@tribe.edu',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    },
    {
      role: 'Vice President',
      name: 'Sarah Jenkins',
      phone: '+1 (555) 019-2042',
      email: 'vp@tribe.edu',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
    }
  ];

  return (
    <section className="mb-32 pt-20 border-t border-[#222]">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
        <div>
           <div className="flex items-center gap-3 mb-4">
             <div className={`w-3 h-8 ${accentBgClass} shadow-[0_0_15px_rgba(255,255,255,0.2)]`}></div>
             <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">Have a Query?</h2>
           </div>
           <p className="text-slate-400 font-medium max-w-xl text-sm">
             Ask the club leadership anything before joining.
           </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        
        {/* Contact Cards */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {leads.map((lead, i) => (
             <div key={i} className="bg-[#111] border border-[#222] rounded-[24px] p-6 flex items-center gap-6 hover:border-white/30 transition-colors group">
               <div className="size-16 rounded-full overflow-hidden shrink-0 border-2 border-[#333] group-hover:border-white transition-colors">
                  <img src={lead.img} alt={lead.name} className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:grayscale-0 group-hover:mix-blend-normal transition-all" />
               </div>
               <div className="flex flex-col flex-1">
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{lead.role}</span>
                 <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{lead.name}</h4>
                 <div className="flex flex-col gap-1 text-slate-400 text-xs font-bold font-mono">
                   <a href={`tel:${lead.phone}`} className="hover:text-white transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">call</span> {lead.phone}</a>
                   <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">mail</span> {lead.email}</a>
                 </div>
               </div>
               <div className="shrink-0 size-10 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-black transition-colors cursor-pointer">
                 <span className="material-symbols-outlined text-sm">chat</span>
               </div>
             </div>
          ))}
        </div>

        {/* Message Form */}
        <div className="lg:col-span-3 bg-[#0a0a0a] border border-[#222] rounded-[32px] p-8 md:p-10 relative overflow-hidden">
          {status === 'success' ? (
            <div className="absolute inset-0 bg-[#111] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500 z-10">
              <div className="size-16 rounded-full border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <span className="material-symbols-outlined text-green-500 text-3xl">check</span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Message Transmitted</h3>
              <p className="text-slate-400 text-sm max-w-sm">Your query has been sent to the {clubName} leads. Await response via email.</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-0">
             <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Your Designation</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder="John Doe" className="bg-[#111] border border-[#333] rounded-xl px-4 py-4 text-white focus:border-white transition-colors focus:outline-none text-sm font-bold placeholder:font-medium" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Comms Link (Email)</label>
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder="john@tribe.edu" className="bg-[#111] border border-[#333] rounded-xl px-4 py-4 text-white focus:border-white transition-colors focus:outline-none text-sm font-bold placeholder:font-medium" />
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Query Payload</label>
                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="State your inquiry..." className="bg-[#111] border border-[#333] rounded-xl px-4 py-4 text-white focus:border-white transition-colors focus:outline-none text-sm font-medium resize-none h-32" />
             </div>
             
             <button disabled={status === 'submitting'} type="submit" className="mt-2 py-4 rounded-xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50">
               {status === 'submitting' ? (
                 <><span className="animate-spin size-4 border-2 border-black border-t-transparent rounded-full" /> Transmitting...</>
               ) : (
                 <>Transmit Query <span className="material-symbols-outlined text-sm">send</span></>
               )}
             </button>
          </form>
        </div>

      </div>
    </section>
  );
};
