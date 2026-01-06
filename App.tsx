
import React, { useState, useEffect } from 'react';
import { Character, GameView, Item, ItemType, Mission } from './types';
import { INITIAL_ITEMS, MISSIONS } from './constants';

// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProfileView from './components/ProfileView';
import MissionsView from './components/MissionsView';
import ShopView from './components/ShopView';
import DuelView from './components/DuelView';
import AvatarCreator from './components/AvatarCreator';

// Usando uma ilustração 2D de alta qualidade como padrão inicial
const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2023/07/26/16/33/man-8151610_1280.jpg';

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character>({
    name: 'GhostDog',
    level: 1,
    xp: 0,
    maxXp: 100,
    hp: 100,
    maxHp: 100,
    cash: 500,
    gold: 10,
    energy: 100,
    maxEnergy: 100,
    avatar: DEFAULT_AVATAR,
    stats: {
      strength: 10,
      physique: 10,
      luck: 5,
      tenacity: 5
    },
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    },
    inventory: Array(25).fill(null)
  });

  const [currentView, setCurrentView] = useState<GameView>(GameView.PROFILE);
  const [activeMission, setActiveMission] = useState<{ id: string, endTime: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeMission && currentTime >= activeMission.endTime) {
      const mission = MISSIONS.find(m => m.id === activeMission.id);
      if (mission) completeMission(mission);
    }
  }, [activeMission, currentTime]);

  const completeMission = (mission: Mission) => {
    setCharacter(prev => {
      let newXp = prev.xp + mission.rewards.xp;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      if (newXp >= prev.maxXp) {
        newLevel += 1;
        newXp -= prev.maxXp;
        newMaxXp = Math.floor(prev.maxXp * 1.5);
      }
      return {
        ...prev,
        cash: prev.cash + mission.rewards.cash,
        xp: newXp,
        level: newLevel,
        maxXp: newMaxXp,
        energy: Math.min(prev.energy + 5, prev.maxEnergy)
      };
    });
    setActiveMission(null);
  };

  const startMission = (missionId: string) => {
    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission || activeMission) return;
    const endTime = Date.now() + (mission.duration * 1000);
    setActiveMission({ id: missionId, endTime });
  };

  const equipItem = (item: Item, inventoryIndex: number) => {
    setCharacter(prev => {
      const newInventory = [...prev.inventory];
      let replacedItem: Item | null = null;
      const newEquipment = { ...prev.equipment };
      if (item.type === ItemType.WEAPON) { replacedItem = newEquipment.weapon; newEquipment.weapon = item; }
      else if (item.type === ItemType.ARMOR) { replacedItem = newEquipment.armor; newEquipment.armor = item; }
      else if (item.type === ItemType.ACCESSORY) { replacedItem = newEquipment.accessory; newEquipment.accessory = item; }
      newInventory[inventoryIndex] = replacedItem;
      return { ...prev, equipment: newEquipment, inventory: newInventory };
    });
  };

  const unequipItem = (slot: keyof Character['equipment']) => {
    setCharacter(prev => {
      const itemToUnequip = prev.equipment[slot];
      if (!itemToUnequip) return prev;
      const freeSlot = prev.inventory.findIndex(i => i === null);
      if (freeSlot === -1) return prev;
      const newInventory = [...prev.inventory];
      newInventory[freeSlot] = itemToUnequip;
      const newEquipment = { ...prev.equipment };
      newEquipment[slot] = null;
      return { ...prev, equipment: newEquipment, inventory: newInventory };
    });
  };

  const buyItem = (item: Item) => {
    setCharacter(prev => {
      const currency = item.currency === 'cash' ? 'cash' : 'gold';
      if (prev[currency] < item.price) return prev;
      const freeSlot = prev.inventory.findIndex(i => i === null);
      if (freeSlot === -1) return prev;
      const newInventory = [...prev.inventory];
      newInventory[freeSlot] = { ...item, id: `${item.id}-${Date.now()}` };
      return { ...prev, [currency]: prev[currency] - item.price, inventory: newInventory };
    });
  };

  const saveAvatar = (avatar: string) => {
    setCharacter(prev => ({ ...prev, avatar }));
    setCurrentView(GameView.PROFILE);
  };

  const renderView = () => {
    switch (currentView) {
      case GameView.PROFILE: return <ProfileView character={character} onEquip={equipItem} onUnequip={unequipItem} onEditAvatar={() => setCurrentView(GameView.AVATAR_CREATOR)} />;
      case GameView.AVATAR_CREATOR: return <AvatarCreator initialAvatar={character.avatar} onSave={saveAvatar} />;
      case GameView.MISSIONS: return <MissionsView missions={MISSIONS} activeMission={activeMission} currentTime={currentTime} onStart={startMission} />;
      case GameView.SHOP: return <ShopView items={INITIAL_ITEMS} onBuy={buyItem} />;
      case GameView.DUELS: return <DuelView character={character} />;
      default: return <ProfileView character={character} onEquip={equipItem} onUnequip={unequipItem} onEditAvatar={() => setCurrentView(GameView.AVATAR_CREATOR)} />;
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-[1400px] mx-auto p-2 md:p-4 gap-3 overflow-hidden bg-[#0b0e14]">
      <Header character={character} />
      
      <div className="flex flex-col md:flex-row gap-3 flex-1 overflow-hidden">
        <aside className="w-full md:w-56 flex flex-col gap-3 h-full overflow-hidden shrink-0">
          <Navigation currentView={currentView} setView={setCurrentView} />
          
          <div className="bg-[#11151d] border border-[#1e293b] rounded-lg p-3 shadow-xl">
            <h3 className="text-[10px] font-bold text-[#3b82f6] uppercase mb-2 tracking-widest">Painel Operacional</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] mb-1 font-mono">
                  <span className="text-slate-400">ENERGIA</span>
                  <span className="text-[#3b82f6]">{character.energy}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#3b82f6] to-[#1e40af] transition-all duration-500" style={{ width: `${character.energy}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1 font-mono">
                  <span className="text-slate-400">SAÚDE</span>
                  <span className="text-red-500">{character.hp}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-600 to-red-900 transition-all duration-500" style={{ width: `${character.hp}%` }} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-[#11151d] border border-[#1e293b] rounded-lg shadow-2xl relative overflow-hidden flex flex-col">
          <div className="h-1 w-full bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1e40af]"></div>
          <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            {renderView()}
          </div>
        </main>
      </div>

      <footer className="text-center text-[9px] text-slate-700 uppercase tracking-[0.3em] py-1 shrink-0 font-black">
        Underworld Syndicate • Criminal Empire Sim
      </footer>
    </div>
  );
};

export default App;
