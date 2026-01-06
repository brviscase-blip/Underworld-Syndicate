
import React, { useState } from 'react';
import { Character } from '../types';

interface AdmEditorViewProps {
  character: Character;
  onUpdate: (updatedCharacter: Character) => void;
  onClose: () => void;
}

const AdmEditorView: React.FC<AdmEditorViewProps> = ({ character, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<Character>(character);

  const handleChange = (field: keyof Character, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (stat: keyof Character['stats'], value: number) => {
    setFormData(prev => ({
      ...prev,
      stats: { ...prev.stats, [stat]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#1e293b] pb-4">
        <div>
          <h2 className="text-xl font-black text-[#3b82f6] uppercase tracking-tighter">Terminal Administrativo</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Autorização Nível: OVERRIDE</p>
        </div>
        <button 
          onClick={onClose}
          className="px-3 py-1 bg-red-900/20 text-red-500 border border-red-900/30 rounded text-xs font-bold hover:bg-red-900/40 transition-all"
        >
          Encerrar Sessão
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identidade */}
        <div className="space-y-4 bg-[#0b0e14] p-4 rounded-lg border border-[#1e293b]">
          <h3 className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-4">Identidade & Nível</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Nome de Operação</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-[#11151d] border border-[#1e293b] text-white px-3 py-2 rounded text-sm focus:border-[#3b82f6] outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Level</label>
                <input 
                  type="number" 
                  value={formData.level}
                  onChange={(e) => handleChange('level', parseInt(e.target.value))}
                  className="w-full bg-[#11151d] border border-[#1e293b] text-white px-3 py-2 rounded text-sm focus:border-[#3b82f6] outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">XP Atual</label>
                <input 
                  type="number" 
                  value={formData.xp}
                  onChange={(e) => handleChange('xp', parseInt(e.target.value))}
                  className="w-full bg-[#11151d] border border-[#1e293b] text-white px-3 py-2 rounded text-sm focus:border-[#3b82f6] outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Patrimônio */}
        <div className="space-y-4 bg-[#0b0e14] p-4 rounded-lg border border-[#1e293b]">
          <h3 className="text-[10px] font-bold text-[#fbbf24] uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-4">Fundos & Patrimônio</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Dinheiro (Cash)</label>
              <input 
                type="number" 
                value={formData.cash}
                onChange={(e) => handleChange('cash', parseInt(e.target.value))}
                className="w-full bg-[#11151d] border border-[#1e293b] text-[#3b82f6] px-3 py-2 rounded text-sm focus:border-[#3b82f6] outline-none font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Ouro (AUR)</label>
              <input 
                type="number" 
                value={formData.gold}
                onChange={(e) => handleChange('gold', parseInt(e.target.value))}
                className="w-full bg-[#11151d] border border-[#1e293b] text-[#fbbf24] px-3 py-2 rounded text-sm focus:border-[#fbbf24] outline-none font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="space-y-4 bg-[#0b0e14] p-4 rounded-lg border border-[#1e293b] md:col-span-2">
          <h3 className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-4">Estatísticas Operacionais</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Força</label>
              <input 
                type="number" 
                value={formData.stats.strength}
                onChange={(e) => handleStatChange('strength', parseInt(e.target.value))}
                className="w-full bg-[#11151d] border border-[#1e293b] text-white px-3 py-2 rounded text-sm focus:border-[#3b82f6] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Físico</label>
              <input 
                type="number" 
                value={formData.stats.physique}
                onChange={(e) => handleStatChange('physique', parseInt(e.target.value))}
                className="w-full bg-[#11151d] border border-[#1e293b] text-white px-3 py-2 rounded text-sm focus:border-[#3b82f6] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Sorte</label>
              <input 
                type="number" 
                value={formData.stats.luck}
                onChange={(e) => handleStatChange('luck', parseInt(e.target.value))}
                className="w-full bg-[#11151d] border border-[#1e293b] text-white px-3 py-2 rounded text-sm focus:border-[#3b82f6] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Tenacidade</label>
              <input 
                type="number" 
                value={formData.stats.tenacity}
                onChange={(e) => handleStatChange('tenacity', parseInt(e.target.value))}
                className="w-full bg-[#11151d] border border-[#1e293b] text-white px-3 py-2 rounded text-sm focus:border-[#3b82f6] outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="md:col-span-2 py-3 bg-[#3b82f6] text-white font-black uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg border-b-4 border-[#1e40af]"
        >
          Aplicar Sobrescrita de Dados
        </button>
      </form>
    </div>
  );
};

export default AdmEditorView;
