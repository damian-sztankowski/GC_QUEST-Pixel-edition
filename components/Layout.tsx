
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

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      soundService.playClick();
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#0c0c0c] flex flex-col items-center relative overflow-hidden pixel-grid"
      onClick={() => soundEnabled && soundService.playClick()}
    >
      <header className="w-full max-w-7xl px-6 py-4 flex justify-between items-center border-b-8 border-white bg-[#1a1a1a] shadow-[0_8px_0_#000] relative z-10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 border-4 border-white p-2 bg-black">
            <div className="w-4 h-4 bg-red-500 border-2 border-white"></div>
            <div className="w-4 h-4 bg-blue-500 border-2 border-white"></div>
            <div className="w-4 h-4 bg-yellow-500 border-2 border-white"></div>
            <div className="w-4 h-4 bg-green-500 border-2 border-white"></div>
          </div>
          <h1 className="text-3xl font-black pixel-font tracking-tighter text-white">
            GC_QUEST <span style={{ color: currentAccent }}>::PIXEL</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleSound}
            className={`pixel-button px-4 py-2 text-xs pixel-font ${soundEnabled ? 'bg-green-800 text-white' : 'bg-red-900 text-slate-400 grayscale'}`}
          >
            {soundEnabled ? 'SOUND: ON' : 'SOUND: OFF'}
          </button>

          <div className="hidden md:flex flex-col items-end pixel-font">
            <div className="text-[10px] text-yellow-500 mb-1 font-black">FOUNDATIONAL_MODE</div>
            <div className="text-xs text-white bg-black px-2 border-2 border-white">
              {activeRole ? `SYS: ${activeRole.replace('Cloud ', '').toUpperCase()}` : 'STATUS: STBY'}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-7xl p-8 flex flex-col items-center relative z-10">
        {children}
      </main>

      <footer className="w-full max-w-7xl px-6 py-6 border-t-4 border-white bg-black text-center text-slate-500 text-sm pixel-font tracking-widest relative z-10">
        (C) 1991-2025 GOOGLE_CLOUD_ACADEMY // V_BIT.01
      </footer>
    </div>
  );
};

export default Layout;
