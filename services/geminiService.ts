
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const runChat = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
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
