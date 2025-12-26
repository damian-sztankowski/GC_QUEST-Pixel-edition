
import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';

interface PuzzleStageProps {
  levelId: number;
  onComplete: (bonusScore: number) => void;
}

interface GameObject {
  id: number;
  x: number;
  y: number;
  type: string;
  label: string;
}

const SYLLABUS_ITEMS: Record<number, { items: string[], categories: string[] }> = {
  1: { items: ['Compute Engine', 'Cloud Run', 'Gmail', 'VPC', 'BigQuery', 'Salesforce'], categories: ['IaaS', 'PaaS', 'SaaS'] },
  2: { items: ['Cloud SQL', 'Firestore', 'Bigtable', 'Spanner', 'Cloud Storage'], categories: ['SQL', 'NoSQL', 'Object'] },
  3: { items: ['Vision API', 'Vertex AI', 'AutoML', 'BigQuery ML', 'TensorFlow'], categories: ['Pre-trained', 'Custom', 'MLOps'] },
  4: { items: ['Virtual Machine', 'Docker Image', 'Cloud Function', 'Kubernetes'], categories: ['Compute', 'Container', 'Serverless'] },
  5: { items: ['Cloud Armor', 'IAM Policy', 'Cloud KMS', 'VPC SC'], categories: ['Network', 'Identity', 'Data'] },
  6: { items: ['Error Budget', 'Burn Rate', 'SLA', 'Latency'], categories: ['SRE', 'DevOps', 'Operations'] },
};

