import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Warning: API_KEY or GEMINI_API_KEY is not set.');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: API_KEY });

// API Endpoints

app.post('/api/generate-question', async (req, res) => {
  try {
    const { role, level, questionIndex } = req.body;

    // Validate inputs
    if (!role || !level || typeof questionIndex !== 'number') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
    2. **The Scenario (The Lock):** Frame the question as a high-stakes business or technical emergency.
    3. **Clue Highlighting (NEW):** Identify the 1-3 most critical keywords or technical concepts in the question text that serve as the "clue" to the solution. Wrap these words in [clue] and [/clue] tags.
       - EXAMPLE: "A company needs to move [clue]unstructured data[/clue] with [clue]millisecond latency[/clue]..."
    4. **Technical Rigor:** Use official Google Cloud terminology. Distractors must be plausible but technically inferior.
    5. **Difficulty:** Foundational (CDL Level).

    STRUCTURE:
    - Question text: Immersive narrative with [clue] tags.
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

    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { role, question, userAnswer, isCorrect } = req.body;

    if (!question || !userAnswer || isCorrect === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Act as an expert Cloud Digital Leader Instructor in a retro 8-bit game.
    The user just answered: "${userAnswer}" to the question: "${question}".
    Result: ${isCorrect ? 'Correct' : 'Incorrect'}.

    Provide a professional, concise feedback snippet (1-2 sentences). Explain the technical logic based on the CDL syllabus. Keep the tone slightly "retro gamer" but strictly educational.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

app.post('/api/hint', async (req, res) => {
  try {
    const { question, topic } = req.body;

    if (!question || !topic) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `The user is stuck on a Google Cloud question regarding "${topic}".
    Question: "${question}"

    Provide a subtle hint that points them towards the right concept without revealing the answer.
    Use a "Retro AI System" or "Debug Console" persona. Keep it under 20 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

app.post('/api/avatar', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

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

    let imageUrl = '';
    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
        throw new Error("Failed to generate image part");
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating avatar:', error);
    res.status(500).json({ error: 'Failed to generate avatar' });
  }
});


// Handle SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
