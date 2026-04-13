import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockData } from '../../data/mockData';
import ProfilePanel from '../shared/ProfilePanel';
import SettingsPanel from '../shared/SettingsPanel';
import AddClubModal from '../shared/AddClubModal';
import EventModal from '../shared/EventModal';
import { GlobalSearch } from '../shared/GlobalSearch';
import { SharedHeaderUserArea } from '../shared/SharedHeaderUserArea';

export interface SidebarLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accentColorClass: string;
  accentBorderClass: string;
  accentShadowClass: string;
  accentBgClass: string;
  category: 'Technical' | 'Cultural' | 'Sports';
  onAddClub: (club: any) => void;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  accentColorClass,
  accentBorderClass,
  accentShadowClass,
  accentBgClass,
  category,
  onAddClub
}) => {
  const { globalEvents } = mockData;
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Event Management State
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  React.useEffect(() => {
    const savedEvents = localStorage.getItem('tribe_events');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        setEvents(globalEvents || []);
      }
    } else {
      setEvents(globalEvents || []);
    }
  }, [globalEvents]);

  const saveEvents = (newEvents: any[]) => {
    setEvents(newEvents);
    localStorage.setItem('tribe_events', JSON.stringify(newEvents));
  };

  const handleSaveEvent = (eventData: any) => {
    const exists = events.find(e => e.id === eventData.id);
    let updated;
    if (exists) {
      updated = events.map(e => e.id === eventData.id ? eventData : e);
    } else {
      updated = [...events, eventData];
    }
    saveEvents(updated);
    setShowEventModal(false);
  };

  return (
    <div className={`flex min-h-screen w-full bg-[#0a0a0a] font-display text-slate-100`}>
      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-[#0a0a0a] backdrop-blur-xl border-r border-[#222] hidden md:flex flex-col relative z-20`}>
        <div className="p-6 flex flex-col gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 ${accentBgClass} rounded-xl flex items-center justify-center ${accentShadowClass} group-hover:scale-105 transition-all`}>
              <span className="material-symbols-outlined text-[#0a0a0a] font-black text-xl">hub</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase text-white mt-1">TRIBE</h1>
          </Link>
          
          <nav className="flex-1 space-y-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold group">
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">dashboard</span>
              <span className="tracking-widest uppercase text-xs">Dashboard</span>
            </Link>
            
            {[
              { id: 'clubs', icon: 'groups', label: 'Clubs' },
              { id: 'events', icon: 'event', label: 'Events' },
              { id: 'profile', icon: 'account_circle', label: 'Profile' },
            ].map(item => (
              <div 
                key={item.id}
                onClick={() => setActiveTab(item.id)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold group
                  ${activeTab === item.id 
                    ? `bg-white/5 ${accentColorClass} ${accentBorderClass} shadow-inner` 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className={`material-symbols-outlined text-xl`}>{item.icon}</span>
                <span className="tracking-widest uppercase text-xs">{item.label}</span>
                {activeTab === item.id && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full ${accentBgClass} shadow-lg`}></div>
                )}
              </div>
            ))}

            <div className="pt-8 pb-2 px-4 uppercase text-[10px] font-black text-slate-600 tracking-[0.2em]">System</div>
            
            {[
              { id: 'settings', icon: 'settings', label: 'Settings' },
            ].map(item => (
              <div 
                key={item.id}
                onClick={() => setActiveTab(item.id)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold group
                  ${activeTab === item.id 
                    ? `bg-white/5 ${accentColorClass} ${accentBorderClass} shadow-inner` 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className={`material-symbols-outlined text-xl`}>{item.icon}</span>
                <span className="tracking-widest uppercase text-xs">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
        
        <div className="p-6 mt-auto">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-5 shadow-xl text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-slate-500 mb-2">memory</span>
            <p className="text-[10px] text-slate-400 mb-1 font-bold tracking-widest uppercase">{category} System</p>
            <p className="font-black text-slate-200 tracking-wider">v3.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#0a0a0a]">
        {/* Top Navbar */}
        <header className={`sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl px-8 py-5 flex items-center justify-between border-b border-[#222]`}>
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <GlobalSearch />
          </div>
          <SharedHeaderUserArea setActiveTab={setActiveTab}>
            <button onClick={() => setShowAddModal(true)} className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full ${accentBgClass} text-[#0a0a0a] font-bold text-xs tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 shadow-lg`}>
              <span className="material-symbols-outlined text-sm">add</span>
              Add Club
            </button>
          </SharedHeaderUserArea>
        </header>

        {/* Dynamic Inner Content Based on Tab */}
        <div className="relative z-10 w-full h-full">
          {activeTab === 'clubs' && children}
          
          {activeTab === 'events' && (
             <div className="p-8 md:p-12 max-w-[1400px] mx-auto animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                 <div>
                   <h2 className="text-5xl md:text-[64px] font-black tracking-tighter text-white mb-2 leading-none uppercase">Master Calendar</h2>
                   <div className="flex items-center gap-3">
                     <div className={`w-8 h-1 ${accentBgClass}`}></div>
                     <p className={`text-sm font-bold ${accentColorClass} tracking-[0.2em] uppercase`}>{category} Calendar</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => { setEditingEvent(null); setShowEventModal(true); }} className="px-6 py-2.5 rounded-full bg-[#111] border border-[#333] hover:bg-[#222] text-white font-bold text-xs tracking-widest uppercase transition-colors">Add Event</button>
                    <button onClick={() => setSelectedDate(null)} className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 shadow-lg">Show All</button>
                 </div>
               </div>
               <div className="grid lg:grid-cols-3 gap-8">
                 {/* Calendar Section */}
                 <div className="lg:col-span-1">
                   <div className="bg-[#111] border border-[#222] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full pointer-events-none" />
                     
                     <div className="flex justify-between items-center mb-8 relative z-10">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">May 2026</h3>
                       <div className="flex gap-2">
                         <button className="size-8 rounded-full bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center transition-colors border border-[#333]"><span className="material-symbols-outlined text-sm text-white">chevron_left</span></button>
                         <button className="size-8 rounded-full bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center transition-colors border border-[#333]"><span className="material-symbols-outlined text-sm text-white">chevron_right</span></button>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-7 gap-2 relative z-10">
                       {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                         <div key={d} className="text-center text-[10px] font-black text-slate-500 py-2 uppercase">{d}</div>
                       ))}
                       {Array.from({ length: 35 }).map((_, i) => {
                         const daysInMonth = 31;
                         const day = i - 4; // Starts on a Friday
                         const isCurrentMonth = day > 0 && day <= daysInMonth;
                         
                         const hasEvent = isCurrentMonth && events.some(e => e.day === day);
                         const isSelected = selectedDate === day;
                         
                         return (
                           <div 
                             key={i} 
                             onClick={() => isCurrentMonth && setSelectedDate(day)}
                             className={`aspect-square flex items-center justify-center rounded-lg text-sm font-bold
                               ${!isCurrentMonth ? 'text-[#333]' : 'text-slate-300'}
                               ${isCurrentMonth ? 'hover:bg-white/10 cursor-pointer transition-colors' : ''}
                               ${hasEvent ? `bg-white/5 ${accentColorClass} border ${accentBorderClass} shadow-lg` : ''}
                               ${isSelected ? `ring-2 ring-white bg-[#222]` : ''}
                             `}
                           >
                             {day > 0 && day <= daysInMonth ? day : ''}
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 </div>

                 {/* Events List View */}
                 <div className="lg:col-span-2 flex flex-col gap-4">
                   <div className="flex items-center justify-between px-2 mb-2">
                     <h3 className="text-sm font-bold text-slate-500 tracking-[0.2em] uppercase">
                       {selectedDate ? `Events for MAY ${selectedDate}` : 'Upcoming Events'}
                     </h3>
                     {selectedDate && <span className={`text-[10px] font-black tracking-widest uppercase ${accentColorClass}`}>{events.filter(e => e.day === selectedDate).length} Records</span>}
                   </div>
                   
                   {events.filter(e => selectedDate ? e.day === selectedDate : true).length === 0 ? (
                     <div className="p-10 border border-dashed border-[#333] rounded-[24px] text-center bg-[#0a0a0a]">
                       <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">No records found for parameters.</p>
                     </div>
                   ) : (
                     events
                     .filter(e => selectedDate ? e.day === selectedDate : true)
                     .sort((a,b) => a.day - b.day)
                     .map((ev, i) => (
                       <div onClick={() => { setEditingEvent(ev); setShowEventModal(true); }} key={ev.id || i} className="group flex flex-col sm:flex-row gap-6 p-6 rounded-[24px] bg-[#111] hover:bg-[#151515] transition-all border border-[#222] hover:border-[#444] cursor-pointer shadow-xl relative overflow-hidden">
                         <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 ${accentBgClass} transition-opacity`}></div>
                         
                         <div className="sm:w-24 shrink-0 flex flex-col sm:items-center sm:justify-center border-b sm:border-b-0 sm:border-r border-[#333] pb-4 sm:pb-0 sm:pr-6">
                           <span className={`${accentColorClass} font-black text-xl tracking-tighter uppercase`}>{ev.date}</span>
                           <span className="text-slate-500 text-xs font-bold tracking-widest">{ev.time ? ev.time.split(' ')[0] : 'TBD'}</span>
                         </div>
                         
                         <div className="flex-1 flex flex-col justify-center">
                           <div className="flex items-center gap-3 mb-2">
                             <span className="px-2.5 py-1 rounded bg-[#222] border border-[#333] text-white text-[10px] font-bold tracking-widest uppercase">{ev.type || 'Event'}</span>
                             <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase">{ev.org || 'System'}</span>
                           </div>
                           <h4 className="text-2xl font-black text-slate-200 group-hover:text-white transition-colors tracking-tighter uppercase leading-tight">{ev.title}</h4>
                         </div>
                         
                         <div className="hidden sm:flex items-center">
                           <div className="size-10 rounded-full border border-[#333] flex items-center justify-center text-slate-500 group-hover:text-white group-hover:border-white group-hover:bg-white/5 transition-all">
                             <span className="material-symbols-outlined text-[18px]">edit</span>
                           </div>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </div>
             </div>
          )}
          
          {activeTab === 'profile' && <ProfilePanel accentColorClass={accentColorClass} accentBgClass={accentBgClass} />}
          
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </main>

      {showAddModal && <AddClubModal onClose={() => setShowAddModal(false)} onAdd={(c: any) => { onAddClub(c); setShowAddModal(false); }} category={category} />}
      {showEventModal && <EventModal onClose={() => setShowEventModal(false)} onSave={handleSaveEvent} initialData={editingEvent} />}
    </div>
  );
};

export default SidebarLayout;
