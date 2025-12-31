
import { GoogleGenAI, Type } from "@google/genai";
import { CloudRole, Level, Question } from "../types";

// Strictly use process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestion = async (role: CloudRole, level: Level, questionIndex: number): Promise<Question> => {
  const entropy = Math.random().toString(36).substring(7);
  
  const prompt = `You are a Lead Google Cloud Certification Architect.
  
  TASK: Generate a unique "Escape Room" multiple-choice question for the Cloud Digital Leader (CDL) exam.
  CHAPTER: "${level.topic}"
  SYLLABUS FOCUS: "${level.description}"
  QUESTION_PROGRESS: ${questionIndex} of 10
  ENTROPY_SEED: ${entropy}
  
  CRITICAL COVERAGE RULES:
  1. **Concept Rotation (Anti-Repetition):** The SYLLABUS FOCUS contains many topics. To ensure 100% coverage across the 10-question level:
     - Mentally divide the SYLLABUS FOCUS into 10 distinct logical sub-topics.
     - You MUST generate a question specifically for the sub-topic at position #${questionIndex}.
     - EXAMPLE: If index is 1, test the first concept mentioned. If index is 5, test the middle concepts (e.g. financials). If index is 10, test the final concepts (e.g. Shared Responsibility).
  2. **The Scenario (The Lock):** Frame the question as a high-stakes business or technical emergency (e.g., "A global retailer is bleeding revenue due to high latency in Zone B...", "The CFO demands a shift from CapEx to OpEx but the team is confused...").
  3. **Technical Rigor:** Use official Google Cloud terminology. Distractors must be plausible but technically inferior or incorrect for the specific CDL use-case.
  4. **The Solution (The Key):** The correct answer must be the specific Google Cloud product or principle that solves the scenario.
  5. **Difficulty:** Foundational (CDL Level). Focus on "What is it?" and "When to use it?"
  
  STRUCTURE:
  - Question text: Immersive narrative.
  - Options: 4 strings.
  - correctIndex: 0-3.
  - Explanation: 1-2 sentences of technical logic.
  
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
