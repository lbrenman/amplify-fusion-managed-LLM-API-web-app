import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app      = express();
const PORT     = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const publicDir = join(__dirname, 'public');
const indexFile = join(publicDir, 'index.html');

console.log('\n── Aria Chat Server ──────────────────────');
console.log(`  Public dir : ${publicDir}  [${existsSync(publicDir) ? '✓ found' : '✗ MISSING'}]`);
console.log(`  index.html : ${existsSync(indexFile) ? '✓ found' : '✗ MISSING'}`);
console.log(`  Upstream   : ${BASE_URL}`);
console.log('──────────────────────────────────────────\n');

// Serve static files from ./public
app.use(express.static(publicDir));

// Proxy /api/stream → BASE_URL/sse/v1/prompt/stream
app.use('/api/stream', createProxyMiddleware({
  target: BASE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/stream': '/sse/v1/prompt/stream' },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Cookie', 'locale=en-US');
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err.message);
      res.status(502).json({ error: 'Upstream service unavailable' });
    }
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  if (existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(500).send('<h2>Setup error</h2><p><code>public/index.html</code> not found.</p>');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Running at http://localhost:${PORT}\n`);
});
