
import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';
// Fix: LEVELS is exported from constants.ts, not types.ts
import { PuzzleType } from '../types';
import { LEVELS } from '../constants';

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
  vx?: number;
  vy?: number;
}

const CATEGORY_MAP: Record<string, string[]> = {
  'IaaS': ['Compute Engine', 'VPC', 'Virtual Machine'],
  'PaaS': ['Cloud Run', 'App Engine', 'Cloud Functions'],
  'SaaS': ['Gmail', 'Salesforce', 'Workspace'],
  'SQL': ['Cloud SQL', 'Spanner'],
  'NoSQL': ['Firestore', 'Bigtable'],
  'Object': ['Cloud Storage'],
  'Pre-trained': ['Vision API', 'Natural Language', 'Translate'],
  'Custom': ['Vertex AI', 'AutoML'],
  'MLOps': ['TensorFlow', 'Kubeflow'],
  'Compute': ['Compute Engine', 'VM'],
  'Container': ['GKE', 'Cloud Run'],
  'Serverless': ['Cloud Functions', 'App Engine'],
  'Network': ['Cloud Armor', 'VPC SC'],
  'Identity': ['IAM', 'Cloud Identity'],
  'Data': ['KMS', 'Encryption'],
  'SRE': ['Error Budget', 'SLA', 'SLO'],
  'DevOps': ['CI/CD', 'Cloud Build'],
  'Operations': ['Cloud Monitoring', 'Logging'],
};

const SYLLABUS_ITEMS: Record<number, { items: string[], categories: string[] }> = {
  1: { items: ['Compute Engine', 'Cloud Run', 'Gmail', 'VPC', 'BigQuery', 'Salesforce'], categories: ['IaaS', 'PaaS', 'SaaS'] },
  2: { items: ['Cloud SQL', 'Firestore', 'Bigtable', 'Spanner', 'Cloud Storage'], categories: ['SQL', 'NoSQL', 'Object'] },
  3: { items: ['Vision API', 'Vertex AI', 'AutoML', 'BigQuery ML', 'TensorFlow'], categories: ['Pre-trained', 'Custom', 'MLOps'] },
  4: { items: ['Compute Engine', 'GKE', 'Cloud Run', 'Cloud Functions'], categories: ['Compute', 'Container', 'Serverless'] },
  5: { items: ['Cloud Armor', 'IAM', 'KMS', 'VPC SC'], categories: ['Network', 'Identity', 'Data'] },
  6: { items: ['Error Budget', 'Cloud Build', 'Cloud Monitoring', 'SLA'], categories: ['SRE', 'DevOps', 'Operations'] },
};

