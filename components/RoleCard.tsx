
import React from 'react';
import { CloudRole, RoleConfig } from '../types';
import Avatar from './Avatar';

interface RoleCardProps {
  role: RoleConfig;
  onSelect: (role: CloudRole) => void;
  index: number;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onSelect, index }) => {
  return (
    <div 
      onClick={() => onSelect(role.type)}
      style={{ animationDelay: `${index * 150}ms` }}
      className="pixel-box p-12 cursor-pointer group hover:pixel-box-blue transition-all duration-100 transform hover:-translate-y-3 flex flex-col items-center text-center h-full border-8 bg-[#111]"
    >
      <div className="mb-10 border-4 border-white bg-black p-5 shadow-[6px_6px_0_#000] group-hover:scale-110 transition-transform">
        <Avatar role={role.type} size="xl" base64={role.avatarBase64} animate={true} />
      </div>
      
      <h3 className="text-3xl font-black pixel-font text-white mb-6 tracking-tight group-hover:text-blue-400 transition-colors">
        {role.type.toUpperCase()}
      </h3>
      
      <p className="mono-font text-slate-300 text-xl leading-relaxed mb-12 px-2 uppercase">
        {role.description}
      </p>

      <div className="mt-auto pt-8 border-t-4 border-white/20 w-full flex justify-between items-center px-2">
        <div className="flex items-center space-x-2">
           <div className="w-3 h-3 bg-yellow-500 animate-pulse"></div>
           <span className="pixel-font text-[10px] text-yellow-500">READY</span>
        </div>
        <span className="pixel-font text-xs text-white group-hover:translate-x-2 transition-transform">
          START_QUEST >
        </span>
      </div>
    </div>
  );
};

export default RoleCard;
