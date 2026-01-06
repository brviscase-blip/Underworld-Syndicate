
import React from 'react';
import { Item } from '../types';

interface ShopViewProps {
  items: Item[];
  onBuy: (item: Item) => void;
}

const ShopView: React.FC<ShopViewProps> = ({ items, onBuy }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Arsenal & Utilitários</h2>
        <p className="text-[#94a3b8] text-sm">Equipamentos de alta qualidade para operações de risco.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-[#0b0e14] border border-[#1e293b] rounded-xl p-6 flex gap-6 hover:border-[#2dd4bf]/30 transition-all group">
            <div className="w-24 h-24 bg-[#11151d] rounded-lg border border-[#1e293b] flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-inner">
              {item.icon}
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white uppercase tracking-wider">{item.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    item.rarity === 'common' ? 'text-slate-400 border-slate-700' :
                    item.rarity === 'rare' ? 'text-blue-400 border-blue-900 bg-blue-900/10' :
                    item.rarity === 'epic' ? 'text-purple-400 border-purple-900 bg-purple-900/10' :
                    'text-yellow-400 border-yellow-900 bg-yellow-900/10 animate-pulse'
                  }`}>
                    {item.rarity}
                  </span>
                </div>
                
                <div className="flex gap-4 mt-2">
                  {Object.entries(item.stats).map(([stat, val]) => (
                    <div key={stat} className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-[#94a3b8]">{stat === 'attack' ? 'ATK' : 'DEF'}</span>
                      <span className="text-sm font-mono text-white">+{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  {item.currency === 'cash' ? (
                    <span className="text-lg font-mono font-bold text-[#2dd4bf]">${item.price.toLocaleString()}</span>
                  ) : (
                    <span className="text-lg font-mono font-bold text-[#fbbf24]">{item.price} AUR</span>
                  )}
                </div>
                
                <button 
                  onClick={() => onBuy(item)}
                  className="bg-[#1e293b] border border-[#334155] text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#2dd4bf] hover:text-[#0b0e14] hover:border-[#2dd4bf] transition-all"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopView;
