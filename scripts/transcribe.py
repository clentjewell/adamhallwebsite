#!/usr/bin/env python3
"""
transcribe.py — transcribe an audio file/URL with faster-whisper (local, free).

Usage:
    python3 scripts/transcribe.py <audio-path-or-url> [--model base] [--out file.txt]

Prints the transcript to stdout (and to --out if given). No API key required.
Model is downloaded once from Hugging Face and cached in ~/.cache.
"""
import argparse
import subprocess
import sys
import tempfile
import os


def fetch(url_or_path: str) -> str:
    if url_or_path.startswith(("http://", "https://")):
        fd, tmp = tempfile.mkstemp(suffix=".mp3")
        os.close(fd)
        subprocess.run(
            ["curl", "-sSL", "--max-time", "180",
             "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
             url_or_path, "-o", tmp],
            check=True,
        )
        return tmp
    return url_or_path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--model", default="base",
                    help="tiny | base | small | medium (bigger = slower, more accurate)")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    from faster_whisper import WhisperModel  # imported here so --help works without the dep

    audio = fetch(args.audio)
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    segments, info = model.transcribe(audio, beam_size=5, vad_filter=True)

    parts = []
    for seg in segments:
        parts.append(seg.text.strip())
    text = " ".join(parts).strip()
    # light sentence spacing cleanup
    text = " ".join(text.split())

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(text)
    sys.stdout.write(text + "\n")
    sys.stderr.write(f"[transcribe] language={info.language} chars={len(text)}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
