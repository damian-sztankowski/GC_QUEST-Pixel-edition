
import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';
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
  sprite?: string;
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

const CATEGORY_SPRITES: Record<string, string> = {
  'IaaS': '🧱',
  'PaaS': '🏗️',
  'SaaS': '📦',
  'SQL': '🗄️',
  'NoSQL': '📊',
  'Object': '☁️',
  'Pre-trained': '🧠',
  'Custom': '🛠️',
  'MLOps': '🚀',
  'Compute': '⚡',
  'Container': '🐳',
  'Serverless': '🔥',
  'Network': '🌐',
  'Identity': '🔑',
  'Data': '🔒',
  'SRE': '📈',
  'DevOps': '🛠️',
  'Operations': '🕵️',
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
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number}[]>([]);
  
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
    
    // Create background stars
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
    
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
        y: -10,
        type: type,
        label: label,
        vy: puzzleType === 'DEFENDER' ? 0.6 : 1.2,
        sprite: CATEGORY_SPRITES[type] || '👾'
      };
      setItems(prev => [...prev, newItem]);
    }, 1000);

    const physicsLoop = setInterval(() => {
      // Move Items
      setItems(prev => {
        const next = prev.map(item => ({ ...item, y: item.y + (item.vy || 1) }));
        const remaining: GameObject[] = [];
        
        next.forEach(item => {
          if (puzzleType === 'CATCHER') {
            const isCaught = item.y >= 82 && item.y <= 90 && Math.abs(item.x - basketXRef.current) < 10;
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
          const next = prev.map(p => ({ ...p, y: p.y - 6 })).filter(p => p.y > -10);
          
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
    }, 16);

    return () => {
      clearInterval(itemSpawner);
      clearInterval(physicsLoop);
    };
  }, [isActive, config, isSuccess, puzzleType]);

  // SORTER MECHANICS
  useEffect(() => {
    if (!isActive || isSuccess || puzzleType !== 'SORTER') return;
    
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
         y: 20 + Math.floor(i / 3) * 20,
         sprite: CATEGORY_SPRITES[type] || '📁'
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
          <div className="grid grid-cols-3 gap-8 p-16 relative z-10">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => handleSorterClick(item)}
                className="pixel-box bg-[#111] hover:bg-blue-900 p-8 pixel-font text-[10px] text-white uppercase font-black transition-all transform hover:scale-105 active:scale-90 border-4 shadow-[8px_8px_0_#000] flex flex-col items-center gap-4"
              >
                <div className="text-4xl animate-pixel-float">{item.sprite}</div>
                <div className="text-center">{item.label}</div>
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
                className={`absolute pixel-box px-4 py-2 border-2 border-white whitespace-nowrap shadow-[4px_4px_0_#000] flex items-center gap-2 ${
                  item.type === targetCategory ? 'bg-blue-600 animate-pulse border-blue-300' : 'bg-slate-800 grayscale opacity-90'
                }`}
                style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`, 
                  transform: 'translateX(-50%)',
                  zIndex: 5
                }}
              >
                <span className="text-xl">{item.sprite}</span>
                <div className="pixel-font text-[8px] text-white uppercase font-black tracking-tighter">
                  {item.label}
                </div>
              </div>
            ))}

            {projectiles.map(p => (
              <div 
                key={p.id}
                className="absolute w-2 h-6 bg-yellow-400 border-x-2 border-white shadow-[0_0_8px_#fbbf24]"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translateX(-50%)' }}
              />
            ))}

            {/* PLAYER UNIT */}
            <div 
              className={`absolute bottom-6 h-20 w-32 border-4 border-white ${puzzleType === 'DEFENDER' ? 'bg-red-700' : 'bg-blue-700'} shadow-[0_12px_0_#000] z-10 transition-colors flex items-center justify-center`}
              style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute -top-8 left-0 w-full text-center pixel-font text-[8px] text-white font-black bg-black border-2 border-white px-2 py-1 shadow-[2px_2px_0_#000]">
                 {puzzleType === 'DEFENDER' ? '[ LASER_TURRET ]' : '[ DECRYPTOR_v3 ]'}
              </div>
              <div className="absolute inset-2 border-2 border-white/20 animate-pulse" />
              <div className="text-3xl drop-shadow-md">{puzzleType === 'DEFENDER' ? '🔫' : '🛒'}</div>
              
              {puzzleType === 'DEFENDER' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-4 h-10 bg-white border-2 border-black" />
              )}
              {/* Extra pixel detailing */}
              <div className="absolute -left-2 top-2 w-2 h-4 bg-white" />
              <div className="absolute -right-2 top-2 w-2 h-4 bg-white" />
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
      className={`relative w-full aspect-video pixel-box border-8 bg-[#020202] overflow-hidden ${puzzleType === 'SORTER' ? 'cursor-default' : 'cursor-none'}`}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        {particles.map(p => (
          <div 
            key={p.id} 
            className="absolute bg-white rounded-full animate-pulse" 
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`, 
              width: `${p.size}px`, 
              height: `${p.size}px`,
              opacity: Math.random() * 0.5 + 0.2
            }} 
          />
        ))}
        {/* Subtle Scanlines Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] pointer-events-none" />
      </div>

      {!isActive ? (
        <div className="absolute inset-0 flex flex-row items-center justify-center bg-black z-30 border-4 border-white m-4 gap-12 animate-in fade-in duration-300">
          <div className="text-left max-w-sm">
            <div className="pixel-font text-white text-5xl mb-6 animate-pixel-float font-black tracking-tighter">INIT_{puzzleType}</div>
            <div className="pixel-font text-yellow-400 text-[10px] leading-relaxed font-black mb-8 border-l-4 border-yellow-500 pl-4">
              OBJECTIVE: {puzzleType === 'SORTER' ? 'VALIDATE_DATA_NODES' : puzzleType === 'DEFENDER' ? 'INTERCEPT_THREATS' : 'RECOVER_STRAY_PACKETS'}<br/>
              THRESHOLD: 200_INTEGRITY_REQUIRED
            </div>
            <div className="bg-[#111] border-4 border-white p-6 shadow-[8px_8px_0_#000]">
              <div className="text-[10px] text-blue-400 pixel-font mb-3 uppercase">Priority_Target</div>
              <div className="flex items-center gap-4">
                 <div className="text-4xl">{CATEGORY_SPRITES[targetCategory] || '📡'}</div>
                 <div className="text-3xl text-white pixel-font font-black">{targetCategory}</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 border-4 border-white p-8 max-w-xs shadow-[8px_8px_0_#000]">
             <div className="text-[12px] text-green-400 pixel-font mb-6 uppercase underline font-bold">LEGITIMATE_SERVICES:</div>
             <div className="space-y-3">
                {allowedItems.map((item, i) => (
                  <div key={i} className="text-[12px] text-white pixel-font flex items-center font-bold">
                    <span className="text-yellow-500 mr-3 animate-pulse">>>></span> {item.toUpperCase()}
                  </div>
                ))}
             </div>
          </div>
        </div>
      ) : isSuccess ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-40 animate-in fade-in zoom-in duration-500">
           <div className="pixel-font text-white text-7xl mb-6 font-black tracking-tighter shadow-green-900 drop-shadow-xl animate-pixel-float">LINK_ESTABLISHED</div>
           <div className="pixel-font text-green-400 text-2xl animate-pulse font-black">RESOURCES_SYNCHRONIZED...</div>
           <div className="mt-12 text-white pixel-font text-sm font-bold bg-green-900 px-6 py-2 border-2 border-white">TIME_BONUS: +{gameTime * 10}</div>
           <div className="absolute top-1/2 left-0 w-full h-1 bg-white/20 animate-pixel-float" />
        </div>
      ) : (
        <>
          <div className="absolute top-6 left-6 right-6 flex justify-between z-10 pointer-events-none">
            <div className="pixel-box bg-black border-4 border-blue-500 p-4 shadow-[4px_4px_0_#000] flex items-center gap-3">
              <div className="text-2xl">{CATEGORY_SPRITES[targetCategory]}</div>
              <div>
                <div className="text-[8px] text-slate-400 pixel-font mb-1 uppercase font-bold">Target</div>
                <div className="text-sm text-white pixel-font font-black">{targetCategory}</div>
              </div>
            </div>
            
            <div className="pixel-box bg-black border-4 border-red-500 p-4 shadow-[4px_4px_0_#000] min-w-[140px] text-center">
              <div className="text-[8px] text-slate-400 pixel-font mb-1 uppercase font-bold">Stability_Loss</div>
              <div className={`text-xl pixel-font font-black ${gameTime < 7 ? 'text-red-500 animate-pulse' : 'text-red-400'}`}>{gameTime}s</div>
            </div>

            <div className="pixel-box bg-black border-4 border-green-500 p-4 shadow-[4px_4px_0_#000]">
              <div className="text-[8px] text-slate-400 pixel-font mb-1 uppercase font-bold">Data_Integrity</div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-green-400 pixel-font font-black">{score} / 200</div>
                <div className="w-24 h-3 bg-slate-900 border-2 border-white">
                  <div className="h-full bg-green-500 transition-all shadow-[inset_-2px_-2px_0_#1a5e20]" style={{ width: `${(score/200)*100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {renderGame()}

          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-1 bg-white animate-[scanline_3s_linear_infinite]" />
          </div>
        </>
      )}

      {/* BREACH FAILED SCREEN - MORE OPAQUE AND PIXEL ART */}
      {gameTime === 0 && !isSuccess && isActive && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 animate-in fade-in duration-500 p-12">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="text-8xl mb-8 animate-pixel-float grayscale">🚫</div>
          <div className="pixel-font text-red-600 text-7xl mb-8 font-black tracking-tighter drop-shadow-[0_8px_0_#450a0a]">BREACH_FAILED</div>
          <div className="pixel-font text-white text-[10px] mb-12 uppercase font-black text-center max-w-lg leading-loose bg-red-950/50 p-6 border-2 border-red-900 border-dashed">
            SECURITY_HANDSHAKE_TIMEOUT.<br/>
            BIT_STREAM_CORRUPTED.<br/>
            INTRUSION_DETECTED_RESETTING_NODE...
          </div>
          <div 
            onClick={() => window.location.reload()} 
            className="pixel-button bg-red-800 text-white px-16 py-8 pixel-font text-xl font-black animate-pulse cursor-pointer border-4 border-white shadow-[8px_8px_0_#000] hover:bg-red-700 active:translate-y-2"
          >
            REINITIALIZING...
          </div>
          <div className="absolute bottom-10 w-full text-center pixel-font text-[8px] text-slate-600 font-black">
             ERROR_CODE: 0x80042109 // KERNEL_PANIC
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleStage;
