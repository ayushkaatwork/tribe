import React, { useState, useMemo } from 'react';
import { mockData } from '../data/mockData';
import { Link } from 'react-router-dom';
import cardBgImage from '../assets/card-bg.jpg';
import EventModal from '../components/shared/EventModal';
import { EventDetailDrawer } from '../components/shared/EventDetailDrawer';
import { SettingsPanel } from '../components/shared/SettingsPanel';
import { ClubDiscoveryAssistant } from '../components/shared/ClubDiscoveryAssistant';
import { SharedHeaderUserArea } from '../components/shared/SharedHeaderUserArea';
import { ProfilePanel } from '../components/shared/ProfilePanel';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const FloatingGalacticSpace = ({ count = 3000 }) => {
  const ref = React.useRef<any>(null);
  const [positions] = useState<any>(() => random.inSphere(new Float32Array(count * 3), { radius: 10 }));
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#ffffff" size={0.015} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
      </Points>
    </group>
  );
};

interface DashboardProps {
  readonly children?: React.ReactNode;
  readonly className?: string;
}

export interface TribeEvent {
  id?: string;
  date: string;
  day: number;
  month?: number;
  year?: number;
  time?: string;
  title: string;
  org?: string;
  type?: string;
  description?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  className = '',
  ...props
}) => {
  const { dashboard, globalEvents } = mockData;

  // Synthesize master events array from all possible club events + global events
  const masterEvents = useMemo(() => {
    let combined: TribeEvent[] = [...(globalEvents || [])];
    
    // Inject cultural events dynamically to ensure the calendar is heavily populated
    if (mockData.culturalClubs) {
      mockData.culturalClubs.forEach((club: any) => {
        if (club.upcomingEvents) {
          club.upcomingEvents.forEach((ev: any) => {
            const match = ev.date?.match(/(\w+)\s+(\d+)/);
            if (match) {
              combined.push({
                id: `cultural-${club.name}-${match[2]}`,
                title: ev.title,
                org: club.name,
                type: 'Cultural',
                date: `MAY ${match[2]}`,
                day: parseInt(match[2]),
                month: 5,
                year: 2026,
                description: `${club.name} is hosting ${ev.title}. Join the community to participate.`
              });
            }
          });
        }
      });
    }

    // Sort to keep timeline chronologically stable
    return combined.sort((a,b) => a.day - b.day);
  }, [globalEvents]);

  const [events, setEvents] = useState<TribeEvent[]>(() => {
    const saved = localStorage.getItem('tribe_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved local events with the synthesized mock data
        return [...masterEvents, ...parsed].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
      } catch {
        return masterEvents;
      }
    }
    return masterEvents;
  });

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<TribeEvent | null>(null);
  const [viewingEvent, setViewingEvent] = useState<TribeEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDiscoveryAssistant, setShowDiscoveryAssistant] = useState(false);
  
  // Master Calendar Overlay State
  const [showMasterCalendar, setShowMasterCalendar] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState('All');

  const saveEvents = (newEvents: TribeEvent[]) => {
    setEvents(newEvents);
    // Only persist custom created ones ideally to save quota, but for mock purposes we'll stringify
    localStorage.setItem('tribe_events', JSON.stringify(newEvents));
  };

  const handleSaveEvent = (eventData: TribeEvent) => {
    const exists = events.find((e) => e.id === eventData.id);
    let updated;
    if (exists) {
      updated = events.map((e) => e.id === eventData.id ? eventData : e);
    } else {
      updated = [...events, eventData];
    }
    saveEvents(updated);
    setShowEventModal(false);
  };

  const filteredMasterEvents = events.filter(e => calendarFilter === 'All' ? true : e.type?.toLowerCase() === calendarFilter.toLowerCase());

  return (
    <div className={`relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-[#0a0a0a] text-slate-100 ${className}`} {...props}>
      {/* Premium Ambient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/5 blur-[200px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-[#222] px-6 md:px-12 py-5 shadow-2xl">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform">
              <span className="text-black font-black text-xl">T</span>
            </div>
            <button 
              onClick={() => setShowDiscoveryAssistant(true)}
              className="hidden sm:flex items-center px-6 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase bg-[#111] border border-[#333] text-slate-300 rounded-full hover:bg-white hover:text-black hover:border-white transition-all shadow-lg active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-[14px] mr-2">smart_toy</span>
              UNSURE WHAT TO JOIN?
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowMasterCalendar(true)}
              className="px-6 py-2.5 rounded-full bg-[#111] hover:bg-white hover:text-black border border-[#333] hover:border-white text-slate-300 flex items-center gap-3 transition-all tracking-widest text-[10px] font-black uppercase shadow-lg active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span className="hidden sm:inline">Master Calendar</span>
            </button>
            <div className="w-px h-6 bg-[#333] mx-2"></div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`size-10 rounded-full flex items-center justify-center transition-all border ${showSettings ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-[#111] border-[#333] text-slate-300 hover:text-white hover:border-slate-500 hover:bg-[#222]'}`}
            >
              <span className="material-symbols-outlined text-sm">{showSettings ? 'close' : 'settings'}</span>
            </button>
            <SharedHeaderUserArea setActiveTab={(tab) => { if (tab === 'profile') setShowProfileModal(true) }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto w-full px-6 md:px-12 py-12 flex-1 flex flex-col relative z-20">
        {showSettings ? (
          <SettingsPanel />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* Premium Hero Section */}
            <section className="relative p-12 lg:p-20 rounded-[40px] bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#222] overflow-hidden mb-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] group h-[400px] flex flex-col justify-center">
              {/* Subtle 3D Depth Layer */}
              <div className="absolute inset-0 z-0 mix-blend-screen opacity-50">
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <FloatingGalacticSpace />
                </Canvas>
              </div>

              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-screen group-hover:scale-105 group-hover:opacity-20 transition-all duration-1000 z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80 z-0" />
              
              <div className="relative z-10 flex flex-col items-start max-w-3xl pointer-events-none">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/50 border border-white/10 text-white text-[10px] font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-md shadow-2xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                  Active Control Center
                </div>
                
                <h1 className="text-5xl sm:text-6xl md:text-[80px] font-black mb-6 tracking-tighter uppercase leading-[0.9] text-white drop-shadow-2xl">
                  {dashboard.hero.title}
                </h1>
                
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium mb-10 border-l-2 border-red-600/50 pl-6 bg-gradient-to-r from-red-600/5 to-transparent py-2">
                  {dashboard.hero.description}
                </p>
              </div>
            </section>

            {/* Dimensional Portal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
              {dashboard.cards.map((card) => (
                <Link
                  key={card.id}
                  to={card.path}
                  className="group relative overflow-hidden rounded-[40px] bg-[#0a0a0a] border border-[#222] p-8 md:p-10 flex flex-col justify-between min-h-[460px] cursor-pointer shadow-2xl hover:border-slate-500 hover:shadow-[0_20px_80px_rgba(255,255,255,0.05)] hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Cinematic Background Layer */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center z-0 opacity-10 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700 mix-blend-luminosity grayscale group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${cardBgImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent z-0" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientClass} z-0 opacity-20 group-hover:opacity-60 transition-opacity duration-500`} />

                  {/* Watermark Icon */}
                  <div className="absolute top-0 right-[-10%] p-8 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700 group-hover:scale-125 transform origin-center mix-blend-screen pointer-events-none">
                    <span className={`material-symbols-outlined text-[200px] ${card.textClass}`}>{card.bgIcon}</span>
                  </div>

                  {/* Content Hub */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="size-16 rounded-2xl flex items-center justify-center mb-auto border border-white/10 bg-black/40 backdrop-blur-xl text-white shadow-2xl group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                    </div>
                    
                    <div className="mt-8 transition-transform duration-500 group-hover:translate-y-[-10px]">
                      <h3 className="text-3xl lg:text-4xl font-black mb-4 uppercase tracking-tighter text-white drop-shadow-lg">{card.title}</h3>
                      <p className="text-slate-400 leading-relaxed font-medium text-sm mb-8 line-clamp-3 group-hover:text-slate-200 transition-colors">{card.description}</p>
                      
                      <div className="flex items-center gap-4 border-t border-[#333] pt-6 group-hover:border-white/30 transition-colors">
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white group-hover:text-red-500 transition-colors">
                          Deploy Module
                        </span>
                        <div className="size-8 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PREMIUM INTERACTIVE DASHBOARD CALENDAR */}
            <section className="mb-12 p-8 md:p-12 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#222] rounded-[40px] shadow-2xl relative overflow-hidden group hover:border-[#333] transition-colors">
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 relative z-10">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 uppercase drop-shadow-lg">Global Intel</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]"></div>
                    <p className="text-xs font-black text-slate-400 tracking-[0.3em] uppercase">Event Calendar</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => { setEditingEvent(null); setShowEventModal(true); }} className="px-8 py-3 rounded-2xl bg-[#0a0a0a] border border-[#333] text-white font-black text-[10px] tracking-widest uppercase hover:bg-[#222] hover:border-slate-500 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:scale-95">
                    New Action
                  </button>
                  <button onClick={() => setShowMasterCalendar(true)} className="px-8 py-3 rounded-2xl bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase hover:bg-slate-200 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)] active:scale-95">
                    Execute Master View
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-16 relative z-10">
                {/* Visual Interactive Month Grid */}
                <div className="lg:col-span-1">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#333] cursor-pointer group-hover:border-slate-500 max-w-[300px]" onClick={() => setShowMasterCalendar(true)}>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-red-500 transition-colors">May 2026</h3>
                     <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">open_in_new</span>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-3 max-w-[300px]">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
                      <div key={index} className="text-center text-[10px] font-black text-slate-600 py-2 uppercase">{d}</div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const daysInMonth = 31;
                      const day = i - 4; 
                      const isCurrentMonth = day > 0 && day <= daysInMonth;
                      const dayEvents = isCurrentMonth ? events.filter(e => e.day === day) : [];
                      const hasEvent = dayEvents.length > 0;
                      const isSelected = selectedDate === day;
                      
                      return (
                        <div 
                          key={i} 
                          onClick={() => {
                            if(isCurrentMonth) {
                              if(hasEvent) setSelectedDate(day);
                              else setShowMasterCalendar(true); // Pop open the master calendar for deep browsing
                            }
                          }}
                          className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all
                            ${!isCurrentMonth ? 'text-transparent cursor-default pointer-events-none' : 'text-slate-400 hover:bg-[#222] cursor-pointer hover:-translate-y-1 hover:shadow-lg'}
                            ${hasEvent ? 'bg-[#222] text-white border border-[#444] shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-[#0a0a0a] border border-[#1a1a1a]'}
                            ${isSelected ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110 z-10' : ''}
                          `}
                        >
                          {isCurrentMonth ? day : ''}
                          {hasEvent && !isSelected && <div className="mt-1 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(220,38,38,0.8)]"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Event Sidebar Details */}
                <div className="lg:col-span-2 flex flex-col h-full border-l border-[#222] pl-0 lg:pl-16">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">
                        {selectedDate ? `Telemetry Log: MAY ${selectedDate}` : 'Upcoming Architecture'}
                     </h3>
                     {selectedDate && (
                       <button onClick={() => setSelectedDate(null)} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:text-white transition-colors">Clear Filter</button>
                     )}
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[360px]">
                    {events.filter(e => selectedDate ? e.day === selectedDate : true).length === 0 ? (
                      <div className="flex-1 border border-dashed border-[#333] rounded-[32px] flex flex-col items-center justify-center p-12 bg-[#0a0a0a]/50">
                         <span className="material-symbols-outlined text-4xl text-slate-700 mb-4">radar</span>
                         <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">No telemetry detected.</p>
                      </div>
                    ) : (
                      events
                      .filter(e => selectedDate ? e.day === selectedDate : true)
                      .slice(0, selectedDate ? undefined : 4)
                      .map((ev, i) => (
                        <div key={ev.id || i} onClick={() => setViewingEvent(ev)} className="group flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-[24px] bg-[#0a0a0a] border border-[#222] hover:border-[#555] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                          
                          <div className="w-20 shrink-0 flex flex-col justify-center border-l-2 border-red-600 pl-4">
                            <span className="text-white font-black text-2xl tracking-tighter leading-none mb-1">{ev.date.split(' ')[1]}</span>
                            <span className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">{ev.date.split(' ')[0]}</span>
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="px-2.5 py-1 rounded-md bg-[#222] text-slate-300 text-[9px] font-black tracking-widest uppercase border border-[#333]">{ev.type || 'Event'}</span>
                              <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase">{ev.org || 'System Core'}</span>
                            </div>
                            <h4 className="text-lg font-black text-white tracking-tighter uppercase leading-tight line-clamp-1">{ev.title}</h4>
                          </div>
                          
                          <div className="shrink-0 size-12 rounded-full border border-[#333] flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </div>

                        </div>
                      ))
                    )}

                    {!selectedDate && events.length > 4 && (
                      <button onClick={() => setShowMasterCalendar(true)} className="mt-4 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 hover:text-black hover:bg-white transition-all text-center w-full bg-[#111] border border-[#333] rounded-[24px] shadow-lg">
                         Load Full Event Calendar ({events.length} Modules)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* MASTER UNIFIED CALENDAR OVERLAY */}
      {showMasterCalendar && (
        <div className="fixed inset-0 z-[200] bg-[#0a0a0a]/95 backdrop-blur-3xl flex flex-col p-4 md:p-12 lg:p-16 overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
          <div className="max-w-[1400px] w-full mx-auto relative flex flex-col h-full bg-[#111] border border-[#333] rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden">
            
            {/* Overlay Header */}
            <header className="px-10 py-8 border-b border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0a0a0a]">
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 uppercase">Unified Calendar</h2>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">All Nodes & Divisions</p>
                </div>
              </div>
              <button onClick={() => setShowMasterCalendar(false)} className="absolute top-8 right-10 size-12 rounded-full bg-[#222] hover:bg-red-600 border border-[#444] hover:border-red-500 text-white flex items-center justify-center transition-all group z-50">
                <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">close</span>
              </button>
            </header>

            {/* Filter Hub */}
            <div className="px-10 py-6 border-b border-[#222] bg-[#111] flex overflow-x-auto custom-scrollbar gap-4">
              {['All', 'Technical', 'Cultural', 'Sports', 'Summit', 'Workshop'].map(cat => (
                <button 
                  key={cat} onClick={() => setCalendarFilter(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase whitespace-nowrap transition-all border ${calendarFilter === cat ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-[#0a0a0a] text-slate-400 border-[#333] hover:border-slate-400 hover:text-white'}`}
                >
                  {cat} Calendar
                </button>
              ))}
            </div>

            {/* Event List / Detail Expansion */}
            <div className="flex-1 overflow-y-auto p-10 bg-[#0a0a0a] custom-scrollbar grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredMasterEvents.length === 0 ? (
                 <div className="col-span-full py-32 flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-[80px] text-slate-800 mb-6">event_busy</span>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-600">No telemetry recorded</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">Try adjusting the databank filters.</p>
                 </div>
               ) : (
                 filteredMasterEvents.map((ev, idx) => (
                    <div key={ev.id || idx} className="bg-[#111] border border-[#222] hover:border-white/30 rounded-[32px] p-8 flex flex-col group transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col border-l-2 border-red-600 pl-4">
                          <span className="text-white font-black text-3xl tracking-tighter leading-none mb-1">{ev.date.split(' ')[1]}</span>
                          <span className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">{ev.date.split(' ')[0]} 2026</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-600 group-hover:text-white transition-colors text-3xl">event</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-md bg-[#222] text-white text-[9px] font-black tracking-widest uppercase border border-[#333]">{ev.type || 'System Event'}</span>
                        <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase bg-[#0a0a0a] px-3 py-1 rounded-md border border-[#222]">{ev.org || 'Global'}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 line-clamp-2">{ev.title}</h3>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 flex-1">{ev.description || "Details rendering. Check back momentarily for comprehensive event structure."}</p>
                      
                      <button onClick={() => setViewingEvent(ev)} className="w-full py-4 rounded-xl bg-[#222] hover:bg-white hover:text-black text-[10px] font-black tracking-[0.2em] text-white uppercase transition-all mt-auto flex items-center justify-center gap-3 border border-[#333]">
                        Expand File <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </div>
                 ))
               )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto px-10 py-8 border-t border-[#222] bg-[#0a0a0a] relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">© 2026 TRIBE ECOSYSTEM. ALL SYSTEMS OPERATIONAL.</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Protocol</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>

      {showEventModal && <EventModal onClose={() => setShowEventModal(false)} onSave={handleSaveEvent} initialData={editingEvent} />}
      {viewingEvent && <EventDetailDrawer event={viewingEvent} onClose={() => setViewingEvent(null)} />}
      {showDiscoveryAssistant && <ClubDiscoveryAssistant onClose={() => setShowDiscoveryAssistant(false)} />}
      
      {showProfileModal && (
        <div className="fixed inset-0 z-[700] bg-[#0a0a0a]/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300 overflow-y-auto custom-scrollbar">
          <div className="absolute top-8 right-8 z-[710]">
            <button onClick={() => setShowProfileModal(false)} className="size-12 rounded-full bg-[#111] hover:bg-white text-slate-400 hover:text-black border border-[#333] flex items-center justify-center transition-all group shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">close</span>
            </button>
          </div>
          <div className="w-full max-w-[1000px] my-auto bg-[#111] border border-[#222] rounded-[32px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative">
            <ProfilePanel accentColorClass="text-red-500" accentBgClass="bg-red-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