const PuzzleStage: React.FC<PuzzleStageProps> = ({ levelId, onComplete }) => {
  const level = LEVELS.find(l => l.id === levelId) || LEVELS[0];
  const puzzleType: PuzzleType = level.puzzleType;

  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // For Sorter Game
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // For Defender Game
  const [projectiles, setProjectiles] = useState<{id: number, x: number, y: number}[]>([]);

  const basketXRef = useRef(50);
  const targetCategoryRef = useRef('');
  const gameRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef(0);

  const config = SYLLABUS_ITEMS[levelId] || SYLLABUS_ITEMS[1];
  const targetCategory = config.categories[0]; 
  const allowedItems = CATEGORY_MAP[targetCategory] || [];
  
  useEffect(() => {
    targetCategoryRef.current = targetCategory;
    soundService.playSiren();
    const startTimeout = setTimeout(() => setIsActive(true), 3000);
    return () => clearTimeout(startTimeout);
  }, [targetCategory]);

  useEffect(() => {
    if (!isActive || isSuccess) return;
    const timer = setInterval(() => {
      setGameTime(t => (t <= 0 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, isSuccess]);

  // CATCHER & DEFENDER MECHANICS
  useEffect(() => {
    if (!isActive || isSuccess || puzzleType === 'SORTER') return;

    const itemSpawner = setInterval(() => {
      const allPossibleItems = config.items;
      const label = allPossibleItems[Math.floor(Math.random() * allPossibleItems.length)];
      
      let type = 'Noise';
      for (const [cat, labels] of Object.entries(CATEGORY_MAP)) {
        if (labels.includes(label)) {
          type = cat;
          break;
        }
      }

      const newItem: GameObject = {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: puzzleType === 'DEFENDER' ? -10 : -10,
        type: type,
        label: label,
        vy: puzzleType === 'DEFENDER' ? 0.8 : 1.4
      };
      setItems(prev => [...prev, newItem]);
    }, 1200);

    const physicsLoop = setInterval(() => {
      // Move Items
      setItems(prev => {
        const next = prev.map(item => ({ ...item, y: item.y + (item.vy || 1) }));
        const remaining: GameObject[] = [];
        
        next.forEach(item => {
          if (puzzleType === 'CATCHER') {
            const isCaught = item.y >= 85 && item.y <= 92 && Math.abs(item.x - basketXRef.current) < 12;
            if (isCaught) {
              if (item.type === targetCategoryRef.current) {
                scoreRef.current += 50;
                setScore(scoreRef.current);
                soundService.playBlip();
                if (scoreRef.current >= 200) setIsSuccess(true);
              } else {
                scoreRef.current = Math.max(0, scoreRef.current - 25);
                setScore(scoreRef.current);
                soundService.playIncorrect();
              }
            } else if (item.y < 105) {
              remaining.push(item);
            }
          } else if (puzzleType === 'DEFENDER') {
            if (item.y < 105) remaining.push(item);
          }
        });
        return remaining;
      });

      // Move Projectiles for Defender
      if (puzzleType === 'DEFENDER') {
        setProjectiles(prev => {
          const next = prev.map(p => ({ ...p, y: p.y - 5 })).filter(p => p.y > -10);
          
          // Collision Detection
          setItems(currentItems => {
            const hitItems = new Set<number>();
            next.forEach(p => {
              currentItems.forEach(item => {
                const dx = Math.abs(p.x - item.x);
                const dy = Math.abs(p.y - item.y);
                if (dx < 6 && dy < 6) {
                   hitItems.add(item.id);
                   if (item.type === targetCategoryRef.current) {
                      scoreRef.current += 50;
                      setScore(scoreRef.current);
                      soundService.playBlip();
                      if (scoreRef.current >= 200) setIsSuccess(true);
                   } else {
                      scoreRef.current = Math.max(0, scoreRef.current - 20);
                      setScore(scoreRef.current);
                      soundService.playIncorrect();
                   }
                }
              });
            });
            return currentItems.filter(i => !hitItems.has(i.id));
          });
          
          return next;
        });
      }
    }, 20);

    return () => {
      clearInterval(itemSpawner);
      clearInterval(physicsLoop);
    };
  }, [isActive, config, isSuccess, puzzleType]);

  // SORTER MECHANICS
  useEffect(() => {
    if (!isActive || isSuccess || puzzleType !== 'SORTER') return;
    
    // Initialize random items on screen
    const initialItems = config.items.map((label, i) => {
       let type = 'Noise';
       for (const [cat, labels] of Object.entries(CATEGORY_MAP)) {
         if (labels.includes(label)) { type = cat; break; }
       }
       return {
         id: i,
         label,
         type,
         x: 15 + (i % 3) * 35,
         y: 20 + Math.floor(i / 3) * 20
       };
    });
    setItems(initialItems);
  }, [isActive, isSuccess, puzzleType]);

  const handleSorterClick = (item: GameObject) => {
    if (item.type === targetCategory) {
      setScore(s => {
        const ns = s + 50;
        scoreRef.current = ns;
        if (ns >= 200) setIsSuccess(true);
        return ns;
      });
      soundService.playBlip();
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setScore(s => Math.max(0, s - 25));
      soundService.playIncorrect();
    }
  };

  const handleDefenderClick = () => {
    if (puzzleType !== 'DEFENDER' || isSuccess) return;
    setProjectiles(prev => [...prev, { id: Math.random(), x: basketX, y: 85 }]);
    soundService.playClick();
  };

  useEffect(() => {
    if (isSuccess) {
      soundService.playLevelComplete();
      const finishTimeout = setTimeout(() => onComplete(scoreRef.current + gameTime * 10), 2000);
      return () => clearTimeout(finishTimeout);
    }
  }, [isSuccess]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameRef.current || isSuccess) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(8, Math.min(92, x));
    setBasketX(clampedX);
    basketXRef.current = clampedX;
  };

  const renderGame = () => {
    switch (puzzleType) {
      case 'SORTER':
        return (
          <div className="grid grid-cols-3 gap-6 p-12">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => handleSorterClick(item)}
                className="pixel-box bg-[#111] hover:bg-blue-900 p-6 pixel-font text-[10px] text-white uppercase font-black transition-all transform hover:scale-110 active:scale-95 border-4"
              >
                {item.label}
              </button>
            ))}
          </div>
        );
      case 'DEFENDER':
      case 'CATCHER':
      default:
        return (
          <>
            {items.map(item => (
              <div 
                key={item.id}
                className={`absolute pixel-box px-4 py-2 border-2 border-white whitespace-nowrap shadow-[4px_4px_0_#000] ${
                  item.type === targetCategory ? 'bg-blue-600 animate-pulse' : 'bg-slate-800 grayscale opacity-80'
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

            {projectiles.map(p => (
              <div 
                key={p.id}
                className="absolute w-2 h-4 bg-yellow-400 border-x-2 border-white"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translateX(-50%)' }}
              />
            ))}

            <div 
              className={`absolute bottom-6 h-16 w-32 border-x-4 border-b-8 border-white ${puzzleType === 'DEFENDER' ? 'bg-red-600' : 'bg-blue-600/40'} shadow-[0_8px_0_#4285F4] z-10 transition-colors`}
              style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute -top-6 left-0 w-full text-center pixel-font text-[8px] text-white font-black bg-black border-2 border-white px-2 py-1">
                 {puzzleType === 'DEFENDER' ? '[ LASER_TURRET ]' : '[ DECRYPTOR_v3 ]'}
              </div>
              <div className="absolute inset-0 bg-blue-400/20 animate-pulse" />
              {puzzleType === 'DEFENDER' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-4 h-8 bg-white border-2 border-black" />
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div 
      ref={gameRef}
      onMouseMove={handleMouseMove}
      onClick={handleDefenderClick}
      className={`relative w-full aspect-video pixel-box border-8 bg-[#050505] overflow-hidden ${puzzleType === 'SORTER' ? 'cursor-default' : 'cursor-none'}`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white animate-pulse" />
         <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white animate-pulse delay-75" />
         <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white animate-pulse delay-150" />
      </div>

      {!isActive ? (
        <div className="absolute inset-0 flex flex-row items-center justify-center bg-blue-950/80 backdrop-blur-md z-20 border-4 border-white m-4 gap-8">
          <div className="text-left max-w-sm">
            <div className="pixel-font text-white text-3xl mb-4 animate-pixel-float font-black">{puzzleType}_MISSION</div>
            <div className="pixel-font text-yellow-400 text-xs leading-relaxed font-black mb-4">
              CHALLENGE: {puzzleType === 'SORTER' ? 'SELECT_VALID_NODES' : puzzleType === 'DEFENDER' ? 'ELIMINATE_TARGETS' : 'VALIDATE_TRAFFIC'}<br/>
              GOAL: 200_INTEGRITY
            </div>
            <div className="bg-black border-2 border-white p-4">
              <div className="text-[8px] text-blue-400 pixel-font mb-2 uppercase">Target_Type</div>
              <div className="text-xl text-white pixel-font font-black">{targetCategory}</div>
            </div>
          </div>
          <div className="bg-slate-900 border-4 border-white p-6 max-w-xs">
             <div className="text-[10px] text-green-400 pixel-font mb-4 uppercase underline">System_Manual:</div>
             <div className="space-y-2">
                {allowedItems.map((item, i) => (
                  <div key={i} className="text-[10px] text-white pixel-font flex items-center">
                    <span className="text-yellow-500 mr-2">></span> {item.toUpperCase()}
                  </div>
                ))}
             </div>
          </div>
        </div>
      ) : isSuccess ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-950/90 z-40 animate-in fade-in zoom-in duration-300">
           <div className="pixel-font text-white text-6xl mb-4 font-black tracking-tighter shadow-green-900 drop-shadow-xl">ACCESS_GRANTED</div>
           <div className="pixel-font text-green-400 text-xl animate-pulse font-black">CHAPTER_UNLOCKED...</div>
           <div className="mt-8 text-white pixel-font text-[10px]">TIME_BONUS: +{gameTime * 10}</div>
        </div>
      ) : (
        <>
          <div className="absolute top-6 left-6 right-6 flex justify-between z-10 pointer-events-none">
            <div className="pixel-box bg-black/90 p-3 border-2 border-blue-500 shadow-[4px_4px_0_#000]">
              <div className="text-[8px] text-slate-400 pixel-font mb-1 uppercase">Target</div>
              <div className="text-sm text-yellow-500 pixel-font font-black">{targetCategory}</div>
            </div>
            
            <div className="pixel-box bg-black/90 p-3 border-2 border-red-500 shadow-[4px_4px_0_#000] min-w-[100px] text-center">
              <div className="text-[8px] text-slate-400 pixel-font mb-1 uppercase">Breach_Timer</div>
              <div className={`text-sm pixel-font font-black ${gameTime < 7 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>{gameTime}s</div>
            </div>

            <div className="pixel-box bg-black/90 p-3 border-2 border-green-500 shadow-[4px_4px_0_#000]">
              <div className="text-[8px] text-slate-400 pixel-font mb-1 uppercase">Decryption_Progress</div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-blue-400 pixel-font font-black">{score} / 200</div>
                <div className="w-20 h-2 bg-slate-800 border-2 border-white">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${(score/200)*100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {renderGame()}

          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-1 bg-white animate-[scanline_4s_linear_infinite]" />
          </div>
        </>
      )}

      {gameTime === 0 && !isSuccess && isActive && (
        <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
          <div className="pixel-font text-red-600 text-6xl mb-6 font-black tracking-tighter shadow-red-900 drop-shadow-lg">BREACH_FAILED</div>
          <div className="pixel-font text-white text-xs mb-8 uppercase font-black text-center max-w-md leading-loose">
            Security_Protocol_Active.<br/> Handshake_Signature_Mismatch.<br/> System_Resetting...
          </div>
          <div 
            onClick={() => window.location.reload()} 
            className="pixel-button bg-red-800 text-white px-12 py-6 pixel-font text-lg font-black animate-pulse cursor-pointer"
          >
            REINITIALIZING...
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleStage;
