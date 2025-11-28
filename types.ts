export interface Wallpaper {
  id: string;
  url: string; // Base64 data URL
  prompt: string;
  createdAt: number;
}

export type ImageSize = '1K' | '2K'; // 4K might be too slow for mobile/parallel, sticking to 1K/2K for reliability in this demo

export interface GenerationSettings {
  size: ImageSize;
}
