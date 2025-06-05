# EchoChain Architecture

EchoChain is an audio-only social loop where each visitor hears a five-second clip from the previous visitor and then leaves their own five‑second message. The system runs entirely on Cloudflare’s edge platform.

## Frontend
- **React 18** application bootstrapped with Vite.
- **Tailwind CSS** for utility-first styling and mood-driven themes using CSS variables (`--bg`, `--accent`, `--anim`).
- Captures audio via the Web Audio API and displays waveforms.
- Communicates with the backend via a small REST API.
- Persona‑based UI strings are fetched at runtime from `/api/persona/{persona}` and cached locally.

## Backend
- **Cloudflare Workers** serve the API and static assets.
- **Durable Objects** guarantee atomic FIFO ordering when multiple users submit clips simultaneously. Each chain has a single Durable Object that stores the pointer to the latest clip.
- **Cloudflare R2** stores audio blobs keyed by UUID.
- **KV Storage** keeps metadata (mood, depth, timestamp, UUID) with a 24‑hour TTL.
- **Anonymous UUID** stored in a cookie to associate a visitor with a single clip.

### Clip Submission Flow
1. Visitor records a 5‑sec audio snippet in the browser.
2. The frontend posts the recording and selected depth to `POST /api/clip` with the UUID in a header.
3. Worker streams the audio to Whisper STT for transcription, performs sentiment analysis, and validates depth selection and profanity. Silence or profanity triggers an error response with persona‑style messaging.
4. On success, the Worker stores the blob in R2, writes metadata to KV, and updates the Durable Object pointer to point to the new clip.

### Clip Playback Flow
1. On page load, the frontend requests `GET /api/clip/next` to retrieve the URL of the previous visitor’s clip plus mood and depth information.
2. The audio file is streamed from R2 and played once automatically. Mood data drives the theme by setting CSS variables.
3. After playback, the UI enables recording of the next clip.

## Moderation
- Simple banned‑word filter on transcribed text.
- Silence detector rejects clips with less than 0.5 seconds of voiced audio (users may retry once).
- Rejected clips are not stored or played back.

## Analytics
Minimal events recorded via PostHog or Cloudflare Zaraz:
- `clip_played` with mood and depth.
- `clip_recorded` with depth.
- `persona_changed` whenever a user switches the language style.

## Deployment
- CI/CD through GitHub Actions which runs lint/tests then deploys to Cloudflare Workers using the `wrangler` CLI.
- Static frontend assets are bundled by Vite and served from the Worker alongside API endpoints.

