
import { GoogleGenAI, Type } from "@google/genai";
import { CloudRole, Level, Question } from "../types";

// Fix: Strictly use process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestion = async (role: CloudRole, level: Level, questionIndex: number): Promise<Question> => {
  const entropy = Math.random().toString(36).substring(7);
  const prompt = `You are a Lead Google Cloud Certification Architect designed to gamify the Cloud Digital Leader (CDL) exam.
  
  TASK: Generate a unique "Escape Room" style multiple-choice question that tests **one specific concept** found in the Syllabus Scope.
  CHAPTER: "${level.topic}"
  SYLLABUS FOCUS: "${level.description}"
  QUESTION_PROGRESS: ${questionIndex} of 10
  ENTROPY_SEED: ${entropy}
  
  CRITICAL RULES:
  1. **Selectivity:** The Syllabus Scope provided is a list of keywords. Do NOT test them all. Isolate ONE specific concept (e.g., if the list says "SQL vs Spanner vs Bigtable", choose *only* Spanner for this specific question).
  2. *The Scenario (The Lock):** Frame the question as an urgent, high-stakes scenario (e.g., "The colony's life-support data is fragmenting...", "The startup's budget is leaking oxygen...").
  3. **STRUCTURE:** Question text, 4 plausible options, 1 correct index, and a clear explanation.
  4. **The Solution (The Key):** The correct answer must be the *exact* Google Cloud product or principle that solves the scenario.
  5. **Tone:** Immersive and dramatic narrative, but **technically rigorous** options. No magic solutions; only real Google Cloud engineering.
  6. **Difficulty:** Foundational (CDL Level). Focus on "What is it?" and "When to use it?"
  
  Return JSON format: { text, options: [4 strings], correctIndex: number(0-3), explanation: string }`;

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
  
  Provide a professional, concise feedback snippet (1-2 sentences). Explain the technical logic based on the CDL syllabus. Keep the tone slightly "retro gamer" but strictly educational.`;

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
