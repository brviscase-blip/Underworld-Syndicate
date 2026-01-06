
import React from 'react';
import { Character, Item, ItemType } from '../types';
import AvatarDisplay from './AvatarDisplay';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Character Stats & Equipment */}
      <div className="space-y-6">
        {/* Avatar Preview Card */}
        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg p-6 flex flex-col items-center gap-4 group">
          <div className="relative">
            <AvatarDisplay avatar={character.avatar} size={180} className="border-4 border-[#171c26] rounded-2xl shadow-2xl" />
            <button 
              onClick={onEditAvatar}
              className="absolute -bottom-2 -right-2 bg-[#fbbf24] text-[#0b0e14] p-2 rounded-lg shadow-xl hover:scale-110 transition-transform"
              title="Mudar Avatar"
            >
              📸
            </button>
          </div>
          <div className="text-center">
             <h3 className="text-xl font-black text-white uppercase tracking-tighter">{character.name}</h3>
             <p className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest mt-1 italic">"Gângster por Natureza"</p>
          </div>
        </div>

        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg">
          <div className="bg-[#171c26] px-4 py-3 border-b border-[#1e293b] flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#fbbf24]">Estatísticas Vitais</h2>
            <div className="text-[10px] text-[#94a3b8] font-mono">ID: 02026-X</div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#11151d] p-4 rounded-lg border border-[#1e293b] group hover:border-[#fbbf24]/50 transition-colors">
                <div className="text-[10px] text-[#94a3b8] uppercase font-bold mb-1 group-hover:text-[#fbbf24]">Ataque</div>
                <div className="text-3xl font-mono font-bold text-white leading-none">{calculateTotalAttack()}</div>
              </div>
              <div className="bg-[#11151d] p-4 rounded-lg border border-[#1e293b] group hover:border-[#ef4444]/50 transition-colors">
                <div className="text-[10px] text-[#94a3b8] uppercase font-bold mb-1 group-hover:text-[#ef4444]">Defesa</div>
                <div className="text-3xl font-mono font-bold text-white leading-none">{calculateTotalDefense()}</div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="flex items-center justify-between border-b border-[#1e293b] pb-2 last:border-0">
                  <span className="text-sm text-[#94a3b8] capitalize">{stat === 'physique' ? 'Físico' : stat === 'strength' ? 'Força' : stat === 'luck' ? 'Sorte' : 'Tenacidade'}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-mono font-bold text-white">{value}</span>
                    <button className="w-5 h-5 flex items-center justify-center bg-[#fbbf24] text-[#0b0e14] rounded-full text-xs font-bold hover:scale-110 active:scale-95 transition-transform">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Equipment & Inventory */}
      <div className="space-y-6">
        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg">
          <div className="bg-[#171c26] px-4 py-3 border-b border-[#1e293b]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#ef4444]">Arsenal Ativo</h2>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
            {(['weapon', 'armor', 'accessory'] as const).map((slot) => {
              const item = character.equipment[slot];
              return (
                <div 
                  key={slot}
                  onClick={() => item && onUnequip(slot)}
                  className={`aspect-square rounded-lg border-2 border-dashed border-[#1e293b] flex flex-col items-center justify-center cursor-pointer transition-all ${
                    item ? 'bg-[#11151d] border-solid border-[#fbbf24]/40' : 'bg-[#11151d]/50 hover:bg-[#11151d] hover:border-[#94a3b8]'
                  }`}
                >
                  {item ? (
                    <>
                      <span className="text-4xl mb-1">{item.icon}</span>
                      <span className="text-[8px] uppercase text-[#94a3b8] font-bold text-center px-1 truncate w-full">{item.name}</span>
                    </>
                  ) : (
                    <span className="text-xs text-[#1e293b] font-bold uppercase tracking-widest">
                      {slot === 'weapon' ? 'Arma' : slot === 'armor' ? 'Corpo' : 'Aces'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="bg-[#171c26] px-4 py-3 border-b border-[#1e293b] flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#fbbf24]">Inventário</h2>
            <span className="text-[10px] text-[#94a3b8] font-mono">
              {character.inventory.filter(i => i !== null).length} / {character.inventory.length}
            </span>
          </div>
          
          <div className="p-6 grid grid-cols-5 gap-3">
            {character.inventory.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => item && onEquip(item, idx)}
                className={`aspect-square rounded-md border border-[#1e293b] flex items-center justify-center cursor-pointer transition-all group ${
                  item 
                    ? 'bg-[#171c26] hover:border-[#fbbf24]/50 hover:shadow-lg hover:shadow-[#fbbf24]/5' 
                    : 'bg-[#11151d]/30 hover:bg-[#11151d]'
                }`}
              >
                {item ? (
                  <div className="relative">
                    <span className="text-3xl group-hover:scale-110 transition-transform inline-block">{item.icon}</span>
                    {item.rarity === 'legendary' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse shadow-lg shadow-[#fbbf24]/50"></div>}
                  </div>
                ) : (
                  <div className="w-1/3 h-1/3 bg-[#1e293b]/20 rounded-sm"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 border-t border-[#1e293b] bg-[#11151d]/50">
            <p className="text-[10px] text-[#94a3b8] uppercase text-center font-bold tracking-[0.1em]">Dica: Clique em um item para equipar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
