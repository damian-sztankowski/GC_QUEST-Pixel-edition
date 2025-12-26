
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import RoleCard from './components/RoleCard';
import Leaderboard from './components/Leaderboard';
import GameSessionUI from './components/GameSessionUI';
import Avatar from './components/Avatar';
import { GameState, CloudRole, RoleConfig } from './types';
import { ROLES, LEVELS } from './constants';
import { generateAvatar } from './services/geminiService';
import { soundService } from './services/soundService';

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
      }
    };

    initializeAvatars();
  }, []);

  const handleStartGame = () => {
    soundService.playPowerUp();
    setGameState(GameState.ROLE_SELECTION);
  };

  const handleRoleSelect = (r: CloudRole) => {
    soundService.playClick();
    setSelectedRole(r);
    setGameState(GameState.PLAYING);
  };

  const handleGameEnd = (s: number) => {
    soundService.playLevelComplete();
    setFinalScore(s);
    setGameState(GameState.GAME_OVER);
  };

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
      {gameState === GameState.HOME && (
        <div className="relative w-full min-h-[75vh] flex flex-col items-center justify-center py-12 px-6">
          <div className="relative z-10 flex flex-col items-center text-center">
            
            <div className="mb-12 border-4 border-white p-2 bg-black animate-in zoom-in duration-500 shadow-[8px_8px_0_#000]">
               <div className="px-6 py-2 bg-yellow-500 text-black text-xs pixel-font font-black">CREDIT 01</div>
            </div>
            
            <div className="mb-16 relative">
              <div className="absolute -top-16 -left-32 text-6xl opacity-20 animate-pixel-float">☁️</div>
              <div className="absolute -bottom-8 -right-32 text-6xl opacity-20 animate-pixel-float" style={{ animationDelay: '1s' }}>☁️</div>
              
              <h1 className="text-7xl md:text-9xl font-black pixel-font text-white mb-6 drop-shadow-[12px_12px_0_#4285F4]">
                CLOUD<br />QUEST
              </h1>
              <div className="text-2xl pixel-font text-yellow-500 animate-pulse tracking-widest bg-blue-900/40 inline-block px-8 py-2 border-2 border-blue-500 font-black uppercase">
                :: PIXEL_EDITION ::
              </div>
            </div>
            
            <div className="mb-16 max-w-2xl">
              <div className="pixel-box p-10 bg-black/90 border-4">
                 <p className="mono-font text-xl md:text-2xl text-slate-200 leading-relaxed uppercase font-black">
                   COMPLETE_THE_6_STAGES_OF_CLOUDOM.<br/>
                   MASTER_OFFICIAL_CDL_EXAM_GUIDE.<br/>
                   ESCAPE_THE_BIT_MATRIX_DUNGEON.
                 </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mb-24 w-full max-w-2xl">
              <button 
                onClick={handleStartGame}
                className="pixel-button pixel-button-primary px-20 py-10 pixel-font text-3xl group shadow-[10px_10px_0_#000] font-black"
              >
                1P_START
              </button>

              <button 
                onClick={() => { soundService.playClick(); setGameState(GameState.LEADERBOARD); }}
                className="pixel-button bg-black text-white px-16 py-8 pixel-font text-xl hover:bg-slate-900 font-black"
              >
                HI_SCORE
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
               <div className="pixel-box p-10 border-4 hover:bg-blue-950 transition-colors group">
                  <div className="text-5xl mb-6 group-hover:animate-pixel-float">👾</div>
                  <h3 className="text-2xl pixel-font text-blue-400 mb-4 font-black">EXAM_LOGIC</h3>
                  <p className="mono-font text-slate-400 text-xl uppercase font-black">All 6 official sections of the CDL Guide included.</p>
               </div>
               <div className="pixel-box p-10 border-4 hover:bg-red-950 transition-colors group">
                  <div className="text-5xl mb-6 group-hover:animate-pixel-float">💣</div>
                  <h3 className="text-2xl pixel-font text-red-400 mb-4 font-black">ARCADE_SPEED</h3>
                  <p className="mono-font text-slate-400 text-xl uppercase font-black">Complete the migration before stability drops to 0%.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {gameState === GameState.ROLE_SELECTION && (
        <div className="w-full animate-in slide-in-from-bottom-8 duration-500 pt-10 px-4 flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black pixel-font text-white mb-6 uppercase">Hero_Select</h2>
            <div className="pixel-hr w-64 mx-auto mb-6"></div>
            <p className="text-yellow-500 pixel-font text-sm animate-pulse uppercase tracking-widest font-black">Detecting_User_Biometrics...</p>
          </div>
          
          <div className="max-w-2xl mx-auto w-full px-6">
            {rolesWithAvatars.map((role, idx) => (
              <RoleCard key={idx} role={role} onSelect={handleRoleSelect} index={idx} />
            ))}
          </div>
          
          <button onClick={() => { soundService.playClick(); setGameState(GameState.HOME); }} className="mt-20 pixel-button bg-black text-slate-400 px-10 py-5 pixel-font text-xs font-black uppercase">
            [ Exit_To_Title_Screen ]
          </button>
        </div>
      )}

      {gameState === GameState.PLAYING && selectedRole && (
        <GameSessionUI role={selectedRole} onGameEnd={handleGameEnd} />
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="w-full max-w-4xl mx-auto pixel-box border-8 p-16 bg-[#0c0c0c] animate-in zoom-in-95 duration-500 text-center shadow-[16px_16px_0_#000]">
          <div className="text-7xl pixel-font text-yellow-500 mb-10 animate-pixel-float tracking-tighter font-black">MISSION_COMPLETE!</div>
          
          <div className="flex flex-col items-center mb-12">
            <div className="border-8 border-white p-4 bg-slate-900 shadow-[8px_8px_0_#000] mb-8">
               <Avatar role={selectedRole!} size="xl" animate={true} />
            </div>
            <div className="pixel-font text-blue-400 text-3xl uppercase tracking-widest font-black">{selectedRole}</div>
            <div className="mt-4 text-green-500 pixel-font text-xs font-black uppercase tracking-widest animate-pulse">
               RANK: PLATINUM_FOUNDATIONAL
            </div>
          </div>

          <div className="bg-[#111] p-12 border-4 border-white mb-16 shadow-inner relative overflow-hidden font-black">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
            <div className="pixel-font text-slate-500 text-xs mb-6 uppercase tracking-widest">FINAL_RECAP_MODULE</div>
            <div className="pixel-font text-8xl text-white drop-shadow-[8px_8px_0_#4285F4]">
               <AnimatedScore score={finalScore} />
            </div>
            <div className="mt-10 inline-block px-8 py-3 bg-green-900 border-2 border-green-500 text-green-400 pixel-font text-[10px] uppercase">
               6_STAGES_CLEARED: CERT_READY
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 justify-center">
            <button 
              onClick={resetGame}
              className="pixel-button pixel-button-primary px-16 py-8 pixel-font text-2xl shadow-[8px_8px_0_#000] font-black"
            >
              REPLAY?
            </button>
            <button 
              onClick={() => { soundService.playClick(); setGameState(GameState.LEADERBOARD); }}
              className="pixel-button bg-slate-800 text-white px-16 py-8 pixel-font text-2xl shadow-[8px_8px_0_#000] font-black"
            >
              HALL_OF_FAME
            </button>
          </div>
        </div>
      )}

      {gameState === GameState.LEADERBOARD && (
        <div className="w-full flex flex-col items-center pt-10 px-4 pb-20">
           <Leaderboard />
           <button onClick={() => { soundService.playClick(); setGameState(GameState.HOME); }} className="mt-16 pixel-button bg-black text-slate-400 px-12 py-6 pixel-font text-sm font-black uppercase">
              [ Return_To_HQ ]
           </button>
        </div>
      )}
    </Layout>
  );

  function resetGame() {
    soundService.playClick();
    setGameState(GameState.HOME);
    setSelectedRole(null);
    setFinalScore(0);
  }
};

export default App;
