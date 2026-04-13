import React, { useState, useEffect, useRef } from 'react';
import { EventDetailDrawer } from './EventDetailDrawer';

export const SharedHeaderUserArea: React.FC<{ setActiveTab: (tab: string) => void, children?: React.ReactNode }> = ({ setActiveTab, children }) => {
  const [user, setUser] = useState<{name?: string, avatar?: string} | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = () => {
      const profileStr = localStorage.getItem('tribe_user_profile');
      if (profileStr) {
        try {
          const parsed = JSON.parse(profileStr);
          if (parsed.name) {
             setUser(parsed);
          } else {
             setUser(null); // Reset if profile was cleared
          }
        } catch (e) {}
      } else {
        setUser(null);
      }
    };

    loadProfile();
    window.addEventListener('profile_updated', loadProfile);

    const loadRegistrations = () => {
      const regsStr = localStorage.getItem('tribe_event_registrations');
      if (regsStr) {
         try {
           const parsed = JSON.parse(regsStr);
           setRegisteredEvents(parsed);
         } catch (e) {}
      }
    };

    loadRegistrations();
    window.addEventListener('registration_added', loadRegistrations);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
       document.removeEventListener('mousedown', handleClickOutside);
       window.removeEventListener('registration_added', loadRegistrations);
       window.removeEventListener('profile_updated', loadProfile);
    };
  }, []);

  const today = new Date();
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const todayStr1 = `${monthNames[today.getMonth()]} ${today.getDate() < 10 ? '0'+today.getDate() : today.getDate()}`.toLowerCase();
  const todayStr2 = `${monthNames[today.getMonth()]} ${today.getDate()}`.toLowerCase();

  const trulyTodayEvents = registeredEvents.filter((reg: any) => {
    if(!reg.event || !reg.event.date) return false;
    const d = reg.event.date.toLowerCase();
    return d.includes(todayStr1) || d.includes(todayStr2) || d.includes('today');
  });

  const displayEvents = trulyTodayEvents;

  const handleOpenEvent = (evt: any) => {
    setSelectedEvent(evt);
    setShowNotifications(false);
  };

  return (
    <div className="flex items-center gap-5">
      
      {/* Today's Notification Bell */}
      <div className="relative z-50">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="size-10 flex items-center justify-center rounded-full bg-[#111] hover:bg-[#222] text-slate-300 transition-colors border border-[#333] relative"
        >
          <span className="material-symbols-outlined text-sm">notifications</span>
          {displayEvents.length > 0 && (
             <span className="absolute -top-1 -right-1 size-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.8)] border border-[#111]">
               {displayEvents.length}
             </span>
          )}
        </button>

        {showNotifications && (
           <div ref={dropdownRef} className="absolute top-14 right-0 w-[380px] bg-[#0a0a0a] border border-[#333] rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col font-display animate-in slide-in-from-top-2 fade-in duration-200">
             <div className="p-4 border-b border-[#222] bg-[#111]">
               <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-white flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                 Today's Registrations
               </h3>
             </div>
             
             <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {displayEvents.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-slate-600 text-3xl mb-3">event_busy</span>
                    <p className="text-white text-sm font-black tracking-widest uppercase mb-1">Clear Horizon</p>
                    <p className="text-slate-500 text-xs font-bold">No registered events scheduled for today.</p>
                  </div>
                ) : (
                  <div className="p-2 flex flex-col gap-1">
                    {displayEvents.map((reg, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-transparent hover:bg-[#111] transition-colors border border-transparent hover:border-[#333] group cursor-pointer" onClick={() => handleOpenEvent(reg.event)}>
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[9px] font-black uppercase tracking-widest text-red-500">{reg.event.time || 'All Day'}</span>
                           <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500 bg-[#222] px-2 py-0.5 rounded">{reg.event.org || 'Tribe'} • {reg.event.__cat || 'Event'}</span>
                        </div>
                        <h4 className="text-white text-sm font-black uppercase tracking-tighter mb-1 leading-tight">{reg.event.title}</h4>
                        <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                           <span className="material-symbols-outlined text-[12px]">location_on</span>
                           {reg.event.location || 'Remote Vector'}
                        </div>
                        <button className="mt-3 w-full py-2 bg-[#222] text-slate-300 group-hover:text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg transition-colors border border-[#333] group-hover:bg-white group-hover:text-black">
                           View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           </div>
        )}
      </div>

      {children}
      <div className="flex items-center gap-4 pl-5 border-l border-[#333]">
        {user ? (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white tracking-wide uppercase">{user.name}</p>
            </div>
            {user.avatar ? (
              <img onClick={() => setActiveTab('profile')} alt="Profile" className={`size-11 rounded-full cursor-pointer hover:scale-105 transition-transform border-2 border-[#333] hover:border-white object-cover`} src={user.avatar} />
            ) : (
              <div onClick={() => setActiveTab('profile')} className="size-11 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-slate-400 font-bold cursor-pointer hover:border-white transition-colors">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
              </div>
            )}
          </>
        ) : (
          <div onClick={() => setActiveTab('profile')} className="size-10 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-slate-400 cursor-pointer hover:text-white hover:border-white transition-colors group">
             <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">person</span>
          </div>
        )}
      </div>
      
      {selectedEvent && <EventDetailDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};
