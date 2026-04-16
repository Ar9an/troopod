# Mirra ✦ — AI Landing Page Personalizer

Match your landing page messaging to your ad creative instantly using AI.

## How it works
1. Paste your ad description
2. Enter your landing page URL + copy
3. Get a CRO-optimized, personalized version in seconds
4. and you are done

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
Create a `.env` file in the root folder:
```
OPENROUTER_API_KEY=your_key_here
```
Get a free key at: https://openrouter.ai

### 3. Run locally
```bash
node server.js
```
Open http://localhost:3000

## Tech Stack
- Frontend: HTML, CSS, Vanilla JS
- Backend: Node.js + Express
- AI: OpenRouter API (Qwen 2.5 72B)

## Deployment
Deploy to Railway, Render, or any Node.js host.
Set `OPENROUTER_API_KEY` as an environment variable on the platform.
