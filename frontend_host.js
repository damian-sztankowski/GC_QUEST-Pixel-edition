
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Security: Use Helmet with CSP allowing the separate backend domain
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://*.google.com", "https://*.googleapis.com"],
      "script-src": ["'self'", "https://cdn.tailwindcss.com", "https://esm.sh"],
      "connect-src": ["'self'", "https://*.googleapis.com", "*"] // Allows connecting to the backend service
    },
  },
}));

const distPath = path.join(__dirname, 'dist');

// Serve static assets
app.use(express.static(distPath));

// Handle React SPA Routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend Static Host listening on port ${PORT}`);
});
