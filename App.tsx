import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { checkAndSelectApiKey, generateWallpaperImages } from './services/geminiService';
import { Wallpaper, ImageSize } from './types';
import { InputArea } from './components/InputArea';
import { FullImageViewer } from './components/FullImageViewer';

const App: React.FC = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  // Initialize checks
  useEffect(() => {
    checkAndSelectApiKey().catch(err => console.error("Key selection error:", err));
  }, []);

  const handleGenerate = async (prompt: string, size: ImageSize, remixSource?: string) => {
    setLoading(true);
    setLoadingMessage(remixSource ? '리믹스 생성 중...' : '상상하는 중...');
    
    try {
      await checkAndSelectApiKey();
      
      const images = await generateWallpaperImages(prompt, size, remixSource);
      
      if (images.length === 0) {
        alert("이미지를 생성하지 못했습니다. 다시 시도해주세요.");
        return;
      }

      const newWallpapers: Wallpaper[] = images.map(url => ({
        id: uuidv4(),
        url,
        prompt: remixSource ? `Remix: ${prompt}` : prompt,
        createdAt: Date.now()
      }));

      // Add new ones to the top
      setWallpapers(prev => [...newWallpapers, ...prev]);

    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleRemix = (wallpaper: Wallpaper) => {
    // Close viewer first
    setSelectedWallpaper(null);
    // Trigger generation with the wallpaper as reference
    handleGenerate(wallpaper.prompt, '1K', wallpaper.url);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-white w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            WallGen AI
          </h1>
        </div>
        {loading && (
           <span className="text-xs text-purple-400 animate-pulse font-medium">{loadingMessage}</span>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {wallpapers.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path><line x1="21" y1="2" x2="15.5" y2="7.5"></line><line x1="15.5" y1="2" x2="21" y2="7.5"></line><path d="M21 2v5.5"></path><path d="M15.5 7.5H21"></path></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">나만의 배경화면 만들기</h2>
            <p className="text-gray-500 max-w-xs">
              "비 오는 서정적인 도시 풍경" 처럼 원하는 분위기를 입력하면 4가지 버전을 만들어드려요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-8">
            {/* Loading Skeletons */}
            {loading && (
               <>
                 {[1, 2, 3, 4].map((i) => (
                   <div key={`skel-${i}`} className="aspect-[9/16] rounded-xl bg-gray-900 animate-pulse border border-gray-800 flex items-center justify-center">
                     <svg className="w-8 h-8 text-gray-800 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                     </svg>
                   </div>
                 ))}
               </>
            )}
            
            {/* Generated Wallpapers */}
            {wallpapers.map((wp) => (
              <div 
                key={wp.id} 
                onClick={() => setSelectedWallpaper(wp)}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer border border-gray-800 bg-gray-900 active:scale-95 transition-transform duration-200"
              >
                <img 
                  src={wp.url} 
                  alt={wp.prompt} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                   <p className="text-xs text-white line-clamp-2">{wp.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <InputArea onGenerate={(p, s) => handleGenerate(p, s)} isGenerating={loading} />
      
      <FullImageViewer 
        wallpaper={selectedWallpaper} 
        onClose={() => setSelectedWallpaper(null)}
        onRemix={handleRemix}
      />
    </div>
  );
};

export default App;
