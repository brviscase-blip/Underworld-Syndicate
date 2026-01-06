
import React, { useState } from 'react';
import AvatarDisplay from './AvatarDisplay';
import Icons from './Icons';

interface AvatarCreatorProps {
  initialAvatar: string;
  onSave: (avatar: string) => void;
}

const MODELS_2D = [
  "https://cdn.pixabay.com/photo/2023/07/26/16/33/man-8151610_1280.jpg",
  "https://cdn.pixabay.com/photo/2024/02/12/17/23/ai-generated-8569065_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/11/02/16/00/anime-8361021_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/04/23/15/22/ai-generated-7945952_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/09/27/12/15/woman-8279482_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/09/29/18/12/ai-generated-8284534_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/10/06/13/37/girl-8298282_1280.jpg",
  "https://cdn.pixabay.com/photo/2024/02/12/17/23/ai-generated-8569064_1280.jpg"
];

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ initialAvatar, onSave }) => {
  const [currentAvatar, setCurrentAvatar] = useState(initialAvatar);

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto py-2 h-full justify-center">
      <div className="text-center">
        <h2 className="text-xl font-black text-[#3b82f6] uppercase tracking-tighter">Terminal de Identidade</h2>
        <p className="text-slate-500 text-[9px] mt-1 font-bold uppercase tracking-widest">Selecione seu registro visual no Sindicato</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        {/* Preview do Modelo */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-1 bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.15)]">
            <AvatarDisplay avatar={currentAvatar} size={180} className="rounded-lg border-4 border-black" />
          </div>
          <button 
            onClick={() => onSave(currentAvatar)}
            className="w-full py-2.5 bg-[#3b82f6] text-white font-black uppercase tracking-widest rounded-md hover:brightness-110 active:scale-95 transition-all shadow-xl border-b-4 border-[#1e40af] text-[10px] flex items-center justify-center gap-2"
          >
            <Icons name="ranking" size={14} color="white" /> Confirmar Identidade
          </button>
        </div>

        {/* Grade de Seleção 2D */}
        <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1e293b] shadow-2xl max-w-sm">
          <div className="mb-3 flex justify-between items-center border-b border-[#1e293b] pb-2">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Base de Dados</span>
            <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-[#1e40af]"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {MODELS_2D.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentAvatar(url)}
                className={`relative aspect-square rounded overflow-hidden border-2 transition-all hover:scale-105 ${
                  currentAvatar === url 
                    ? 'border-[#3b82f6] shadow-lg shadow-[#3b82f6]/20' 
                    : 'border-[#1e293b] opacity-40 hover:opacity-100 hover:border-slate-500'
                }`}
              >
                <img src={url} alt={`Model ${idx}`} className="w-full h-full object-cover grayscale-[0.3] contrast-125" />
                <div className={`absolute bottom-0 inset-x-0 h-0.5 ${idx < 4 ? 'bg-[#3b82f6]' : 'bg-[#60a5fa]'}`}></div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 p-2.5 bg-[#11151d] rounded border border-[#1e293b]">
             <p className="text-[7px] text-slate-500 uppercase font-black tracking-widest text-center leading-tight">
               Arquivo <span className="text-white">Seinen 2.0</span> Ativo<br/>
               <span className="text-[#3b82f6] opacity-80">Relação de cor: Sindicato Blue System.</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;
