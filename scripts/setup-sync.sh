#!/usr/bin/env bash
# One-time-per-session setup for the episode sync job.
# Installs faster-whisper (CPU, no API key). ffmpeg ships with the environment.
set -e
echo "› Installing faster-whisper…"
pip3 install --quiet faster-whisper
echo "✔ faster-whisper ready."
echo "  (the Whisper model downloads from huggingface.co on first transcription;"
echo "   ensure huggingface.co is on the network allow-list.)"
