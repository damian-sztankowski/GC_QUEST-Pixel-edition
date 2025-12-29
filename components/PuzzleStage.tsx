import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';
import { DifficultyLevel } from '../types';
import { DIFFICULTY_SETTINGS } from '../constants';

interface GameItem {
  id: number;
  label: string;
  category: string;
  x: number;
  y: number;
  speed: number;
}

const MISSION_DATA: Record<number, any> = {
  1: { 
    id: 1,
    name: 'THE_RESPONSIBILITY_TRIAGE', 
    type: 'TRIAGE',
    instructions: 'Sort items to [PROVIDER] or [CUSTOMER] based on Shared Responsibility.',
    items: [
      { label: 'Physical Security', category: 'PROVIDER' },
      { label: 'OS Patching (IaaS)', category: 'CUSTOMER' },
      { label: 'App Data', category: 'CUSTOMER' },
      { label: 'Hardware Maint.', category: 'PROVIDER' },
      { label: 'Firewall Rules', category: 'CUSTOMER' },
      { label: 'Cloud Infrastructure', category: 'PROVIDER' }
    ]
  },
  2: { 
    id: 2,
    name: 'STORAGE_SILO_MATCHER', 
    type: 'SILO',
    instructions: 'Route data packets to the correct Storage Silo.',
    prompts: [
      { q: "Global Relational SQL", a: "Spanner" },
      { q: "Fast NoSQL Key-Value", a: "Bigtable" },
      { q: "Standard SQL (MySQL)", a: "Cloud SQL" },
      { q: "Unstructured Blobs", a: "Storage" }
    ],
    silos: ["Spanner", "Bigtable", "Cloud SQL", "Storage"]
  },
  3: { 
    id: 3,
    name: 'THE_ML_DEVELOPER_LAB', 
    type: 'LAB',
    instructions: 'Select the optimal AI path for each customer request.',
    requests: [
      { q: "Detect objects in photos", a: "API", detail: "Vision API (Pre-trained)" },
      { q: "Custom labels for medical images", a: "AutoML", detail: "Vertex AI AutoML" },
      { q: "Build proprietary LLM model", a: "Vertex", detail: "Vertex AI Custom Training" },
      { q: "Translate 100 languages", a: "API", detail: "Translation API" }
    ],
    paths: [
      { id: 'API', label: 'PRE-TRAINED API', cost: 'Low Effort' },
      { id: 'AutoML', label: 'AUTOML', cost: 'Medium Effort' },
      { id: 'Vertex', label: 'VERTEX AI', cost: 'High Effort' }
    ]
  },
  4: { 
    id: 4,
    name: 'THE_COMPUTE_DEFENDER', 
    type: 'SHOOTER',
    instructions: 'TOGGLE [1,2,3] weapons. Match Compute to Enemy vulnerability.',
    weapons: [
      { id: 'CE', label: 'Compute Engine', key: '1', color: 'bg-blue-600' },
      { id: 'GKE', label: 'GKE (Containers)', key: '2', color: 'bg-green-600' },
      { id: 'Run', label: 'Cloud Run (Serverless)', key: '3', color: 'bg-purple-600' }
    ],
    enemies: [
      { label: 'Legacy Monolith', weak: 'CE' },
      { label: 'Docker Cluster', weak: 'GKE' },
      { label: 'Scale-to-Zero App', weak: 'Run' },
      { label: 'Windows Server', weak: 'CE' },
      { label: 'Microservice', weak: 'Run' }
    ]
  },
  5: { 
    id: 5,
    name: 'THE_IAM_FIREWALL_GATE', 
    type: 'FIREWALL',
    instructions: 'ALLOW authorized traffic. DENY malicious threats.',
    packets: [
      { label: 'Editor Role', safe: true },
      { label: 'SQL Injection', safe: false },
      { label: 'DDoS Burst', safe: false },
      { label: 'Signed URL', safe: true },
      { label: 'Viewer IAM', safe: true },
      { label: 'Phishing Script', safe: false }
    ]
  },
  6: { 
    id: 6,
    name: 'HIERARCHY_STACKER', 
    type: 'STACKER',
    instructions: 'STACK from Top (Parent) to Bottom (Child).',
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
  const [gameTime, setGameTime] = useState(30);
  
  // Game state sub-properties
  const [subState, setSubState] = useState<any>({
    items: [],
    index: 0,
    weapon: 'CE',
    stack: [],
    feedback: null
  });

  // Use ReturnType<typeof setInterval> to avoid NodeJS namespace dependency in browser environments
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);

  const updateScore = (points: number) => {
    if (points > 0) soundService.playBlip();
    else soundService.playIncorrect();
    scoreRef.current = Math.max(0, scoreRef.current + points);
    setScore(scoreRef.current);
    
    // Check completion threshold
    const threshold = 400;
    if (scoreRef.current >= threshold && !isSuccess) {
      handleWin();
    }
  };

  const handleWin = () => {
    setIsSuccess(true);
    soundService.playLevelComplete();
    setTimeout(() => onComplete(scoreRef.current + gameTime * 15), 2500);
  };

  useEffect(() => {
    if (isActive && !isSuccess) {
      timerRef.current = setInterval(() => {
        setGameTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            if (scoreRef.current < 400) {
                // Fail - reset
                soundService.playIncorrect();
                setIsActive(false);
                scoreRef.current = 0;
                setScore(0);
                setGameTime(30);
            } else {
                handleWin();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Game-specific Spawning
      if (['TRIAGE', 'SHOOTER', 'FIREWALL'].includes(mission.type)) {
        spawnRef.current = setInterval(() => {
          const newItem = generateItem();
          setSubState((s: any) => ({ ...s, items: [...s.items, newItem] }));
        }, 1200 / diffSetting.speedMultiplier);
      }

      // Physics Loop
      const physics = setInterval(() => {
        setSubState((s: any) => {
          const updated = s.items.map((i: any) => ({ ...i, y: i.y + (1.2 * diffSetting.speedMultiplier) }));
          // Filter out of bounds and handle auto-miss penalty
          const filtered = updated.filter((i: any) => {
            if (i.y > 100) {
              if (mission.type === 'FIREWALL' && i.safe) updateScore(-30);
              return false;
            }
            return true;
          });
          return { ...s, items: filtered };
        });
      }, 16);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);
        clearInterval(physics);
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
      return { id: Math.random(), ...template, x: 10 + Math.random() * 80, y: -10 };
    }
    return null;
  };

  // User Actions
  const handleTriage = (id: number, cat: string) => {
    const item = subState.items.find((i: any) => i.id === id);
    if (!item) return;
    if (item.category === cat) updateScore(50);
    else updateScore(-30);
    setSubState((s: any) => ({ ...s, items: s.items.filter((i: any) => i.id !== id) }));
  };

  const handleShoot = (id: number) => {
    const enemy = subState.items.find((i: any) => i.id === id);
    if (!enemy) return;
    if (enemy.weak === subState.weapon) updateScore(60);
    else updateScore(-20);
    setSubState((s: any) => ({ ...s, items: s.items.filter((i: any) => i.id !== id) }));
  };

  const handleFirewall = (id: number, allow: boolean) => {
    const packet = subState.items.find((i: any) => i.id === id);
    if (!packet) return;
    if (packet.safe === allow) updateScore(50);
    else updateScore(-40);
    setSubState((s: any) => ({ ...s, items: s.items.filter((i: any) => i.id !== id) }));
  };

  const renderTriage = () => (
    <div className="relative h-full w-full flex flex-col justify-between">
      <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
      <div className="flex-1 relative">
        {subState.items.map((i: any) => (
          <div 
            key={i.id} 
            className="absolute p-3 border-2 border-white bg-black pixel-font text-[8px] text-white animate-in zoom-in-50 duration-200"
            style={{ left: `${i.x}%`, top: `${i.y}%`, transform: 'translateX(-50%)' }}
          >
            <div className="mb-2 text-center">{i.label}</div>
            <div className="flex gap-1">
              <button onClick={() => handleTriage(i.id, 'PROVIDER')} className="bg-blue-600 px-1 py-0.5 border border-white hover:bg-white hover:text-blue-600 transition-colors">PROVIDER</button>
              <button onClick={() => handleTriage(i.id, 'CUSTOMER')} className="bg-green-600 px-1 py-0.5 border border-white hover:bg-white hover:text-green-600 transition-colors">CUSTOMER</button>
            </div>
          </div>
        ))}
      </div>
      <div className="h-16 flex border-t-4 border-white">
        <div className="flex-1 bg-blue-900/50 flex items-center justify-center pixel-font text-[10px] text-blue-300">GOOGLE_ZONE</div>
        <div className="flex-1 bg-green-900/50 flex items-center justify-center pixel-font text-[10px] text-green-300">USER_ZONE</div>
      </div>
    </div>
  );

  const renderSilo = () => {
    const prompt = mission.prompts[subState.index % mission.prompts.length];
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 gap-12">
        <div className="bg-black border-4 border-white p-6 w-full max-w-md text-center shadow-[8px_8px_0_#000]">
          <div className="text-yellow-500 pixel-font text-[8px] mb-4 uppercase">NETWORK_REQUEST:</div>
          <div className="text-white pixel-font text-lg animate-pulse">{prompt.q}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {mission.silos.map((s: string) => (
            <button 
              key={s} 
              onClick={() => {
                if (s === prompt.a) {
                  updateScore(100);
                  setSubState((prev: any) => ({ ...prev, index: prev.index + 1 }));
                } else {
                  updateScore(-50);
                }
              }}
              className="pixel-box bg-slate-900 border-2 border-white p-4 text-white pixel-font text-[8px] hover:invert transition-all flex flex-col items-center gap-2"
            >
              <span className="text-2xl">🗄️</span>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderLab = () => {
    const req = mission.requests[subState.index % mission.requests.length];
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 gap-8">
        <div className="flex items-center gap-6 w-full max-w-xl">
           <div className="text-6xl animate-pixel-float">👤</div>
           <div className="pixel-box bg-black border-4 border-white p-6 flex-1 relative">
             <div className="absolute -left-3 top-4 w-4 h-4 bg-black border-l-4 border-t-4 border-white rotate-[-45deg]" />
             <div className="text-blue-400 pixel-font text-[8px] mb-2 font-black">CUSTOMER_DEMAND:</div>
             <p className="text-white pixel-font text-[10px] uppercase leading-relaxed">"{req.q}"</p>
           </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xl">
          {mission.paths.map((p: any) => (
            <button 
              key={p.id}
              onClick={() => {
                if (p.id === req.a) {
                  updateScore(120);
                  setSubState((prev: any) => ({ ...prev, index: prev.index + 1, feedback: req.detail }));
                  setTimeout(() => setSubState((prev: any) => ({ ...prev, feedback: null })), 2000);
                } else {
                  updateScore(-60);
                }
              }}
              className="pixel-button bg-[#111] border-2 border-white p-4 text-white flex justify-between items-center group hover:bg-white hover:text-black"
            >
              <div className="flex flex-col items-start">
                <span className="pixel-font text-xs mb-1">{p.label}</span>
                <span className="pixel-font text-[6px] opacity-50">{p.cost}</span>
              </div>
              <span className="pixel-font text-[8px] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">SELECT_PATH >></span>
            </button>
          ))}
        </div>
        {subState.feedback && (
          <div className="text-green-500 pixel-font text-[10px] animate-bounce">SYNCED: {subState.feedback}</div>
        )}
      </div>
    );
  };

  const renderShooter = () => (
    <div className="relative h-full w-full bg-[#0a0a0c] overflow-hidden">
      <div className="absolute inset-0 opacity-10 pixel-grid" />
      {subState.items.map((i: any) => (
        <button 
          key={i.id}
          onClick={() => handleShoot(i.id)}
          className={`absolute p-4 border-2 border-white pixel-font text-[8px] text-white flex flex-col items-center gap-2 hover:scale-110 transition-transform ${
            subState.weapon === i.weak ? 'bg-red-900 shadow-[0_0_15px_red]' : 'bg-slate-800'
          }`}
          style={{ left: `${i.x}%`, top: `${i.y}%`, transform: 'translateX(-50%)' }}
        >
          <span className="text-2xl">🛸</span>
          {i.label}
        </button>
      ))}

      <div className="absolute bottom-8 left-0 right-0 px-8 flex flex-col items-center">
        <div className="flex gap-4 mb-4">
          {mission.weapons.map((w: any) => (
            <button 
              key={w.id}
              onClick={() => { setSubState((s:any)=>({...s, weapon: w.id})); soundService.playClick(); }}
              className={`pixel-box border-4 p-3 transition-all ${
                subState.weapon === w.id ? 'bg-white text-black -translate-y-2' : 'bg-black text-white'
              }`}
            >
              <div className="text-[10px] pixel-font mb-1">[{w.key}]</div>
              <div className="text-[8px] pixel-font">{w.id}</div>
            </button>
          ))}
        </div>
        <div className="w-16 h-16 relative">
          <div className={`w-full h-full border-4 border-white ${mission.weapons.find((w:any)=>w.id === subState.weapon)?.color} animate-pulse`} />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-1 h-12 bg-white/40 animate-ping" />
        </div>
      </div>
    </div>
  );

  const renderFirewall = () => (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="absolute inset-y-0 left-1/2 w-1 bg-white/10" />
      {subState.items.map((i: any) => (
        <div 
          key={i.id}
          className="absolute flex flex-col items-center gap-2"
          style={{ left: `${i.x}%`, top: `${i.y}%`, transform: 'translateX(-50%)' }}
        >
          <div className="pixel-box bg-black border-2 border-white p-2 text-white pixel-font text-[8px] whitespace-nowrap">
            {i.label}
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleFirewall(i.id, true)} className="bg-green-600 px-2 py-1 border border-white text-[8px] pixel-font text-white hover:bg-white hover:text-green-600">ALLOW</button>
            <button onClick={() => handleFirewall(i.id, false)} className="bg-red-600 px-2 py-1 border border-white text-[8px] pixel-font text-white hover:bg-white hover:text-red-600">DENY</button>
          </div>
        </div>
      ))}
      <div className="pixel-box border-4 border-white p-8 bg-black/80 z-10 flex flex-col items-center">
         <div className="text-4xl mb-4">🛡️</div>
         <div className="pixel-font text-[10px] text-white animate-pulse">FIREWALL_ACTIVE</div>
      </div>
    </div>
  );

  const renderStacker = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 gap-10">
      <div className="flex flex-col-reverse gap-3 w-64 border-b-8 border-white pb-2 min-h-[200px] justify-start">
        {subState.stack.map((s: string, idx: number) => (
          <div key={idx} className="bg-blue-600 border-4 border-white p-4 text-white pixel-font text-[10px] text-center shadow-[6px_6px_0_#000] animate-in slide-in-from-top-4">
            {s.toUpperCase()}
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {mission.layers.filter((l: string) => !subState.stack.includes(l)).map((l: string) => (
          <button 
            key={l}
            onClick={() => {
              const nextIndex = subState.stack.length;
              if (l === mission.layers[nextIndex]) {
                const newStack = [...subState.stack, l];
                setSubState((s: any) => ({ ...s, stack: newStack }));
                updateScore(150);
                if (newStack.length === mission.layers.length) {
                  setTimeout(handleWin, 800);
                }
              } else {
                updateScore(-50);
              }
            }}
            className="pixel-button bg-slate-800 border-2 border-white p-3 text-white pixel-font text-[8px] hover:bg-white hover:text-black"
          >
            {l}
          </button>
        ))}
      </div>

      <div className="text-slate-500 pixel-font text-[7px] animate-pulse">
        REMAINING_LAYERS: {mission.layers.length - subState.stack.length}
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
      {/* Background CRT and Grid */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {!isActive ? (
        <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-10 text-center">
          <h2 className="pixel-font text-blue-500 text-3xl mb-4">MISSION_{levelId}: {mission.name}</h2>
          <div className="w-16 h-1 border-b-4 border-blue-500 mb-6" />
          <p className="pixel-font text-white text-[10px] mb-10 max-w-lg leading-relaxed uppercase tracking-tight">{mission.instructions}</p>
          <button 
            onClick={() => { setIsActive(true); soundService.playPowerUp(); }} 
            className="pixel-button bg-white text-black px-12 py-5 hover:bg-blue-600 hover:text-white transition-all shadow-[8px_8px_0_#000] text-lg font-black"
          >
            INITIALIZE_LEVEL
          </button>
        </div>
      ) : isSuccess ? (
        <div className="absolute inset-0 z-[200] bg-blue-600 flex flex-col items-center justify-center animate-in fade-in duration-500">
           <div className="pixel-font text-white text-5xl mb-4 animate-bounce font-black">SYNC_COMPLETE</div>
           <div className="pixel-font text-white text-xs opacity-70 tracking-widest uppercase">CHAPTER {levelId} KNOWLEDGE INTEGRATED</div>
           <div className="mt-12 w-64 h-2 bg-white/20 border-2 border-white relative overflow-hidden">
             <div className="h-full bg-white animate-[progress_2s_linear] shadow-[0_0_15px_white]" style={{width: '100%'}} />
           </div>
        </div>
      ) : (
        <>
          <div className="absolute top-4 left-4 right-4 flex justify-between pixel-font text-[10px] z-[100] pointer-events-none">
            <div className="bg-black border-2 border-white p-2 text-white shadow-[4px_4px_0_#000]">SCORE: {score} / 400</div>
            <div className={`bg-black border-2 p-2 shadow-[4px_4px_0_#000] ${gameTime < 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-white text-white'}`}>
              TIME: {gameTime}s
            </div>
          </div>
          {renderCurrentGame()}
        </>
      )}
    </div>
  );
};

export default PuzzleStage;