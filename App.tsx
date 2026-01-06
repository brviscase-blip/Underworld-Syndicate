
import React, { useState, useEffect, useCallback } from 'react';
import { Character, GameView, Item, ItemType, Mission } from './types';
import { INITIAL_ITEMS, MISSIONS } from './constants';
import { supabase } from './supabase';

// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProfileView from './components/ProfileView';
import MissionsView from './components/MissionsView';
import ShopView from './components/ShopView';
import DuelView from './components/DuelView';
import AdmEditorView from './components/AdmEditorView';
import DebugView from './components/DebugView';
import SettingsView from './components/SettingsView';

const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2023/11/02/16/00/anime-8361021_1280.jpg';

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
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load character from Supabase
  useEffect(() => {
    const loadCharacter = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('name', 'GhostDog')
        .single();

      if (data && !error) {
        setCharacter({
          name: data.name,
          level: data.level,
          xp: data.xp,
          maxXp: data.max_xp,
          hp: data.hp,
          maxHp: data.max_hp,
          cash: data.cash,
          gold: data.gold,
          energy: data.energy,
          maxEnergy: data.max_energy,
          avatar: data.avatar || DEFAULT_AVATAR,
          stats: {
            strength: data.strength,
            physique: data.physique,
            luck: data.luck,
            tenacity: data.tenacity
          },
          equipment: data.equipment,
          inventory: data.inventory
        });
      }
      setIsLoaded(true);
    };

    loadCharacter();
  }, []);

  // Auto-save to Supabase (Debounced logic)
  useEffect(() => {
    if (!isLoaded) return;

    const saveTimeout = setTimeout(async () => {
      setIsSyncing(true);
      const { error } = await supabase
        .from('characters')
        .upsert({
          name: character.name,
          level: character.level,
          xp: character.xp,
          max_xp: character.maxXp,
          hp: character.hp,
          max_hp: character.maxHp,
          cash: character.cash,
          gold: character.gold,
          energy: character.energy,
          max_energy: character.maxEnergy,
          avatar: character.avatar,
          strength: character.stats.strength,
          physique: character.stats.physique,
          luck: character.stats.luck,
          tenacity: character.stats.tenacity,
          equipment: character.equipment,
          inventory: character.inventory,
          updated_at: new Date().toISOString()
        }, { onConflict: 'name' });

      if (error) console.error('Sync Error:', error);
      setIsSyncing(false);
    }, 1500);

    return () => clearTimeout(saveTimeout);
  }, [character, isLoaded]);

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
      
      while (newXp >= newMaxXp) {
        newLevel += 1;
        newXp -= newMaxXp;
        newMaxXp = Math.floor(newMaxXp * 1.5);
      }
      
      return {
        ...prev,
        cash: prev.cash + mission.rewards.cash,
        xp: newXp,
        level: newLevel,
        maxXp: newMaxXp,
        energy: Math.max(0, prev.energy - 10)
      };
    });
    setActiveMission(null);
  };

  const startMission = (missionId: string) => {
    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission || activeMission || character.energy < 10) return;
    const endTime = Date.now() + (mission.duration * 1000);
    setActiveMission({ id: missionId, endTime });
  };

  const instantFinishMission = () => {
    if (!activeMission) return;
    const mission = MISSIONS.find(m => m.id === activeMission.id);
    if (mission) completeMission(mission);
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

  const handleUpdateCharacter = (updated: Character | ((prev: Character) => Character)) => {
    if (typeof updated === 'function') {
      setCharacter(prev => {
        const result = updated(prev);
        let newXp = result.xp;
        let newLevel = result.level;
        let newMaxXp = result.maxXp;
        while (newXp >= newMaxXp) {
          newLevel += 1;
          newXp -= newMaxXp;
          newMaxXp = Math.floor(newMaxXp * 1.5);
        }
        return { ...result, xp: newXp, level: newLevel, maxXp: newMaxXp };
      });
    } else {
      setCharacter(updated);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case GameView.PROFILE: return <ProfileView character={character} onEquip={equipItem} onUnequip={unequipItem} />;
      case GameView.MISSIONS: return <MissionsView missions={MISSIONS} activeMission={activeMission} currentTime={currentTime} onStart={startMission} />;
      case GameView.SHOP: return <ShopView items={INITIAL_ITEMS} onBuy={buyItem} />;
      case GameView.DUELS: return <DuelView character={character} />;
      case GameView.SETTINGS: return (
        <SettingsView 
          character={character}
          onUpdateAvatar={(url) => setCharacter(prev => ({ ...prev, avatar: url }))} 
          onClose={() => setCurrentView(GameView.PROFILE)} 
        />
      );
      case GameView.ADM_EDITOR: return (
        <AdmEditorView 
          character={character} 
          onUpdate={handleUpdateCharacter} 
          onClose={() => setCurrentView(GameView.PROFILE)} 
        />
      );
      case GameView.DEBUG: return (
        <DebugView 
          character={character}
          onQuickUpdate={handleUpdateCharacter}
          onFinishMission={instantFinishMission}
          onClose={() => setCurrentView(GameView.PROFILE)}
        />
      );
      default: return <ProfileView character={character} onEquip={equipItem} onUnequip={unequipItem} />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0b0e14] text-[#3b82f6] font-mono">
        <div className="text-2xl font-black mb-4 animate-pulse uppercase tracking-[0.5em]">Establishing Connection...</div>
        <div className="w-64 h-1 bg-[#1e293b] rounded-full overflow-hidden">
          <div className="h-full bg-[#3b82f6] animate-progress-fast"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col max-w-[1400px] mx-auto p-2 md:p-4 gap-3 overflow-hidden bg-[#0b0e14]">
      <Header character={character} />
      
      <div className="flex flex-col md:flex-row gap-3 flex-1 overflow-hidden">
        <aside className="w-full md:w-56 flex flex-col gap-3 h-full overflow-hidden shrink-0">
          <Navigation currentView={currentView} setView={setCurrentView} />
          
          <div className="bg-[#11151d] border border-[#1e293b] rounded-lg p-3 shadow-xl mt-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest">Painel Operacional</h3>
              {isSyncing && <span className="text-[8px] text-green-500 font-mono animate-pulse uppercase">Syncing...</span>}
            </div>
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
        Underworld Syndicate • Database Active: SUPABASE_CLOUD
      </footer>
    </div>
  );
};

export default App;
