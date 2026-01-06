
import React from 'react';
import { GameView } from '../types';
import Icons from './Icons';

interface NavigationProps {
  currentView: GameView;
  setView: (view: GameView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: GameView.PROFILE, label: 'Perfil Ativo', icon: 'profile' },
    { id: GameView.MISSIONS, label: 'Missões', icon: 'mission' },
    { id: GameView.DUELS, label: 'Duelos', icon: 'duel' },
    { id: GameView.SHOP, label: 'Loja Obscura', icon: 'shop' },
    { id: GameView.RANKING, label: 'Ranking Geral', icon: 'ranking' },
  ];

  return (
    <div className="flex flex-col h-full gap-2">
      <nav className="flex flex-col gap-2 bg-[#11151d] border border-[#1e293b] rounded-lg p-2 shadow-xl flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            <Icons 
              name={item.icon} 
              size={18} 
              color={currentView === item.id ? '#3b82f6' : '#64748b'}
              className="transition-transform group-hover:scale-110" 
            />
            {item.label}
          </button>
        ))}
      </nav>
      
      <button
        onClick={() => setView(GameView.SETTINGS)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border mt-auto shadow-lg ${
          currentView === GameView.SETTINGS
            ? 'bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/40'
            : 'bg-[#0b0e14]/50 text-[#4b5563] border-[#1e293b] hover:text-[#3b82f6] hover:border-[#3b82f6]/30'
        }`}
      >
        <Icons name="settings" size={14} className={currentView === GameView.SETTINGS ? 'animate-spin-slow' : ''} />
        Configurações
      </button>
    </div>
  );
};

export default Navigation;
