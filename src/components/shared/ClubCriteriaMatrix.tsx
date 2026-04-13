import React from 'react';

interface ClubCriteriaMatrixProps {
  clubName: string;
}

export const ClubCriteriaMatrix: React.FC<ClubCriteriaMatrixProps> = ({ clubName }) => {
  const name = clubName.toLowerCase();

  let criteria = [
    { title: 'Baseline Skill', desc: 'Fundamentals required to operate within the domain.', req: 'General Interest' },
    { title: 'Core Assessment', desc: 'Initial challenge testing logical approach.', req: 'Passed Review' },
    { title: 'Commitment', desc: 'Dedicated hours expected per week.', req: '4-6 Hours' },
  ];

  if (name.includes('code') || name.includes('cod')) {
    criteria = [
      { title: 'DSA Fundamentals', desc: 'Understanding of core data structures and algorithmic complexity.', req: 'Arrays, Trees, Graphs' },
      { title: 'Problem Solving Round', desc: 'Live logical algorithmic assessment in sandbox environment.', req: 'Rank Validation' },
      { title: 'Code Sprint', desc: 'Mini-hackathon solving a defined architecture challenge under 48 hours.', req: 'Working Prototype' },
      { title: 'Operational Discipline', desc: 'Consistent competitive programming engagement and hackathon participation.', req: '8+ Hours/Week' },
      { title: 'GitHub / CP Stats (Optional)', desc: 'Prior open-source contribution or LeetCode/CodeForces ranking.', req: 'Profile Link' },
    ];
  } else if (name.includes('ai') || name.includes('data')) {
    criteria = [
      { title: 'Python Dynamics', desc: 'General proficiency in Python and mathematical logic.', req: 'Pandas/NumPy Basics' },
      { title: 'Model Experimentation', desc: 'Conceptual understanding of neural network layers or ML classifiers.', req: 'Conceptual Grasp' },
      { title: 'Notebook Challenge', desc: 'Data cleaning and predictive modeling mini-task.', req: 'Jupyter Notebook Submission' },
      { title: 'Dataset Thinking', desc: 'Ability to frame real-world problems into dataset constraints.', req: 'Interview Round' },
      { title: 'Research Drive', desc: 'Kaggle participation or desire to read core ML papers.', req: 'Consistency' },
    ];
  } else if (name.includes('cyber') || name.includes('security')) {
    criteria = [
      { title: 'OS Navigation', desc: 'Familiarity with Linux environments and basic bash commands.', req: 'CLI Proficiency' },
      { title: 'CTF Aptitude', desc: 'Problem solving mindset geared toward unraveling locked protocols.', req: 'Logic Puzzle Clearance' },
      { title: 'Threat Analysis Round', desc: 'Investigating a mock penetration log or finding a simple web exploit.', req: 'Documentation' },
      { title: 'Ethical Directives', desc: 'Absolute adherence to white-hat guidelines within external networks.', req: 'Signed Protocol' },
      { title: 'Lab Discipline', desc: 'Regular attendance to internal training and server sandboxing sessions.', req: '6+ Hours/Week' },
    ];
  } else if (name.includes('robotic')) {
    criteria = [
      { title: 'Hardware Fundamentals', desc: 'Basic knowledge of circuitry, sensors, and microcontrollers.', req: 'Arduino / IoT Basics' },
      { title: 'Sensor Logic Task', desc: 'Simple programmed response based on analog/digital input reading.', req: 'Circuit Diagram or Code' },
      { title: 'Mechanical Build', desc: 'Ability to construct physical housings or handle kinematic designs.', req: 'Proto Build Round' },
      { title: 'Embedded Systems', desc: 'C/C++ knowledge for hardware interfacing.', req: 'Code Assessment' },
      { title: 'Team Synchronization', desc: 'Operating effectively in cross-functional physical deployments.', req: 'Clear Communication' },
    ];
  } else if (name.includes('cloud')) {
    criteria = [
      { title: 'Infra Curiosity', desc: 'Interest in how large scale applications stay online and balance loads.', req: 'Conceptual Grasp' },
      { title: 'Deployment Logic', desc: 'Basic understanding of Docker, VMs, or serverless functions.', req: 'Basic Containers' },
      { title: 'Service Design', desc: 'Architecting a scalable system for a mock high-traffic endpoint.', req: 'System Design Interview' },
      { title: 'DevOps Mindset', desc: 'Interest in CI/CD pipelines, automated testing, and release cycles.', req: 'Action Flow Setup' },
      { title: 'Ops Consistency', desc: 'Weekly checks and maintenance of internal hosted projects.', req: '5+ Hours/Week' },
    ];
  } else if (name.includes('open source') || name.includes('web3') || name.includes('block')) {
    criteria = [
      { title: 'Decentralized Logic', desc: 'Understanding repositories, chain layers, and global state machines.', req: 'Git / Ledger Basics' },
      { title: 'Issue Resolution', desc: 'Finding and patching a documented bug in a mock or live repository.', req: 'Merged PR / Smart Contract' },
      { title: 'Collaboration Etiquette', desc: 'Writing clean code documentation, maintaining issue readability.', req: 'Markdown / Readme Test' },
      { title: 'Ecosystem Protocols', desc: 'Familiarity with Web3 safety or standard open-source licensing.', req: 'Concept Mapping' },
    ];
  }

  return (
    <div className="relative pt-8 pb-8 z-10 font-display">
      <div className="absolute left-[24px] md:left-[39px] top-12 bottom-8 w-0.5 bg-gradient-to-b from-red-600 via-[#444] to-transparent z-0" />
      <div className="flex flex-col gap-6 md:gap-10 relative z-10 w-full">
        {criteria.map((s, i) => (
          <div key={i} className="flex gap-4 md:gap-8 items-start group perspective-1000">
            <div className="w-12 h-12 md:w-20 md:h-20 shrink-0 bg-[#0a0a0a] border-4 border-[#222] group-hover:border-red-600 rounded-xl md:rounded-2xl flex flex-col items-center justify-center transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.8)] relative z-10 transform-gpu group-hover:-translate-y-1 group-hover:scale-105">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-red-500 transition-colors">S-{i+1}</span>
            </div>
            
            <div className="flex flex-col p-6 rounded-3xl bg-[#111] border border-[#222] group-hover:border-[#444] group-hover:bg-[#141414] w-full transition-all duration-500 group-hover:-translate-x-2 shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                 <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white group-hover:text-red-50">{s.title}</h3>
                 <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-sm w-fit">
                   Criteria: {s.req}
                 </span>
               </div>
               <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed border-l-2 border-[#333] group-hover:border-red-600 pl-4">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
