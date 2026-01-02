
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Core Security: Helmet & CSP
// helmet sets various HTTP headers to help protect your app from well-known web vulnerabilities.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://*.google.com"],
      "script-src": ["'self'", "https://cdn.tailwindcss.com", "https://esm.sh"],
      "connect-src": ["'self'", "https://*.googleapis.com"]
    },
  },
}));

// 2. CORS: Restrict to your domain
const allowedOrigins = [
  'http://localhost:3000',
  'https://pixel-cloud-escape.damiansztankowski.cloud'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests if you want)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// 3. Rate Limiting: Prevent DoS/Abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Security alert: Too many requests detected." }
});

app.use(express.json({ limit: '1mb' }));
app.use(express.static('dist'));

// --- SECURE API ROUTE ---
app.post('/api/generate', limiter, async (req, res) => {
  try {
    const { prompt, config } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Payload missing prompt string' });
    }

    // Initialize per request to ensure use of the most up-to-date environment key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Model selection based on task (default to flash for speed)
    const modelName = req.body.model || 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: config || {}
    });

    // CORRECT USAGE: response.text is a getter property, not a method.
    res.json({ text: response.text });

  } catch (error) {
    console.error('[GENAI_SERVER_ERROR]:', error.message);
    res.status(500).json({ error: 'Internal Cloud Intelligence Error' });
  }
});

// Handle SPA React Routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Cloud Quest Node running on ${PORT} | Security: ACTIVE`);
});
