import React, { useState } from 'react';

interface EventRegistrationFormProps {
  eventTitle: string;
  event?: any;
  onClose: () => void;
}

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({ eventTitle, event, onClose }) => {
  const [formData, setFormData] = useState(() => {
    const profile = localStorage.getItem('tribe_user_profile');
    if(profile) {
      try {
        const parsed = JSON.parse(profile);
        return { name: parsed.name || '', email: parsed.email || '', year: parsed.year || '', dept: parsed.department || '', phone: parsed.phone || '', reason: '', experience: '' };
      } catch (e) {}
    }
    return { name: '', email: '', year: '', dept: '', phone: '', reason: '', experience: '' };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      // Save data locally
      const savedRegex = localStorage.getItem('tribe_event_registrations');
      const records = savedRegex ? JSON.parse(savedRegex) : [];
      records.push({
         formData,
         event: event || { title: eventTitle, __cat: 'Unknown', date: 'TBD', time: 'TBD' },
         timestamp: new Date().toISOString()
      });
      localStorage.setItem('tribe_event_registrations', JSON.stringify(records));
      window.dispatchEvent(new Event('registration_added'));

      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[600] bg-[#0a0a0a]/90 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-full max-w-md bg-[#111] border border-[#222] p-10 rounded-[32px] flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
           <div className="size-20 rounded-full border-[2px] border-white flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.4)] bg-[#050505] relative z-10">
             <span className="material-symbols-outlined text-white text-3xl">check</span>
           </div>
           <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 relative z-10">Registration Confirmed</h2>
           <p className="text-sm font-medium text-slate-400 mb-8 relative z-10">
             Your application for {eventTitle} has been successfully logged into the event manifest.
           </p>
           <button 
             onClick={onClose}
             className="w-full py-4 rounded-xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
           >
             Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[600] bg-[#0a0a0a]/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-[700px] my-auto bg-[#111] border border-[#222] rounded-[32px] overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative">
        
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-[#222] flex justify-between items-start bg-[#0a0a0a] relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[#222] border border-[#333] rounded-sm text-white text-[9px] font-black uppercase tracking-widest">Event Registration</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter line-clamp-1">{eventTitle}</h2>
          </div>
          <button onClick={onClose} className="size-10 shrink-0 rounded-full bg-[#1a1a1a] hover:bg-white text-slate-400 hover:text-black border border-[#333] flex items-center justify-center transition-all group">
            <span className="material-symbols-outlined text-sm group-hover:rotate-90 transition-transform">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 md:p-10 relative z-10">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-right-10 fade-in">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">FullName</label>
                <input required type="text" className="bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-white transition-colors focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Link Email</label>
                <input required type="email" className="bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-white transition-colors focus:outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Department</label>
                 <select required className="bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-white transition-colors focus:outline-none appearance-none" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})}>
                    <option value="" disabled>Select Department...</option>
                    <option value="CS">Computer Science</option>
                    <option value="IT">Information Tech</option>
                    <option value="ME">Mechanical</option>
                    <option value="EC">Electronics</option>
                    <option value="Other">Other</option>
                  </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Year</label>
                 <select required className="bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-white transition-colors focus:outline-none appearance-none" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}>
                    <option value="" disabled>Select Year...</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Phone (Optional)</label>
                <input type="tel" className="bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-white transition-colors focus:outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Why do you want to attend?</label>
                <textarea required className="bg-[#050505] border border-[#333] rounded-xl px-4 py-4 text-white focus:border-white transition-colors focus:outline-none min-h-[100px] resize-none" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t border-[#222] mt-4">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-full border border-[#333] text-white text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.4)] disabled:opacity-50">
                {isSubmitting ? (
                   <><span className="animate-spin size-4 border-2 border-black border-t-transparent rounded-full" /> Sending...</>
                ) : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
