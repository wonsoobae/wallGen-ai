import React from 'react';
import { Wallpaper } from '../types';

interface FullImageViewerProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
  onRemix: (wallpaper: Wallpaper) => void;
}

export const FullImageViewer: React.FC<FullImageViewerProps> = ({ wallpaper, onClose, onRemix }) => {
  if (!wallpaper) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in">
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 opacity-30 blur-3xl scale-110 pointer-events-none"
        style={{ backgroundImage: `url(${wallpaper.url})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
      />
      
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 bg-black/40 rounded-full text-white backdrop-blur-md hover:bg-black/60 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img 
          src={wallpaper.url} 
          alt={wallpaper.prompt}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          style={{ aspectRatio: '9/16' }}
        />
      </div>

      {/* Actions Bar */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 px-6 z-50">
        <a
          href={wallpaper.url}
          download={`wallpaper-${wallpaper.id}.png`}
          className="flex-1 max-w-[160px] flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium py-3 px-6 rounded-2xl transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          다운로드
        </a>
        
        <button
          onClick={() => onRemix(wallpaper)}
          className="flex-1 max-w-[160px] flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-2xl shadow-lg shadow-purple-900/40 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          리믹스
        </button>
      </div>
    </div>
  );
};
