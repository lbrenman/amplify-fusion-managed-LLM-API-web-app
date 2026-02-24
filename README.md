# Aria — SSE Chat App

A clean, modern chat web app that streams responses in real time from your Server-Sent Events (SSE) API. Uses a lightweight Node.js proxy to avoid CORS issues.

## How it works

```
Browser → POST /api/stream → Express proxy → POST BASE_URL/sse/v1/prompt/stream
```

The browser only ever talks to the local Express server (same origin = no CORS). Express forwards the request to your upstream API server-to-server.

## Project Structure

```
├── server.js                   # Express server + SSE proxy
├── public/
│   └── index.html              # Single-page chat UI
├── .devcontainer/
│   └── devcontainer.json       # GitHub Codespaces config
├── package.json
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

## Quick Start

### GitHub Codespaces

1. Click **Code → Codespaces → Create codespace**
2. Wait for setup to complete (runs `npm install` automatically)
3. Set your API URL in `.env`:
   ```
   BASE_URL=https://your-api-host.com
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Codespaces will prompt you to open the forwarded port 3000 in a browser

### Local Setup

```bash
git clone https://github.com/YOUR_USERNAME/aria-chat.git
cd aria-chat
npm install
cp .env.example .env
# Edit .env and set BASE_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

Edit `.env`:

| Variable   | Default                | Description                              |
|------------|------------------------|------------------------------------------|
| `BASE_URL` | `http://localhost:8080`| Base URL of your SSE API (no trailing /) |
| `PORT`     | `3000`                 | Local dev server port                    |

## API Contract

The proxy forwards to `BASE_URL/sse/v1/prompt/stream`.

**Request body:**
```json
{ "prompt": "Your message here" }
```

**SSE response stream:**
```
event: chunk
data: Hello

event: chunk
data: !

event: done
data: {"reason":"completed"}
```

## Scripts

| Command       | Description                              |
|---------------|------------------------------------------|
| `npm start`   | Start production server                  |
| `npm run dev` | Start with auto-restart on file changes  |

## License

MIT
