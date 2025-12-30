import React, { useMemo } from 'react';
import { CloudRole, RoleConfig } from '../types';
import { ROLES } from '../constants';

interface AvatarProps {
  role: CloudRole;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  base64?: string;
}

const Avatar: React.FC<AvatarProps> = ({ role, size = 'md', animate = true, base64 }) => {
  const roleConfig = ROLES.find(r => r.type === role);
  const icon = roleConfig?.icon || '☁️';

  const displayBase64 = useMemo(() => {
    if (base64) return base64;
    const cached = localStorage.getItem('quest_avatars');
    if (cached) {
      const roles: RoleConfig[] = JSON.parse(cached);
      return roles.find(r => r.type === role)?.avatarBase64;
    }
    return undefined;
  }, [role, base64]);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  return (
    <div className={`relative flex items-center justify-center border-4 border-white bg-black ${sizeClasses[size]} overflow-hidden shadow-[6px_6px_0_#000] shrink-0 ${animate ? 'animate-pulse' : ''}`}>
      {displayBase64 ? (
        <img 
          src={displayBase64} 
          alt={role} 
          className="w-full h-full object-cover" 
          style={{ imageRendering: 'pixelated', filter: 'contrast(1.4) brightness(1.2) hue-rotate(-5deg)' }} 
        />
      ) : (
        <span className="select-none text-4xl">{icon}</span>
      )}
      
      {/* Scanline overlay for avatar */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]"></div>
      
      {animate && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20 animate-[scan_2s_linear_infinite]" />
        </div>
      )}
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white"></div>
    </div>
  );
};

export default Avatar;