#!/usr/bin/env node
/*
 * sync-episodes.mjs — pull new "What's Your Car Worth" episodes from Omny
 * (the program's canonical publishing host) into the Listen page.
 *
 * Why Omny and not the 4crb.com HTML page?
 *   www.4crb.com sits behind a Cloudflare "managed challenge" (JS/cookie
 *   interstitial) that a headless fetch can't clear. The episodes on that page
 *   are an embed of the Omny program, and Omny exposes a clean, un-challenged
 *   public JSON API — so we read straight from the source of truth.
 *
 * What it does, each run:
 *   1. Fetch every clip for the program from api.omny.fm.
 *   2. Keep the ones published after the last sync (state in scripts/.sync-state.json;
 *      first run uses SINCE_BASELINE = the newest hand-added episode already on the site).
 *   3. For each NEW clip, newest first:
 *        - download its cover to public/assets/covers/omny-<id>.jpg
 *        - download the audio and transcribe it locally via scripts/transcribe.py
 *          (faster-whisper, free, no API key)
 *        - prepend an Episode record and store the transcript keyed by clip id
 *   4. Rewrite src/data/episodes.ts and public/data/transcripts.json.
 *   5. Print NEW_EPISODES=<n> for the deploy step to act on.
 *
 * Audio is streamed from Omny's CDN (same as the existing episodes stream from
 * their host) — only covers and transcripts are stored in-repo.
 *
 * Usage: node scripts/sync-episodes.mjs [--limit N] [--no-transcribe]
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const ORG = 'f29927f7-c62b-47a4-8d33-b06e00c903fe';
const PROG = '1072c1b1-461e-4031-aa82-b111003c2946';
const API = `https://api.omny.fm/orgs/${ORG}/programs/${PROG}/clips`;

// First-run baseline: the newest episode that was added to the site by hand.
// Anything published at or before this is assumed already present.
const SINCE_BASELINE = '2026-01-27T23:59:59.000Z';

const EPISODES_TS = join(ROOT, 'src/data/episodes.ts');
const TRANSCRIPTS_JSON = join(ROOT, 'public/data/transcripts.json');
const COVERS_DIR = join(ROOT, 'public/assets/covers');
const STATE_FILE = join(__dirname, '.sync-state.json');
const TRANSCRIBE = join(__dirname, 'transcribe.py');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const args = process.argv.slice(2);
const LIMIT = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
const NO_TRANSCRIBE = args.includes('--no-transcribe');

function log(...a) { console.error('[sync]', ...a); }

function curl(url, outFile) {
  // --retry with --retry-all-errors rides out transient CDN resets/timeouts.
  const base = ['-sSL', '--max-time', '300', '--retry', '5', '--retry-delay', '3',
    '--retry-all-errors', '--connect-timeout', '30', '-A', UA];
  if (outFile) execFileSync('curl', [...base, url, '-o', outFile], { stdio: ['ignore', 'ignore', 'inherit'] });
  else return execFileSync('curl', [...base, url], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

// Download `audioUrl` and transcribe it locally. Returns '' on failure.
function transcribeAudio(audioUrl) {
  if (NO_TRANSCRIBE) return '';
  const tmp = join(mkdtempSync(join(tmpdir(), 'ep-')), 'audio.mp3');
  try {
    curl(audioUrl, tmp);
    const t = execFileSync('python3', [TRANSCRIBE, tmp, '--model', 'base'], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    }).trim();
    log(`  transcript ${t.length} chars`);
    return t;
  } catch (e) {
    log('  ! transcription failed:', e.message.split('\n')[0]);
    return '';
  }
}

// An Omny episode id is a UUID; the older hand-added episodes use numeric ids.
const isOmnyId = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(id);
const MIN_TRANSCRIPT_CHARS = 500;

async function fetchAllClips() {
  const clips = [];
  let cursor = '';
  for (let guard = 0; guard < 50; guard++) {
    const url = `${API}?cursor=${encodeURIComponent(cursor)}&pageSize=100`;
    const data = JSON.parse(curl(url));
    clips.push(...(data.Clips || []));
    if (!data.Cursor) break;
    cursor = data.Cursor;
  }
  return clips;
}

// Parse the existing `export const episodes: Episode[] = [ ... ];` array.
function readEpisodes() {
  const src = readFileSync(EPISODES_TS, 'utf8');
  const m = src.match(/episodes:\s*Episode\[\]\s*=\s*/);
  if (!m) throw new Error('could not locate `episodes: Episode[] =` in episodes.ts');
  const start = m.index + m[0].length; // position of the array-literal `[`
  const end = src.lastIndexOf(']');
  const arr = JSON.parse(src.slice(start, end + 1));
  const header = src.slice(0, start);
  return { arr, header };
}

