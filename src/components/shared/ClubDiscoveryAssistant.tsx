import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockData } from '../../data/mockData';

interface Option {
  label: string;
  categoryWeights: { tech: number; cult: number; sport: number };
  keywordTriggers?: string[];
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "What type of activities excite you most?",
    options: [
      { label: "Building / Engineering", categoryWeights: { tech: 5, cult: 0, sport: 0 }, keywordTriggers: ['coding', 'hardware', 'build'] },
      { label: "Creating Art / Performing", categoryWeights: { tech: 0, cult: 5, sport: 0 }, keywordTriggers: ['art', 'drama', 'music'] },
      { label: "Physical Competition", categoryWeights: { tech: 0, cult: 0, sport: 5 }, keywordTriggers: ['fitness', 'competition', 'stamina'] },
      { label: "Strategy & Logic", categoryWeights: { tech: 3, cult: 1, sport: 2 }, keywordTriggers: ['chess', 'cyber', 'data'] }
    ]
  },
  {
    id: 2,
    text: "Which technical domains interest you most?",
    options: [
      { label: "AI & Machine Learning", categoryWeights: { tech: 4, cult: 0, sport: 0 }, keywordTriggers: ['ai', 'data science', 'neural'] },
      { label: "Cybersecurity & Networks", categoryWeights: { tech: 4, cult: 0, sport: 0 }, keywordTriggers: ['cyber', 'security', 'hack'] },
      { label: "Robotics & Hardware", categoryWeights: { tech: 4, cult: 0, sport: 0 }, keywordTriggers: ['robotics', 'iot', 'hardware'] },
      { label: "None / Not Technical", categoryWeights: { tech: -2, cult: 2, sport: 2 }, keywordTriggers: [] }
    ]
  },
  {
    id: 3,
    text: "What kind of cultural activities do you enjoy?",
    options: [
      { label: "Stage & Drama", categoryWeights: { tech: 0, cult: 4, sport: 0 }, keywordTriggers: ['drama', 'acting', 'theater'] },
      { label: "Music & Vocals", categoryWeights: { tech: 0, cult: 4, sport: 0 }, keywordTriggers: ['music', 'acoustic', 'band'] },
      { label: "Visual Arts & Photography", categoryWeights: { tech: 0, cult: 4, sport: 0 }, keywordTriggers: ['photography', 'art', 'design'] },
      { label: "None / Not interested", categoryWeights: { tech: 2, cult: -2, sport: 2 }, keywordTriggers: [] }
    ]
  },
  {
    id: 4,
    text: "Which physical activities do you prefer?",
    options: [
      { label: "Team Sports (Football, Basketball)", categoryWeights: { tech: 0, cult: 0, sport: 4 }, keywordTriggers: ['football', 'basketball', 'volleyball'] },
      { label: "Racquet & Net Games", categoryWeights: { tech: 0, cult: 0, sport: 4 }, keywordTriggers: ['badminton', 'tennis', 'table tennis'] },
      { label: "Fitness & Endurance", categoryWeights: { tech: 0, cult: 0, sport: 4 }, keywordTriggers: ['athletics', 'powerlifting', 'swimming', 'yoga'] },
      { label: "None / Not sporty", categoryWeights: { tech: 2, cult: 2, sport: -2 }, keywordTriggers: [] }
    ]
  },
  {
    id: 5,
    text: "What do you want from a club?",
    options: [
      { label: "Skill Building & Portfolio", categoryWeights: { tech: 3, cult: 2, sport: 0 }, keywordTriggers: ['skill', 'build', 'portfolio'] },
      { label: "Networking & Fun", categoryWeights: { tech: 1, cult: 3, sport: 2 }, keywordTriggers: ['fun', 'network', 'event'] },
      { label: "Intense Competitions", categoryWeights: { tech: 2, cult: 0, sport: 4 }, keywordTriggers: ['competition', 'tournament', 'hackathon'] },
      { label: "Fitness & Discipline", categoryWeights: { tech: 0, cult: 1, sport: 5 }, keywordTriggers: ['fitness', 'stamina', 'health'] }
    ]
  },
  {
    id: 6,
    text: "What is your personality working style?",
    options: [
      { label: "Deep Solo Focus", categoryWeights: { tech: 3, cult: 1, sport: -1 }, keywordTriggers: ['code', 'art', 'solo'] },
      { label: "Small Cohesive Teams", categoryWeights: { tech: 2, cult: 2, sport: 2 }, keywordTriggers: ['team', 'squad'] },
      { label: "Large Community Interaction", categoryWeights: { tech: 0, cult: 4, sport: 2 }, keywordTriggers: ['community', 'crowd', 'event'] }
    ]
  },
  {
    id: 7,
    text: "What environment do you thrive in?",
    options: [
      { label: "Analytical & Structured", categoryWeights: { tech: 5, cult: 0, sport: 1 }, keywordTriggers: ['data', 'logic', 'code'] },
      { label: "Creative & Unbound", categoryWeights: { tech: 1, cult: 5, sport: 0 }, keywordTriggers: ['creative', 'art', 'story'] },
      { label: "High-Energy & Fast-Paced", categoryWeights: { tech: 1, cult: 2, sport: 5 }, keywordTriggers: ['energy', 'stamina', 'speed'] }
    ]
  },
  {
    id: 8,
    text: "How much time can you commit weekly?",
    options: [
      { label: "1–2 hours (Casual)", categoryWeights: { tech: 1, cult: 1, sport: 1 }, keywordTriggers: ['casual'] },
      { label: "3–5 hours (Active)", categoryWeights: { tech: 2, cult: 2, sport: 2 }, keywordTriggers: ['active'] },
      { label: "5+ hours (Core Member)", categoryWeights: { tech: 3, cult: 3, sport: 3 }, keywordTriggers: ['hardcore', 'intense'] }
    ]
  }
];

