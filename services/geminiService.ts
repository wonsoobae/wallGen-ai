import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types";

// Helper to ensure API key selection
export const checkAndSelectApiKey = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      const success = await (window as any).aistudio.openSelectKey();
      return success;
    }
    return true;
  }
  return true; // Fallback if not running in the specific environment expecting this global
};

const getClient = () => {
  // Always create a new client to pick up the latest selected key
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateWallpaperImages = async (
  prompt: string,
  size: ImageSize,
  referenceImageBase64?: string
): Promise<string[]> => {
  const ai = getClient();
  const model = 'gemini-3-pro-image-preview';

  // We need 4 variations.
  // We will fire 4 parallel requests because generateContent typically returns 1 candidate for image models currently.
  const requests = Array(4).fill(null).map(async () => {
    try {
      const parts: any[] = [];
      
      // If remixing, add the reference image
      if (referenceImageBase64) {
        // Strip prefix if present for the API call payload if needed, 
        // but SDK usually handles inlineData with base64 string directly.
        // The SDK expects raw base64.
        const cleanBase64 = referenceImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: 'image/png' // Assuming PNG for internal consistency
          }
        });
        parts.push({ text: `Create a variation of this image with the atmosphere: ${prompt}` });
      } else {
        parts.push({ text: prompt });
      }

      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: '9:16', // Strict requirement
            imageSize: size,
          },
          // Google search tool is allowed for pro-image-preview but not strictly needed for generic wallpaper
          // unless the user asks for "current weather" style wallpapers. 
          // We'll leave it out to keep it pure unless requested.
        }
      });

      // Extract image
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (e) {
      console.error("Single image generation failed", e);
      return null;
    }
  });

  const results = await Promise.all(requests);
  return results.filter((res): res is string => res !== null);
};
