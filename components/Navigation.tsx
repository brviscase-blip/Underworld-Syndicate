
import React from 'react';
import { GameView } from '../types';

interface NavigationProps {
  currentView: GameView;
  setView: (view: GameView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: GameView.PROFILE, label: 'Perfil Ativo', icon: '👤' },
    { id: GameView.AVATAR_CREATOR, label: 'Customizar Herói', icon: '🎨' },
    { id: GameView.MISSIONS, label: 'Missões', icon: '📋' },
    { id: GameView.DUELS, label: 'Duelos', icon: '⚔️' },
    { id: GameView.SHOP, label: 'Loja Obscura', icon: '🏪' },
    { id: GameView.RANKING, label: 'Ranking Geral', icon: '🏆' },
  ];

  return (
    <nav className="flex flex-col gap-2 bg-[#11151d] border border-[#1e293b] rounded-lg p-2 shadow-xl">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 group ${
            currentView === item.id
              ? 'bg-[#2dd4bf]/10 text-[#2dd4bf] border border-[#2dd4bf]/20'
              : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
          }`}
        >
          <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${currentView === item.id ? 'opacity-100' : 'opacity-60'}`}>
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
