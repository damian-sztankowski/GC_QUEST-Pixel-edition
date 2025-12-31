
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import RoleCard from './components/RoleCard';
import Leaderboard from './components/Leaderboard';
import GameSessionUI from './components/GameSessionUI';
import Avatar from './components/Avatar';
import ChapterMap from './components/ChapterMap';
import AboutSection from './components/AboutSection';
import NotificationSystem from './components/NotificationSystem';
import { GameState, CloudRole, RoleConfig, DifficultyLevel } from './types';
import { ROLES, LEVELS, DIFFICULTY_SETTINGS } from './constants';
import { generateAvatar } from './services/geminiService';
import { soundService } from './services/soundService';
import { notificationService } from './services/notificationService';
import { leaderboardService } from './services/leaderboardService';

const AnimatedScore: React.FC<{ score: number }> = ({ score }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = Math.max(1, score / (duration / 16));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayValue(score);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  return <span>{displayValue.toString().padStart(6, '0')}</span>;
};

type EasterEggStage = 'GLITCH' | 'SHUTDOWN' | 'BLACKOUT' | 'INFO' | null;
type BeaconStage = 'IDLE' | 'INIT' | 'RESPONSE' | 'NETWORK' | 'MESSAGE' | null;

interface BeaconNode {
  id: number;
  x: number;
  y: number;
  color: string;
}

