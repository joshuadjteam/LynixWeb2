import { GoogleGenAI } from "@google/genai";

const getAi = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const runChat = async (prompt: string): Promise<string> => {
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
        // Provide a more user-friendly message for common API key issues
        if (error.message.includes('API key not valid')) {
            return "The AI assistant is currently unavailable due to a configuration issue. Please try again later.";
        }
        return `An error occurred while contacting the AI assistant: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI assistant.";
  }
};
