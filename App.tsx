
import React, { useState, useEffect, useCallback } from 'react';
import { Character, GameView, Item, ItemType, Mission } from './types';
import { INITIAL_ITEMS, MISSIONS, UI_COLORS } from './constants';

// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProfileView from './components/ProfileView';
import MissionsView from './components/MissionsView';
import ShopView from './components/ShopView';
import DuelView from './components/DuelView';
import AvatarCreator from './components/AvatarCreator';

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gunnar';

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character>({
    name: 'RagnarZoiudo',
    level: 1,
    xp: 0,
    maxXp: 100,
    hp: 100,
    maxHp: 100,
    cash: 500,
    gold: 5,
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

  // Clock for missions
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check mission completion
  useEffect(() => {
    if (activeMission && currentTime >= activeMission.endTime) {
      const mission = MISSIONS.find(m => m.id === activeMission.id);
      if (mission) {
        completeMission(mission);
      }
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
    alert(`Missão "${mission.title}" completa! Recompensas: $${mission.rewards.cash} e ${mission.rewards.xp} XP.`);
  };

  const startMission = (missionId: string) => {
    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission) return;
    
    if (activeMission) {
      alert("Você já está em uma missão!");
      return;
    }

    const endTime = Date.now() + (mission.duration * 1000);
    setActiveMission({ id: missionId, endTime });
  };

  const equipItem = (item: Item, inventoryIndex: number) => {
    setCharacter(prev => {
      const newInventory = [...prev.inventory];
      let replacedItem: Item | null = null;
      const newEquipment = { ...prev.equipment };

      if (item.type === ItemType.WEAPON) {
        replacedItem = newEquipment.weapon;
        newEquipment.weapon = item;
      } else if (item.type === ItemType.ARMOR) {
        replacedItem = newEquipment.armor;
        newEquipment.armor = item;
      } else if (item.type === ItemType.ACCESSORY) {
        replacedItem = newEquipment.accessory;
        newEquipment.accessory = item;
      }

      newInventory[inventoryIndex] = replacedItem;
      return { ...prev, equipment: newEquipment, inventory: newInventory };
    });
  };

  const unequipItem = (slot: keyof Character['equipment']) => {
    setCharacter(prev => {
      const itemToUnequip = prev.equipment[slot];
      if (!itemToUnequip) return prev;

      const freeSlot = prev.inventory.findIndex(i => i === null);
      if (freeSlot === -1) {
        alert("Inventário cheio!");
        return prev;
      }

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
      if (prev[currency] < item.price) {
        alert(`Saldo insuficiente de ${currency === 'cash' ? 'Dinheiro' : 'Barras de Ouro'}!`);
        return prev;
      }

      const freeSlot = prev.inventory.findIndex(i => i === null);
      if (freeSlot === -1) {
        alert("Inventário cheio!");
        return prev;
      }

      const newInventory = [...prev.inventory];
      newInventory[freeSlot] = { ...item, id: `${item.id}-${Date.now()}` };

      return {
        ...prev,
        [currency]: prev[currency] - item.price,
        inventory: newInventory
      };
    });
  };

  const saveAvatar = (avatar: string) => {
    setCharacter(prev => ({ ...prev, avatar }));
    setCurrentView(GameView.PROFILE);
  };

  const renderView = () => {
    switch (currentView) {
      case GameView.PROFILE:
        return <ProfileView character={character} onEquip={equipItem} onUnequip={unequipItem} onEditAvatar={() => setCurrentView(GameView.AVATAR_CREATOR)} />;
      case GameView.AVATAR_CREATOR:
        return <AvatarCreator initialAvatar={character.avatar} onSave={saveAvatar} />;
      case GameView.MISSIONS:
        return <MissionsView missions={MISSIONS} activeMission={activeMission} currentTime={currentTime} onStart={startMission} />;
      case GameView.SHOP:
        return <ShopView items={INITIAL_ITEMS} onBuy={buyItem} />;
      case GameView.DUELS:
        return <DuelView character={character} />;
      default:
        return <ProfileView character={character} onEquip={equipItem} onUnequip={unequipItem} onEditAvatar={() => setCurrentView(GameView.AVATAR_CREATOR)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[1400px] mx-auto p-4 md:p-6 gap-6">
      <Header character={character} />
      
      <div className="flex flex-col md:flex-row gap-6 flex-1">
        <aside className="w-full md:w-64 flex flex-col gap-4">
          <Navigation currentView={currentView} setView={setCurrentView} />
          
          {/* Quick Stats Mini-Card */}
          <div className="bg-[#11151d] border border-[#1e293b] rounded-lg p-4 shadow-xl">
            <h3 className="text-xs font-bold text-[#94a3b8] uppercase mb-3 tracking-widest text-[#fbbf24]">Painel de Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#94a3b8]">Energia</span>
                  <span className="text-[#fbbf24] font-mono">{character.energy}/{character.maxEnergy}</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#fbbf24] to-[#d97706] transition-all duration-500"
                    style={{ width: `${(character.energy / character.maxEnergy) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#94a3b8]">Saúde</span>
                  <span className="text-[#ef4444] font-mono">{character.hp}/{character.maxHp}</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#ef4444] to-[#991b1b] transition-all duration-500"
                    style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-[#11151d] border border-[#1e293b] rounded-lg shadow-2xl relative overflow-hidden flex flex-col">
          {/* Header Accent Bar - Golden as Questland */}
          <div className="h-1 w-full bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#b45309]"></div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            {renderView()}
          </div>
        </main>
      </div>

      <footer className="text-center text-[10px] text-slate-600 uppercase tracking-[0.2em] py-4">
        Underworld Syndicate v1.1.0 • Quest Edition
      </footer>
    </div>
  );
};

export default App;
