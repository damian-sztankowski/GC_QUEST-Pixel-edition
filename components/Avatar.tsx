
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
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <div className={`relative flex items-center justify-center border-4 border-white bg-[#0c0c0c] ${sizeClasses[size]} overflow-hidden shadow-[4px_4px_0_#000] shrink-0`}>
      {displayBase64 ? (
        <img 
          src={displayBase64} 
          alt={role} 
          className="w-full h-full object-cover" 
          style={{ imageRendering: 'pixelated', filter: 'contrast(1.2) brightness(1.1)' }} 
        />
      ) : (
        <span className="select-none text-2xl">{icon}</span>
      )}
      
      {animate && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-2 bg-white/10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10 animate-pulse" style={{ animationDelay: '0.8s' }} />
          <div className="absolute inset-0 border-2 border-white/5" />
        </div>
      )}
      
      {/* Pixel corners */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-white"></div>
      <div className="absolute top-0 right-0 w-1 h-1 bg-white"></div>
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-white"></div>
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-white"></div>
    </div>
  );
};

export default Avatar;
