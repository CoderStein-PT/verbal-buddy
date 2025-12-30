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

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Definition: "${definition}"
Target Word: "${targetWord}"
User's Guess: "${userWord}"`,
        },
      ],
    },
  ];

  const ai = new GoogleGenAI({ apiKey: token });

  console.log("model", model)

  try {
    const response = await ai.models.generateContent({
      model: model || "gemini-2.5-flash",
      config: {
        thinkingConfig: {
          thinkingLevel: 'LOW',
        },
        tools: [],
        systemInstruction: [
            {
              text: `You're a vocabulary practice assistant.
The user is guessing a word based on a definition.

Is the user's guess CORRECT? It has to be exactly the same as the target word, but slight misspellings or deviations are allowed.
If the user says a definition or something unrelated and not a word, treat it as INCORRECT.

If it is correct, respond with exactly: CORRECT
If it is incorrect, respond with: INCORRECT: <short explanation of why it is wrong, max 20 words>
If the user's asking for a hint, reply with: INCORRECT: <hinting some letter or aspect of the word>`,
            }
        ],
      },
      contents,
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
