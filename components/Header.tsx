
import React from 'react';
import { Character } from '../types';
import AvatarDisplay from './AvatarDisplay';
import Icons from './Icons';

interface HeaderProps {
  character: Character;
}

const Header: React.FC<HeaderProps> = ({ character }) => {
  const xpPercent = (character.xp / character.maxXp) * 100;

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-3 bg-[#11151d] border border-[#1e293b] rounded-lg p-3 shadow-xl shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative group">
          <AvatarDisplay avatar={character.avatar} size={48} className="border-2 border-[#3b82f6] shadow-lg rounded-md" />
          <div className="absolute -bottom-1 -right-1 bg-[#3b82f6] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-md">
            Lvl {character.level}
          </div>
        </div>
        
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            {character.name}
            <span className="text-[9px] bg-[#3b82f6]/20 text-[#3b82f6] px-1.5 py-0.5 rounded font-mono uppercase border border-[#3b82f6]/30">SYNDICATE</span>
          </h1>
          <div className="mt-1 w-40 md:w-56">
            <div className="h-1 w-full bg-[#1e293b] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#1e3a8a] transition-all duration-700 ease-out"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-[#94a3b8] uppercase font-bold mt-0.5 tracking-wider">
              <span>XP Progressive</span>
              <span>{Math.floor(xpPercent)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-[#0b0e14]/50 px-4 py-2 rounded-lg border border-[#1e293b]/50">
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-[#94a3b8] uppercase font-bold tracking-widest mb-0.5">Patrimônio</span>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-[#fbbf24] font-mono leading-none">
              {character.gold.toLocaleString()}
            </span>
            <span className="text-[9px] text-[#fbbf24]/60">AUR</span>
          </div>
        </div>
        
        <div className="w-px h-6 bg-[#1e293b]"></div>

        <div className="flex flex-col items-center">
          <span className="text-[8px] text-[#94a3b8] uppercase font-bold tracking-widest mb-0.5">Dinheiro</span>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-[#3b82f6] font-mono leading-none">
              ${character.cash.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-[#1e293b]"></div>

        <div className="flex flex-col items-center">
          <span className="text-[8px] text-[#94a3b8] uppercase font-bold tracking-widest mb-0.5">Respeito</span>
          <div className="flex items-center gap-1 text-lg font-bold text-white">
             <Icons name="ranking" size={14} color="#3b82f6" className="mr-1" /> 2.8k
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
