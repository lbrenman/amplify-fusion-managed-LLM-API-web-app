# Aria — SSE Chat App

A clean, modern chat web app that streams responses in real time from your Server-Sent Events (SSE) API.

![Chat UI Preview](https://via.placeholder.com/800x450/0c0c0e/c8a96e?text=Aria+Chat)

## Features

- **Real-time streaming** — renders tokens as they arrive from your SSE API
- **Clean dark UI** — editorial aesthetic with Fraunces + DM Mono typography
- **Lightweight stack** — plain HTML/CSS/JS frontend, Node.js/Express proxy backend
- **No build step** — just `npm install && npm start`
- **Suggestion prompts** — quick-start chips on the empty state
- **Auto-resize input** — textarea grows with your message
- **Error handling** — graceful degradation with toast notifications

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML / CSS / JS |
| Backend | Node.js + Express |
| Proxy | `http-proxy-middleware` |
| Fonts | Google Fonts (Fraunces, DM Mono) |

## Project Structure

```
├── server.js          # Express server + SSE proxy
├── public/
│   └── index.html     # Single-page chat UI
├── package.json
├── .env.example       # Environment variable template
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+

### Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/aria-chat.git
cd aria-chat

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set BASE_URL to your SSE API base URL

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### GitHub Codespaces

Click **Code → Codespaces → Create codespace**, then in the terminal:

```bash
npm install
cp .env.example .env
# Edit .env with your BASE_URL
npm run dev
```

Codespaces will automatically forward port `3000` and prompt you to open it in the browser.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:8080` | Base URL of your SSE streaming API |
| `PORT` | `3000` | Port for the local dev server |

## API Contract

The app expects your API at `POST /sse/v1/prompt/stream` (proxied from the frontend as `POST /api/stream`).

**Request:**
```json
{ "prompt": "Your message here" }
```

**Response (SSE stream):**
```
event: chunk
data: Hello

event: chunk
data: !

event: done
data: {"reason":"completed"}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with `--watch` (auto-restart on file changes) |

## License

MIT
