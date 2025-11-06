import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyCvPM3A1IdxuczsncLX9RgmbuxytnC5yE0";

const getAi = () => new GoogleGenAI({ apiKey: API_KEY });

export const runChat = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "API key not configured. Please set the API_KEY environment variable.";
  }
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful assistant for Lynix, a technology and coding company. Your name is Lyra. Be friendly, concise, and helpful."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        return `An error occurred while contacting the AI assistant: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI assistant.";
  }
};
