
import React from 'react';
import { Character, Item } from '../types';
import AvatarDisplay from './AvatarDisplay';
import Icons from './Icons';

interface ProfileViewProps {
  character: Character;
  onEquip: (item: Item, index: number) => void;
  onUnequip: (slot: keyof Character['equipment']) => void;
  onEditAvatar: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ character, onEquip, onUnequip, onEditAvatar }) => {
  const calculateTotalAttack = () => {
    let bonus = character.equipment.weapon?.stats.attack || 0;
    return character.stats.strength * 2 + bonus;
  };

  const calculateTotalDefense = () => {
    let bonus = character.equipment.armor?.stats.defense || 0;
    return character.stats.physique * 2 + bonus;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      <div className="space-y-4 flex flex-col">
        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg p-4 flex items-center gap-6 shrink-0">
          <div className="relative shrink-0">
            <AvatarDisplay avatar={character.avatar} size={120} className="border-2 border-[#1e293b] rounded-xl shadow-2xl" />
            <button 
              onClick={onEditAvatar}
              className="absolute -bottom-1 -right-1 bg-[#3b82f6] text-white p-1.5 rounded-md shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
            >
              <Icons name="camera" size={14} color="white" />
            </button>
          </div>
          <div className="flex-1">
             <h3 className="text-lg font-black text-white uppercase tracking-tighter">{character.name}</h3>
             <p className="text-[9px] text-[#3b82f6] uppercase font-bold tracking-widest mt-0.5 italic">"Operativo do Sindicato"</p>
             <div className="grid grid-cols-2 gap-2 mt-3">
               <div className="bg-[#11151d] p-2 rounded border border-[#1e293b]">
                 <div className="text-[8px] text-[#94a3b8] uppercase font-bold">Ataque</div>
                 <div className="text-xl font-mono font-bold text-white">{calculateTotalAttack()}</div>
               </div>
               <div className="bg-[#11151d] p-2 rounded border border-[#1e293b]">
                 <div className="text-[8px] text-[#94a3b8] uppercase font-bold">Defesa</div>
                 <div className="text-xl font-mono font-bold text-white">{calculateTotalDefense()}</div>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg flex-1">
          <div className="bg-[#171c26] px-3 py-2 border-b border-[#1e293b]">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#3b82f6]">Estatísticas de Combate</h2>
          </div>
          <div className="p-3 space-y-2">
            {Object.entries(character.stats).map(([stat, value]) => (
              <div key={stat} className="flex items-center justify-between border-b border-[#1e293b] pb-1 last:border-0">
                <span className="text-xs text-[#94a3b8] capitalize">{stat === 'physique' ? 'Físico' : stat === 'strength' ? 'Força' : stat === 'luck' ? 'Sorte' : 'Tenacidade'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-white">{value}</span>
                  <button className="w-4 h-4 flex items-center justify-center bg-[#3b82f6] text-white rounded-full text-[10px] font-bold hover:scale-110 active:scale-95 transition-transform">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 flex flex-col h-full overflow-hidden">
        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg shrink-0">
          <div className="bg-[#171c26] px-3 py-2 border-b border-[#1e293b]">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#60a5fa]">Equipamento Ativo</h2>
          </div>
          <div className="p-3 grid grid-cols-3 gap-3">
            {(['weapon', 'armor', 'accessory'] as const).map((slot) => {
              const item = character.equipment[slot];
              return (
                <div 
                  key={slot}
                  onClick={() => item && onUnequip(slot)}
                  className={`aspect-square rounded-lg border border-dashed border-[#1e293b] flex flex-col items-center justify-center cursor-pointer transition-all ${
                    item ? 'bg-[#11151d] border-solid border-[#3b82f6]/40' : 'bg-[#11151d]/50 hover:bg-[#11151d]'
                  }`}
                >
                  {item ? (
                    <>
                      <Icons name={item.icon} size={24} color="#3b82f6" className="mb-1" />
                      <span className="text-[7px] uppercase text-[#94a3b8] font-bold text-center px-1 truncate w-full">{item.name}</span>
                    </>
                  ) : (
                    <span className="text-[8px] text-[#1e293b] font-bold uppercase tracking-widest">
                      {slot === 'weapon' ? 'Arma' : slot === 'armor' ? 'Corpo' : 'Aces'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg flex-1 flex flex-col overflow-hidden">
          <div className="bg-[#171c26] px-3 py-2 border-b border-[#1e293b] flex justify-between items-center">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#3b82f6]">Inventário</h2>
            <span className="text-[9px] text-[#94a3b8] font-mono">
              {character.inventory.filter(i => i !== null).length} / {character.inventory.length}
            </span>
          </div>
          
          <div className="p-3 grid grid-cols-5 gap-2 overflow-y-auto scrollbar-thin">
            {character.inventory.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => item && onEquip(item, idx)}
                className={`aspect-square rounded border border-[#1e293b] flex items-center justify-center cursor-pointer transition-all group ${
                  item 
                    ? 'bg-[#171c26] hover:border-[#3b82f6]/50' 
                    : 'bg-[#11151d]/30'
                }`}
              >
                {item ? (
                  <Icons name={item.icon} size={24} color="#3b82f6" className="group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="w-1/4 h-1/4 bg-[#1e293b]/20 rounded-sm"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
