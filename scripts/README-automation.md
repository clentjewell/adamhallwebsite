# Auto-update: new "What's Your Car Worth" episodes

Goal: every ~15 days, check for new episodes, download + transcribe them
locally (free, faster-whisper), add them to the Listen page, and deploy.

## Source of truth: Omny (not the 4crb HTML page)

The episodes on <https://www.4crb.com/live-interviews/whats-your-car-worth/>
are an embed of the program's Omny.fm feed. The 4crb HTML page itself sits
behind a Cloudflare "managed challenge" (a JS/cookie interstitial) that a
headless fetch cannot clear, so we read straight from Omny's public JSON API,
which is un-challenged and is the actual publishing source:

```
https://api.omny.fm/orgs/<org>/programs/<program>/clips?cursor=&pageSize=100
```

- org     `f29927f7-c62b-47a4-8d33-b06e00c903fe`
- program `1072c1b1-461e-4031-aa82-b111003c2946`  ("What's Your Car Worth")

Each clip gives `Id`, `Title`, `AudioUrl`, `ImageUrl`, `PublishedUtc`,
`DurationSeconds`, etc. Audio is streamed from Omny's CDN (as the older
episodes stream from their host); only covers and transcripts live in-repo.

## Pipeline (run by the scheduled Routine)

1. `bash scripts/setup-sync.sh` — installs faster-whisper (once per session).
2. `node scripts/sync-episodes.mjs` — fetches all Omny clips, keeps the ones
   published after the last sync (`scripts/.sync-state.json`; first run uses the
   newest hand-added episode as the baseline), and for each NEW clip:
   - downloads its cover to `public/assets/covers/omny-<id>.jpg`,
   - downloads the audio and transcribes it via `scripts/transcribe.py`
     (local Whisper, `base` model),
   - prepends an `Episode` to `src/data/episodes.ts` and stores the transcript
     keyed by clip id in `public/data/transcripts.json`.
   State + files are written after every episode, so an interruption never
   loses completed work. Prints `NEW_EPISODES=<n>`.
3. If `NEW_EPISODES > 0`: `npm run build && npx wrangler deploy`, then commit + push.
   Otherwise: do nothing.

## Network

Requires outbound access to `api.omny.fm`, `traffic.omny.fm`,
`www.omnycontent.com` (Omny), and `huggingface.co` + its CDN
(`*.hf.co` / `cas-*.xethub.hf.co`) for the one-time Whisper model download.
An "allow all" egress policy covers these. Egress is applied at session start,
so the scheduled Routine runs in a fresh session where the policy is already in
effect.

## Manual run

```bash
bash scripts/setup-sync.sh
node scripts/sync-episodes.mjs                # add any new episodes
node scripts/sync-episodes.mjs --no-transcribe  # metadata only (fast, for testing)
node scripts/sync-episodes.mjs --limit 1      # only the newest new episode
npm run build && npx wrangler deploy          # if new episodes were added
```

## Transcription

`scripts/transcribe.py <audio-url-or-file> --model base` — local, no API key,
~6-7 min per 30-min episode on CPU. Bump `--model small` for higher accuracy.
