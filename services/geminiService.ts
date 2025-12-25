
import { GoogleGenAI, Type } from "@google/genai";
import { CloudRole, Level, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuestion = async (role: CloudRole, level: Level): Promise<Question> => {
  const prompt = `Generate a Google Cloud certification-style question for a ${role} exam candidate.
  The question must be strictly derived from the material described in the official Cloud Digital Leader Exam Guide.
  
  Current Level: "${level.title}"
  Section Objective: "${level.topic}"
  Context: "${level.description}"
  
  Scenario Context: The user is in an escape room environment. Frame the question as a "System Security Gate" or "Production Logic Puzzle".
  
  Requirements:
  1. Focus on foundational business and technical knowledge.
  2. Use correct terminology (e.g., Anthos, BigQuery, VPC, Cloud Run).
  3. Ensure the explanation references Google Cloud best practices.
  
  Return the question in JSON format with properties: text, options (4 options), correctIndex (0-3), and explanation.`;

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
  const prompt = `Act as an expert Cloud Digital Leader Instructor. The user just answered an exam-style question.
  Question: "${question}"
  User Answer: "${userAnswer}"
  Result: ${isCorrect ? 'Correct' : 'Incorrect'}.
  
  Give a professional, concise feedback snippet (2 sentences). Explain the technical reasoning based specifically on the Google Cloud CDL syllabus.`;

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
