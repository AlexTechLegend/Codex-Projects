# EchoChain API

All endpoints are served from the same Cloudflare Worker. Authentication is via an anonymous UUID stored in a cookie and passed in the `X-Client-UUID` header for POST requests.

## GET `/api/clip/next`
Returns the audio URL and metadata for playback.

### Response
```json
{
  "audioUrl": "https://cdn.echochain.com/abc123.webm",
  "mood": "happy",
  "depth": 3
}
```

## POST `/api/clip`
Uploads a new clip. Expects `multipart/form-data` with the fields below.

### Fields
- `audio` — webm/ogg blob, max 6 seconds
- `depth` — integer 1‑5

### Headers
- `X-Client-UUID` — anonymous user identifier

### Response
```json
{ "ok": true }
```

Possible error responses include profanity rejection or silence detection, returned with persona‑styled messages.

## GET `/api/persona/{persona}`
Fetches language‑style strings for UI translation.

### Path Parameters
- `persona` — one of `genz`, `millennial`, or `boomer`

### Response
```json
{
  "strings": {
    "heard_label": "Real one just said:",
    "depth_heading": "How deep we goin'?",
    "record_btn": "Spill it 🎙️",
    "mic_denied_err": "Bruh, need mic perms"
  }
}
```
