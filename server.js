import express from 'express';
import https from 'https';
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

const parsedBase = new URL(BASE_URL);
const publicDir  = join(__dirname, 'public');
const indexFile  = join(publicDir, 'index.html');

console.log('\n── Aria Chat Server ──────────────────────');
console.log(`  Public dir : ${publicDir}  [${existsSync(publicDir) ? '✓ found' : '✗ MISSING'}]`);
console.log(`  index.html : ${existsSync(indexFile) ? '✓ found' : '✗ MISSING'}`);
console.log(`  Upstream   : ${BASE_URL}`);
console.log('──────────────────────────────────────────\n');

app.use(express.static(publicDir));

// Manual proxy — bypasses http-proxy-middleware HTTP/2 compatibility issues
app.post('/api/stream', (req, res) => {
  const chunks = [];

  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);

    const options = {
      hostname: parsedBase.hostname,
      port:     parsedBase.port || 443,
      path:     '/sse/v1/prompt/stream',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': body.length,
        'Cookie':         'locale=en-US',
      },
    };

    console.log(`→ Proxying to ${parsedBase.hostname}:${options.port}${options.path}`);

    const proxyReq = https.request(options, (proxyRes) => {
      console.log(`← Upstream status: ${proxyRes.statusCode}`);

      res.writeHead(proxyRes.statusCode, {
        'Content-Type':  proxyRes.headers['content-type'] || 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection':    'keep-alive',
      });

      proxyRes.pipe(res);

      proxyRes.on('end', () => {
        console.log('← Stream complete');
        res.end();
      });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err.message);
      if (!res.headersSent) {
        res.status(502).json({ error: err.message });
      }
    });

    proxyReq.write(body);
    proxyReq.end();
  });
});

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
