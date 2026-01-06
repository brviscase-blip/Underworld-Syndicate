
import React, { useState, useRef } from 'react';
import { Character } from '../types';
import Icons from './Icons';
import AvatarDisplay from './AvatarDisplay';

interface SettingsViewProps {
  character: Character;
  onUpdateAvatar: (url: string) => void;
  onClose: () => void;
}

const MODELS_2D = [
  "https://cdn.pixabay.com/photo/2023/11/02/16/00/anime-8361021_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/07/26/16/33/man-8151610_1280.jpg",
  "https://cdn.pixabay.com/photo/2024/02/12/17/23/ai-generated-8569065_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/04/23/15/22/ai-generated-7945952_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/09/27/12/15/woman-8279482_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/09/29/18/12/ai-generated-8284534_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/10/06/13/37/girl-8298282_1280.jpg",
  "https://cdn.pixabay.com/photo/2024/02/12/17/23/ai-generated-8569064_1280.jpg"
];

const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2023/11/02/16/00/anime-8361021_1280.jpg';

const SettingsView: React.FC<SettingsViewProps> = ({ character, onUpdateAvatar, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdateAvatar(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("Erro ao processar arquivo de imagem.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full flex flex-col p-4 animate-fade-in space-y-6">
      <div className="flex justify-between items-center border-b border-[#1e293b] pb-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <Icons name="settings" size={20} color="#3b82f6" />
            Configurações de Identidade
          </h2>
          <p className="text-[#94a3b8] text-[10px] uppercase tracking-[0.2em]">Sincronização de registro biométrico facial</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#1e293b] rounded-full transition-colors"
        >
          <Icons name="profile" size={20} color="#64748b" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preview Panel */}
        <div className="lg:col-span-4 flex flex-col items-center space-y-4 bg-[#0b0e14] p-6 rounded-xl border border-[#1e293b] shadow-xl h-fit">
          <span className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest mb-2">Monitor de Status</span>
          <div className="relative group">
            <AvatarDisplay avatar={character.avatar} size={180} className="border-4 border-[#3b82f6] shadow-2xl rounded-xl" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-xl animate-pulse">
                <div className="w-8 h-8 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-[8px] font-bold text-[#3b82f6] uppercase">Carregando...</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl pointer-events-none">
              <Icons name="camera" size={32} color="white" />
            </div>
          </div>
          <button
            onClick={() => onUpdateAvatar(DEFAULT_AVATAR)}
            className="w-full px-6 py-2.5 bg-red-950/20 text-red-500 border border-red-900/30 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Formatar Dados (Reset)
          </button>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* UPLOAD SECTION */}
          <section className="bg-[#11151d] border border-[#1e293b] rounded-xl p-4 shadow-lg">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              Upload de Arquivo Local
            </h3>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-[#1e293b] hover:border-[#3b82f6]/50 rounded-xl p-8 flex flex-col items-center justify-center transition-all bg-[#0b0e14]/50 hover:bg-[#3b82f6]/5"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#3b82f6] transition-colors">
                <Icons name="camera" size={24} color={isUploading ? '#64748b' : 'white'} />
              </div>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Clique para selecionar imagem</p>
              <p className="text-[8px] text-slate-500 mt-1 uppercase">PNG, JPG ou WEBP (Max 2MB recomendado)</p>
            </div>
          </section>

          {/* GALLERY SECTION */}
          <section className="bg-[#11151d] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg">
            <div className="bg-[#171c26] px-4 py-2 border-b border-[#1e293b]">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Modelos do Sindicato</h3>
            </div>
            <div className="p-4 bg-[#0b0e14]">
              <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-4 gap-3">
                {MODELS_2D.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => onUpdateAvatar(url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 group ${
                      character.avatar === url 
                        ? 'border-[#3b82f6] shadow-lg shadow-[#3b82f6]/20' 
                        : 'border-[#1e293b] opacity-50 hover:opacity-100 hover:border-[#3b82f6]/50'
                    }`}
                  >
                    <img src={url} alt={`Modelo ${idx}`} className="w-full h-full object-cover" />
                    {character.avatar === url && (
                      <div className="absolute inset-0 bg-[#3b82f6]/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
