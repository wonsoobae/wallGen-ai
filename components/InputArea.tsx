import React, { useState } from 'react';
import { ImageSize } from '../types';

interface InputAreaProps {
  onGenerate: (prompt: string, size: ImageSize) => void;
  isGenerating: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt, size);
    setPrompt(''); // Clear input after submit? User might want to tweak. Let's keep it if they want to tweak, usually better UX. 
    // Actually for mobile, clearing is often better to see results. Let's clear.
    setPrompt(''); 
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 z-40 pb-safe">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md mx-auto">
        
        {/* Settings Toggles */}
        {showSettings && (
          <div className="flex gap-2 animate-fade-in-up">
             <div className="text-xs text-gray-400 mb-1 self-center mr-2">해상도:</div>
             {(['1K', '2K'] as ImageSize[]).map((s) => (
               <button
                 key={s}
                 type="button"
                 onClick={() => setSize(s)}
                 className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                   size === s 
                   ? 'bg-purple-600 text-white' 
                   : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                 }`}
               >
                 {s}
               </button>
             ))}
          </div>
        )}

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-full transition-colors ${showSettings ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="비 오는 서정적인 도시 풍경..."
            className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            disabled={isGenerating}
          />
          
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className={`p-3 rounded-full font-bold transition-all transform active:scale-95 flex items-center justify-center ${
              isGenerating || !prompt.trim()
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/50'
            }`}
          >
            {isGenerating ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
