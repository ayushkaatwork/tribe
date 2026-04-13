import React, { useState } from 'react';

interface AddClubModalProps {
  onClose: () => void;
  onAdd: (club: any) => void;
  category: string;
}

export const AddClubModal: React.FC<AddClubModalProps> = ({ onClose, onAdd, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop', // default fallback
    members: '10+',
    icon: 'api'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      gradientClass: 'from-[#222] to-[#111]'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#111] border border-[#333] p-10 rounded-[32px] shadow-2xl w-full max-w-[600px] relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase mb-2">Propose Node</h2>
          <p className="text-slate-500 text-xs tracking-widest uppercase font-bold">Register a new {category} cluster</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Cluster Designation</label>
            <input 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="E.g., Quantum Computing Lab" 
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-4 outline-none text-white focus:border-white transition-colors font-bold uppercase tracking-tight"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Operational Parameters (Description)</label>
            <textarea 
              required 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Define core objectives..." 
              className="w-full h-32 bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-4 outline-none text-slate-300 focus:border-white transition-colors font-medium resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Visual Identifier (Image URL)</label>
            <input 
              value={formData.image} 
              onChange={e => setFormData({...formData, image: e.target.value})} 
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-4 outline-none text-slate-400 focus:border-white transition-colors text-sm"
            />
          </div>

          <button type="submit" className="mt-4 w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors active:scale-[0.98]">
            Transmit Proposal
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClubModal;
