
import React from 'react';

interface AvatarDisplayProps {
  avatar: string;
  className?: string;
  size?: number;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatar, className = "", size = 150 }) => {
  return (
    <div 
      className={`relative flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-inner ${className}`} 
      style={{ width: size, height: size }}
    >
      <img 
        src={avatar} 
        alt="Operativo" 
        className="w-full h-full object-cover contrast-[1.15] brightness-110"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://cdn.pixabay.com/photo/2023/07/26/16/33/man-8151610_1280.jpg';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 border-[4px] border-black/10 pointer-events-none"></div>
    </div>
  );
};

export default AvatarDisplay;
