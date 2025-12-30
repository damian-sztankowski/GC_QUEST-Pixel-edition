import React, { useState, useEffect } from 'react';
import { CloudRole } from '../types';
import { ROLES } from '../constants';
import { soundService } from '../services/soundService';

interface LayoutProps {
  children: React.ReactNode;
  activeRole?: CloudRole | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const roleConfig = ROLES.find(r => r.type === activeRole);
  const themeColor = roleConfig?.color || 'blue';

  const themeColors: Record<string, string> = {
    blue: '#4285F4',
    purple: '#A855F7',
  };

  const currentAccent = themeColors[themeColor] || themeColors.blue;

  useEffect(() => {
    soundService.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    soundService.setBGMEnabled(bgmEnabled);
  }, [bgmEnabled, soundEnabled]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      soundService.playClick();
    }
  };

  const toggleBgm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBgmEnabled(!bgmEnabled);
    if (!bgmEnabled && soundEnabled) {
      soundService.playClick();
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#0c0c0c] flex flex-col items-center relative overflow-hidden pixel-grid"
      onClick={() => soundEnabled && soundService.playClick()}
    >
      <header className="w-full max-w-7xl px-4 py-2 flex justify-between items-center border-b-4 border-white bg-[#1a1a1a] shadow-[0_4px_0_#000] relative z-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 border-2 border-white p-1 bg-black">
            <div className="w-3 h-3 bg-red-500 border-1 border-white"></div>
            <div className="w-3 h-3 bg-blue-500 border-1 border-white"></div>
            <div className="w-3 h-3 bg-yellow-500 border-1 border-white"></div>
            <div className="w-3 h-3 bg-green-500 border-1 border-white"></div>
          </div>
          <h1 className="text-xl md:text-2xl font-black pixel-font tracking-tighter text-white">
            PIXEL_CLOUD:ESCAPE <span style={{ color: currentAccent }}>::CDL EDITION</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-black border-2 border-white p-0.5 space-x-1">
            <button 
              onClick={toggleSound}
              className={`pixel-button px-2 py-0.5 text-[7px] pixel-font ${soundEnabled ? 'bg-blue-600 text-white' : 'bg-red-900 text-slate-400 grayscale'}`}
            >
              SFX: {soundEnabled ? 'ON' : 'OFF'}
            </button>
            <button 
              onClick={toggleBgm}
              className={`pixel-button px-2 py-0.5 text-[7px] pixel-font ${bgmEnabled ? 'bg-green-600 text-white' : 'bg-red-900 text-slate-400 grayscale'}`}
            >
              BGM: {bgmEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="hidden sm:flex flex-col items-end pixel-font leading-none">
            <div className="text-[8px] text-yellow-500 mb-0.5 font-black uppercase">Exam_ready</div>
            <div className="text-[10px] text-white bg-black px-1.5 border-2 border-white whitespace-nowrap">
              {activeRole ? `SYS: CDL` : 'STATUS: STBY'}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-7xl px-4 py-4 md:px-8 md:py-6 flex flex-col items-center relative z-10 overflow-hidden">
        {children}
      </main>

      <footer className="w-full max-w-7xl px-4 py-2 border-t-2 border-white bg-black text-center text-slate-500 text-[10px] pixel-font tracking-widest relative z-20">
        (C) 2025 BUILT WITH <span style={{ color: 'red' }}>&hearts;</span> for GOOGLE CLOUD COMMUNITY // V_BIT.01
      </footer>
    </div>
  );
};

export default Layout;