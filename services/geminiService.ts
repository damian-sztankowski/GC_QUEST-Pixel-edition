
import { Type } from "@google/genai";
import { CloudRole, Level, Question } from "../types";

// Security Handshake - Must match backend_api.js
const HANDSHAKE_SECRET = "GCP_QUEST_SECURE_PROTO_V1";

/**
 * Access the backend URL.
 * In Vite, this is usually import.meta.env.VITE_BACKEND_URL.
 * We use safe navigation and a type-safe fallback to prevent TypeErrors in non-Vite or misconfigured environments.
 */
// @ts-ignore
const BACKEND_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) || '';

const secureFetch = async (endpoint: string, body: any) => {
  const url = `${BACKEND_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Handshake-Token': HANDSHAKE_SECRET
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const status = response.status;
    const errorData = await response.json().catch(() => ({}));
    console.error(`[SECURE_FETCH_FAILED]: ${status} - ${url}`, errorData);
    throw new Error(errorData.message || `API_ERROR_${status}`);
  }

  return response.json();
};

export const generateQuestion = async (role: CloudRole, level: Level, questionIndex: number): Promise<Question> => {
  const entropy = Math.random().toString(36).substring(7);
  
  const prompt = `You are a Lead Google Cloud Certification Architect.
  TASK: Generate a unique "Escape Room" multiple-choice question for the Cloud Digital Leader (CDL) exam.
  CHAPTER: "${level.topic}"
  SYLLABUS FOCUS: "${level.description}"
  QUESTION_PROGRESS: ${questionIndex} of 10
  ENTROPY_SEED: ${entropy}
  
  STRUCTURE:
  - Question text: Immersive narrative with [clue] tags.
  - Options: 4 strings.
  - correctIndex: 0-3.
  - Explanation: 1-2 sentences.
  Return JSON format: { text, options, correctIndex, explanation }`;

  const data = await secureFetch('/api/generate', {
    prompt,
    model: "gemini-3-flash-preview",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.NUMBER },
          explanation: { type: Type.STRING }
        },
        required: ["text", "options", "correctIndex", "explanation"]
      }
    }
  });

  return JSON.parse(data.text);
};

export const getGeminiFeedback = async (role: CloudRole, question: string, userAnswer: string, isCorrect: boolean): Promise<string> => {
  const prompt = `Act as an expert Cloud Digital Leader Instructor in a retro 8-bit game.
  Question: "${question}"
  User Answer: "${userAnswer}"
  Result: ${isCorrect ? 'Correct' : 'Incorrect'}.
  Provide a concise 1-2 sentence technical explanation. Tone: Retro-educational.`;

  const data = await secureFetch('/api/generate', {
    prompt,
    model: "gemini-3-flash-preview"
  });

  return data.text;
};

export const generateHint = async (question: string, topic: string): Promise<string> => {
  const prompt = `The user is stuck on a Google Cloud question regarding "${topic}".
  Question: "${question}"
  Provide a subtle hint under 20 words. Persona: Retro Debug Console.`;

  const data = await secureFetch('/api/generate', {
    prompt,
    model: "gemini-3-flash-preview"
  });

  return data.text;
};

export const generateAvatar = async (prompt: string): Promise<string> => {
  const data = await secureFetch('/api/generate', {
    contents: { parts: [{ text: prompt }] },
    model: 'gemini-2.5-flash-image',
    config: { 
      imageConfig: { 
        aspectRatio: "1:1"
      } 
    },
  });

  if (data.parts && Array.isArray(data.parts)) {
    for (const part of data.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("AVATAR_EXTRACTION_FAILED: No image part found.");
};
