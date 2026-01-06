
import React from 'react';
import { Mission } from '../types';

interface MissionsViewProps {
  missions: Mission[];
  activeMission: { id: string, endTime: number } | null;
  currentTime: number;
  onStart: (id: string) => void;
}

const MissionsView: React.FC<MissionsViewProps> = ({ missions, activeMission, currentTime, onStart }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Painel de Missões</h2>
          <p className="text-[#94a3b8] text-sm">Controle as operações de rua e expanda sua influência.</p>
        </div>
        <div className="bg-[#1e293b] px-4 py-2 rounded-lg border border-[#334155]">
          <span className="text-[10px] text-[#94a3b8] uppercase font-bold block mb-1">Status Operacional</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${activeMission ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span className="text-xs text-white font-mono">{activeMission ? 'MISSÃO EM CURSO' : 'DISPONÍVEL'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => {
          const isActive = activeMission?.id === mission.id;
          const timeLeft = isActive ? Math.max(0, Math.floor((activeMission.endTime - currentTime) / 1000)) : 0;
          const isButtonDisabled = activeMission !== null;

          return (
            <div 
              key={mission.id}
              className={`bg-[#0b0e14] border rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${
                isActive ? 'border-[#2dd4bf] shadow-xl shadow-[#2dd4bf]/5' : 'border-[#1e293b] opacity-90 hover:opacity-100'
              }`}
            >
              <div className="px-5 py-4 border-b border-[#1e293b] flex justify-between items-center bg-[#171c26]/50">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{mission.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  mission.difficulty === 'EASY' ? 'bg-green-500/20 text-green-400' :
                  mission.difficulty === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {mission.difficulty}
                </span>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-6 italic">"{mission.description}"</p>
                
                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-[#94a3b8] uppercase block font-bold mb-1">Recompensa</span>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-mono font-bold text-[#2dd4bf]">${mission.rewards.cash}</span>
                        <span className="text-[10px] text-[#94a3b8] font-mono">/ {mission.rewards.xp} XP</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#94a3b8] uppercase block font-bold mb-1">Duração</span>
                      <span className="text-sm font-mono text-white">
                        {Math.floor(mission.duration / 60)}:{(mission.duration % 60).toString().padStart(2, '0')}m
                      </span>
                    </div>
                  </div>

                  {isActive ? (
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-[#1e293b] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#2dd4bf] to-[#0d9488]"
                          style={{ width: `${((mission.duration - timeLeft) / mission.duration) * 100}%` }}
                        />
                      </div>
                      <div className="text-center font-mono text-lg text-[#2dd4bf] animate-pulse">
                        {Math.floor(timeLeft / 60)}:{ (timeLeft % 60).toString().padStart(2, '0') }s
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onStart(mission.id)}
                      disabled={isButtonDisabled}
                      className={`w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-all ${
                        isButtonDisabled 
                          ? 'bg-[#1e293b] text-slate-600 cursor-not-allowed'
                          : 'bg-[#2dd4bf] text-[#0b0e14] hover:bg-[#2dd4bf]/90 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isButtonDisabled ? 'Em Operação' : 'Iniciar Missão'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MissionsView;
