
import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';
import { DifficultyLevel } from '../types';
import { DIFFICULTY_SETTINGS } from '../constants';

const MISSION_DATA: Record<number, any> = {
  1: { 
    id: 1,
    name: 'THE_RESPONSIBILITY_TRIAGE', 
    type: 'TRIAGE',
    instructions: 'Items are falling! Sort them to [PROVIDER] or [CUSTOMER] based on the Shared Responsibility Model.',
    items: [
      { label: 'Physical Security', category: 'PROVIDER' },
      { label: 'OS Patching (IaaS)', category: 'CUSTOMER' },
      { label: 'Application Data', category: 'CUSTOMER' },
      { label: 'Hardware Maint.', category: 'PROVIDER' },
      { label: 'Network Firewall', category: 'CUSTOMER' },
      { label: 'Global Infrastructure', category: 'PROVIDER' },
      { label: 'Identity/Access', category: 'CUSTOMER' }
    ]
  },
  2: { 
    id: 2,
    name: 'STORAGE_SILO_MATCHER', 
    type: 'SILO',
    instructions: 'Route data packets to the correct Storage Silo based on the business requirement.',
    prompts: [
      { q: "Global Relational SQL (Scaling)", a: "Spanner" },
      { q: "High-speed Millisecond NoSQL", a: "Bigtable" },
      { q: "Standard SQL (Managed MySQL)", a: "Cloud SQL" },
      { q: "Unstructured Blob Data", a: "Storage" }
    ],
    silos: ["Spanner", "Bigtable", "Cloud SQL", "Storage"]
  },
  3: { 
    id: 3,
    name: 'THE_ML_DEVELOPER_LAB', 
    type: 'LAB',
    instructions: 'Choose the most efficient AI path for each customer request (API vs AutoML vs Custom).',
    requests: [
      { q: "Detect objects in images (standard)", a: "API", detail: "Vision API (Pre-trained)" },
      { q: "Custom labels for medical scans", a: "AutoML", detail: "Vertex AI AutoML" },
      { q: "Build proprietary custom LLM", a: "Vertex", detail: "Vertex AI Custom Training" },
      { q: "Translate text (pre-trained)", a: "API", detail: "Translation API" }
    ],
    paths: [
      { id: 'API', label: 'PRE-TRAINED API', cost: 'Fast / Low Effort' },
      { id: 'AutoML', label: 'AUTOML', cost: 'Medium Effort / Custom' },
      { id: 'Vertex', label: 'VERTEX AI', cost: 'High Effort / Custom Code' }
    ]
  },
  4: { 
    id: 4,
    name: 'THE_COMPUTE_DEFENDER', 
    type: 'SHOOTER',
    instructions: 'TOGGLE WEAPONS [1, 2, 3]. SHOOT enemies with their modern compute weakness.',
    weapons: [
      { id: 'CE', label: 'Compute Engine', key: '1', color: 'bg-blue-600', desc: 'FOR LEGACY VMs' },
      { id: 'GKE', label: 'GKE', key: '2', color: 'bg-green-600', desc: 'FOR CONTAINERS' },
      { id: 'Run', label: 'Cloud Run', key: '3', color: 'bg-purple-600', desc: 'FOR SERVERLESS' }
    ],
    enemies: [
      { label: 'Legacy Monolith', weak: 'CE' },
      { label: 'Docker Cluster', weak: 'GKE' },
      { label: 'Scale-to-Zero App', weak: 'Run' },
      { label: 'Windows Server 2008', weak: 'CE' },
      { label: 'Microservice API', weak: 'Run' },
      { label: 'K8s Deployment', weak: 'GKE' }
    ]
  },
  5: { 
    id: 5,
    name: 'THE_IAM_FIREWALL_GATE', 
    type: 'FIREWALL',
    instructions: 'ALLOW authorized IAM traffic. DENY malicious threats like DDoS and SQL Injections.',
    packets: [
      { label: 'Editor Role Grant', safe: true },
      { label: 'SQL Injection Attack', safe: false },
      { label: 'DDoS Burst Traffic', safe: false },
      { label: 'Cloud Armor Policy', safe: true },
      { label: 'Signed URL Access', safe: true },
      { label: 'Phishing Script Injection', safe: false }
    ]
  },
  6: { 
    id: 6,
    name: 'HIERARCHY_STACKER', 
    type: 'STACKER',
    instructions: 'STACK the GCP Resource Hierarchy blocks from TOP (Organization) to BOTTOM (Resource).',
    layers: ['Organization', 'Folder', 'Project', 'Resource']
  }
};

