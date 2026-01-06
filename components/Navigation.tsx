
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
    { id: GameView.AVATAR_CREATOR, label: 'Customizar Herói', icon: 'avatar' },
    { id: GameView.MISSIONS, label: 'Missões', icon: 'mission' },
    { id: GameView.DUELS, label: 'Duelos', icon: 'duel' },
    { id: GameView.SHOP, label: 'Loja Obscura', icon: 'shop' },
    { id: GameView.RANKING, label: 'Ranking Geral', icon: 'ranking' },
  ];

  return (
    <nav className="flex flex-col gap-2 bg-[#11151d] border border-[#1e293b] rounded-lg p-2 shadow-xl">
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
  );
};

export default Navigation;
