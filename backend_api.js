
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

// Security Secret - Must match frontend geminiService.ts
const HANDSHAKE_SECRET = "GCP_QUEST_SECURE_PROTO_V1";

// 1. Hardened Security Headers
app.use(helmet());

// 2. Strict CORS Configuration
// In a real separate Cloud Run deployment, the origin should be your frontend's Cloud Run URL
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://pixel-cloud-escape.damiansztankowski.cloud' // Example prod URL
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow browsers from specific domains or local dev
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('CORS_POLICY_VIOLATION: UNAUTHORIZED_ORIGIN'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Handshake-Token', 'Accept']
}));

app.use(express.json({ limit: '2mb' }));

// 3. Handshake Middleware: Validates that the request is coming from our specific frontend
const securityHandshake = (req, res, next) => {
  const token = req.get('X-Handshake-Token');
  if (token !== HANDSHAKE_SECRET) {
    console.warn(`[SECURITY_ALERT]: Unauthorized access attempt (Handshake Failed) from ${req.ip}`);
    return res.status(403).json({ 
      error: 'ACCESS_DENIED', 
      message: 'Secure Handshake Protocol Failure. Direct terminal access is blocked.' 
    });
  }
  next();
};

// 4. API Throttling
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 150, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Node stability limit reached. AI Core cooling down." }
});

// --- AI GENERATION ENDPOINT ---
app.post('/api/generate', limiter, securityHandshake, async (req, res) => {
  try {
    const { prompt, contents, config, model } = req.body;
    const inputContents = contents || prompt;
    
    if (!inputContents) {
      return res.status(400).json({ error: 'Payload missing contents' });
    }

    // Server-side exclusively holds the API KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = model || 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: inputContents,
      config: config || {}
    });

    res.json({ 
      parts: response.candidates[0].content.parts,
      text: response.text 
    });

  } catch (error) {
    console.error('[BACKEND_ERROR]:', error.message);
    res.status(500).json({ error: 'Internal Cloud Intelligence Error', detail: error.message });
  }
});

// Health check for Cloud Run
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => {
  console.log(`AI Backend Service listening on port ${PORT}`);
  console.log(`Handshake Protocol: GCP_QUEST_SECURE_PROTO_V1`);
});
