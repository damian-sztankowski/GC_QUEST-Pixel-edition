import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';

// --- Expanded Category Map for all 6 Chapters ---
const CHAPTER_MISSIONS: Record<number, any> = {
  1: { title: "SHARED_RESPONSIBILITY", task: "SORT_CLOUD_MODELS", target: "PaaS", items: ['App Engine', 'Cloud Functions', 'Cloud Run'], noise: ['Compute Engine', 'VMs', 'Gmail', 'Workspace'] },
  2: { title: "DATA_STABILIZER", task: "CAPTURE_ANALYTICS", target: "OLAP", items: ['BigQuery', 'Looker'], noise: ['Cloud SQL', 'Spanner', 'Firestore'] },
  3: { title: "APP_MODERNIZER", task: "SCALE_CONTAINERS", target: "Serverless", items: ['Cloud Run', 'Functions'], noise: ['Compute Engine', 'Bare Metal'] },
  4: { title: "ZERO_TRUST_GATE", task: "ALLOW_IDENTITIES", target: "IAM", items: ['Roles', 'Service Accounts'], noise: ['DDoS Attack', 'SQL Injection'] },
  5: { title: "RELIABILITY_ENGINEER", task: "MAINTAIN_SLO", target: "SRE", items: ['SLI', 'Error Budget'], noise: ['Manual Toil', 'Outage'] },
  6: { title: "BILLING_GUARDIAN", task: "OPTIMIZE_COSTS", target: "Savings", items: ['CUDs', 'Sustained Discounts'], noise: ['Zombie VMs', 'Unused IP'] },
};

const PuzzleStage: React.FC<{levelId: number, onComplete: (score: number) => void}> = ({ levelId, onComplete }) => {
  const mission = CHAPTER_MISSIONS[levelId] || CHAPTER_MISSIONS[1];
  const [items, setItems] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  
  const basketX = useRef(50);
  const scoreRef = useRef(0);
  const gameRef = useRef<HTMLDivElement>(null);

  // --- Game Loop: Spawning ---
  useEffect(() => {
    if (!isActive || isSuccess) return;

    const spawnInterval = setInterval(() => {
      const isTarget = Math.random() > 0.4;
      const label = isTarget 
        ? mission.items[Math.floor(Math.random() * mission.items.length)]
        : mission.noise[Math.floor(Math.random() * mission.noise.length)];

      setItems(prev => [...prev, {
        id: Math.random(),
        x: 10 + Math.random() * 80,
        y: -10,
        label,
        isTarget,
        speed: 1 + (levelId * 0.2) // Levels get faster
      }]);
    }, 900 - (levelId * 50));

    return () => clearInterval(spawnInterval);
  }, [isActive, isSuccess, levelId]);

  // --- Physics Loop ---
  useEffect(() => {
    if (!isActive || isSuccess) return;

    const physics = setInterval(() => {
      setItems(prev => prev.map(item => ({ ...item, y: item.y + item.speed }))
        .filter(item => {
          // Collision Detection
          if (item.y > 82 && item.y < 90 && Math.abs(item.x - basketX.current) < 12) {
            if (item.isTarget) {
              scoreRef.current += 50 * multiplier;
              setScore(scoreRef.current);
              setMultiplier(m => Math.min(m + 0.1, 4));
              soundService.playBlip();
            } else {
              scoreRef.current = Math.max(0, scoreRef.current - 40);
              setScore(scoreRef.current);
              setMultiplier(1);
              soundService.playIncorrect();
            }
            return false;
          }
          return item.y < 100;
        })
      );

      if (scoreRef.current >= 500) setIsSuccess(true);
    }, 16);

    return () => clearInterval(physics);
  }, [isActive, isSuccess, multiplier]);

  // Handle Complete
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => onComplete(score + gameTime * 10), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <div 
      ref={gameRef}
      className="relative w-full aspect-video bg-[#050505] overflow-hidden border-4 border-blue-900 cursor-crosshair"
      onMouseMove={(e) => {
        const rect = gameRef.current?.getBoundingClientRect();
        if (rect) basketX.current = ((e.clientX - rect.left) / rect.width) * 100;
      }}
    >
      {/* CRT Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {!isActive ? (
        <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="pixel-font text-blue-400 text-2xl mb-2">CHAPTER_{levelId}: {mission.title}</h2>
          <p className="pixel-font text-white text-sm mb-6 uppercase tracking-tighter">Mission: {mission.task}</p>
          <div className="bg-blue-900/30 border-2 border-blue-500 p-4 mb-8">
            <span className="text-yellow-400 pixel-font text-[10px]">CATCH THESE:</span>
            <div className="flex gap-2 mt-2">
              {mission.items.map((i: string) => <span key={i} className="bg-white text-black text-[8px] px-2 py-1 pixel-font">{i}</span>)}
            </div>
          </div>
          <button onClick={() => setIsActive(true)} className="pixel-button bg-blue-600 text-white px-6 py-3 pixel-font hover:bg-white hover:text-blue-600 transition-all">START_DEPLOIMENT</button>
        </div>
      ) : (
        <>
          {/* HUD */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pixel-font">
            <div className="bg-black border-2 border-white p-2">
              <div className="text-[8px] text-gray-400">INTEGRITY</div>
              <div className="text-white text-xl">{score}/500</div>
            </div>
            <div className="text-center">
              <div className="text-blue-500 text-xs animate-pulse">{multiplier.toFixed(1)}x COMBO</div>
            </div>
            <div className="bg-black border-2 border-red-500 p-2 text-right">
              <div className="text-[8px] text-gray-400">UPTIME</div>
              <div className="text-red-500 text-xl">{Math.ceil(gameTime)}s</div>
            </div>
          </div>

          {/* Falling Items */}
          {items.map(item => (
            <div 
              key={item.id}
              className={`absolute px-3 py-1 border-2 pixel-font text-[10px] whitespace-nowrap shadow-[4px_4px_0_#000]
                ${item.isTarget ? 'bg-blue-600 border-white text-white' : 'bg-red-900 border-red-400 text-red-200'}`}
              style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translateX(-50%)' }}
            >
              {item.label}
            </div>
          ))}

          {/* Player Catcher (Load Balancer) */}
          <div 
            className="absolute bottom-6 h-6 bg-white border-x-8 border-blue-500 shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center"
            style={{ left: `${basketX.current}%`, width: '15%', transform: 'translateX(-50%)' }}
          >
            <div className="pixel-font text-[8px] text-blue-900 font-bold">LOAD_BALANCER</div>
          </div>
        </>
      )}

      {isSuccess && (
        <div className="absolute inset-0 bg-blue-600 z-[60] flex flex-col items-center justify-center animate-pulse">
          <h1 className="pixel-font text-white text-4xl mb-4">DEPLOYMENT_SUCCESS</h1>
          <p className="pixel-font text-blue-200 uppercase">Chapter {levelId} Mastered</p>
        </div>
      )}
    </div>
  );
};

export default PuzzleStage;