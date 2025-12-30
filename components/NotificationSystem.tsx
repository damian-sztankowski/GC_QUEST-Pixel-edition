
import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { soundService } from '../services/soundService';

const NotificationSystem: React.FC = () => {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((n) => {
      setActiveNotifications(prev => [...prev, n]);
      
      // Play sound based on type
      if (n.type === 'SUCCESS' || n.type === 'ACHIEVEMENT') {
        soundService.playPowerUp();
      } else if (n.type === 'ERROR') {
        soundService.playIncorrect();
      } else {
        soundService.playBlip();
      }

      // Auto-remove after 4 seconds
      setTimeout(() => {
        setActiveNotifications(prev => prev.filter(item => item.id !== n.id));
      }, 4000);
    });

    return unsubscribe;
  }, []);

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'SUCCESS': return 'border-green-500 bg-green-900/90 text-green-100';
      case 'ERROR': return 'border-red-500 bg-red-900/90 text-red-100';
      case 'ACHIEVEMENT': return 'border-yellow-500 bg-yellow-900/90 text-yellow-100';
      default: return 'border-blue-500 bg-blue-900/90 text-blue-100';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[2000] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
      {activeNotifications.map((n) => (
        <div 
          key={n.id}
          className={`pixel-box p-4 border-4 shadow-[6px_6px_0_#000] animate-in slide-in-from-right-full duration-300 pointer-events-auto ${getTypeStyles(n.type)}`}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xl">
              {n.type === 'SUCCESS' ? '⭐' : n.type === 'ERROR' ? '⚠️' : n.type === 'ACHIEVEMENT' ? '🏆' : '📟'}
            </span>
            <h4 className="pixel-font text-[10px] font-black uppercase tracking-tighter">{n.title}</h4>
          </div>
          <p className="mono-font text-lg uppercase font-bold leading-tight pl-8">
            {n.message}
          </p>
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-white blinking"></div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;