interface PuzzleStageProps {
  levelId: number;
  difficulty: DifficultyLevel;
  onComplete: (score: number) => void;
}

const PuzzleStage: React.FC<PuzzleStageProps> = ({ levelId, difficulty, onComplete }) => {
  const mission = MISSION_DATA[levelId] || MISSION_DATA[1];
  const diffSetting = DIFFICULTY_SETTINGS[difficulty];
  
  const [isActive, setIsActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(45);
  
  const [subState, setSubState] = useState<any>({
    items: [],
    index: 0,
    weapon: 'CE',
    stack: [],
    feedback: null
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const physicsRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);

  const updateScore = (points: number) => {
    if (points > 0) soundService.playBlip();
    else soundService.playIncorrect();
    scoreRef.current = Math.max(0, scoreRef.current + points);
    setScore(scoreRef.current);
    
    const threshold = 400;
    if (scoreRef.current >= threshold && !isSuccess) {
      handleWin();
    }
  };

  const handleWin = () => {
    setIsSuccess(true);
    soundService.playLevelComplete();
    setTimeout(() => onComplete(scoreRef.current + gameTime * 20), 2500);
  };

  useEffect(() => {
    if (isActive && !isSuccess) {
      timerRef.current = setInterval(() => {
        setGameTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            if (scoreRef.current < 400) {
                soundService.playIncorrect();
                setIsActive(false);
                scoreRef.current = 0;
                setScore(0);
                setGameTime(45);
            } else {
                handleWin();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (['TRIAGE', 'SHOOTER', 'FIREWALL'].includes(mission.type)) {
        spawnRef.current = setInterval(() => {
          const newItem = generateItem();
          if (newItem) {
            setSubState((s: any) => ({ ...s, items: [...s.items, newItem] }));
          }
        }, 1800 / diffSetting.speedMultiplier);

        physicsRef.current = setInterval(() => {
          setSubState((s: any) => {
            const updated = s.items.map((i: any) => ({ 
              ...i, 
              y: i.y + (0.5 * diffSetting.speedMultiplier) 
            }));
            const filtered = updated.filter((i: any) => {
              if (i.y > 100) {
                if (mission.type === 'FIREWALL' && i.safe) updateScore(-30);
                if (mission.type === 'TRIAGE') updateScore(-20);
                return false;
              }
              return true;
            });
            return { ...s, items: filtered };
          });
        }, 16);
      }

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);
        if (physicsRef.current) clearInterval(physicsRef.current);
      };
    }
  }, [isActive, isSuccess]);

  const generateItem = () => {
    if (mission.type === 'TRIAGE') {
      const template = mission.items[Math.floor(Math.random() * mission.items.length)];
      return { id: Math.random(), ...template, x: 20 + Math.random() * 60, y: -10 };
    }
    if (mission.type === 'FIREWALL') {
      const template = mission.packets[Math.floor(Math.random() * mission.packets.length)];
      return { id: Math.random(), ...template, x: 20 + Math.random() * 60, y: -10 };
    }
    if (mission.type === 'SHOOTER') {
      const template = mission.enemies[Math.floor(Math.random() * mission.enemies.length)];
      return { id: Math.random(), ...template, x: 20 + Math.random() * 60, y: -10 };
    }
    return null;
  };

  const handleTriage = (id: number, cat: string) => {
    const item = subState.items.find((i: any) => i.id === id);
    if (!item) return;
    if (item.category === cat) updateScore(60);
    else updateScore(-40);
    setSubState((s: any) => ({ ...s, items: s.items.filter((i: any) => i.id !== id) }));
  };

  const handleShoot = (id: number) => {
    const enemy = subState.items.find((i: any) => i.id === id);
    if (!enemy) return;
    if (enemy.weak === subState.weapon) updateScore(80);
    else updateScore(-30);
    setSubState((s: any) => ({ ...s, items: s.items.filter((i: any) => i.id !== id) }));
  };

  const handleFirewall = (id: number, allow: boolean) => {
    const packet = subState.items.find((i: any) => i.id === id);
    if (!packet) return;
    if (packet.safe === allow) updateScore(60);
    else updateScore(-50);
    setSubState((s: any) => ({ ...s, items: s.items.filter((i: any) => i.id !== id) }));
  };

  const renderTriage = () => (
    <div className="relative h-full w-full flex flex-col justify-between bg-[#0a0a0c]">
      <div className="flex-1 relative">
        {subState.items.map((i: any) => (
          <div key={i.id} className="absolute p-4 border-2 border-white bg-black pixel-font text-[10px] text-white shadow-[4px_4px_0_#000]" style={{ left: `${i.x}%`, top: `${i.y}%`, transform: 'translateX(-50%)' }}>
            <div className="mb-4 text-center font-black">{i.label}</div>
            <div className="flex gap-2">
              <button onClick={() => handleTriage(i.id, 'PROVIDER')} className="bg-blue-600 px-3 py-2 border-2 border-white hover:bg-white hover:text-blue-600">GOOGLE</button>
              <button onClick={() => handleTriage(i.id, 'CUSTOMER')} className="bg-green-600 px-3 py-2 border-2 border-white hover:bg-white hover:text-green-600">YOU</button>
            </div>
          </div>
        ))}
      </div>
      <div className="h-20 flex border-t-4 border-white pixel-font">
        <div className="flex-1 bg-blue-900/60 flex items-center justify-center text-[12px] text-blue-200 border-r-2 border-white">PROVIDER</div>
        <div className="flex-1 bg-green-900/60 flex items-center justify-center text-[12px] text-green-200">CUSTOMER</div>
      </div>
    </div>
  );

  const renderSilo = () => {
    const prompt = mission.prompts[subState.index % mission.prompts.length];
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 gap-12 bg-[#050505]">
        <div className="bg-black border-4 border-white p-8 w-full max-w-lg text-center shadow-[12px_12px_0_#000]">
          <div className="text-yellow-500 pixel-font text-[10px] mb-4 uppercase font-black tracking-widest">[ NETWORK_DATAGRAM ]</div>
          <div className="text-white pixel-font text-xl animate-pulse font-black leading-snug">{prompt.q}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
          {mission.silos.map((s: string) => (
            <button key={s} onClick={() => { if (s === prompt.a) { updateScore(120); setSubState((prev: any) => ({ ...prev, index: prev.index + 1 })); } else { updateScore(-60); } }} className="pixel-box bg-slate-900 border-4 border-white p-6 text-white pixel-font text-[10px] hover:scale-105 hover:bg-blue-600 transition-all flex flex-col items-center gap-3">
              <span className="text-4xl">🗄️</span>
              <span className="font-black">{s.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderLab = () => {
    const req = mission.requests[subState.index % mission.requests.length];
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 gap-10 bg-[#08080a]">
        <div className="flex items-center gap-8 w-full max-w-2xl">
           <div className="text-8xl animate-pixel-float">👤</div>
           <div className="pixel-box bg-black border-4 border-white p-8 flex-1 relative shadow-[8px_8px_0_#000]">
             <div className="absolute -left-4 top-6 w-6 h-6 bg-black border-l-4 border-t-4 border-white rotate-[-45deg]" />
             <div className="text-blue-400 pixel-font text-[10px] mb-3 font-black">USER_STORY_{subState.index + 1}:</div>
             <p className="text-white pixel-font text-sm uppercase font-black">"{req.q}"</p>
           </div>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {mission.paths.map((p: any) => (
            <button key={p.id} onClick={() => { if (p.id === req.a) { updateScore(150); setSubState((prev: any) => ({ ...prev, index: prev.index + 1, feedback: req.detail })); setTimeout(() => setSubState((prev: any) => ({ ...prev, feedback: null })), 2500); } else { updateScore(-70); } }} className="pixel-button bg-[#111] border-4 border-white p-6 text-white flex justify-between items-center group hover:bg-yellow-500 hover:text-black">
              <div className="flex flex-col items-start text-left">
                <span className="pixel-font text-sm mb-1 font-black">{p.label}</span>
                <span className="pixel-font text-[8px] opacity-70 font-black">{p.cost}</span>
              </div>
              <span className="pixel-font text-[10px] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-black">CHOOSE_PATH &gt;</span>
            </button>
          ))}
        </div>
        {subState.feedback && (
          <div className="text-green-500 pixel-font text-[12px] animate-bounce font-black bg-black px-4 py-2 border-2 border-green-500">
             PATH: {subState.feedback}
          </div>
        )}
      </div>
    );
  };

  const renderShooter = () => (
    <div className="relative h-full w-full bg-[#0a0a12] overflow-hidden">
      {subState.items.map((i: any) => (
        <button key={i.id} onClick={() => handleShoot(i.id)} className={`absolute p-5 border-4 border-white pixel-font text-[10px] text-white flex flex-col items-center gap-3 shadow-[6px_6px_0_#000] ${subState.weapon === i.weak ? 'bg-red-800' : 'bg-slate-800'}`} style={{ left: `${i.x}%`, top: `${i.y}%`, transform: 'translateX(-50%)' }}>
          <span className="text-4xl">👾</span>
          <span className="font-black">{i.label}</span>
        </button>
      ))}
      <div className="absolute bottom-10 left-0 right-0 px-10 flex flex-col items-center">
        <div className="flex gap-6 mb-6">
          {mission.weapons.map((w: any) => (
            <button key={w.id} onClick={() => { setSubState((s:any)=>({...s, weapon: w.id})); soundService.playClick(); }} className={`pixel-box border-4 p-4 ${subState.weapon === w.id ? 'bg-white text-black -translate-y-4' : 'bg-black text-white'}`}>
              <div className="text-[12px] pixel-font mb-2 font-black">[{w.key}]</div>
              <div className="text-[10px] pixel-font font-black">{w.id}</div>
            </button>
          ))}
        </div>
        <div className={`w-20 h-20 border-4 border-white ${mission.weapons.find((w:any)=>w.id === subState.weapon)?.color}`} />
      </div>
    </div>
  );

  const renderFirewall = () => (
    <div className="relative h-full w-full bg-[#0a0c0a] flex items-center justify-center overflow-hidden">
      {/* Redesigned Firewall UI: Status info moved to a compact header to avoid blocking the view */}
      <div className="absolute top-16 left-0 right-0 z-10 flex justify-center">
        <div className="pixel-box border-4 border-white p-3 bg-black/80 flex items-center gap-4 shadow-[8px_8px_0_#000]">
           <div className="text-2xl animate-pulse">🛡️</div>
           <div className="flex flex-col">
              <div className="pixel-font text-[10px] text-white font-black uppercase tracking-tighter">FIREWALL_ACTIVE</div>
              <div className="text-[6px] pixel-font text-blue-400 font-black">INTERCEPTING_INTRUSIONS...</div>
           </div>
        </div>
      </div>

      <div className="absolute inset-y-0 left-1/2 w-1 bg-white/10 border-l-2 border-dashed border-white/40" />
      
      {subState.items.map((i: any) => (
        <div key={i.id} className="absolute flex flex-col items-center gap-3 animate-in fade-in duration-300" style={{ left: `${i.x}%`, top: `${i.y}%`, transform: 'translateX(-50%)' }}>
          <div className="pixel-box bg-black border-4 border-white p-3 text-white pixel-font text-[10px] font-black shadow-[4px_4px_0_#000]">{i.label}</div>
          <div className="flex gap-3">
            <button onClick={() => handleFirewall(i.id, true)} className="bg-green-600 px-4 py-2 border-2 border-white pixel-font text-[10px] text-white hover:bg-white hover:text-green-600 transition-colors font-black shadow-[2px_2px_0_#000]">ALLOW</button>
            <button onClick={() => handleFirewall(i.id, false)} className="bg-red-600 px-4 py-2 border-2 border-white pixel-font text-[10px] text-white hover:bg-white hover:text-red-600 transition-colors font-black shadow-[2px_2px_0_#000]">DENY</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStacker = () => (
    <div className="flex flex-col items-center justify-center h-full p-12 gap-12 bg-[#0c080c]">
      <div className="flex flex-col-reverse gap-4 w-80 border-b-8 border-white pb-4 min-h-[320px] items-center">
        {subState.stack.map((s: string, idx: number) => (
          <div key={idx} className="w-full bg-blue-700 border-4 border-white p-5 text-white pixel-font text-[12px] text-center shadow-[8px_8px_0_#000] font-black">{s.toUpperCase()}</div>
        ))}
        {subState.stack.length === 0 && (
          <div className="text-white/20 pixel-font text-[10px] font-black uppercase mb-10">PLACE_ROOT_HERE</div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {mission.layers.filter((l: string) => !subState.stack.includes(l)).map((l: string) => (
          <button key={l} onClick={() => { const nextIndex = subState.stack.length; if (l === mission.layers[nextIndex]) { const newStack = [...subState.stack, l]; setSubState((s: any) => ({ ...s, stack: newStack })); updateScore(150); if (newStack.length === mission.layers.length) { setTimeout(handleWin, 1000); } } else { updateScore(-70); } }} className="pixel-button bg-slate-900 border-4 border-white p-5 text-white pixel-font text-[10px] hover:invert font-black shadow-[6px_6px_0_#000]">{l}</button>
        ))}
      </div>
    </div>
  );

  const renderCurrentGame = () => {
    switch (mission.type) {
      case 'TRIAGE': return renderTriage();
      case 'SILO': return renderSilo();
      case 'LAB': return renderLab();
      case 'SHOOTER': return renderShooter();
      case 'FIREWALL': return renderFirewall();
      case 'STACKER': return renderStacker();
      default: return null;
    }
  };

  return (
    <div className="relative w-full aspect-video bg-[#050505] border-4 border-blue-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      {!isActive ? (
        <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="pixel-font text-blue-500 text-4xl mb-6 font-black uppercase">{mission.name.replace(/_/g, ' ')}</h2>
          <p className="pixel-font text-white text-[12px] mb-12 max-w-2xl font-black bg-blue-950/30 p-8 border-2 border-blue-900">{mission.instructions}</p>
          <button onClick={() => { setIsActive(true); soundService.playPowerUp(); }} className="pixel-button bg-white text-black px-16 py-6 text-2xl font-black">START_CHALLENGE</button>
        </div>
      ) : isSuccess ? (
        <div className="absolute inset-0 z-[200] bg-blue-700 flex flex-col items-center justify-center">
           <div className="pixel-font text-white text-6xl mb-6 animate-bounce font-black">SYNC_COMPLETE!</div>
           <div className="pixel-font text-white text-lg font-black uppercase">CHAPTER {levelId} INTEGRATED</div>
           <div className="mt-16 w-80 h-4 bg-white/20 border-4 border-white"><div className="h-full bg-white animate-[progress_2s_linear]" style={{width: '100%'}} /></div>
        </div>
      ) : (
        <>
          <div className="absolute top-6 left-6 right-6 flex justify-between pixel-font text-[12px] z-[100] pointer-events-none">
            <div className="bg-black border-4 border-white p-3 text-white shadow-[6px_6px_0_#000] font-black">SCORE: {score} / 400</div>
            <div className={`bg-black border-4 p-3 shadow-[6px_6px_0_#000] font-black ${gameTime < 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-white text-white'}`}>TIME: {gameTime}S</div>
          </div>
          {renderCurrentGame()}
        </>
      )}
    </div>
  );
};

export default PuzzleStage;