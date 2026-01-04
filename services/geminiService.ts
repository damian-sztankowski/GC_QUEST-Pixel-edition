
import { CloudRole, Level, Question, DifficultyLevel } from "../types";
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
 * Indexed by Difficulty_LevelID
 */
const shuffledCache: Record<string, Question[]> = {};

/**
 * REPLACED: No longer uses Gemini API. 
 * Pulls from separated static files based on DifficultyLevel.
 * Ensures 10 unique questions per level by shuffling the specialized pool.
 */
export const generateQuestion = async (role: CloudRole, level: Level, questionIndex: number, difficulty: DifficultyLevel = DifficultyLevel.NORMAL): Promise<Question> => {
  const cacheKey = `${difficulty}_${level.id}`;
  
  if (!shuffledCache[cacheKey]) {
    // Get the base pool for the specific difficulty selected
    const difficultyPool = STATIC_QUESTION_BASE[difficulty] || STATIC_QUESTION_BASE.NORMAL;
    const chapterQuestions = difficultyPool[level.id] || [];
    
    // Shuffle the chapter questions so every 10-question round is unique
    shuffledCache[cacheKey] = shuffleArray(chapterQuestions);
  }
  
  const levelQuestions = shuffledCache[cacheKey];
  
  if (levelQuestions && levelQuestions.length > 0) {
    // Use modulo to cycle if pool is small, but with 10 questions per chapter
    // in each file, this will now provide a full unique 10-question round.
    const idx = (questionIndex - 1) % levelQuestions.length;
    
    return new Promise((resolve) => {
      // Instant resolution for local-only feel
      setTimeout(() => resolve(levelQuestions[idx]), 250);
    });
  }

  // Final emergency fallback
  return {
    text: "SYSTEM_RECOVERY: Which cloud model involves paying only for the [clue]resources consumed[/clue]?",
    options: ["On-premises", "CapEx", "Pay-as-you-go", "Fixed-tier"],
    correctIndex: 2,
    explanation: "The pay-as-you-go model is a hallmark of cloud computing.",
    hint: "Think about consumption-based pricing.",
    difficulty: DifficultyLevel.EASY
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
    "KNOWLEDGE_VERIFIED. PROCEED_TO_NEXT_NODE.",
    "BEYOND_CORP_PROTOCOLS_ACTIVE. WELL_DONE."
  ];
  const negative = [
    "SYSTEM_BREACH! ACCESS_DENIED.",
    "LOGIC_ERROR_DETECTED. RECALIBRATING...",
    "DATA_CORRUPTION_PREVENTED. TRY_AGAIN.",
    "INCORRECT_INPUT. SECURITY_PERIMETER_ACTIVE.",
    "ZERO_TRUST_VERIFICATION_FAILED."
  ];

  const pool = isCorrect ? positive : negative;
  const result = pool[Math.floor(Math.random() * pool.length)];

  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 200);
  });
};

/**
 * REPLACED: Returns a hint from the static metadata.
 */
export const generateHint = async (question: Question | null, topic: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(question?.hint || "SEEK_THE_ROOT_OF_THE_ARCHITECTURE.");
    }, 400);
  });
};

/**
 * REPLACED: Static avatar.
 */
export const generateAvatar = async (prompt: string): Promise<string> => {
  return ""; 
};
