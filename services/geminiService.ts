
import { GoogleGenAI, Type } from "@google/genai";
import { ResearchScores, PersonaAnalysis } from "../types";

export const analyzeResearchPersona = async (scores: ResearchScores, selfDescription: string): Promise<PersonaAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this researcher's profile based on the following aggregate scores:
    - Theory vs. Practice: ${scores.theory}
    - Breadth vs. Depth: ${scores.breadth}
    - Risk Appetite: ${scores.risk}
    - Collaboration Style: ${scores.collaboration}
    - Exploration vs. Optimization: ${scores.exploration}
    - Lab Modality: ${scores.labType} (Positive: Dry, Negative: Wet)
    - Methodological Focus: ${scores.modelFocus} (Positive: Developing models, Negative: Applying tools)
    - Analytical Lens: ${scores.policyFocus} (Positive: Policy orientation, Negative: Technical orientation)

    User's Self-Description: "${selfDescription || 'Not provided'}"

    Return a creative "Research Archetype" in Chinese JSON format. 
    The tone should be professional, insightful, and slightly philosophical (monochrome aesthetic).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            tasteAdvice: { type: Type.STRING },
            matchedResearchers: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["archetype", "title", "description", "strengths", "weaknesses", "tasteAdvice", "matchedResearchers"],
        }
      }
    });

    return JSON.parse(response.text.trim()) as PersonaAnalysis;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateMangaCard = async (base64Image: string, archetype: string, title: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const data = base64Image.split(',')[1] || base64Image;

  const prompt = `Convert this person's portrait into a high-quality "Abstract Pixel Manga Style" character art. 
  Style details: 
  - Strictly Monochrome (Black, White, and shades of Grey).
  - Abstract pixelated aesthetic combined with sharp manga lines.
  - Minimalist and artistic, not a literal photo conversion.
  - Represents the theme of "${archetype}" and "${title}".
  - Futuristic, high-tech, academic vibe.
  - No text, no words, no letters, no characters, and no labels should appear within the image.
  - Professional digital art look.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: 'image/jpeg',
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Pixel Art Generation Error:", error);
    throw error;
  }
};
