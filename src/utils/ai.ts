import { GoogleGenAI } from "@google/genai";

export const checkWordWithAI = async (
  token: string,
  model: string,
  userWord: string,
  targetWord: string,
  definition: string
): Promise<{ correct: boolean; explanation?: string }> => {
  if (!token) {
    throw new Error("Google AI Token is missing");
  }

  const ai = new GoogleGenAI({ apiKey: token });

  const prompt = `
    I am a vocabulary practice assistant.
    The user is guessing a word based on a definition.
    
    Definition: "${definition}"
    Target Word: "${targetWord}"
    User's Guess: "${userWord}"
    
    Is the user's guess correct? It doesn't have to be the exact target word, but it must be a valid synonym or fit the definition perfectly.
    
    If it is correct, respond with exactly: CORRECT
    If it is incorrect, respond with: INCORRECT: <short explanation of why it is wrong, max 20 words>
  `;

  try {
    const response = await ai.models.generateContent({
      model: model || "gemini-2.0-flash-exp",
      contents: prompt,
    });
    
    const text = response.text;
    if (text?.trim().startsWith("CORRECT")) {
      return { correct: true };
    } else {
      return { correct: false, explanation: text?.replace("INCORRECT:", "").trim() };
    }
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
}
