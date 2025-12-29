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
  const isSuccessRef = useRef(false);

  const config = SYLLABUS_ITEMS[levelId] || SYLLABUS_ITEMS[1];
  const targetCategory = config.categories[0]; 
  const allowedItems = CATEGORY_MAP[targetCategory] || [];

  const winThreshold = useRef(200);
  
  useEffect(() => {
    targetCategoryRef.current = targetCategory;
    soundService.playSiren();
    const startTimeout = setTimeout(() => setIsActive(true), 3000);
    
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);

    if (puzzleType === 'SORTER') {
       const correctItems = config.items.filter(label => {
         let type = 'Noise';
         for (const [cat, labels] of Object.entries(CATEGORY_MAP)) {
           if (labels.includes(label)) { type = cat; break; }
         }
         return type === targetCategory;
       });
       winThreshold.current = correctItems.length * 50;
    } else {
       winThreshold.current = 200;
    }
    
    return () => clearTimeout(startTimeout);
  }, [targetCategory, levelId, puzzleType]);

  useEffect(() => {
    if (!isActive || isSuccess) return;
    const timer = setInterval(() => {
      setGameTime(t => (t <= 0 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, isSuccess]);

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
                if (scoreRef.current >= winThreshold.current) {
                  isSuccessRef.current = true;
                  setIsSuccess(true);
                }
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

      if (puzzleType === 'DEFENDER') {
        setProjectiles(prev => {
          const next = prev.map(p => ({ ...p, y: p.y - 6 })).filter(p => p.y > -10);
          
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
                      if (scoreRef.current >= winThreshold.current) {
                        isSuccessRef.current = true;
                        setIsSuccess(true);
                      }
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
  }, [isActive, isSuccess, puzzleType, config]);

  const handleSorterClick = (item: GameObject) => {
    if (item.type === targetCategory) {
      setScore(s => {
        const ns = s + 50;
        scoreRef.current = ns;
        if (ns >= winThreshold.current) {
          isSuccessRef.current = true;
          setIsSuccess(true);
        }
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
      const currentScore = scoreRef.current;
      const currentTimeBonus = gameTime * 10;
      const finishTimeout = setTimeout(() => {
        onComplete(currentTimeBonus); // Send only bonus to parent
      }, 3000);
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 p-4 md:p-8 relative z-10 w-full overflow-y-auto max-h-full">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => handleSorterClick(item)}
                className="pixel-box bg-[#111] hover:bg-blue-900 p-3 md:p-4 pixel-font text-[7px] md:text-[9px] text-white uppercase font-black transition-all transform active:scale-95 border-2 flex flex-col items-center gap-2"
              >
                <div className="text-xl md:text-3xl">{item.sprite}</div>
                <div className="text-center break-words w-full leading-tight">{item.label}</div>
              </button>
            ))}
          </div>
        );
      case 'DEFENDER':
      case 'CATCHER':
      default:
        return (
          <div className="w-full h-full relative">
            {items.map(item => (
              <div 
                key={item.id}
                className={`absolute pixel-box px-2 py-1 border-1 border-white whitespace-nowrap shadow-[2px_2px_0_#000] flex items-center gap-1.5 ${
                  item.type === targetCategory ? 'bg-blue-600 animate-pulse border-blue-300' : 'bg-slate-800 grayscale opacity-90'
                }`}
                style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`, 
                  transform: 'translateX(-50%)',
                  zIndex: 5
                }}
              >
                <span className="text-sm md:text-lg">{item.sprite}</span>
                <div className="pixel-font text-[5px] md:text-[7px] text-white uppercase font-black tracking-tighter">
                  {item.label}
                </div>
              </div>
            ))}

            {projectiles.map(p => (
              <div 
                key={p.id}
                className="absolute w-1.5 h-4 bg-yellow-400 border-x-1 border-white shadow-[0_0_5px_#fbbf24]"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translateX(-50%)' }}
              />
            ))}

            <div 
              className={`absolute bottom-4 h-12 md:h-16 w-20 md:w-28 border-3 border-white ${puzzleType === 'DEFENDER' ? 'bg-red-700' : 'bg-blue-700'} z-10 flex items-center justify-center`}
              style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute -top-6 left-0 w-full text-center pixel-font text-[5px] md:text-[7px] text-white font-black bg-black border-1 border-white px-1.5 py-0.5 truncate">
                 {puzzleType === 'DEFENDER' ? 'TURRET' : 'DECRYPTOR'}
              </div>
              <div className="text-xl md:text-2xl">{puzzleType === 'DEFENDER' ? '🔫' : '🛒'}</div>
              {puzzleType === 'DEFENDER' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-2 h-6 bg-white border-1 border-black" />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      ref={gameRef}
      onMouseMove={handleMouseMove}
      onClick={handleDefenderClick}
      className={`relative w-full aspect-video md:aspect-[21/9] lg:aspect-video pixel-box border-4 bg-[#020202] overflow-hidden ${puzzleType === 'SORTER' ? 'cursor-default' : 'cursor-none'} flex flex-col`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {particles.map(p => (
          <div 
            key={p.id} 
            className="absolute bg-white rounded-full" 
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`, 
              width: `${p.size}px`, 
              height: `${p.size}px`,
              opacity: 0.3
            }} 
          />
        ))}
      </div>

      {!isActive ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-30 border-2 border-white m-2 md:m-4 gap-4 animate-in fade-in duration-300 text-center p-4">
          <div className="pixel-font text-white text-xl md:text-4xl mb-2 font-black">INIT_{puzzleType}</div>
          <div className="bg-[#111] border-2 border-white p-3 md:p-6 shadow-[4px_4px_0_#000]">
            <div className="text-[7px] md:text-[10px] text-blue-400 pixel-font mb-2 uppercase">PRIORITY_NODE:</div>
            <div className="flex items-center justify-center gap-3">
               <div className="text-2xl md:text-4xl">{CATEGORY_SPRITES[targetCategory] || '📡'}</div>
               <div className="text-sm md:text-2xl text-white pixel-font font-black">{targetCategory}</div>
            </div>
          </div>
          <div className="text-[7px] md:text-[9px] text-yellow-400 pixel-font font-bold uppercase">STABILIZE SYSTEM_FLOW IN {gameTime}S</div>
        </div>
      ) : isSuccess ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-40 animate-in fade-in zoom-in duration-500 p-4 text-center">
           <div className="pixel-font text-white text-responsive-xl mb-4 font-black tracking-tighter drop-shadow-lg animate-pixel-float uppercase">LINK_RESTORED</div>
           <div className="pixel-font text-green-400 text-xs md:text-lg animate-pulse font-black uppercase">SYNCHRONIZING_DATA_NODES...</div>
           <div className="mt-6 text-white pixel-font text-[8px] md:text-xs font-bold bg-green-900 px-4 py-1.5 border-1 border-white">TIME_BONUS: +{gameTime * 10}</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative">
          <div className="absolute top-2 left-2 right-2 flex justify-between z-10 pointer-events-none gap-2">
            <div className="pixel-box bg-black/80 border-1 border-blue-500 p-1.5 shadow-[2px_2px_0_#000] flex items-center gap-1.5">
              <div className="text-sm">{CATEGORY_SPRITES[targetCategory]}</div>
              <div className="text-[7px] text-white pixel-font font-black leading-none">{targetCategory}</div>
            </div>
            
            <div className="pixel-box bg-black/80 border-1 border-red-500 p-1.5 shadow-[2px_2px_0_#000] text-center">
              <div className={`text-[9px] pixel-font font-black leading-none ${gameTime < 7 ? 'text-red-500 animate-pulse' : 'text-red-400'}`}>{gameTime}S</div>
            </div>

            <div className="pixel-box bg-black/80 border-1 border-green-500 p-1.5 shadow-[2px_2px_0_#000]">
              <div className="text-[9px] text-green-400 pixel-font font-black leading-none">{score}/{winThreshold.current}</div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            {renderGame()}
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 border-1 border-white px-3 py-1 z-20 pixel-font text-[7px] text-yellow-400 font-bold uppercase whitespace-nowrap">
            {puzzleType === 'SORTER' ? `VALIDATE_NODES` : puzzleType === 'DEFENDER' ? `DEFEND_CORE` : `CAPTURE_PACKETS`}
          </div>
        </div>
      )}

      {gameTime === 0 && !isSuccess && isActive && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 p-4 text-center">
          <div className="pixel-font text-red-600 text-2xl md:text-5xl mb-6 font-black uppercase">ACCESS_DENIED</div>
          <button 
            onClick={() => window.location.reload()} 
            className="pixel-button bg-red-800 text-white px-6 py-3 pixel-font text-xs font-black border-2 border-white shadow-[4px_4px_0_#000] uppercase"
          >
            REBOOT_SYSTEM
          </button>
        </div>
      )}
    </div>
  );
};

export default PuzzleStage;