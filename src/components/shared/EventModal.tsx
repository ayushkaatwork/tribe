import React, { useState } from 'react';

interface EventModalProps {
  onClose: () => void;
  onSave: (event: any) => void;
  initialData?: any;
}

export const EventModal: React.FC<EventModalProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    date: 'MAY 15',
    day: 15,
    time: '12:00 - 14:00',
    type: 'Meeting',
    org: 'Global Nodes',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 animate-in fade-in duration-300 font-display">
      <div className="bg-[#111] border border-[#333] p-10 rounded-[32px] shadow-2xl w-full max-w-[600px] relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase mb-2">{initialData ? 'Modulate Event' : 'Schedule Transmission'}</h2>
          <p className="text-slate-500 text-xs tracking-widest uppercase font-bold">{initialData ? 'Update event parameters' : 'Register a new timeframe'}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Event Designation</label>
            <input 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="E.g., Quantum Computing Lab Focus" 
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-4 outline-none text-white focus:border-white transition-colors font-bold uppercase tracking-tight"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Day (May 2026)</label>
              <input 
                required 
                type="number"
                min="1" max="31"
                value={formData.day} 
                onChange={e => setFormData({...formData, day: parseInt(e.target.value), date: `MAY ${e.target.value}`})} 
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-4 outline-none text-white focus:border-white transition-colors font-bold uppercase tracking-tight"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Timeframe</label>
              <input 
                required 
                value={formData.time} 
                onChange={e => setFormData({...formData, time: e.target.value})} 
                placeholder="14:00 - 16:00"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-4 outline-none text-white focus:border-white transition-colors font-bold uppercase tracking-tight"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Operational Parameters (Description)</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Define core objectives..." 
              className="w-full h-24 bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-4 outline-none text-slate-300 focus:border-white transition-colors font-medium resize-none"
            />
          </div>

          <div className="flex gap-4 mt-4">
             <button type="button" onClick={onClose} className="flex-1 py-4 bg-[#0a0a0a] border border-[#333] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#222] transition-colors">
               Cancel
             </button>
             <button type="submit" className="flex-1 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors active:scale-[0.98]">
               {initialData ? 'Save Changes' : 'Transmit Record'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
