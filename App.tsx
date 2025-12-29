
import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [selectedRole, setSelectedRole] = useState<CloudRole | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.NORMAL);
  const [initialLevelIdx, setInitialLevelIdx] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [rolesWithAvatars, setRolesWithAvatars] = useState<RoleConfig[]>(ROLES);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initStage, setInitStage] = useState('INSERTING_CARTRIDGE');

  useEffect(() => {
    const initializeAvatars = async () => {
      try {
        const cached = localStorage.getItem('quest_avatars');
        if (cached) {
          setRolesWithAvatars(JSON.parse(cached));
          setInitStage('BOOTING_CDL_v1.0');
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
        setInitStage('READY_PLAYER_ONE');
        setTimeout(() => setIsInitializing(false), 1000);
      } catch (err) {
        console.error("Initialization failed", err);
        setIsInitializing(false);
        notificationService.notify('INIT_ERROR', 'SYSTEM_CORE_SYNC_FAILED', 'ERROR');
      }
    };

    initializeAvatars();
  }, []);

  const handleStartGame = () => {
    soundService.playPowerUp();
    notificationService.notify('SESSION_START', 'USER_CREDENTIALS_VERIFIED', 'SUCCESS');
    setGameState(GameState.ROLE_SELECTION);
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
             (C) 1991 Google Cloud // System Stability OK
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout activeRole={selectedRole}>
      <NotificationSystem />
      {gameState === GameState.HOME && (
        <div className="relative w-full flex flex-col items-center justify-center py-4 px-6 overflow-y-auto max-h-full">
          <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
            
            <div className="mb-6 border-4 border-white p-1 bg-black animate-in zoom-in duration-500 shadow-[4px_4px_0_#000]">
               <div className="px-4 py-1 bg-yellow-500 text-black text-[10px] pixel-font font-black">CREDIT 01</div>
            </div>
            
            <div className="mb-8 relative">
              <div className="absolute -top-10 -left-16 md:-left-32 text-4xl md:text-6xl opacity-20 animate-pixel-float">☁️</div>
              <div className="absolute -bottom-4 -right-16 md:-right-32 text-4xl md:text-6xl opacity-20 animate-pixel-float" style={{ animationDelay: '1s' }}>☁️</div>
              
              <h1 className="text-5xl md:text-8xl font-black pixel-font text-white mb-4 drop-shadow-[8px_8px_0_#4285F4] leading-none">
                CLOUD<br />QUEST
              </h1>
              <div className="text-lg md:text-xl pixel-font text-yellow-500 animate-pulse tracking-widest bg-blue-900/40 inline-block px-6 py-1.5 border-2 border-blue-500 font-black uppercase">
                :: PIXEL_EDITION ::
              </div>
            </div>
            
            <div className="mb-8 max-w-xl">
              <div className="pixel-box p-6 bg-black/90 border-4">
                 <p className="mono-font text-xl md:text-2xl text-slate-200 leading-tight uppercase font-black">
                   COMPLETE_THE_6_STAGES_OF_CLOUDOM.<br/>
                   MASTER_OFFICIAL_CDL_EXAM_GUIDE.<br/>
                   ESCAPE_THE_BIT_MATRIX_DUNGEON.
                 </p>
              </div>
            </div>

            {/* Difficulty Settings */}
            <div className="mb-10 w-full max-w-md pixel-box p-4 border-2 bg-slate-900/50">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="pixel-font text-[10px] text-white font-black uppercase tracking-tighter">DIFFICULTY_LEVEL:</h4>
                  <span className={`pixel-font text-[10px] font-black uppercase ${
                    difficulty === DifficultyLevel.EASY ? 'text-green-500' : difficulty === DifficultyLevel.NORMAL ? 'text-blue-500' : 'text-red-500'
                  }`}>
                    {difficulty} ({DIFFICULTY_SETTINGS[difficulty].label})
                  </span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="2" 
                 step="1" 
                 value={difficultyIndex}
                 onChange={handleDifficultyChange}
                 className="w-full h-8 bg-black border-2 border-white appearance-none cursor-pointer accent-blue-500"
                 style={{ 
                   imageRendering: 'pixelated',
                 }}
               />
               <div className="flex justify-between mt-2 pixel-font text-[7px] text-slate-500 font-black uppercase">
                  <span>JUNIOR</span>
                  <span>ARCHITECT</span>
                  <span>LEGEND</span>
               </div>
               <div className="mt-4 grid grid-cols-3 gap-2 text-[6px] pixel-font text-slate-400 uppercase leading-tight font-black">
                  <div className="border-r border-slate-700">TIME: {DIFFICULTY_SETTINGS[difficulty].timeMultiplier}x</div>
                  <div className="border-r border-slate-700">SCORE: {DIFFICULTY_SETTINGS[difficulty].scoreMultiplier}x</div>
                  <div>SPEED: {DIFFICULTY_SETTINGS[difficulty].speedMultiplier}x</div>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 w-full max-w-2xl">
              <button 
                onClick={handleStartGame}
                className="pixel-button pixel-button-primary px-12 py-6 md:px-16 md:py-8 pixel-font text-2xl md:text-3xl group shadow-[8px_8px_0_#000] font-black"
              >
                1P_START
              </button>

              <div className="flex gap-4">
                <button 
                  onClick={() => { soundService.playClick(); setGameState(GameState.LEADERBOARD); }}
                  className="pixel-button bg-black text-white px-8 py-4 pixel-font text-xs hover:bg-slate-900 font-black shadow-[4px_4px_0_#000]"
                >
                  HI_SCORE
                </button>
                <button 
                  onClick={() => { soundService.playClick(); setGameState(GameState.ABOUT); }}
                  className="pixel-button bg-slate-800 text-white px-8 py-4 pixel-font text-xs hover:bg-slate-700 font-black border-slate-400 shadow-[4px_4px_0_#000]"
                >
                  ABOUT
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pb-10">
               <div className="pixel-box p-6 border-4 hover:bg-blue-950 transition-colors group">
                  <div className="text-4xl mb-4 group-hover:animate-pixel-float">👾</div>
                  <h3 className="text-xl pixel-font text-blue-400 mb-2 font-black uppercase">Exam Logic</h3>
                  <p className="mono-font text-slate-400 text-lg uppercase font-black">6 sections of the CDL Guide.</p>
               </div>
               <div className="pixel-box p-6 border-4 hover:bg-red-950 transition-colors group">
                  <div className="text-4xl mb-4 group-hover:animate-pixel-float">💣</div>
                  <h3 className="text-xl pixel-font text-red-400 mb-2 font-black uppercase">Arcade Mode</h3>
                  <p className="mono-font text-slate-400 text-lg uppercase font-black">Beat stability decay.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {gameState === GameState.ROLE_SELECTION && (
        <div className="w-full animate-in slide-in-from-bottom-8 duration-500 pt-6 px-4 flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-black pixel-font text-white mb-4 uppercase leading-tight">Hero_Select</h2>
            <div className="pixel-hr w-48 mx-auto mb-4 my-2"></div>
            <p className="text-yellow-500 pixel-font text-xs animate-pulse uppercase tracking-widest font-black">Detecting_User_Biometrics...</p>
          </div>
          
          <div className="max-w-xl mx-auto w-full px-4">
            {rolesWithAvatars.map((role, idx) => (
              <RoleCard key={idx} role={role} onSelect={handleRoleSelect} index={idx} />
            ))}
          </div>
          
          <button onClick={() => { soundService.playClick(); setGameState(GameState.HOME); }} className="mt-12 pixel-button bg-black text-slate-400 px-8 py-4 pixel-font text-[10px] font-black uppercase shadow-[4px_4px_0_#000]">
            [ Exit_To_Title_Screen ]
          </button>
        </div>
      )}

      {gameState === GameState.CHAPTER_SELECTION && (
        <div className="w-full animate-in zoom-in duration-300 pt-6 px-4 flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-black pixel-font text-white mb-4 uppercase leading-tight">Stage_Select</h2>
            <div className="pixel-hr w-48 mx-auto mb-4 my-2"></div>
            <p className="text-blue-400 pixel-font text-xs animate-pulse uppercase tracking-widest font-black">Loading_Chapter_Data_Modules...</p>
          </div>

          <div className="w-full max-w-5xl pixel-box border-8 p-10 bg-[#0c0c0c] shadow-[12px_12px_0_#000]">
             <ChapterMap currentLevelIdx={-1} onSelectLevel={handleSelectChapter} />
          </div>

          <button onClick={() => { soundService.playClick(); setGameState(GameState.ROLE_SELECTION); }} className="mt-12 pixel-button bg-black text-slate-400 px-8 py-4 pixel-font text-[10px] font-black uppercase shadow-[4px_4px_0_#000]">
            [ Back_To_Hero_Select ]
          </button>
        </div>
      )}

      {gameState === GameState.PLAYING && selectedRole && (
        <GameSessionUI 
          role={selectedRole} 
          difficulty={difficulty}
          onGameEnd={handleGameEnd} 
          initialLevelIdx={initialLevelIdx}
        />
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="w-full max-w-4xl mx-auto pixel-box border-8 p-6 md:p-8 bg-[#0c0c0c] animate-in zoom-in-95 duration-500 text-center shadow-[16px_16px_0_#000] scale-down-content">
          <div className="text-3xl md:text-5xl pixel-font text-yellow-500 mb-6 animate-pixel-float font-black whitespace-normal break-words max-w-full px-4 leading-tight">MISSION_COMPLETE!</div>
          
          <div className="flex flex-col items-center mb-6">
            <div className="border-4 md:border-8 border-white p-1 md:p-2 bg-slate-900 shadow-[6px_6px_0_#000] mb-4">
               <Avatar role={selectedRole!} size="lg" animate={true} />
            </div>
            <div className="pixel-font text-blue-400 text-lg md:text-xl uppercase tracking-widest font-black leading-none">{selectedRole}</div>
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center pb-4">
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
      )}

      {gameState === GameState.LEADERBOARD && (
        <div className="w-full flex flex-col items-center pt-6 px-4 pb-12 overflow-y-auto max-h-full">
           <Leaderboard />
           <button onClick={() => { soundService.playClick(); setGameState(GameState.HOME); }} className="mt-10 pixel-button bg-black text-slate-400 px-10 py-5 pixel-font text-[10px] font-black uppercase shadow-[4px_4px_0_#000]">
              [ Return_To_HQ ]
           </button>
        </div>
      )}

      {gameState === GameState.ABOUT && (
        <div className="w-full flex flex-col items-center pt-6 px-4 pb-12 overflow-y-auto max-h-full">
           <AboutSection />
           <button onClick={() => { soundService.playClick(); setGameState(GameState.HOME); }} className="mt-10 pixel-button bg-black text-slate-400 px-10 py-5 pixel-font text-[10px] font-black uppercase shadow-[4px_4px_0_#000]">
              [ Back_To_Title ]
           </button>
        </div>
      )}
    </Layout>
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
