
import React from 'react';
import { Item } from '../types';
import Icons from './Icons';

interface ShopViewProps {
  items: Item[];
  onBuy: (item: Item) => void;
}

const ShopView: React.FC<ShopViewProps> = ({ items, onBuy }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight uppercase">Mercado Negro</h2>
        <p className="text-[#94a3b8] text-[10px] uppercase tracking-[0.2em] mt-1">Sindicato Supply Network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="bg-[#0b0e14] border border-[#1e293b] rounded-lg p-3 flex gap-4 hover:border-[#3b82f6]/30 transition-all group relative">
            <div className="w-20 h-20 bg-[#11151d] rounded border border-[#1e293b] flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner shrink-0">
              <Icons name={item.icon} size={36} color="#3b82f6" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{item.name}</h3>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                    item.rarity === 'common' ? 'text-slate-400 border-slate-700' :
                    item.rarity === 'rare' ? 'text-[#3b82f6] border-[#3b82f6]/30 bg-[#3b82f6]/10' :
                    item.rarity === 'epic' ? 'text-purple-400 border-purple-900 bg-purple-900/10' :
                    'text-[#fbbf24] border-[#fbbf24]/30 bg-[#fbbf24]/10 animate-pulse'
                  }`}>
                    {item.rarity}
                  </span>
                </div>
                
                <div className="flex gap-3 mt-1">
                  {Object.entries(item.stats).map(([stat, val]) => (
                    <div key={stat} className="flex flex-col">
                      <span className="text-[7px] uppercase font-bold text-[#94a3b8]">{stat === 'attack' ? 'ATK' : 'DEF'}</span>
                      <span className="text-[10px] font-mono text-white">+{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1">
                  {item.currency === 'cash' ? (
                    <span className="text-sm font-mono font-bold text-[#3b82f6]">${item.price.toLocaleString()}</span>
                  ) : (
                    <span className="text-sm font-mono font-bold text-[#fbbf24]">{item.price} AUR</span>
                  )}
                </div>
                
                <button 
                  onClick={() => onBuy(item)}
                  className="bg-[#1e293b] border border-[#334155] text-white px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-[#3b82f6] hover:text-white hover:border-[#3b82f6] transition-all active:scale-95"
                >
                  Adquirir
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
