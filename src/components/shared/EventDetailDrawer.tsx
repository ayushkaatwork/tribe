import React, { useState } from 'react';
import { EventRegistrationForm } from './EventRegistrationForm';

interface EventDetailDrawerProps {
  event: any;
  onClose: () => void;
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({ event, onClose }) => {
  const [showRegistration, setShowRegistration] = useState(false);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[500] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <div className="relative w-full max-w-[500px] h-full bg-[#111] border-l border-[#222] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden font-display">
        
        {/* Header Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-red-600 to-[#333]" />

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          
          <div className="p-8 md:p-10 border-b border-[#222]">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-[#222] text-white text-[9px] font-black tracking-widest uppercase border border-[#333]">{event.type || 'Event'}</span>
                <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase bg-[#0a0a0a] px-3 py-1 rounded-md border border-[#222]">{event.org || 'Global'}</span>
              </div>
              <button onClick={onClose} className="size-10 rounded-full bg-[#1a1a1a] hover:bg-white text-slate-400 hover:text-black border border-[#333] flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{event.title}</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">{event.description || "Detailed overview logging standard operational context for the specified protocol event."}</p>
          </div>

          <div className="p-8 md:p-10 flex flex-col gap-8 flex-1">
             
             {/* Key Metrics Grid */}
             <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Scheduled Date</span>
                  <span className="text-lg font-black text-white">{event.date} 2026</span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Timeframe</span>
                  <span className="text-lg font-black text-white">{event.time || "TBD"}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Location / Vector</span>
                  <span className="text-lg font-black text-white">{event.location || "TBA"}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Status</span>
                  <span className="text-lg font-black text-green-500">Registration Open</span>
                </div>
             </div>

             <div className="mt-8 p-6 bg-[#0a0a0a] border border-[#222] rounded-[24px]">
               <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                 <span className="material-symbols-outlined text-sm">info</span>
                 Organizer Note
               </h4>
               <p className="text-sm font-medium text-slate-500 italic">
                 Ensure early transmission of registration payload. Resources and access tokens are limited.
               </p>
             </div>
          </div>

          {/* Fixed Footer CTA */}
          <div className="p-8 border-t border-[#222] bg-[#0a0a0a]">
            <button 
              onClick={() => setShowRegistration(true)} 
              className="w-full py-5 rounded-xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
            >
              Register for Event
            </button>
          </div>
        </div>
      </div>

      {showRegistration && (
        <EventRegistrationForm eventTitle={event.title} event={event} onClose={() => { setShowRegistration(false); onClose(); }} />
      )}
    </div>
  );
};
