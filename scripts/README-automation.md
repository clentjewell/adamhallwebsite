# Auto-update: new "What's Your Car Worth" episodes

Goal: every ~15 days, check 4CRB for new episodes, download + transcribe them
locally (free, faster-whisper), add them to the Listen page, and deploy.

Source: https://www.4crb.com/live-interviews/whats-your-car-worth/
Target: `src/data/episodes.ts` + `public/data/transcripts.json`

## Pipeline (run by the scheduled Routine)

1. `bash scripts/setup-sync.sh` — installs faster-whisper (once per session).
2. `node scripts/sync-episodes.mjs` — fetches the 4CRB page, diffs against
   `src/data/episodes.ts`, and for each NEW episode:
   - downloads the audio,
   - transcribes it via `scripts/transcribe.py` (local Whisper),
   - downloads/derives a cover,
   - appends to `episodes.ts` + `transcripts.json`.
   Prints `NEW_EPISODES=<n>`.
3. If `NEW_EPISODES > 0`: `npm run build && npx wrangler deploy`, then commit + push.
   Otherwise: do nothing.

## Network allow-list required (Claude Code on the web → environment → network)

- `www.4crb.com` and `4crb.com` — the source page
- the audio CDN 4CRB streams from (identified on first run; whitelisted then)
- `huggingface.co` and `cdn-lfs.huggingface.co` — one-time Whisper model download
  (pypi is already allowed for the pip install)

Because egress is applied at session start, add these, then start a fresh
session on this branch.

## Manual run

```bash
bash scripts/setup-sync.sh
node scripts/sync-episodes.mjs        # adds any new episodes
npm run build && npx wrangler deploy  # if new episodes were added
```

## Transcription

`scripts/transcribe.py <audio-url> --model base` — local, no API key, ~2-4 min
per 30-min episode on CPU. Bump `--model small` for higher accuracy if needed.
