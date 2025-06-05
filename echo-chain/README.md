# EchoChain

EchoChain is a small demo of an audio-only social loop. This folder contains a minimal React + Tailwind prototype along with docs describing the architecture, API and UI.

## Local Development

1. Install dependencies (requires Node 18+):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

The app is built with Vite. Production builds use `npm run build` and output to `dist/`.

## Documentation

- `docs/Architecture.md` – technical architecture overview
- `docs/Wireframes.md` – low fidelity wireframes in ASCII
- `docs/API.md` – REST API contract and examples

This prototype focuses on the core UI components; the Cloudflare Worker backend is described in the docs but not fully implemented here.
