
import { CloudRole, Level, Question } from "../types";

export const generateQuestion = async (role: CloudRole, level: Level, questionIndex: number): Promise<Question> => {
  const response = await fetch('/api/generate-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role, level, questionIndex }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate question');
  }

  return response.json();
};

export const getGeminiFeedback = async (role: CloudRole, question: string, userAnswer: string, isCorrect: boolean): Promise<string> => {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role, question, userAnswer, isCorrect }),
  });

  if (!response.ok) {
    throw new Error('Failed to get feedback');
  }

  const data = await response.json();
  return data.text;
};

export const generateHint = async (question: string, topic: string): Promise<string> => {
  const response = await fetch('/api/hint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, topic }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate hint');
  }

  const data = await response.json();
  return data.text;
};

export const generateAvatar = async (prompt: string): Promise<string> => {
  const response = await fetch('/api/avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate avatar');
  }

  const data = await response.json();
  return data.imageUrl;
};
