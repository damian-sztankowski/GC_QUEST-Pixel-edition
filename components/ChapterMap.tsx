
import React from 'react';
import { LEVELS } from '../constants';

interface ChapterMapProps {
  currentLevelIdx: number;
  onSelectLevel?: (idx: number) => void;
  compact?: boolean;
}

const ChapterMap: React.FC<ChapterMapProps> = ({ currentLevelIdx, onSelectLevel, compact = false }) => {
  return (
    <div className={`grid grid-cols-3 md:grid-cols-6 gap-3 w-full ${compact ? '' : 'max-w-5xl px-2'}`}>
      {LEVELS.map((level, idx) => {
        const isCurrent = idx === currentLevelIdx;
        const isPassed = idx < currentLevelIdx;
        const isLocked = idx > currentLevelIdx && !onSelectLevel;

        let statusColor = 'bg-slate-900 border-slate-700';
        let textColor = 'text-slate-500';
        let label = 'LOCKED';

        if (isCurrent) {
          statusColor = 'bg-blue-900 border-blue-400 animate-pulse';
          textColor = 'text-blue-400';
          label = 'ACTIVE';
        } else if (isPassed) {
          statusColor = 'bg-green-900 border-green-500';
          textColor = 'text-green-500';
          label = 'CLEAR';
        } else if (onSelectLevel) {
          statusColor = 'bg-slate-800 border-white hover:bg-slate-700 cursor-pointer';
          textColor = 'text-white';
          label = 'READY';
        }

        return (
          <button
            key={level.id}
            disabled={isLocked}
            onClick={() => onSelectLevel && onSelectLevel(idx)}
            className={`pixel-box border-2 md:border-4 p-2 md:p-3 flex flex-col items-center text-center transition-all transform leading-none ${
              isCurrent ? 'scale-105 z-10 border-blue-400' : ''
            } ${onSelectLevel && !isLocked ? 'hover:-translate-y-1' : ''} ${statusColor} shadow-[4px_4px_0_#000]`}
          >
            <div className={`pixel-font text-[7px] mb-1 font-black ${textColor}`}>
               CH_{idx + 1}
            </div>
            
            <div className="mb-1.5 text-xl md:text-2xl group-hover:animate-pixel-float">
               {isPassed ? '✅' : isCurrent ? '📍' : level.puzzleType === 'CATCHER' ? '📥' : level.puzzleType === 'SORTER' ? '🗂️' : '🛡️'}
            </div>
            
            <div className={`pixel-font text-[6px] md:text-[7px] uppercase font-black leading-tight ${textColor} truncate w-full`}>
              {level.title.split(' ')[0]}
            </div>

            <div className={`mt-2 px-1.5 py-0.5 border-1 pixel-font text-[5px] font-black ${isCurrent ? 'bg-blue-400 text-black border-white' : 'bg-black text-slate-500 border-slate-700'}`}>
              {label}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChapterMap;
