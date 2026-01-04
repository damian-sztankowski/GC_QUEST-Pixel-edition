
import { CloudRole, Level, Question } from "../types";
import { STATIC_QUESTION_BASE } from "../data/questions";

/**
 * UTILITY: Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

/**
 * Cache for shuffled questions to maintain consistency within a session
 */
const shuffledCache: Record<number, Question[]> = {};

/**
 * REPLACED: No longer uses Gemini API. Retrieves from STATIC_QUESTION_BASE.
 */
export const generateQuestion = async (role: CloudRole, level: Level, questionIndex: number): Promise<Question> => {
  // Check if we already shuffled this level for this session
  if (!shuffledCache[level.id]) {
    const baseQuestions = STATIC_QUESTION_BASE[level.id] || [];
    shuffledCache[level.id] = shuffleArray(baseQuestions);
  }
  
  const levelQuestions = shuffledCache[level.id];
  
  if (levelQuestions && levelQuestions.length > 0) {
    // Zero-based index from 1-based questionIndex
    const idx = (questionIndex - 1) % levelQuestions.length;
    
    // Simulate a tiny "network delay" for retro feel, but no API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(levelQuestions[idx]), 300);
    });
  }

  // Absolute fallback
  return {
    text: "SYSTEM_RECOVERY: Which cloud model involves paying only for the [clue]resources consumed[/clue]?",
    options: ["On-premises", "CapEx", "Pay-as-you-go", "Fixed-tier"],
    correctIndex: 2,
    explanation: "The pay-as-you-go model is a hallmark of cloud computing, enabling OpEx flexibility.",
    hint: "Think about consumption-based pricing."
  };
};

/**
 * REPLACED: Returns static feedback based on correctness.
 */
export const getGeminiFeedback = async (role: CloudRole, question: string, userAnswer: string, isCorrect: boolean): Promise<string> => {
  const positive = [
    "DATA_FLOW_STABILIZED! ACCESS_GRANTED.",
    "CRITICAL_SUCCESS. NODE_ONLINE.",
    "CORE_SYNC_COMPLETE. EXCELLENT_WORK.",
    "KNOWLEDGE_VERIFIED. PROCEED_TO_NEXT_NODE."
  ];
  const negative = [
    "SYSTEM_BREACH! ACCESS_DENIED.",
    "LOGIC_ERROR_DETECTED. RECALIBRATING...",
    "DATA_CORRUPTION_PREVENTED. TRY_AGAIN.",
    "INCORRECT_INPUT. SECURITY_PERIMETER_ACTIVE."
  ];

  const pool = isCorrect ? positive : negative;
  const result = pool[Math.floor(Math.random() * pool.length)];

  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 200);
  });
};

/**
 * REPLACED: Returns a hint if provided in the question data.
 */
export const generateHint = async (question: Question | null, topic: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(question?.hint || "SEEK_THE_ROOT_OF_THE_ARCHITECTURE.");
    }, 400);
  });
};

/**
 * REPLACED: No longer generates images via AI.
 * Returns a static placeholder or pre-defined pixel art.
 */
export const generateAvatar = async (prompt: string): Promise<string> => {
  // In a real local-only app, you'd use static assets. 
  // We return a placeholder that triggers the SVG fallback in Avatar component.
  return ""; 
};
