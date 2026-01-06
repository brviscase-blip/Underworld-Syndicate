
import React from 'react';
import { Character } from '../types';

interface DebugViewProps {
  character: Character;
  onQuickUpdate: (update: Partial<Character> | ((prev: Character) => Character)) => void;
  onFinishMission: () => void;
  onClose: () => void;
}

const DebugView: React.FC<DebugViewProps> = ({ character, onQuickUpdate, onFinishMission, onClose }) => {
  return (
    <div className="space-y-6 animate-fade-in font-mono">
      <div className="flex justify-between items-center border-b border-green-900/50 pb-4">
        <div>
          <h2 className="text-xl font-black text-green-500 uppercase tracking-tighter">System Debug Console</h2>
          <p className="text-[10px] text-green-700 uppercase tracking-[0.3em] font-bold">Kernel Mode: Unrestricted Access</p>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-1.5 bg-green-500 text-black rounded text-[10px] font-black uppercase tracking-widest hover:bg-green-400 transition-all"
        >
          Exit Debug
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cheat Panel */}
        <div className="space-y-4">
          <section className="bg-black/50 border border-green-900/30 p-4 rounded-lg">
            <h3 className="text-[10px] font-bold text-green-500 uppercase mb-3 border-b border-green-900/20 pb-1">Currency Cheats</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onQuickUpdate(prev => ({ ...prev, cash: prev.cash + 10000 }))}
                className="py-2 bg-green-950/50 border border-green-500/30 text-green-500 text-[9px] font-bold rounded hover:bg-green-500 hover:text-black transition-all"
              >
                ADD $10.000 CASH
              </button>
              <button 
                onClick={() => onQuickUpdate(prev => ({ ...prev, gold: prev.gold + 100 }))}
                className="py-2 bg-green-950/50 border border-green-500/30 text-green-500 text-[9px] font-bold rounded hover:bg-green-500 hover:text-black transition-all"
              >
                ADD 100 GOLD
              </button>
            </div>
          </section>

          <section className="bg-black/50 border border-green-900/30 p-4 rounded-lg">
            <h3 className="text-[10px] font-bold text-green-500 uppercase mb-3 border-b border-green-900/20 pb-1">Character Status</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onQuickUpdate(prev => ({ ...prev, hp: prev.maxHp }))}
                className="py-2 bg-green-950/50 border border-green-500/30 text-green-500 text-[9px] font-bold rounded hover:bg-green-500 hover:text-black transition-all"
              >
                REFRESH HEALTH
              </button>
              <button 
                onClick={() => onQuickUpdate(prev => ({ ...prev, energy: prev.maxEnergy }))}
                className="py-2 bg-green-950/50 border border-green-500/30 text-green-500 text-[9px] font-bold rounded hover:bg-green-500 hover:text-black transition-all"
              >
                REFRESH ENERGY
              </button>
              <button 
                onClick={() => onQuickUpdate(prev => ({ ...prev, xp: prev.xp + 1000 }))}
                className="py-2 bg-green-950/50 border border-green-500/30 text-green-500 text-[9px] font-bold rounded hover:bg-green-500 hover:text-black transition-all"
              >
                ADD 1000 XP
              </button>
              <button 
                onClick={onFinishMission}
                className="py-2 bg-green-950/50 border border-green-500/30 text-green-500 text-[9px] font-bold rounded hover:bg-green-500 hover:text-black transition-all"
              >
                FINISH MISSION
              </button>
            </div>
          </section>
        </div>

        {/* State Inspector */}
        <div className="bg-black border border-green-900/30 p-4 rounded-lg flex flex-col h-full max-h-[400px]">
          <h3 className="text-[10px] font-bold text-green-500 uppercase mb-3 border-b border-green-900/20 pb-1 flex justify-between">
            <span>Live State Inspector</span>
            <span className="text-green-800 tracking-tighter">CHARACTER_OBJ_READ_ONLY</span>
          </h3>
          <pre className="flex-1 overflow-auto text-[9px] text-green-400 scrollbar-thin scrollbar-thumb-green-900">
            {JSON.stringify(character, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="p-3 bg-green-900/10 border border-green-900/20 rounded-md text-[8px] text-green-800 leading-relaxed uppercase tracking-widest text-center">
        Warning: Debug operations may desynchronize server-side validation or corrupt local save data if used during critical transitions.
      </div>
    </div>
  );
};

export default DebugView;
