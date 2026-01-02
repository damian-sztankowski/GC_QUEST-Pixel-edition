
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Basic security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "connect-src": ["'self'", "https://*.googleapis.com", process.env.VITE_BACKEND_URL || "*"],
      "img-src": ["'self'", "data:", "https://*.google.com", "https://*.googleapis.com"],
      "script-src": ["'self'", "https://cdn.tailwindcss.com", "https://esm.sh"]
    }
  }
}));

// Serve static files from the Vite build output directory
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: Return index.html for any unknown path
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend Host running on port ${PORT}`);
});
