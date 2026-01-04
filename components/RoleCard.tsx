
import React from 'react';
import { CloudRole, RoleConfig } from '../types';
import Avatar from './Avatar';

interface RoleCardProps {
  role: RoleConfig;
  onSelect: (role: CloudRole) => void;
  index: number;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onSelect, index }) => {
  const accentColor = role.accent;

  return (
    <div 
      onClick={() => onSelect(role.type)}
      style={{ 
        animationDelay: `${index * 150}ms`,
        boxShadow: `8px 8px 0px rgba(0, 0, 0, 0.8)`
      }}
      className="pixel-box p-4 md:p-6 mb-4 cursor-pointer group transition-all duration-200 transform hover:-translate-y-1 hover:scale-[1.01] flex flex-row items-center gap-4 md:gap-6 border-4 border-white bg-[#111] hover:bg-[#1a1a1a]"
    >
      <div 
        className="border-4 border-white bg-black p-2 shadow-[4px_4px_0_#000] group-hover:scale-110 transition-transform duration-200 shrink-0"
        style={{ borderColor: accentColor }}
      >
        <Avatar role={role.type} size="md" base64={role.avatarBase64} animate={true} />
      </div>
      
      <div className="flex-1 text-left min-w-0">
        <div className="border-4 border-dashed border-blue-500 p-2 md:p-3">
          <h3 
            className="text-sm md:text-lg font-black pixel-font text-white mb-2 tracking-tighter whitespace-normal leading-tight"
            style={{ color: accentColor }}
          >
            {role.type.toUpperCase()}
          </h3>
          <p className="mono-font text-slate-300 text-[10px] md:text-base leading-snug uppercase">
            {role.description}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end shrink-0">
        <span className="pixel-font text-[8px] md:text-[10px] text-white group-hover:translate-x-1 transition-transform">
          SELECT >
        </span>
      </div>
    </div>
  );
};

export default RoleCard;
