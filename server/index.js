import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from Vite build output
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

// Simple health check API (optional)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// SPA fallback – all routes return index.html
// SPA fallback – serve index.html for any unmatched route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