const PuzzleStage: React.FC<PuzzleStageProps> = ({ levelId, onComplete }) => {
  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(25);
  const [isActive, setIsActive] = useState(false);
  
  // Refs to prevent interval re-renders and logic resets
  const basketXRef = useRef(50);
  const targetCategoryRef = useRef('');
  const gameRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef(0);

  const config = SYLLABUS_ITEMS[levelId] || SYLLABUS_ITEMS[1];
  const targetCategory = config.categories[0]; 
  
  useEffect(() => {
    targetCategoryRef.current = targetCategory;
    soundService.playSiren();
    const startTimeout = setTimeout(() => setIsActive(true), 2000);
    return () => clearTimeout(startTimeout);
  }, [targetCategory]);

  // Handle game timer
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setGameTime(t => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive]);

  // Handle game logic (Item Spawning & Movement)
  useEffect(() => {
    if (!isActive) return;

    // Spawner
    const itemSpawner = setInterval(() => {
      const newItem: GameObject = {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: -10, // Start slightly off-screen
        type: config.categories[Math.floor(Math.random() * config.categories.length)],
        label: config.items[Math.floor(Math.random() * config.items.length)]
      };
      setItems(prev => [...prev, newItem]);
    }, 1000);

    // Physics Loop
    const physicsLoop = setInterval(() => {
      setItems(prev => {
        const next = prev.map(item => ({ ...item, y: item.y + 1.2 }));
        
        // Check collisions
        const remaining: GameObject[] = [];
        next.forEach(item => {
          const isCaught = item.y >= 85 && item.y <= 92 && Math.abs(item.x - basketXRef.current) < 12;
          
          if (isCaught) {
            if (item.type === targetCategoryRef.current) {
              scoreRef.current += 50;
              setScore(scoreRef.current);
              soundService.playBlip();
            } else {
              scoreRef.current = Math.max(0, scoreRef.current - 25);
              setScore(scoreRef.current);
              soundService.playIncorrect();
            }
            // Item is caught, don't add to remaining
          } else if (item.y < 100) {
            remaining.push(item);
          }
        });
        
        return remaining;
      });
    }, 20);

    return () => {
      clearInterval(itemSpawner);
      clearInterval(physicsLoop);
    };
  }, [isActive, config]);

  // Handle Win/Loss Condition
  useEffect(() => {
    if (gameTime === 0 && isActive) {
      if (score >= 200) {
        soundService.playLevelComplete();
        onComplete(score);
      } else {
        // Reset for retry
        setGameTime(20);
        setScore(0);
        scoreRef.current = 0;
        setItems([]);
        soundService.playIncorrect();
      }
    }
  }, [gameTime, score, isActive, onComplete]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(8, Math.min(92, x));
    setBasketX(clampedX);
    basketXRef.current = clampedX;
  };

  return (
    <div 
      ref={gameRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video pixel-box border-8 bg-black overflow-hidden cursor-none"
    >
      {/* Dynamic Background Stars */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white animate-pulse"></div>
         <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white animate-pulse delay-75"></div>
         <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white animate-pulse delay-150"></div>
         <div className="absolute top-1/3 left-10 w-1 h-1 bg-white animate-pulse delay-300"></div>
      </div>

      {!isActive ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/60 backdrop-blur-md z-20 border-4 border-white m-4">
          <div className="pixel-font text-white text-4xl mb-6 animate-pixel-float uppercase font-black">Interlock_Engagement</div>
          <div className="pixel-font text-yellow-400 text-sm text-center max-w-lg px-10 leading-loose font-black">
            MISSION: FILTER_INCOMING_TRAFFIC<br/>
            CATCH_ONLY: <span className="text-white text-2xl bg-blue-600 px-6 py-2 border-4 border-white inline-block mt-4 shadow-[4px_4px_0_#000]">{targetCategory}</span><br/>
            <span className="text-[10px] mt-4 block text-slate-300">AVOID_UNCATEGORIZED_PACKETS</span>
          </div>
        </div>
      ) : (
        <>
          {/* HUD Overlay */}
          <div className="absolute top-6 left-6 right-6 flex justify-between z-10 pointer-events-none">
            <div className="pixel-box bg-black/90 p-3 border-2 border-blue-500 shadow-[4px_4px_0_#000]">
              <div className="text-[8px] text-slate-400 pixel-font mb-1 uppercase">Target_Type</div>
              <div className="text-sm text-yellow-500 pixel-font font-black">{targetCategory}</div>
            </div>
            
            <div className="pixel-box bg-black/90 p-3 border-2 border-red-500 shadow-[4px_4px_0_#000]">
              <div className="text-[8px] text-slate-400 pixel-font mb-1 uppercase">Time_Left</div>
              <div className={`text-sm pixel-font font-black ${gameTime < 7 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>{gameTime}s</div>
            </div>

            <div className="pixel-box bg-black/90 p-3 border-2 border-green-500 shadow-[4px_4px_0_#000]">
              <div className="text-[8px] text-slate-400 pixel-font mb-1 uppercase">Integrity</div>
              <div className="text-sm text-blue-400 pixel-font font-black">{score} / 200</div>
            </div>
          </div>

          {/* Falling Items */}
          {items.map(item => (
            <div 
              key={item.id}
              className={`absolute pixel-box px-4 py-2 border-2 border-white whitespace-nowrap shadow-[4px_4px_0_#000] ${
                item.type === targetCategory ? 'bg-blue-900' : 'bg-slate-800'
              }`}
              style={{ 
                left: `${item.x}%`, 
                top: `${item.y}%`, 
                transform: 'translateX(-50%)',
                zIndex: 5
              }}
            >
              <div className="pixel-font text-[10px] text-white uppercase font-black tracking-tighter">
                {item.label}
              </div>
            </div>
          ))}

          {/* Player Decryptor */}
          <div 
            className="absolute bottom-6 h-14 w-28 border-x-4 border-b-8 border-white bg-blue-600/40 shadow-[0_6px_0_#4285F4] z-10"
            style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute -top-6 left-0 w-full text-center pixel-font text-[8px] text-white font-black bg-black border-2 border-white px-1">
               [ DECRYPTOR_v2 ]
            </div>
            <div className="absolute inset-0 bg-blue-400/20 animate-pulse"></div>
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-white/50"></div>
          </div>

          {/* Scanning Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-1 bg-white animate-[scanline_4s_linear_infinite]" />
          </div>
        </>
      )}

      {/* Fail Overlay */}
      {gameTime === 0 && score < 200 && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 animate-in fade-in duration-500">
          <div className="pixel-font text-red-600 text-5xl mb-6 font-black tracking-tighter shadow-red-900 drop-shadow-lg">HANDSHAKE_FAILED</div>
          <div className="pixel-font text-white text-xs mb-8 uppercase font-black">Insufficient_Data_Integrity_To_Unlock_Chapter</div>
          <div className="pixel-button bg-red-800 text-white px-8 py-4 pixel-font text-sm font-black animate-pulse">RETRYING_CONNECTION...</div>
        </div>
      )}
    </div>
  );
};

export default PuzzleStage;
