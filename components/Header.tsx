
import React from 'react';
import { Character } from '../types';

interface HeaderProps {
  character: Character;
}

const Header: React.FC<HeaderProps> = ({ character }) => {
  const xpPercent = (character.xp / character.maxXp) * 100;

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#11151d] border border-[#1e293b] rounded-lg p-4 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="w-16 h-16 bg-[#1e293b] rounded-md border-2 border-[#2dd4bf] overflow-hidden flex items-center justify-center text-3xl shadow-lg shadow-[#2dd4bf]/10">
            👤
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#2dd4bf] text-[#0b0e14] text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-md">
            Lvl {character.level}
          </div>
        </div>
        
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {character.name}
            <span className="text-[10px] bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded font-mono uppercase">ROAD</span>
          </h1>
          <div className="mt-2 w-48 md:w-64">
            <div className="flex justify-between text-[10px] text-[#94a3b8] uppercase font-bold mb-1 tracking-wider">
              <span>XP Progressive</span>
              <span>{Math.floor(xpPercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2dd4bf] to-[#0d9488] transition-all duration-700 ease-out"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 md:gap-8 items-center bg-[#0b0e14]/50 px-6 py-3 rounded-lg border border-[#1e293b]/50">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest mb-1">Patrimônio</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#fbbf24] font-mono leading-none">
              {character.gold.toLocaleString()}
            </span>
            <span className="text-xs text-[#fbbf24]/60">AUR</span>
          </div>
        </div>
        
        <div className="w-px h-8 bg-[#1e293b]"></div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest mb-1">Dinheiro</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#2dd4bf] font-mono leading-none">
              ${character.cash.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="w-px h-8 bg-[#1e293b]"></div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest mb-1">Respeito</span>
          <div className="flex items-center gap-2 text-white font-bold text-xl">
             🏆 2.880
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
