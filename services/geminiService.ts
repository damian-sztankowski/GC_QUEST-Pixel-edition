
import { Type } from "@google/genai";
import { CloudRole, Level, Question } from "../types";

// Access the backend URL.
// In Vite, this is usually import.meta.env.VITE_BACKEND_URL.
// @ts-ignore
const BACKEND_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) || '';

// Access the handshake secret from env.
// @ts-ignore
const HANDSHAKE_SECRET = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_HANDSHAKE_SECRET) || '';

const secureFetch = async (endpoint: string, body: any) => {
  const url = `${BACKEND_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (HANDSHAKE_SECRET) {
    headers['X-Handshake-Token'] = HANDSHAKE_SECRET;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
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
  
  const data = await secureFetch('/api/generate-question', {
    role,
    level,
    questionIndex,
    entropy
  });

  return JSON.parse(data.text);
};

export const getGeminiFeedback = async (role: CloudRole, question: string, userAnswer: string, isCorrect: boolean): Promise<string> => {
  const data = await secureFetch('/api/feedback', {
    role, // Passed for potential future persona adjustments
    question,
    userAnswer,
    isCorrect
  });

  return data.text;
};

export const generateHint = async (question: string, topic: string): Promise<string> => {
  const data = await secureFetch('/api/hint', {
    question,
    topic
  });

  return data.text;
};

export const generateAvatar = async (prompt: string): Promise<string> => {
  const data = await secureFetch('/api/avatar', {
    prompt
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
