
import React, { useMemo } from 'react';
import { CloudRole, RoleConfig } from '../types';
import { ROLES } from '../constants';

interface AvatarProps {
  role: CloudRole | 'GDE_LOGO';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  base64?: string;
}

const GDELogoSVG: React.FC<{ size: string }> = ({ size }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`${size} animate-pixel-float`} 
    style={{ imageRendering: 'pixelated' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Left Side: Blue (Bottom) and Red (Top) forming a '<' shape */}
    {/* Blue Pill (Bottom Left) */}
    <rect 
      x="10" y="34" width="24" height="14" rx="7" 
      fill="#4285F4" 
      transform="rotate(-45 22 41)" 
    />
    {/* Red Pill (Top Left) */}
    <rect 
      x="10" y="16" width="24" height="14" rx="7" 
      fill="#EA4335" 
      transform="rotate(45 22 23)" 
    />

    {/* Right Side: Yellow (Bottom) and Green (Top) forming a '>' shape */}
    {/* Green Pill (Top Right) */}
    <rect 
      x="30" y="16" width="24" height="14" rx="7" 
      fill="#34A853" 
      transform="rotate(-45 42 23)" 
    />
    {/* Yellow Pill (Bottom Right) */}
    <rect 
      x="30" y="34" width="24" height="14" rx="7" 
      fill="#FBBC05" 
      transform="rotate(45 42 41)" 
    />

    {/* Central Core Highlight - Subtle pulse */}
    <circle cx="32" cy="32" r="2" fill="#FFF" opacity="0.3">
      <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" repeatCount="indefinite" />
      <animate attributeName="r" values="1;3;1" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const CloudHeroSVG: React.FC<{ size: string }> = ({ size }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`${size} animate-pixel-float`} 
    style={{ imageRendering: 'pixelated' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15 35 L5 50 L20 45 L15 35" fill="#1A73E8">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="0.5s" repeatCount="indefinite" />
    </path>
    <path d="M12 30 L2 45 L15 40 L12 30" fill="#4285F4">
      <animate attributeName="opacity" values="1;0.5;1" dur="0.8s" repeatCount="indefinite" />
    </path>
    <rect x="20" y="24" width="24" height="16" fill="#4285F4" />
    <rect x="16" y="28" width="32" height="12" fill="#4285F4" />
    <rect x="24" y="20" width="16" height="4" fill="#4285F4" />
    <rect x="24" y="38" width="16" height="4" fill="#4285F4" />
    <rect x="22" y="26" width="4" height="2" fill="#ADCCFF" />
    <rect x="26" y="22" width="6" height="2" fill="#ADCCFF" />
    <rect x="42" y="16" width="6" height="10" fill="#4285F4" />
    <rect x="44" y="14" width="6" height="6" fill="#4285F4" />
    <rect x="46" y="12" width="4" height="4" fill="#0D47A1" />
    <rect x="28" y="30" width="8" height="6" fill="#0D47A1" />
    <rect x="30" y="32" width="4" height="2" fill="#FFF" />
    <rect x="26" y="27" width="2" height="2" fill="#000" />
    <rect x="36" y="27" width="2" height="2" fill="#000" />
  </svg>
);

const Avatar: React.FC<AvatarProps> = ({ role, size = 'md', animate = true, base64 }) => {
  const displayBase64 = useMemo(() => {
    if (role === 'GDE_LOGO') return undefined;
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

  const isBeacon = role === 'GDE_LOGO';

  return (
    <div className={`relative flex items-center justify-center border-4 ${isBeacon ? 'border-black' : 'border-white'} bg-[#0c0c0c] ${sizeClasses[size]} overflow-hidden shadow-[4px_4px_0_#000] shrink-0`}>
      {role === 'GDE_LOGO' ? (
        <GDELogoSVG size="w-full h-full p-2" />
      ) : displayBase64 ? (
        <img 
          src={displayBase64} 
          alt={role} 
          className="w-full h-full object-cover" 
          style={{ imageRendering: 'pixelated', filter: 'contrast(1.2) brightness(1.1)' }} 
        />
      ) : (
        <CloudHeroSVG size="w-full h-full p-2" />
      )}
      
      {animate && !isBeacon && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-2 bg-white/10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10 animate-pulse" style={{ animationDelay: '0.8s' }} />
          <div className="absolute inset-0 border-2 border-white/5" />
        </div>
      )}
      
      <div className="absolute top-0 left-0 w-1 h-1 bg-white"></div>
      <div className="absolute top-0 right-0 w-1 h-1 bg-white"></div>
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-white"></div>
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-white"></div>
    </div>
  );
};

export default Avatar;
