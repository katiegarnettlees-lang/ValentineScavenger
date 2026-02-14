
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateClueText = async (stopName: string, theme: string, familyInfo: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a savvy scavenger hunt master for teenagers and adults. 
    Write a 4-line rhyming riddle for the location: ${stopName}.
    Theme: ${theme}.
    Family context: ${familyInfo}.
    CRITICAL: The riddle MUST contain physical clues about the location's surroundings (e.g., mention the specific color of the building, a nearby statue, the sound of the water, or the narrowness of the street) so they can identify it. 
    Make the tone cool, mysterious, and engaging for 15-16 year olds.`,
  });
  return response.text || "Love is the key, follow your heart to the next place you'll be!";
};

export const generateHint = async (stopName: string, postcode: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a short, 1-sentence helpful hint for finding "${stopName}" at "${postcode}". 
    Do not mention the name of the place directly, but describe a very specific visual landmark nearby (like "It's right across from the giant anchor" or "Look for the building with the bright red door"). 
    Keep it brief and encouraging.`,
  });
  return response.text || "Look for a local landmark nearby to guide your way.";
};

export const generateClueImage = async (stopName: string, theme: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A high-contrast, trendy Valentine's Day scavenger hunt graphic. 
          Topic: ${theme} at ${stopName}.
          Style: Edgy Y2K aesthetic, retro-modern streetwear design. 
          Colors: Bold reds, deep blacks, neon pinks, and metallic silver. 
          Elements: Stylized geometric heart motifs, some grain/grunge texture, and a symbolic representation of the location (e.g., if it's a bakery, a stylized croissant; if it's a castle, a crown). 
          The graphic should look like a cool high-end brand's social media asset.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "https://picsum.photos/800/800?heart=1";
};
