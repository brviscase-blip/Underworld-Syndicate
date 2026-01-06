
import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import Icons from './Icons';
import AvatarDisplay from './AvatarDisplay';

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
    setLog(["Relatório: Alvo localizado. Iniciando protocolo de combate."]);
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

    setPlayer(p => ({ ...p, isGuarding: false }));

    switch (action) {
      case 'BASIC':
        damage = 10 + Math.floor(character.stats.strength * 0.8);
        msg = `Sindicato: Ataque direto executado. Dano: ${damage}.`;
        break;
      case 'HEAVY':
        hit = Math.random() > 0.3;
        damage = hit ? 20 + character.stats.strength : 0;
        msg = hit ? `Sindicato: Carga máxima atingida! Dano: ${damage}.` : "Erro: O alvo se esquivou do golpe pesado.";
        break;
      case 'DEFEND':
        setPlayer(p => ({ ...p, isGuarding: true }));
        addLog("Protocolo: Postura defensiva ativada. Redução de dano: 50%.");
        finishPlayerTurn();
        return;
      case 'DIRTY':
        damage = 5 + Math.floor(character.stats.luck * 0.5);
        const stun = Math.random() > 0.6;
        msg = `Tática: Golpe baixo aplicado. ${stun ? "Alvo desestabilizado." : ""}`;
        if (stun) {
           applyDamageToEnemy(damage);
           addLog(msg);
           setIsProcessing(false);
           return; 
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

  useEffect(() => {
    if (status === 'ENEMY_TURN' && !isProcessing) {
      const runEnemyTurn = async () => {
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 1200));

        const shouldDefend = enemy.hp < enemy.maxHp * 0.3 && Math.random() > 0.5;
        
        if (shouldDefend) {
          setEnemy(e => ({ ...e, isGuarding: true }));
          addLog("Alvo: O inimigo está em posição de defesa!");
        } else {
          const dmg = 8 + (character.level * 2) + Math.floor(Math.random() * 5);
          const finalDmg = player.isGuarding ? Math.floor(dmg * 0.5) : dmg;
          
          setPlayer(p => {
            const newHp = Math.max(0, p.hp - finalDmg);
            if (newHp === 0) setStatus('LOST');
            return { ...p, hp: newHp, isGuarding: false };
          });
          
          addLog(`Alvo: Contra-ataque recebido. Dano sofrido: ${finalDmg}.`);
        }

        if (player.hp > 0) setStatus('PLAYER_TURN');
        setIsProcessing(false);
      };
      runEnemyTurn();
    }
  }, [status]);

  const getHealthColor = (hp: number, max: number) => {
    const pct = (hp / max) * 100;
    if (pct > 60) return 'bg-[#3b82f6]';
    if (pct > 25) return 'bg-[#60a5fa]';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-stretch h-56">
        {/* Player Side */}
        <div className="flex-1 bg-[#0b0e14] border border-[#1e293b] rounded-lg p-4 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 z-10">
            <div>
              <h3 className="text-sm font-bold text-white leading-none uppercase tracking-wider">{character.name}</h3>
              <p className="text-[8px] text-[#3b82f6] font-mono mt-1 uppercase tracking-widest">SINDICATO</p>
            </div>
            {player.isGuarding && <div className="bg-[#3b82f6]/20 text-[#3b82f6] text-[8px] px-1.5 py-0.5 rounded border border-[#3b82f6]/30 animate-pulse font-bold">DEFESA ATIVA</div>}
          </div>
          
          <div className="relative flex-1 flex items-center justify-center mb-2 z-10">
            <div className={`transition-all duration-300 ${status === 'PLAYER_TURN' ? 'scale-110' : 'scale-100 opacity-60 grayscale-[0.5]'}`}>
              <AvatarDisplay avatar={character.avatar} size={80} className="border-2 border-[#3b82f6]/30 rounded-lg shadow-xl" />
            </div>
          </div>

          <div className="space-y-1 z-10">
            <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
              <span>Integridade</span>
              <span className="font-mono">{player.hp} / {player.maxHp}</span>
            </div>
            <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getHealthColor(player.hp, player.maxHp)}`}
                style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* VS Center */}
        <div className="flex items-center justify-center shrink-0">
          <div className="relative group">
            <div className={`w-10 h-10 rounded-full bg-[#171c26] border-2 border-[#1e293b] flex items-center justify-center shadow-2xl transition-colors ${status !== 'IDLE' ? 'border-[#3b82f6]' : ''}`}>
               <span className="text-xs font-black italic text-[#3b82f6]">VS</span>
            </div>
            {isProcessing && <div className="absolute -inset-1.5 border-2 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin"></div>}
          </div>
        </div>

        {/* Enemy Side */}
        <div className="flex-1 bg-[#0b0e14] border border-[#1e293b] rounded-lg p-4 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 z-10">
            {enemy.isGuarding && <div className="bg-[#3b82f6]/20 text-[#3b82f6] text-[8px] px-1.5 py-0.5 rounded border border-[#3b82f6]/30 animate-pulse font-bold">DEFESA ATIVA</div>}
            <div className="text-right">
              <h3 className="text-sm font-bold text-slate-400 leading-none uppercase tracking-wider">Rival Local</h3>
              <p className="text-[8px] text-red-500 font-mono mt-1 uppercase tracking-widest">ALVO</p>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center mb-2 z-10">
            <div className={`transition-transform duration-300 ${status === 'ENEMY_TURN' ? 'scale-110' : 'scale-100 opacity-60 grayscale'}`}>
              <Icons name="skull" size={64} color={status === 'ENEMY_TURN' ? '#ef4444' : '#334155'} />
            </div>
          </div>

          <div className="space-y-1 z-10">
            <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
              <span className="font-mono">{enemy.hp} / {enemy.maxHp}</span>
              <span>Integridade</span>
            </div>
            <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ml-auto ${getHealthColor(enemy.hp, enemy.maxHp)}`}
                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="lg:col-span-2 bg-[#11151d] border border-[#1e293b] rounded-lg p-4 shadow-xl">
          <div className="mb-3 flex justify-between items-center">
            <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Controles de Operação</h4>
            <div className={`text-[9px] font-mono ${status === 'PLAYER_TURN' ? 'text-[#3b82f6]' : 'text-slate-500'}`}>
              {status === 'PLAYER_TURN' ? "AGUARDANDO COMANDO" : status === 'ENEMY_TURN' ? "ALVO EM MOVIMENTO..." : "STANDBY"}
            </div>
          </div>

          {status === 'IDLE' || status === 'WON' || status === 'LOST' ? (
            <button 
              onClick={startBattle}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#1e3a8a] text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-[#3b82f6]/10 hover:brightness-110 active:scale-95 transition-all border-b-4 border-[#1e3a8a]"
            >
              {status === 'IDLE' ? 'Iniciar Combate' : status === 'WON' ? 'Nova Operação (Sucesso)' : 'Tentar Novamente (Falha)'}
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleAction('BASIC')}
                disabled={status !== 'PLAYER_TURN' || isProcessing}
                className="group flex items-center gap-3 p-2 bg-[#1e293b] border border-[#334155] rounded hover:border-[#3b82f6] hover:bg-[#3b82f6]/5 transition-all disabled:opacity-50"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-black/40 rounded">
                  <Icons name="fist" size={16} color="#3b82f6" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-white uppercase">Ataque Direto</div>
                  <div className="text-[7px] text-slate-500 uppercase">100% Acerto</div>
                </div>
              </button>
              
              <button 
                onClick={() => handleAction('HEAVY')}
                disabled={status !== 'PLAYER_TURN' || isProcessing}
                className="group flex items-center gap-3 p-2 bg-[#1e293b] border border-[#334155] rounded hover:border-[#3b82f6] hover:bg-[#3b82f6]/5 transition-all disabled:opacity-50"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-black/40 rounded">
                  <Icons name="heavy" size={16} color="#3b82f6" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-white uppercase">Golpe Pesado</div>
                  <div className="text-[7px] text-slate-500 uppercase">70% Acerto</div>
                </div>
              </button>

              <button 
                onClick={() => handleAction('DEFEND')}
                disabled={status !== 'PLAYER_TURN' || isProcessing}
                className="group flex items-center gap-3 p-2 bg-[#1e293b] border border-[#334155] rounded hover:border-[#3b82f6] hover:bg-[#3b82f6]/5 transition-all disabled:opacity-50"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-black/40 rounded">
                  <Icons name="shield" size={16} color="#3b82f6" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-white uppercase">Defender</div>
                  <div className="text-[7px] text-slate-500 uppercase">-50% Dano</div>
                </div>
              </button>

              <button 
                onClick={() => handleAction('DIRTY')}
                disabled={status !== 'PLAYER_TURN' || isProcessing}
                className="group flex items-center gap-3 p-2 bg-[#1e293b] border border-[#334155] rounded hover:border-[#3b82f6] hover:bg-[#3b82f6]/5 transition-all disabled:opacity-50"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-black/40 rounded">
                  <Icons name="dirty" size={16} color="#3b82f6" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-white uppercase">Estratégia</div>
                  <div className="text-[7px] text-slate-500 uppercase">Atordoamento</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Combat Log */}
        <div className="bg-[#0b0e14] border border-[#1e293b] rounded-lg flex flex-col overflow-hidden max-h-48 lg:max-h-none">
          <div className="bg-[#171c26] px-3 py-2 border-b border-[#1e293b]">
            <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Logs de Rede</h4>
          </div>
          <div className="p-3 flex-1 font-mono text-[9px] space-y-1.5 overflow-y-auto bg-[#0b0e14] scrollbar-thin">
            {log.map((line, i) => (
              <div key={i} className={`p-1.5 rounded border-l-2 ${
                line.includes('Sindicato') || line.includes('Protocolo') ? 'border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]' : 
                line.includes('Alvo') || line.includes('sofrido') ? 'border-red-500 bg-red-500/5 text-red-400' : 
                line.includes('Tática') ? 'border-purple-500 bg-purple-500/5 text-purple-400' :
                'border-slate-800 text-slate-600'
              }`}>
                {line}
              </div>
            ))}
            {log.length === 0 && (
              <div className="h-full flex items-center justify-center opacity-20 italic uppercase tracking-widest">Escaneando...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuelView;
