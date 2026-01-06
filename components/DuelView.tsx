
import React, { useState, useEffect } from 'react';
import { Character } from '../types';

interface DuelViewProps {
  character: Character;
}

type BattleStatus = 'IDLE' | 'PLAYER_TURN' | 'ENEMY_TURN' | 'WON' | 'LOST';

interface EntityState {
  hp: number;
  maxHp: number;
  isGuarding: boolean;
}

const DuelView: React.FC<DuelViewProps> = ({ character }) => {
  const [status, setStatus] = useState<BattleStatus>('IDLE');
  const [player, setPlayer] = useState<EntityState>({ hp: character.hp, maxHp: character.maxHp, isGuarding: false });
  const [enemy, setEnemy] = useState<EntityState>({ hp: 100, maxHp: 100, isGuarding: false });
  const [log, setLog] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize battle
  const startBattle = () => {
    const enemyHp = 80 + (character.level * 15);
    setPlayer({ hp: character.hp, maxHp: character.maxHp, isGuarding: false });
    setEnemy({ hp: enemyHp, maxHp: enemyHp, isGuarding: false });
    setLog(["Inimigo avistado! Prepare-se para o combate."]);
    setStatus('PLAYER_TURN');
  };

  const addLog = (msg: string) => {
    setLog(prev => [msg, ...prev].slice(0, 10));
  };

  // Player Actions
  const handleAction = async (action: 'BASIC' | 'HEAVY' | 'DEFEND' | 'DIRTY') => {
    if (status !== 'PLAYER_TURN' || isProcessing) return;
    setIsProcessing(true);

    let damage = 0;
    let hit = true;
    let msg = "";

    // Reset player guard from previous turn at start of action
    setPlayer(p => ({ ...p, isGuarding: false }));

    switch (action) {
      case 'BASIC':
        damage = 10 + Math.floor(character.stats.strength * 0.8);
        msg = `Você desferiu um Jab direto! (-${damage} HP)`;
        break;
      case 'HEAVY':
        hit = Math.random() > 0.3;
        damage = hit ? 20 + character.stats.strength : 0;
        msg = hit ? `GOLPE BRUTAL! Você acertou em cheio! (-${damage} HP)` : "Você tentou um golpe pesado mas errou feio!";
        break;
      case 'DEFEND':
        setPlayer(p => ({ ...p, isGuarding: true }));
        addLog("Você entrou em Postura Defensiva. Próximo dano será reduzido.");
        finishPlayerTurn();
        return;
      case 'DIRTY':
        damage = 5 + Math.floor(character.stats.luck * 0.5);
        const stun = Math.random() > 0.6;
        msg = `Golpe Baixo! ${stun ? "O inimigo ficou atordoado!" : ""}`;
        if (stun) {
           applyDamageToEnemy(damage);
           addLog(msg);
           setIsProcessing(false);
           return; // Skip enemy turn
        }
        break;
    }

    if (hit) applyDamageToEnemy(damage);
    addLog(msg);
    finishPlayerTurn();
  };

  const applyDamageToEnemy = (dmg: number) => {
    const actualDmg = enemy.isGuarding ? Math.floor(dmg * 0.5) : dmg;
    setEnemy(e => {
      const newHp = Math.max(0, e.hp - actualDmg);
      if (newHp === 0) setStatus('WON');
      return { ...e, hp: newHp, isGuarding: false };
    });
  };

  const finishPlayerTurn = () => {
    setTimeout(() => {
      if (enemy.hp > 0) {
        setStatus('ENEMY_TURN');
      }
      setIsProcessing(false);
    }, 1000);
  };

  // Enemy AI logic
  useEffect(() => {
    if (status === 'ENEMY_TURN' && !isProcessing) {
      const runEnemyTurn = async () => {
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 1200));

        const shouldDefend = enemy.hp < enemy.maxHp * 0.3 && Math.random() > 0.5;
        
        if (shouldDefend) {
          setEnemy(e => ({ ...e, isGuarding: true }));
          addLog("O inimigo está se protegendo!");
        } else {
          const dmg = 8 + (character.level * 2) + Math.floor(Math.random() * 5);
          const finalDmg = player.isGuarding ? Math.floor(dmg * 0.5) : dmg;
          
          setPlayer(p => {
            const newHp = Math.max(0, p.hp - finalDmg);
            if (newHp === 0) setStatus('LOST');
            return { ...p, hp: newHp, isGuarding: false };
          });
          
          addLog(`O inimigo contra-atacou! (-${finalDmg} HP) ${player.isGuarding ? "[DEFENDIDO]" : ""}`);
        }

        if (player.hp > 0) setStatus('PLAYER_TURN');
        setIsProcessing(false);
      };
      runEnemyTurn();
    }
  }, [status]);

  const getHealthColor = (hp: number, max: number) => {
    const pct = (hp / max) * 100;
    if (pct > 60) return 'bg-emerald-500';
    if (pct > 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Combatants Header */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* Player Side */}
        <div className="flex-1 bg-[#0b0e14] border border-[#1e293b] rounded-xl p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 z-10">
            <div>
              <h3 className="text-lg font-bold text-white leading-none">{character.name}</h3>
              <p className="text-[10px] text-[#2dd4bf] font-mono mt-1 uppercase tracking-widest">VOCÊ</p>
            </div>
            {player.isGuarding && <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded border border-blue-500/30 animate-pulse">ESCUDO ATIVO</span>}
          </div>
          
          <div className="relative h-24 flex items-center justify-center mb-4 z-10">
            <span className={`text-6xl transition-transform duration-300 ${status === 'PLAYER_TURN' ? 'scale-110' : 'scale-100 opacity-80'}`}>👤</span>
          </div>

          <div className="space-y-1.5 z-10">
            <div className="flex justify-between text-[10px] font-bold text-[#94a3b8] uppercase">
              <span>Energia Vital</span>
              <span className="font-mono">{player.hp} / {player.maxHp}</span>
            </div>
            <div className="h-2 w-full bg-[#1e293b] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getHealthColor(player.hp, player.maxHp)}`}
                style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* VS Center */}
        <div className="flex items-center justify-center">
          <div className="relative group">
            <div className={`w-14 h-14 rounded-full bg-[#171c26] border-2 border-[#1e293b] flex items-center justify-center shadow-2xl transition-colors ${status !== 'IDLE' ? 'border-[#f472b6]' : ''}`}>
               <span className="text-xl font-black italic text-[#f472b6]">VS</span>
            </div>
            {isProcessing && <div className="absolute -inset-2 border-2 border-[#f472b6]/30 border-t-[#f472b6] rounded-full animate-spin"></div>}
          </div>
        </div>

        {/* Enemy Side */}
        <div className="flex-1 bg-[#0b0e14] border border-[#1e293b] rounded-xl p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 z-10">
            {enemy.isGuarding && <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded border border-blue-500/30 animate-pulse">ESCUDO ATIVO</span>}
            <div className="text-right">
              <h3 className="text-lg font-bold text-[#94a3b8] leading-none">Rival Local</h3>
              <p className="text-[10px] text-[#ef4444] font-mono mt-1 uppercase tracking-widest">INIMIGO</p>
            </div>
          </div>

          <div className="relative h-24 flex items-center justify-center mb-4 z-10">
            <span className={`text-6xl transition-transform duration-300 ${status === 'ENEMY_TURN' ? 'scale-110' : 'scale-100 opacity-60'}`}>💀</span>
          </div>

          <div className="space-y-1.5 z-10">
            <div className="flex justify-between text-[10px] font-bold text-[#94a3b8] uppercase">
              <span className="font-mono">{enemy.hp} / {enemy.maxHp}</span>
              <span>Energia Vital</span>
            </div>
            <div className="h-2 w-full bg-[#1e293b] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ml-auto ${getHealthColor(enemy.hp, enemy.maxHp)}`}
                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 bg-[#11151d] border border-[#1e293b] rounded-xl p-6 shadow-xl">
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-xs font-bold text-[#94a3b8] uppercase tracking-[0.2em]">Comandos de Combate</h4>
            <div className="text-[10px] font-mono text-[#2dd4bf]">
              {status === 'PLAYER_TURN' ? "SUA VEZ DE AGIR" : status === 'ENEMY_TURN' ? "INIMIGO PENSANDO..." : "AGUARDANDO DESAFIO"}
            </div>
          </div>

          {status === 'IDLE' || status === 'WON' || status === 'LOST' ? (
            <button 
              onClick={startBattle}
              className="w-full py-6 rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#0d9488] text-[#0b0e14] font-black uppercase tracking-[0.3em] text-xl shadow-lg shadow-[#2dd4bf]/20 hover:scale-[1.01] active:scale-95 transition-all"
            >
              {status === 'IDLE' ? 'Iniciar Duelo' : status === 'WON' ? 'Lutar Novamente (Vitória!)' : 'Revanche (Derrota)'}
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleAction('BASIC')}
                disabled={status !== 'PLAYER_TURN' || isProcessing}
                className="group flex flex-col items-center justify-center p-4 bg-[#1e293b] border border-[#334155] rounded-lg hover:border-[#2dd4bf] hover:bg-[#2dd4bf]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">👊</span>
                <span className="text-xs font-bold text-white uppercase">Ataque Direto</span>
                <span className="text-[8px] text-[#94a3b8] mt-1">Dano Estável | 100% Acerto</span>
              </button>
              
              <button 
                onClick={() => handleAction('HEAVY')}
                disabled={status !== 'PLAYER_TURN' || isProcessing}
                className="group flex flex-col items-center justify-center p-4 bg-[#1e293b] border border-[#334155] rounded-lg hover:border-[#f472b6] hover:bg-[#f472b6]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">💥</span>
                <span className="text-xs font-bold text-white uppercase">Golpe Brutal</span>
                <span className="text-[8px] text-[#94a3b8] mt-1">Dano Alto | 70% Acerto</span>
              </button>

              <button 
                onClick={() => handleAction('DEFEND')}
                disabled={status !== 'PLAYER_TURN' || isProcessing}
                className="group flex flex-col items-center justify-center p-4 bg-[#1e293b] border border-[#334155] rounded-lg hover:border-blue-400 hover:bg-blue-400/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🛡️</span>
                <span className="text-xs font-bold text-white uppercase">Defender</span>
                <span className="text-[8px] text-[#94a3b8] mt-1">-50% Dano Recebido</span>
              </button>

              <button 
                onClick={() => handleAction('DIRTY')}
                disabled={status !== 'PLAYER_TURN' || isProcessing}
                className="group flex flex-col items-center justify-center p-4 bg-[#1e293b] border border-[#334155] rounded-lg hover:border-amber-400 hover:bg-amber-400/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🦶</span>
                <span className="text-xs font-bold text-white uppercase">Golpe Baixo</span>
                <span className="text-[8px] text-[#94a3b8] mt-1">Dano Baixo | Chance de Atordoar</span>
              </button>
            </div>
          )}
        </div>

        {/* Combat Log */}
        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-xl flex flex-col overflow-hidden">
          <div className="bg-[#171c26] px-4 py-3 border-b border-[#1e293b] flex justify-between items-center">
            <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Relatório de Batalha</h4>
          </div>
          <div className="p-4 flex-1 font-mono text-[10px] space-y-2 overflow-y-auto bg-[#0b0e14]">
            {log.map((line, i) => (
              <div key={i} className={`p-2 rounded border-l-2 ${
                line.includes('Você') ? 'border-[#2dd4bf] bg-[#2dd4bf]/5 text-[#2dd4bf]' : 
                line.includes('inimigo') ? 'border-[#ef4444] bg-[#ef4444]/5 text-[#ef4444]' : 
                'border-[#334155] text-[#94a3b8]'
              }`}>
                {line}
              </div>
            ))}
            {log.length === 0 && (
              <div className="h-full flex items-center justify-center opacity-20 italic">Aguardando início...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuelView;
