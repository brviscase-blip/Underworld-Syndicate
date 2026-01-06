
import React from 'react';

interface AvatarDisplayProps {
  avatar: string;
  className?: string;
  size?: number;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatar, className = "", size = 150 }) => {
  return (
    <div 
      className={`relative flex items-center justify-center bg-[#1a1c23] rounded-lg overflow-hidden border border-[#1e293b] shadow-inner ${className}`} 
      style={{ width: size, height: size }}
    >
      <img 
        src={avatar} 
        alt="Avatar" 
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default AvatarDisplay;
