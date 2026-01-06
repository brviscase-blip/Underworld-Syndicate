
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight leading-none">Missões Operacionais</h2>
          <p className="text-[#94a3b8] text-[10px] mt-1 uppercase tracking-widest">Sindicato Controle de Áreas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {missions.map((mission) => {
          const isActive = activeMission?.id === mission.id;
          const timeLeft = isActive ? Math.max(0, Math.floor((activeMission.endTime - currentTime) / 1000)) : 0;
          const isButtonDisabled = activeMission !== null;

          return (
            <div 
              key={mission.id}
              className={`bg-[#0b0e14] border rounded-lg overflow-hidden transition-all flex items-center p-3 ${
                isActive ? 'border-[#3b82f6] bg-[#3b82f6]/5' : 'border-[#1e293b]'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{mission.title}</h3>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    mission.difficulty === 'EASY' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    mission.difficulty === 'MEDIUM' ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {mission.difficulty}
                  </span>
                </div>
                <p className="text-[10px] text-[#94a3b8] italic truncate pr-4">Arquivo: {mission.description}</p>
              </div>
              
              <div className="flex items-center gap-6 shrink-0">
                <div className="flex gap-4">
                  <div className="text-center">
                    <span className="text-[8px] text-[#94a3b8] uppercase block font-bold">Grana</span>
                    <span className="text-xs font-mono font-bold text-[#3b82f6]">${mission.rewards.cash}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[8px] text-[#94a3b8] uppercase block font-bold">Duração</span>
                    <span className="text-xs font-mono text-white">{Math.floor(mission.duration / 60)}m</span>
                  </div>
                </div>

                <div className="w-32">
                  {isActive ? (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#3b82f6]"
                          style={{ width: `${((mission.duration - timeLeft) / mission.duration) * 100}%` }}
                        />
                      </div>
                      <div className="text-center font-mono text-[10px] text-[#3b82f6]">
                        {Math.floor(timeLeft / 60)}:{ (timeLeft % 60).toString().padStart(2, '0') }s
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onStart(mission.id)}
                      disabled={isButtonDisabled}
                      className={`w-full py-1.5 rounded font-bold uppercase tracking-widest text-[9px] transition-all border ${
                        isButtonDisabled 
                          ? 'bg-[#1e293b] text-slate-600 border-[#1e293b] cursor-not-allowed'
                          : 'bg-[#3b82f6] text-white border-[#2563eb] hover:brightness-110 active:scale-95'
                      }`}
                    >
                      {isButtonDisabled ? 'Operando' : 'Iniciar'}
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