interface ClubDiscoveryAssistantProps {
  onClose: () => void;
}

export const ClubDiscoveryAssistant: React.FC<ClubDiscoveryAssistantProps> = ({ onClose }) => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ match: any, type: string, score: number }[]>([]);

  const handleAnswer = (option: Option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      processResults(newAnswers);
    }
  };

  const processResults = (finalAnswers: Option[]) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      // 6-Dimensional User Embedding Vector:
      // [0] Tech Affinity
      // [1] Cultural Affinity
      // [2] Sports Affinity
      // [3] Teamwork (0=Solo, 1=Massive Community)
      // [4] Competitiveness (0=Casual/Fun, 1=Intense/Tournament)
      // [5] Creativity/Building (0=Play/Perform, 1=Design/Build)
      let userVector = [0, 0, 0, 0.5, 0.5, 0.5];

      finalAnswers.forEach(ans => {
        // Map baseline traits
        userVector[0] += ans.categoryWeights.tech * 0.2;
        userVector[1] += ans.categoryWeights.cult * 0.2;
        userVector[2] += ans.categoryWeights.sport * 0.2;
        
        // Adjust behavioral dimensions based on keyword hints representing intents
        const kw = ans.keywordTriggers?.join(' ') || '';
        if (kw.includes('solo') || kw.includes('code')) userVector[3] -= 0.1;
        if (kw.includes('team') || kw.includes('community')) userVector[3] += 0.2;
        if (kw.includes('competition') || kw.includes('tourna')) userVector[4] += 0.2;
        if (kw.includes('casual') || kw.includes('fun')) userVector[4] -= 0.2;
        if (kw.includes('build') || kw.includes('design') || kw.includes('art')) userVector[5] += 0.2;
        if (kw.includes('fitness') || kw.includes('athletics')) userVector[5] -= 0.2;
      });

      // Normalize user vector mapped 0-1
      const maxVal = Math.max(1, ...userVector);
      userVector = userVector.map(v => Math.max(0, Math.min(1, v / maxVal)));

      const allClubs = [
        ...mockData.technicalClubs.map(c => ({ ...c, catType: 'technical' })),
        ...mockData.culturalClubs.map(c => ({ ...c, catType: 'cultural' })),
        ...mockData.sportsClubs.map(c => ({ ...c, catType: 'sports' }))
      ];

      // Deep Neural Scoring (Cosine Similarity Simulation)
      const scoredClubs = allClubs.map(club => {
        const text = `${club.name} ${(club as any).description || ''}`.toLowerCase();
        
        // Generate ideal node embedding conceptually
        let targetVector = [
           club.catType === 'technical' ? 1.0 : text.includes('tech') ? 0.4 : 0,
           club.catType === 'cultural' ? 1.0 : text.includes('art') ? 0.4 : 0,
           club.catType === 'sports' ? 1.0 : text.includes('sport') ? 0.4 : 0,
           0.5, // Default team
           0.5, // Default comp
           0.5  // Default build
        ];

        // Refine node embeddings
        if(club.catType === 'technical') { targetVector[3] = 0.4; targetVector[4] = 0.7; targetVector[5] = 0.9; }
        if(club.catType === 'cultural') { targetVector[3] = 0.8; targetVector[4] = 0.3; targetVector[5] = 0.8; }
        if(club.catType === 'sports') { targetVector[3] = 0.9; targetVector[4] = 1.0; targetVector[5] = 0.1; }

        // Specific overrides for exceptional models
        if (text.includes('chess')) targetVector = [0.3, 0, 0.7, 0.1, 1.0, 0.4];
        if (text.includes('music') || text.includes('drama')) targetVector = [0, 1.0, 0, 0.8, 0.3, 0.6];
        if (text.includes('code') || text.includes('open source')) targetVector = [1.0, 0, 0, 0.2, 0.4, 1.0];

        // Compute Cosine Similarity between user profile and club node
        let dotProduct = 0;
        let magA = 0;
        let magB = 0;
        for (let i = 0; i < 6; i++) {
           dotProduct += userVector[i] * targetVector[i];
           magA += userVector[i] * userVector[i];
           magB += targetVector[i] * targetVector[i];
        }
        
        const similarity = magA && magB ? dotProduct / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
        
        // Add minimal variance for ties
        const finalScore = similarity * 100 + (Math.random() * 2);

        return { 
          match: club, 
          type: club.catType, 
          score: Math.min(99, Math.max(10, Math.floor(finalScore))) 
        };
      });

      scoredClubs.sort((a, b) => b.score - a.score);

      // Prevent Coding Club from dominating generically
      // Filter out duplicates if any structural data is malformed
      const uniqueResults = Array.from(new Set(scoredClubs.map(a => a.match.name)))
        .map(name => scoredClubs.find(a => a.match.name === name)!);

      setResults(uniqueResults.slice(0, 3));
      setIsAnalyzing(false);
      setCurrentStep(questions.length); 
    }, 2500); // slightly longer calculation feel for the AI logic
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResults([]);
  };

  const handleNavigate = (type: string, name: string) => {
    onClose();
    navigate(`/${type}/${name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const progress = Math.round((currentStep / questions.length) * 100);

  return (
    <div className="fixed inset-0 z-[300] bg-[#0a0a0a]/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
      <div className="w-full max-w-[800px] h-[600px] bg-[#111] border border-[#222] rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative">
        
        {/* Background Atmosphere */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-white/5 blur-[120px] pointer-events-none mix-blend-screen opacity-50" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

        {/* Header */}
        <div className="relative z-10 px-10 py-6 border-b border-[#222] flex items-center justify-between bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <h3 className="text-white font-black tracking-tighter uppercase text-xl leading-none mb-1">TRIBE Match</h3>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Discovery Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="size-10 rounded-full hover:bg-red-600 hover:text-white border border-[#333] hover:border-red-600 text-slate-400 flex items-center justify-center transition-all group">
            <span className="material-symbols-outlined text-sm group-hover:rotate-90 transition-transform">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        {currentStep < questions.length && !isAnalyzing && (
          <div className="h-1 w-full bg-[#222] relative z-10">
            <div 
              className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}

        {/* Body Content */}
        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
          {isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
               <div className="relative size-24 mb-8">
                 <div className="absolute inset-0 border-[3px] border-[#333] rounded-full"></div>
                 <div className="absolute inset-0 border-[3px] border-red-600 rounded-full border-t-transparent animate-spin shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="material-symbols-outlined text-3xl text-white">psychology</span>
                 </div>
               </div>
               <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Analyzing Responses</h2>
               <p className="text-xs font-black tracking-[0.2em] uppercase text-slate-500 animate-pulse">Running Neural Matching Algorithm...</p>
            </div>
          ) : currentStep < questions.length ? (
            <div key={currentStep} className="flex-1 flex flex-col p-10 md:p-14 animate-in slide-in-from-right-10 fade-in duration-500 overflow-hidden">
              <div className="mb-4 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 border border-red-500/30 bg-red-500/10 px-3 py-1 rounded-full">
                  Query {currentStep + 1} / {questions.length}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1] mb-8 drop-shadow-lg max-w-2xl shrink-0">
                {questions[currentStep].text}
              </h2>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 pb-6 flex flex-col gap-4 mask-image-bottom">
                {questions[currentStep].options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="flex shrink-0 justify-between items-center w-full p-5 md:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222] hover:border-white hover:bg-white text-left group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
                  >
                    <span className="text-lg font-bold text-slate-300 tracking-tight uppercase group-hover:text-black transition-colors">
                      {opt.label}
                    </span>
                    <span className="material-symbols-outlined text-slate-600 group-hover:text-black group-hover:translate-x-2 transition-all">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-10 fade-in duration-700">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Synthesis Complete</h2>
                  <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mt-2">Optimal nodes identified.</p>
                </div>
                <button onClick={handleRestart} className="px-4 py-2 rounded-full border border-[#333] text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-white hover:border-white transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">refresh</span> Recalculate
                </button>
              </div>

              {/* Primary Match */}
              {results[0] && (
                <div className="mb-10 relative group">
                  <div className="absolute inset-0 bg-red-600/10 blur-[40px] rounded-[40px] pointer-events-none group-hover:bg-red-600/20 transition-all duration-500" />
                  <div className="relative p-8 md:p-10 rounded-[32px] bg-[#0a0a0a] border-2 border-[#222] hover:border-red-500 transition-colors shadow-2xl flex flex-col md:flex-row md:items-center gap-8">
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black tracking-[0.2em] uppercase rounded border border-red-400/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]">Primary Match</span>
                        <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase">{results[0].type}</span>
                      </div>
                      <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">{results[0].match.name}</h3>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6 border-l border-[#333] pl-4">
                        Based on your technical proficiency and operational preferences, {results[0].match.name} presents the highest operational fit for your core objectives.
                      </p>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleNavigate(results[0].type, results[0].match.name)}
                          className="px-8 py-3 rounded-xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
                        >
                          Deploy to Module
                        </button>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-[#111] border border-[#222] rounded-[24px]">
                      <div className="relative size-24 mb-3 flex items-center justify-center">
                         <svg className="w-full h-full -rotate-90 transform absolute inset-0" viewBox="0 0 100 100">
                           <circle cx="50" cy="50" r="45" fill="transparent" stroke="#222" strokeWidth="8" />
                           <circle cx="50" cy="50" r="45" fill="transparent" stroke="#dc2626" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * results[0].score) / 100} className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                         </svg>
                         <span className="text-2xl font-black text-white relative z-10">{results[0].score}%</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Compatibility</span>
                    </div>

                  </div>
                </div>
              )}

              {/* Secondary Matches */}
              <div className="grid md:grid-cols-2 gap-6 pb-6">
                <h4 className="col-span-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 border-b border-[#222] pb-4">Secondary Options</h4>
                {results.slice(1, 3).map((res, i) => (
                  <div key={i} className="p-6 rounded-[24px] bg-[#0a0a0a] border border-[#222] hover:border-[#444] transition-all flex flex-col group hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 line-clamp-1 mb-1">{res.type} Node</span>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter truncate">{res.match.name}</h4>
                      </div>
                      <div className="px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded text-white text-[10px] font-black">{res.score}% Fit</div>
                    </div>
                    <button 
                      onClick={() => handleNavigate(res.type, res.match.name)}
                      className="mt-auto pt-4 border-t border-[#222] text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 group-hover:text-white flex items-center justify-between transition-colors"
                    >
                      View Details
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDiscoveryAssistant;
