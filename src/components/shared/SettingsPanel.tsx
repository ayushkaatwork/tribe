import React, { useState } from 'react';

const defaultSettings = {
  theme: true,
  notifications: true,
  privacy: false,
  recommendations: true,
  emailAlerts: true,
  eventReminders: true
};

export const SettingsPanel: React.FC = () => {
  const [toggles, setToggles] = useState(() => {
    const loaded = localStorage.getItem('tribe_settings');
    if (loaded) {
      try {
        return JSON.parse(loaded);
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof defaultSettings) => {
    setToggles((prev: typeof defaultSettings) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem('tribe_settings', JSON.stringify(toggles));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetSettings = () => {
    setToggles(defaultSettings);
    localStorage.removeItem('tribe_settings');
    setSaved(false);
  };

  const sections = [
    { title: 'Interface Protocol (Strict Monochrome)', id: 'theme', desc: 'Enforce strict monochrome aesthetics across environments.' },
    { title: 'Transmission Alerts', id: 'notifications', desc: 'Receive system pings for upcoming operations.' },
    { title: 'Ghost Protocol (Privacy)', id: 'privacy', desc: 'Hide operation history and metrics from public nodes.' },
    { title: 'Neural Recommendations', id: 'recommendations', desc: 'AI-driven suggestions for node engagement and clusters.' },
    { title: 'Email Despatches', id: 'emailAlerts', desc: 'Receive urgent comms via external email protocol.' },
    { title: 'Chronological Reminders', id: 'eventReminders', desc: 'Push notifications 24 hours prior to designated events.' }
  ] as const;

  return (
    <div className="p-8 md:p-12 max-w-[1000px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <div>
          <h2 className="text-5xl md:text-[64px] font-black tracking-tighter text-white mb-2 leading-none uppercase">System Config</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-white"></div>
            <p className="text-sm font-bold text-slate-400 tracking-[0.2em] uppercase">Global Application Preferences</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={resetSettings}
            className="px-8 py-3 rounded-full bg-[#111] hover:bg-[#222] border border-[#333] text-white font-bold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95"
          >
            Reset
          </button>
          <button 
            onClick={saveSettings}
            className="px-8 py-3 rounded-full bg-white text-black font-bold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95 hover:bg-slate-200"
          >
            {saved ? 'Committed!' : 'Commit Changes'}
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {sections.map(sec => (
          <div key={sec.id} className="flex items-center justify-between p-8 bg-[#111] border border-[#222] rounded-2xl shadow-xl hover:border-[#444] transition-colors">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-black tracking-tighter text-white uppercase">{sec.title}</h3>
              <p className="text-sm font-medium text-slate-500">{sec.desc}</p>
            </div>
            
            <button 
              onClick={() => toggle(sec.id)}
              className={`w-16 h-8 rounded-full relative transition-colors duration-300 border ${toggles[sec.id] ? 'bg-white border-white' : 'bg-[#0a0a0a] border-[#333]'}`}
            >
              <div 
                className={`w-6 h-6 rounded-full bg-[#111] absolute top-1 transition-transform duration-300 ${toggles[sec.id] ? 'translate-x-9' : 'translate-x-1'}`}
              ></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPanel;
