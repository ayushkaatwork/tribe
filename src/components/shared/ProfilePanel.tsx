import React, { useState, useEffect, useRef } from 'react';

interface ProfileData {
  name: string;
  email: string;
  year: string;
  department: string;
  phone: string;
  bio: string;
  skills: string;
  avatar: string;
}

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  year: '',
  department: '',
  phone: '',
  bio: '',
  skills: '',
  avatar: '' 
};

export const ProfilePanel: React.FC<{ accentColorClass?: string, accentBgClass?: string }> = ({ 
  accentColorClass = 'text-white', 
  accentBgClass = 'bg-white' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('tribe_user_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        // error parsing
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('tribe_user_profile', JSON.stringify(profile));
    setIsEditing(false);
    setShowToast(true);
    window.dispatchEvent(new Event('profile_updated'));
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    const saved = localStorage.getItem('tribe_user_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setProfile(DEFAULT_PROFILE);
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfile(prev => ({ ...prev, avatar: '' }));
  };

  const isProfileEmpty = !profile.name && !profile.department;
  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '👤';

  return (
    <div className="p-8 md:p-12 max-w-[1000px] mx-auto animate-in fade-in duration-500 font-display">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-10 right-10 bg-white text-black px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_10px_40px_rgba(255,255,255,0.2)] animate-in slide-in-from-bottom-5 fade-in z-50">
          <span className="material-symbols-outlined text-green-600">check_circle</span>
          Profile Successfully Updated
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <div>
          <h2 className="text-5xl md:text-[64px] font-black tracking-tighter text-white mb-2 leading-none uppercase">
            My Profile
          </h2>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-1 ${accentBgClass}`}></div>
            <p className={`text-sm font-bold ${accentColorClass} tracking-[0.2em] uppercase`}>
              {isProfileEmpty ? 'Complete Your Setup' : 'Personal Data'}
            </p>
          </div>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-8 py-3 rounded-full bg-[#111] text-white border border-[#333] hover:bg-white hover:text-black font-bold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={handleReset}
              className="px-6 py-3 rounded-full bg-[#0a0a0a] text-slate-400 border border-[#333] hover:text-white font-bold text-xs tracking-widest uppercase transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-3 rounded-full bg-white text-black font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Save
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-12 bg-[#111] border border-[#222] p-10 rounded-[32px] relative overflow-hidden shadow-2xl">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>
        
        {/* Left: Photo Upload */}
        <div className="flex flex-col items-center gap-6 relative z-10 shrink-0">
          <div className="size-48 rounded-full border-4 border-[#222] overflow-hidden p-2 bg-[#0a0a0a] relative group">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-[#1a1a1a] rounded-full flex items-center justify-center text-4xl text-slate-600 font-bold">
                {initials}
              </div>
            )}
            
            {isEditing && (
              <div onClick={() => fileInputRef.current?.click()} className="absolute inset-2 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                <span className="material-symbols-outlined text-white text-2xl mb-1">photo_camera</span>
                <span className="text-[9px] text-white font-black uppercase tracking-widest">Change</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            accept="image/png, image/jpeg, image/jpg" 
            className="hidden" 
          />
          {isEditing && (
            <div className="flex flex-col gap-3 w-full max-w-[160px]">
              <button onClick={() => fileInputRef.current?.click()} className="w-full px-6 py-2.5 rounded-full border border-[#333] bg-[#111] text-[9px] font-black tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg">
                <span className="material-symbols-outlined text-[14px]">upload</span> Upload
              </button>
              {profile.avatar && (
                <button onClick={handleRemovePhoto} className="w-full px-6 py-2.5 rounded-full border border-red-900/50 bg-red-950/20 text-red-500 text-[9px] font-black tracking-[0.2em] uppercase hover:bg-red-600 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg">
                  <span className="material-symbols-outlined text-[14px]">delete</span> Remove
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Editable Form */}
        <div className="flex-1 flex flex-col gap-8 relative z-10">
          
          {isProfileEmpty && !isEditing && (
             <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-2xl flex flex-col items-center justify-center text-center py-12">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-4">person_add</span>
                <h3 className="text-xl font-black uppercase text-white tracking-widest mb-2">Profile Incomplete</h3>
                <p className="text-sm font-medium text-slate-400 mb-6">Setup your TRIBE identity to seamlessly join and register for clubs.</p>
                <button onClick={() => setIsEditing(true)} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-slate-200 transition-colors">
                  Setup Profile
                </button>
             </div>
          )}

          {(!isProfileEmpty || isEditing) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Full Name</label>
                  {isEditing ? (
                    <input placeholder="Enter full name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-[#050505] border border-[#333] p-4 rounded-xl text-white font-bold outline-none focus:border-white transition-colors uppercase tracking-tight" />
                  ) : (
                    <p className="text-2xl font-black text-white tracking-tighter uppercase leading-none min-h-[32px]">{profile.name || 'Not Provided'}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Email / Comms</label>
                  {isEditing ? (
                    <input placeholder="Enter email address" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="bg-[#050505] border border-[#333] p-4 rounded-xl text-white font-bold outline-none focus:border-white transition-colors" />
                  ) : (
                    <p className="text-base font-bold text-slate-300 min-h-[28px]">{profile.email || '—'}</p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Department</label>
                  {isEditing ? (
                    <select value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})} className="bg-[#050505] border border-[#333] p-4 rounded-xl text-white font-bold outline-none focus:border-white transition-colors uppercase tracking-tight appearance-none">
                      <option value="" disabled>Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Information Tech">Information Tech</option>
                    </select>
                  ) : (
                    <p className="text-lg font-bold text-slate-300 uppercase min-h-[28px]">{profile.department || '—'}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Year</label>
                  {isEditing ? (
                    <select value={profile.year} onChange={e => setProfile({...profile, year: e.target.value})} className="bg-[#050505] border border-[#333] p-4 rounded-xl text-white font-bold outline-none focus:border-white transition-colors uppercase tracking-tight appearance-none">
                      <option value="" disabled>Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  ) : (
                    <p className="text-lg font-bold text-slate-300 uppercase min-h-[28px]">{profile.year ? `${profile.year}${profile.year==='1'?'st':profile.year==='2'?'nd':profile.year==='3'?'rd':'th'} Year` : '—'}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Phone Number</label>
                  {isEditing ? (
                    <input type="tel" placeholder="+1..." value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="bg-[#050505] border border-[#333] p-4 rounded-xl text-white font-bold outline-none focus:border-white transition-colors uppercase tracking-tight" />
                  ) : (
                    <p className="text-sm font-medium text-slate-400 min-h-[20px]">{profile.phone || '—'}</p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Bio / Objective</label>
                  {isEditing ? (
                    <textarea placeholder="Write a short summary about yourself..." value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="bg-[#050505] border border-[#333] p-4 rounded-xl text-white font-medium outline-none focus:border-white transition-colors h-24 resize-none" />
                  ) : (
                    <p className="text-sm font-medium text-slate-400 min-h-[20px]">{profile.bio || '—'}</p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Skills & Interests (Comma separated)</label>
                  {isEditing ? (
                    <input placeholder="React, UI Design, Robotics..." value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} className="bg-[#050505] border border-[#333] p-4 rounded-xl text-white font-bold outline-none focus:border-white transition-colors uppercase tracking-tight" />
                  ) : (
                    <div className="flex flex-wrap gap-2 min-h-[20px]">
                      {profile.skills ? profile.skills.split(',').map((s, idx) => s.trim() && (
                        <span key={idx} className="px-3 py-1 bg-[#1a1a1a] border border-[#333] rounded-md text-[9px] font-black uppercase tracking-widest text-white">{s.trim()}</span>
                      )) : <span className="text-slate-500 text-sm italic">None added</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-8 border-t border-[#222]">
                <h3 className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-4">Joined Clubs</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-[#050505] border border-[#333] rounded-lg text-xs font-bold text-slate-500 italic tracking-wide">
                    You haven't joined any clubs yet. Explore the dashboard to discover.
                  </span>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
