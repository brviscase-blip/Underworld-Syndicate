
import React, { useState, useRef } from 'react';
import AvatarDisplay from './AvatarDisplay';

interface AvatarCreatorProps {
  initialAvatar: string;
  onSave: (avatar: string) => void;
}

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Gunnar'
];

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ initialAvatar, onSave }) => {
  const [currentAvatar, setCurrentAvatar] = useState(initialAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Escolha seu Visual</h2>
        <p className="text-sm text-[#94a3b8] mt-2">Escolha uma imagem de preset ou faça o upload da sua própria foto.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start w-full">
        {/* Preview Area */}
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-[#0b0e14] border-4 border-[#fbbf24] rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.2)]">
            <AvatarDisplay avatar={currentAvatar} size={250} className="rounded-xl" />
          </div>
          
          <button 
            onClick={() => onSave(currentAvatar)}
            className="w-full py-4 bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0b0e14] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Confirmar Avatar
          </button>
        </div>

        {/* Selection Area */}
        <div className="flex-1 space-y-8 w-full">
          {/* Custom Upload */}
          <section className="bg-[#11151d] p-6 rounded-xl border border-[#1e293b]">
            <h3 className="text-xs font-bold text-[#fbbf24] uppercase tracking-widest mb-4">Upload Personalizado</h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#1e293b] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#fbbf24] hover:bg-[#fbbf24]/5 transition-all group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📁</span>
              <p className="text-sm font-bold text-white">Clique para enviar imagem</p>
              <p className="text-[10px] text-[#94a3b8] mt-1 uppercase">JPG, PNG ou GIF (Máx 2MB)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
              />
            </div>
          </section>

          {/* Presets */}
          <section className="bg-[#11151d] p-6 rounded-xl border border-[#1e293b]">
            <h3 className="text-xs font-bold text-[#fbbf24] uppercase tracking-widest mb-4">Galeria de Personagens</h3>
            <div className="grid grid-cols-4 gap-4">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentAvatar(url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${currentAvatar === url ? 'border-[#fbbf24] shadow-lg shadow-[#fbbf24]/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  {currentAvatar === url && (
                    <div className="absolute top-1 right-1 bg-[#fbbf24] text-[#0b0e14] text-[8px] font-bold px-1 rounded shadow">
                      ATIVO
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;
