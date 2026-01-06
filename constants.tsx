
import React from 'react';
import { Item, ItemType, Mission } from './types';

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'w1',
    name: 'Soco Inglês Enferrujado',
    type: ItemType.WEAPON,
    rarity: 'common',
    stats: { attack: 5 },
    price: 150,
    currency: 'cash',
    icon: '👊'
  },
  {
    id: 'w2',
    name: 'Pistola 9mm G17',
    type: ItemType.WEAPON,
    rarity: 'rare',
    stats: { attack: 15, luck: 2 },
    price: 1200,
    currency: 'cash',
    icon: '🔫'
  },
  {
    id: 'a1',
    name: 'Casaco de Couro',
    type: ItemType.ARMOR,
    rarity: 'common',
    stats: { defense: 8 },
    price: 200,
    currency: 'cash',
    icon: '🧥'
  },
  {
    id: 'a2',
    name: 'Colete de Kevlar',
    type: ItemType.ARMOR,
    rarity: 'epic',
    stats: { defense: 25, health: 50 },
    price: 15,
    currency: 'gold',
    icon: '🛡️'
  }
];

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Cobrar Proteção',
    description: 'Vá ao mercadinho local e lembre-os de quem manda no bairro.',
    duration: 60,
    rewards: { cash: 50, xp: 20 },
    difficulty: 'EASY'
  },
  {
    id: 'm2',
    title: 'Escolta de Carga',
    description: 'Proteja o carregamento de "farinha especial" até o porto.',
    duration: 300,
    rewards: { cash: 250, xp: 100, itemChance: 0.1 },
    difficulty: 'MEDIUM'
  },
  {
    id: 'm3',
    title: 'Infiltrar Sede Rival',
    description: 'Plante escutas na sala do Boss da gangue inimiga.',
    duration: 900,
    rewards: { cash: 800, xp: 450, itemChance: 0.3 },
    difficulty: 'HARD'
  }
];

export const UI_COLORS = {
  bg: '#0b0e14',
  card: '#11151d',
  cardHeader: '#171c26',
  accent: '#2dd4bf', // Teal (Essentials)
  secondary: '#f472b6', // Pink (Future)
  warning: '#fbbf24', // Amber (Gold)
  danger: '#ef4444',
  muted: '#94a3b8',
  border: '#1e293b'
};
