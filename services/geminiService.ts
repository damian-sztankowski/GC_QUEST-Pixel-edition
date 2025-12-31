
import { GoogleGenAI, Type } from "@google/genai";
import { CloudRole, Level, Question } from "../types";

// Fix: Strictly use process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestion = async (role: CloudRole, level: Level, questionIndex: number): Promise<Question> => {
  const entropy = Math.random().toString(36).substring(7);
  const prompt = `You are an expert Google Cloud exam setter. Generate a unique Google Cloud certification-style question for a ${role} exam candidate.
  
  CURRENT CHAPTER: "${level.topic}"
  SYLLABUS FOCUS: "${level.description}"
  QUESTION NUMBER: ${questionIndex} of 10
  SESSION_ID: ${entropy}
  
  Requirements:
  1. Target knowledge from ${role}. Focus on high-level concepts and business value.
  2. **Terminology:** Strictly use official Google Cloud terminology. 
  3. Frame the question for an escape room context.
  4. Ensure the explanation mentions the specific Google Cloud concept.
  5. **VARIETY:** Do not repeat common questions. Explore different sub-topics within "${level.description}".
  6. **Distractors:** The wrong answers must be PLAUSIBLE. Use common misconceptions.
  
  Return JSON: { text, options: [4 strings], correctIndex: number(0-3), explanation: string }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correctIndex: { type: Type.NUMBER },
          explanation: { type: Type.STRING }
        },
        required: ["text", "options", "correctIndex", "explanation"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getGeminiFeedback = async (role: CloudRole, question: string, userAnswer: string, isCorrect: boolean): Promise<string> => {
  const prompt = `Act as an expert Cloud Digital Leader Instructor in a retro 8-bit game.
  The user just answered: "${userAnswer}" to the question: "${question}".
  Result: ${isCorrect ? 'Correct' : 'Incorrect'}.
  
  Provide a professional, concise feedback snippet (1-2 sentences). Explain the technical logic based on the CDL syllabus in a easy way. Keep the tone slightly "retro gamer" but educational.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};

export const generateHint = async (question: string, topic: string): Promise<string> => {
  const prompt = `The user is stuck on a Google Cloud question regarding "${topic}".
  Question: "${question}"
  
  Provide a subtle hint that points them towards the right concept without revealing the answer.
  Use a "Retro AI System" or "Debug Console" persona. Keep it under 20 words.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};

export const generateAvatar = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image part");
};
