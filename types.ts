
export enum ItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  ACCESSORY = 'ACCESSORY',
  CONSUMABLE = 'CONSUMABLE'
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
    luck?: number;
  };
  price: number;
  currency: 'cash' | 'gold';
  icon: string;
}

export interface Character {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  cash: number;
  gold: number;
  energy: number;
  maxEnergy: number;
  avatar: string; // URL da imagem ou Base64
  stats: {
    strength: number;
    physique: number;
    luck: number;
    tenacity: number;
  };
  equipment: {
    weapon: Item | null;
    armor: Item | null;
    accessory: Item | null;
  };
  inventory: (Item | null)[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  rewards: {
    cash: number;
    xp: number;
    itemChance?: number;
  };
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export enum GameView {
  PROFILE = 'PROFILE',
  MISSIONS = 'MISSIONS',
  DUELS = 'DUELS',
  SHOP = 'SHOP',
  RANKING = 'RANKING'
}