const GlobalBeaconOverlay: React.FC<{ stage: BeaconStage }> = ({ stage }) => {
  const [nodes, setNodes] = useState<BeaconNode[]>([]);
  const googleColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

  useEffect(() => {
    if (stage === 'RESPONSE') {
      const newNodes: BeaconNode[] = [];
      setNodes([]);
      // High density nodes for a "Global" community feel
      for (let i = 0; i < 90; i++) {
        setTimeout(() => {
          setNodes(prev => [...prev, {
            id: i,
            x: Math.floor(Math.random() * 92 + 4),
            y: Math.floor(Math.random() * 92 + 4),
            color: googleColors[Math.floor(Math.random() * googleColors.length)]
          }]);
          soundService.playConnection();
        }, i * 25);
      }
    }
  }, [stage]);

  if (!stage || stage === 'IDLE') return null;

  return (
    <div className="fixed inset-0 z-[7000] bg-black flex items-center justify-center overflow-hidden">
      {/* Background Pixel Grid */}
      <div className="absolute inset-0 pixel-grid opacity-10" />

      {/* Network Constellation lines - Thin, semi-transparent direct connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="web-glow">
            <feGaussianBlur stdDeviation="0.1" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {nodes.map(node => (
          <React.Fragment key={`web-line-${node.id}`}>
            {(stage === 'NETWORK' || stage === 'MESSAGE') && (
              <line 
                x1={node.x}
                y1={node.y}
                x2={50}
                y2={50}
                stroke={node.color} 
                strokeWidth="0.15"
                className="animate-in fade-in duration-1000"
                style={{ 
                  filter: 'url(#web-glow)', 
                  opacity: 0.25,
                }}
              />
            )}
          </React.Fragment>
        ))}
        {/* Secondary Orthogonal "Core" Web - Slightly thicker but very transparent */}
        {(stage === 'NETWORK' || stage === 'MESSAGE') && nodes.filter((_, i) => i % 3 === 0).map(node => (
          <polyline 
            key={`orthogonal-${node.id}`}
            points={`${node.x},${node.y} ${node.x},50 50,50`}
            fill="none"
            stroke={node.color}
            strokeWidth="0.2"
            style={{ opacity: 0.1, strokeDasharray: "1 1" }}
          />
        ))}
      </svg>

      {/* Community Nodes (Pixel dots) */}
      {nodes.map(node => (
        <div 
          key={`node-${node.id}`}
          className="absolute w-1.5 h-1.5 animate-in zoom-in duration-300 z-10"
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`, 
            backgroundColor: node.color,
            boxShadow: `0 0 4px ${node.color}`,
          }} 
        />
      ))}

      {/* Center Stack: Hub and Terminal */}
      <div className="relative z-50 flex flex-col items-center justify-center gap-10 w-full h-full">
        
        {/* The GDE Hub (Representing the Earth icon/Community Center) */}
        <div className={`transition-all duration-1000 ${stage === 'NETWORK' || stage === 'MESSAGE' ? 'scale-110' : 'scale-100'}`}>
          <div className="p-1 bg-white border-4 border-black shadow-[0_0_150px_rgba(255,255,255,0.3)]">
            <div className="p-2 bg-white border-2 border-slate-100">
              <Avatar role="GDE_LOGO" size="xl" animate={false} />
            </div>
          </div>
          
          {stage === 'INIT' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-white animate-sonar" />
          )}
          
          {(stage === 'NETWORK' || stage === 'MESSAGE') && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 animate-pulse blur-[120px]" />
          )}
        </div>

        {/* Broadcast Terminal - Below the Beacon icon */}
        {(stage === 'MESSAGE') && (
          <div className="w-full max-w-xl animate-in slide-in-from-bottom-12 duration-1000">
            <div className="relative pixel-box p-10 bg-[#0c0c0c]/98 border-4 border-cyan-400 shadow-[0_15px_60px_rgba(34,211,238,0.3)]">
              {/* Retro Speech Bubble Diamond Arrow (Pointing Up towards Hub) */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-400 rotate-45 border-t-4 border-l-4 border-black" />
              
              <div className="pixel-font text-white w-full space-y-4">
                <div className="flex items-start space-x-4">
                  <span className="text-cyan-400 font-black text-xl select-none">&gt;</span>
                  <span className="text-[10px] md:text-xs text-white uppercase tracking-tighter typewriter-effect leading-none h-4">SIGNAL BROADCAST: SUCCESS.</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-green-400 font-black text-xl select-none">&gt;</span>
                  <span className="text-[10px] md:text-xs text-white uppercase tracking-tighter typewriter-effect leading-none h-4" style={{ animationDelay: '2s' }}>KNOWLEDGE SHARED GLOBALLY.</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-400 font-black text-xl select-none">&gt;</span>
                  <span className="text-[10px] md:text-xs text-white uppercase tracking-tighter typewriter-effect leading-none h-4" style={{ animationDelay: '4s' }}>STATUS: YOU ARE NOT ALONE.</span>
                </div>
                
                <div className="pt-8 border-t-2 border-white/5 text-center mt-4">
                  <div className="text-sm md:text-lg text-white font-black uppercase animate-in fade-in duration-1000 tracking-[0.25em] leading-tight" style={{ animationDelay: '6s' }}>
                    THANK YOU, GDE COMMUNITY.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [playerName, setPlayerName] = useState('PLAYER_01');
  const [selectedRole, setSelectedRole] = useState<CloudRole | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.NORMAL);
  const [initialLevelIdx, setInitialLevelIdx] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [rolesWithAvatars, setRolesWithAvatars] = useState<RoleConfig[]>(ROLES);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initStage, setInitStage] = useState('INSERTING_CARTRIDGE');
  const [eeStage, setEeStage] = useState<EasterEggStage>(null);
  const [beaconStage, setBeaconStage] = useState<BeaconStage>(null);
  const [bannerClickCount, setBannerClickCount] = useState(0);
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [savedBgmState, setSavedBgmState] = useState(true);

  useEffect(() => {
    const initializeAvatars = async () => {
      try {
        const cached = localStorage.getItem('quest_avatars');
        if (cached) {
          setRolesWithAvatars(JSON.parse(cached));
          setInitStage('STARTING SYSTEMS');
          setTimeout(() => setIsInitializing(false), 1200);
          return;
        }

        setInitStage('RENDERING_SPRITES');
        const updatedRoles = await Promise.all(
          ROLES.map(async (role) => {
            try {
              const avatar = await generateAvatar(role.avatarPrompt);
              return { ...role, avatarBase64: avatar };
            } catch (err) {
              console.error(`Avatar gen failed for ${role.type}`, err);
              return role;
            }
          })
        );
        setRolesWithAvatars(updatedRoles);
        localStorage.setItem('quest_avatars', JSON.stringify(updatedRoles));
        setInitStage('PLAYER_READY');
        setTimeout(() => setIsInitializing(false), 1000);
      } catch (err) {
        console.error("Initialization failed", err);
        setIsInitializing(false);
        notificationService.notify('INIT_ERROR', 'SYSTEM_CORE_SYNC_FAILED', 'ERROR');
      }
    };

    initializeAvatars();
  }, []);

  const triggerGlobalBeacon = useCallback(() => {
    setSavedBgmState(bgmEnabled);
    setBgmEnabled(false);
    setBeaconStage('INIT');
    soundService.playPing();

    setTimeout(() => setBeaconStage('RESPONSE'), 2500);
    setTimeout(() => {
      setBeaconStage('NETWORK');
      soundService.playPowerUp();
    }, 6000);
    setTimeout(() => setBeaconStage('MESSAGE'), 8500);
    setTimeout(() => {
      setBeaconStage(null);
      setBannerClickCount(0);
      setBgmEnabled(savedBgmState);
      notificationService.notify('GLOBAL_BEACON', 'BEACON_SYNC_TERMINATED', 'SUCCESS');
    }, 28000);
  }, [bgmEnabled, savedBgmState]);

  const handleBannerClick = () => {
    const newCount = bannerClickCount + 1;
    setBannerClickCount(newCount);
    soundService.playBlip();
    if (newCount >= 5) {
      triggerGlobalBeacon();
    }
  };

  const handleStartGame = () => {
    const normalizedInput = playerName.trim().toLowerCase().replace(/_/g, ' ');
    
    if (normalizedInput === 'rm -rf /') {
      triggerEasterEgg();
      return;
    }

    soundService.playPowerUp();
    notificationService.notify('SESSION_START', `${playerName.toUpperCase()}_LINK_ESTABLISHED`, 'SUCCESS');
    setGameState(GameState.ROLE_SELECTION);
  };

  const triggerEasterEgg = () => {
    setSavedBgmState(bgmEnabled);
    soundService.playSiren();
    setEeStage('GLITCH');
    
    setTimeout(() => {
      setEeStage('SHUTDOWN');
      soundService.playIncorrect(); 
      setBgmEnabled(false); 
    }, 1200);

    setTimeout(() => {
      setEeStage('BLACKOUT');
    }, 2400);

    setTimeout(() => {
      setEeStage('INFO');
      soundService.playPowerUp();
    }, 5400);

    setTimeout(() => {
      setEeStage(null);
      setPlayerName('PLAYER_SAFE');
      setBgmEnabled(savedBgmState);
      notificationService.notify('SECURITY_CLEARED', 'Cloud assets protected.', 'SUCCESS');
    }, 9400);
  };

  const handleRoleSelect = (r: CloudRole) => {
    soundService.playClick();
    setSelectedRole(r);
    notificationService.notify('ROLE_LOCKED', `PATH_SELECTED:_${r.toUpperCase().replace(/\s/g, '_')}`, 'INFO');
    setGameState(GameState.CHAPTER_SELECTION);
  };

  const handleSelectChapter = (idx: number) => {
    soundService.playClick();
    setInitialLevelIdx(idx);
    notificationService.notify('WARP_GATE_OPEN', `JUMPING_TO_CHAPTER_${idx + 1}`, 'INFO');
    setGameState(GameState.PLAYING);
  };

  const handleGameEnd = (s: number) => {
    soundService.playLevelComplete();
    setFinalScore(s);
    
    leaderboardService.saveScore({
      name: playerName,
      score: s,
      role: selectedRole!,
      difficulty: difficulty,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    notificationService.notify('CHAPTERS_CLEARED', `FINAL_SCORE: ${s}`, 'ACHIEVEMENT');
    setGameState(GameState.GAME_OVER);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    soundService.playBlip();
    if (val === 0) setDifficulty(DifficultyLevel.EASY);
    else if (val === 1) setDifficulty(DifficultyLevel.NORMAL);
    else setDifficulty(DifficultyLevel.HARD);
  };

  const difficultyIndex = difficulty === DifficultyLevel.EASY ? 0 : difficulty === DifficultyLevel.NORMAL ? 1 : 2;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white pixel-font p-6 overflow-hidden">
        <div className="pixel-box p-12 flex flex-col items-center border-8">
          <div className="w-24 h-24 border-8 border-white border-t-blue-500 animate-spin mb-10 shadow-[8px_8px_0_#000]" />
          <div className="text-2xl animate-pulse mb-6 text-yellow-500 font-black">{initStage}...</div>
          <div className="w-full max-w-xs h-4 bg-slate-900 border-2 border-white mb-6">
             <div className="h-full bg-blue-500 animate-[text-reveal_2s_ease-in-out_infinite]" />
          </div>
          <div className="text-[10px] text-slate-500 tracking-widest text-center uppercase font-black">
             (C) 2025 System Stability // OK
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={eeStage === 'GLITCH' ? 'system-wipe-glitch h-full' : 'h-full'}>
      {eeStage === 'SHUTDOWN' && <div className="crt-shutdown-overlay" />}
      {(eeStage === 'BLACKOUT' || eeStage === 'INFO') && (
        <div className="fixed inset-0 z-[6000] bg-black flex items-center justify-center p-6 text-center">
          {eeStage === 'INFO' && (
            <div className="animate-in fade-in zoom-in duration-1000">
               <div className="pixel-font text-xl md:text-3xl text-yellow-500 mb-6 font-black uppercase tracking-tight">
                  JUST KIDDING.
               </div>
               <div className="pixel-font text-sm md:text-lg text-white font-black uppercase tracking-widest leading-loose">
                  SAFETY FIRST IN THE CLOUD.
               </div>
               <div className="mt-12 text-blue-500 pixel-font text-[10px] animate-pulse uppercase">
                  RESTORE_SEQUENCE_INITIATED...
               </div>
            </div>
          )}
        </div>
      )}

      {/* Global Beacon Cinematic Overlay */}
      <GlobalBeaconOverlay stage={beaconStage} />

      <Layout 
        activeRole={selectedRole}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        bgmEnabled={bgmEnabled}
        setBgmEnabled={setBgmEnabled}
      >
        <NotificationSystem />
        {gameState === GameState.HOME && (
          <div className="relative w-full h-full flex flex-col items-center py-4 px-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full my-auto space-y-4 md:space-y-6">
              
              <div className="border-4 border-white p-1 bg-black animate-in zoom-in duration-500 shadow-[4px_4px_0_#000] shrink-0">
                 <div className="px-4 py-1 bg-yellow-500 text-black text-[10px] pixel-font font-black">CREDIT 01</div>
              </div>
              
              <div className="relative flex flex-col items-center py-4 md:py-8 shrink-0">
                <div className="absolute -top-4 -left-12 text-2xl md:text-4xl opacity-30 animate-pixel-float hidden sm:block">☁️</div>
                <div className="absolute -bottom-4 -right-12 text-2xl md:text-4xl opacity-30 animate-pixel-float hidden sm:block" style={{ animationDelay: '1.2s' }}>☁️</div>
                
                <div className="title-container animate-in zoom-in duration-700 !p-6 md:!p-10 !mb-4">
                  <h1 className="text-2xl sm:text-4xl md:text-6xl font-black pixel-font pixel-cloud-escape-text uppercase">
                    PIXEL_CLOUD<br />
                    <div className="mt-2">ESCAPE</div>
                  </h1>
                </div>

                <div 
                  onClick={handleBannerClick}
                  className="bit-challenge-banner animate-in slide-in-from-bottom-8 duration-500 !py-2 !px-6 cursor-pointer hover:bg-yellow-500/20 active:scale-95 transition-all"
                >
                  <div className="bit-challenge-text pixel-font text-[8px] md:text-xs font-black uppercase">
                     :: COMMUNITY_EDITION ::
                  </div>
                </div>
              </div>
              
              <div className="max-w-xl w-full shrink-0">
                <div className="pixel-box p-4 md:p-6 bg-black/90 border-4">
                   <p className="mono-font text-lg md:text-2xl text-slate-200 leading-tight uppercase font-black">
                     COMPLETE_THE_6_STAGES_OF_CLOUDOM.<br/>
                     MASTER_OFFICIAL_CDL_EXAM_GUIDE.<br/>
                     ESCAPE_THE_BIT_MATRIX_DUNGEON.
                   </p>
                </div>
              </div>

              <div className="w-full max-w-md pixel-box p-3 md:p-4 border-2 bg-slate-900/50 shrink-0">
                 <h4 className="pixel-font text-[8px] md:text-[10px] text-blue-400 mb-2 font-black uppercase text-left">ENTER_CODENAME:</h4>
                 <input 
                   type="text" 
                   maxLength={12}
                   value={playerName}
                   onChange={(e) => setPlayerName(e.target.value.replace(/\s+/g, '_'))}
                   className="w-full bg-black border-2 border-white text-white p-2 md:p-3 pixel-font text-xs md:text-sm uppercase outline-none focus:border-yellow-500"
                 />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-2xl shrink-0 pb-8">
                <button 
                  onClick={handleStartGame}
                  className="pixel-button pixel-button-primary w-full sm:w-auto px-8 py-4 md:px-12 md:py-6 pixel-font text-xl md:text-2xl group shadow-[6px_6px_0_#000] font-black"
                >
                  1P_START
                </button>

                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => { soundService.playClick(); setGameState(GameState.LEADERBOARD); }}
                    className="flex-1 sm:flex-none pixel-button bg-black text-white px-6 py-4 pixel-font text-[9px] hover:bg-slate-900 font-black shadow-[4px_4px_0_#000]"
                  >
                    HI_SCORE
                  </button>
                  <button 
                    onClick={() => { soundService.playClick(); setGameState(GameState.ABOUT); }}
                    className="flex-1 sm:flex-none pixel-button bg-slate-800 text-white px-6 py-4 pixel-font text-[9px] hover:bg-slate-700 font-black border-slate-400 shadow-[4px_4px_0_#000]"
                  >
                    ABOUT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === GameState.ROLE_SELECTION && (
          <div className="w-full flex-1 animate-in slide-in-from-bottom-8 duration-500 pt-4 px-4 flex flex-col items-center justify-center overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-6xl font-black pixel-font text-white mb-2 uppercase leading-tight">Hero_Select</h2>
              <div className="pixel-hr w-48 mx-auto mb-2 my-1"></div>
              <p className="text-yellow-500 pixel-font text-[10px] animate-pulse uppercase tracking-widest font-black">SYNCING_{playerName}...</p>
            </div>
            
            <div className="max-w-xl mx-auto w-full px-4 flex flex-col justify-center">
              {rolesWithAvatars.map((role, idx) => (
                <RoleCard key={idx} role={role} onSelect={handleRoleSelect} index={idx} />
              ))}
            </div>
            
            <button onClick={() => { soundService.playClick(); setGameState(GameState.HOME); }} className="mt-8 mb-6 pixel-button bg-black text-slate-400 px-8 py-4 pixel-font text-[10px] font-black uppercase shadow-[4px_4px_0_#000]">
              [ Exit_To_Title_Screen ]
            </button>
          </div>
        )}

        {gameState === GameState.CHAPTER_SELECTION && (
          <div className="w-full flex-1 animate-in zoom-in duration-300 pt-4 px-4 flex flex-col items-center max-w-6xl justify-center overflow-y-auto">
            <div className="text-center mb-4">
              <h2 className="text-4xl md:text-5xl font-black pixel-font text-white mb-2 uppercase leading-tight">Stage_Select</h2>
              <p className="text-blue-400 pixel-font text-[10px] animate-pulse uppercase tracking-widest font-black">CHOOSE_YOUR_DESTINATION</p>
            </div>

            <div className="w-full pixel-box border-8 p-6 md:p-8 bg-[#0c0c0c] shadow-[12px_12px_0_#000] flex flex-col gap-6 flex-1 overflow-y-auto justify-center">
               <div className="w-full">
                  <ChapterMap currentLevelIdx={-1} onSelectLevel={handleSelectChapter} />
               </div>

               <div className="w-full border-t-4 border-white pt-6">
                  <div className="max-w-md mx-auto">
                      <div className="pixel-box p-4 border-4 bg-slate-900 shadow-[8px_8px_0_#000]">
                         <div className="flex justify-between items-center mb-4">
                            <h4 className="pixel-font text-[10px] text-white font-black uppercase tracking-tighter">STABILITY_MODE:</h4>
                            <span className={`pixel-font text-[8px] font-black uppercase px-2 py-1 border-2 border-white ${
                              difficulty === DifficultyLevel.EASY ? 'bg-green-600 text-white' : difficulty === DifficultyLevel.NORMAL ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                            }`}>
                              {difficulty}
                            </span>
                         </div>
                         
                         <input 
                           type="range" 
                           min="0" 
                           max="2" 
                           step="1" 
                           value={difficultyIndex}
                           onChange={handleDifficultyChange}
                           className="w-full h-8 bg-black border-2 border-white appearance-none cursor-pointer accent-white mb-2"
                           style={{ 
                             imageRendering: 'pixelated',
                           }}
                         />

                         <div className="flex justify-between mb-4 pixel-font text-[7px] text-slate-400 font-black uppercase">
                            <span className={difficulty === DifficultyLevel.EASY ? 'text-white' : ''}>JUNIOR</span>
                            <span className={difficulty === DifficultyLevel.NORMAL ? 'text-white' : ''}>ARCHITECT</span>
                            <span className={difficulty === DifficultyLevel.HARD ? 'text-white' : ''}>LEGEND</span>
                         </div>

                         <div className="grid grid-cols-2 gap-2 text-[8px] pixel-font text-slate-400 uppercase leading-tight font-black bg-black p-3 border-2 border-slate-700">
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                              <span>TIME_MOD:</span>
                              <span className="text-white">{DIFFICULTY_SETTINGS[difficulty].timeMultiplier}X</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                              <span>SCORE_MOD:</span>
                              <span className="text-white">{DIFFICULTY_SETTINGS[difficulty].scoreMultiplier}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>SPEED_MOD:</span>
                              <span className="text-white">{DIFFICULTY_SETTINGS[difficulty].speedMultiplier}X</span>
                            </div>
                            <div className="flex justify-between">
                              <span>TIME_BONUS:</span>
                              <span className="text-white">+{DIFFICULTY_SETTINGS[difficulty].timeBonus}S</span>
                            </div>
                         </div>
                      </div>
                  </div>
               </div>
            </div>

            <button onClick={() => { soundService.playClick(); setGameState(GameState.ROLE_SELECTION); }} className="mt-4 mb-4 pixel-button bg-black text-slate-400 px-8 py-4 pixel-font text-[10px] font-black uppercase shadow-[4px_4px_0_#000]">
              [ Back_To_Hero_Select ]
            </button>
          </div>
        )}

        {gameState === GameState.PLAYING && selectedRole && (
          <GameSessionUI 
            role={selectedRole} 
            difficulty={difficulty}
            playerName={playerName}
            onGameEnd={handleGameEnd} 
            initialLevelIdx={initialLevelIdx}
          />
        )}

        {gameState === GameState.GAME_OVER && (
          <div className="w-full flex-1 flex flex-col items-center justify-center py-4 px-4 overflow-y-auto">
            <div className="w-full max-w-4xl pixel-box border-8 p-6 md:p-8 bg-[#0c0c0c] animate-in zoom-in-95 duration-500 text-center shadow-[16px_16px_0_#000]">
              <div className="text-3xl md:text-5xl pixel-font text-yellow-500 mb-6 animate-pixel-float font-black whitespace-normal break-words max-w-full px-4 leading-tight">MISSION_COMPLETE!</div>
              
              <div className="flex flex-col items-center mb-6">
                <div className="border-4 md:border-8 border-white p-1 md:p-2 bg-slate-900 shadow-[6px_6px_0_#000] mb-4">
                   <Avatar role={selectedRole!} size="lg" animate={true} />
                </div>
                <div className="pixel-font text-blue-400 text-lg md:text-xl uppercase tracking-widest font-black leading-none">{playerName}</div>
                <div className="mt-2 text-green-500 pixel-font text-[8px] font-black uppercase tracking-widest animate-pulse">
                   RANK: {difficulty === DifficultyLevel.HARD ? 'SRE_OVERLORD' : difficulty === DifficultyLevel.NORMAL ? 'CDL_EXPERT' : 'FOUNDATIONAL_CLOUD'}
                </div>
              </div>

              <div className="bg-[#111] p-6 md:p-8 border-4 border-white mb-8 shadow-inner relative overflow-hidden font-black">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                <div className="pixel-font text-slate-500 text-[8px] mb-2 uppercase tracking-widest">FINAL_RECAP_MODULE | {difficulty} MODE</div>
                <div className="pixel-font text-4xl md:text-7xl text-white drop-shadow-[6px_6px_0_#4285F4] leading-none">
                   <AnimatedScore score={finalScore} />
                </div>
                <div className="mt-6 inline-block px-4 py-1.5 bg-green-900 border-2 border-green-500 text-green-400 pixel-font text-[8px] uppercase">
                   6_STAGES_CLEARED: CERT_READY
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={resetGame}
                  className="pixel-button pixel-button-primary px-10 py-5 md:px-14 md:py-6 pixel-font text-lg md:text-xl shadow-[6px_6px_0_#000] font-black"
                >
                  REPLAY?
                </button>
                <button 
                  onClick={() => { soundService.playClick(); setGameState(GameState.LEADERBOARD); }}
                  className="pixel-button bg-slate-800 text-white px-10 py-5 md:px-14 md:py-6 pixel-font text-lg md:text-xl shadow-[6px_6px_0_#000] font-black"
                >
                  HALL_OF_FAME
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === GameState.LEADERBOARD && (
          <div className="w-full flex-1 flex flex-col items-center pt-6 px-4 pb-12 overflow-y-auto max-h-full">
             <Leaderboard />
             <button onClick={() => { soundService.playClick(); setGameState(GameState.HOME); }} className="mt-10 pixel-button bg-black text-slate-400 px-10 py-5 pixel-font text-[10px] font-black uppercase shadow-[4px_4px_0_#000]">
                [ Return_To_HQ ]
             </button>
          </div>
        )}

        {gameState === GameState.ABOUT && (
          <div className="w-full flex-1 flex flex-col items-center pt-6 px-4 pb-12 overflow-y-auto max-h-full">
             <AboutSection />
             <button onClick={() => { soundService.playClick(); setGameState(GameState.HOME); }} className="mt-10 pixel-button bg-black text-slate-400 px-10 py-5 pixel-font text-[10px] font-black uppercase shadow-[4px_4px_0_#000]">
                [ Back_To_Title ]
             </button>
          </div>
        )}
      </Layout>
    </div>
  );

  function resetGame() {
    soundService.playClick();
    setGameState(GameState.HOME);
    setSelectedRole(null);
    setInitialLevelIdx(0);
    setFinalScore(0);
  }
};

export default App;
