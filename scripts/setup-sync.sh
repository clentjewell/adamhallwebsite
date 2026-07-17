#!/usr/bin/env bash
# One-time-per-session setup for the episode sync job.
# Installs faster-whisper (CPU, no API key). ffmpeg ships with the environment.
set -e
echo "› Installing faster-whisper…"
pip3 install --quiet faster-whisper
echo "✔ faster-whisper ready."
echo "  (the Whisper 'base' model (~145 MB) downloads from huggingface.co on first"
echo "   transcription and is then cached in ~/.cache/huggingface. Episode data comes"
echo "   from api.omny.fm — see scripts/README-automation.md.)"