function writeEpisodes(header, arr) {
  const body = JSON.stringify(arr, null, 2).replace(/^\[/, '[').replace(/\]$/, ']');
  writeFileSync(EPISODES_TS, `${header}${body};\n`);
}

function readState() {
  if (existsSync(STATE_FILE)) return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  return { lastPublishedUtc: SINCE_BASELINE };
}

function main() {
  mkdirSync(COVERS_DIR, { recursive: true });
  const { arr: episodes, header } = readEpisodes();
  const transcripts = existsSync(TRANSCRIPTS_JSON)
    ? JSON.parse(readFileSync(TRANSCRIPTS_JSON, 'utf8'))
    : {};
  const state = readState();
  const since = new Date(state.lastPublishedUtc).getTime();

  const existingAudio = new Set(episodes.map((e) => e.audio));
  const existingIds = new Set(episodes.map((e) => e.id));

  log('fetching Omny clips…');
  return fetchAllClips().then((clips) => {
    // newest first
    clips.sort((a, b) => new Date(b.PublishedUtc) - new Date(a.PublishedUtc));

    const fresh = clips.filter((c) => {
      const audio = c.AudioUrl || (c.MediaUrls && c.MediaUrls.AudioUrl);
      return (
        c.PublishState === 'Published' &&
        c.Visibility === 'Public' &&
        audio &&
        new Date(c.PublishedUtc).getTime() > since &&
        !existingIds.has(c.Id) &&
        !existingAudio.has(audio)
      );
    });

    log(`${clips.length} clips total, ${fresh.length} new since ${state.lastPublishedUtc}`);
    const todo = fresh.slice(0, LIMIT).reverse(); // oldest-first so prepending yields newest-first
    let added = 0;
    let newestUtc = state.lastPublishedUtc;

    for (const c of todo) {
      const audio = c.AudioUrl || c.MediaUrls.AudioUrl;
      log(`+ ${c.PublishedUtc.slice(0, 10)}  ${c.Title}`);

      // cover
      let cover = '/assets/covers/whats-your-car-worth.jpg';
      try {
        const coverName = `omny-${c.Id}.jpg`;
        curl(c.ImageUrl, join(COVERS_DIR, coverName));
        cover = `/assets/covers/${coverName}`;
      } catch (e) {
        log('  ! cover download failed, using fallback');
      }

      // transcript
      const transcript = transcribeAudio(audio);

      const episode = {
        id: c.Id,
        title: c.Title,
        subtitle: "What's Your Car Worth",
        audio,
        cover,
      };
      episodes.unshift(episode);
      if (transcript) transcripts[c.Id] = transcript;
      if (new Date(c.PublishedUtc) > new Date(newestUtc)) newestUtc = c.PublishedUtc;
      added++;

      // Persist after every episode so a mid-run interruption never loses work.
      writeEpisodes(header, episodes);
      writeFileSync(TRANSCRIPTS_JSON, JSON.stringify(transcripts, null, 0) + '\n');
      writeFileSync(STATE_FILE, JSON.stringify({ lastPublishedUtc: newestUtc }, null, 2) + '\n');
    }

    // Self-healing pass: fill in any Omny episode whose transcript is missing
    // or too short (e.g. a transient audio-download failure on an earlier run).
    let repaired = 0;
    if (!NO_TRANSCRIBE) {
      for (const e of episodes) {
        if (!isOmnyId(e.id)) continue;
        const cur = transcripts[e.id] || '';
        if (cur.length >= MIN_TRANSCRIPT_CHARS) continue;
        log(`~ repairing transcript: ${e.title}`);
        const t = transcribeAudio(e.audio);
        if (t.length >= MIN_TRANSCRIPT_CHARS) {
          transcripts[e.id] = t;
          writeFileSync(TRANSCRIPTS_JSON, JSON.stringify(transcripts, null, 0) + '\n');
          repaired++;
        }
      }
    }

    if (added > 0 || repaired > 0)
      log(`wrote ${episodes.length} episodes, ${Object.keys(transcripts).length} transcripts (${repaired} repaired)`);
    console.log(`NEW_EPISODES=${added}`);
  });
}

main().catch((e) => {
  console.error('[sync] fatal:', e);
  console.log('NEW_EPISODES=0');
  process.exit(1);
});
