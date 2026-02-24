import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

app.use(express.static(join(__dirname, 'public')));

// Proxy /api/stream -> BASE_URL/sse/v1/prompt/stream
app.use('/api/stream', createProxyMiddleware({
  target: BASE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/stream': '/sse/v1/prompt/stream' },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('Content-Type', 'application/json');
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err.message);
      res.status(502).json({ error: 'Upstream service unavailable' });
    }
  }
}));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Chat app running at http://localhost:${PORT}`);
  console.log(`   Proxying streams to: ${BASE_URL}\n`);
});
